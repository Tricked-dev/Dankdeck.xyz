import { buyAuction, createAuction } from "../../lib/interfaces";

import type { APIRoute } from "astro";
import type { BinAuction } from "@db/schema";
import { client } from "../../../client";
import { getSession } from "auth-astro/server";
import { requireSession } from "../../lib/apiUtils";

export const POST: APIRoute = async ({ request }) => {
  const { session, r } = await requireSession(request);
  if (r) return r;
  try {
    const result = await buyAuction.safeParseAsync(await request.json());

    if (!result.success) {
      return new Response(JSON.stringify(result.error), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const data = result.data;

    const [{ balance }] = await client.query(
      `
    select User {
      balance
    }
    filter User.id = <uuid>$user
    limit 1
  `,
      {
        user: session?.user?.id,
      },
    );

    if (balance < data.price) {
      return new Response(JSON.stringify({ error: "Insufficient funds" }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    //   console.log(balance, data);

    const [bin] = (await client.query(
      `
    select BinAuction {
        price,
        createdAt,
        card: {
            userId
        }
    }
    filter .card.id = <uuid>$cardId
    limit 1
  `,
      {
        cardId: data.cardId,
      },
    )) as BinAuction[];

    if (bin.price !== data.price) {
      return new Response(JSON.stringify({ error: "Bin expired" }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    console.log({
      user: session?.user?.id,
      bal: balance - data.price,
    });

    const r = await client.query(
      `
    update User
    filter .id = <uuid>$user
    set {
        balance := <int64>$bal
    }
  `,
      {
        user: session?.user?.id,
        bal: balance - data.price,
      },
    );

    await client.query(
      `
    delete BinAuction
    filter .card.id = <uuid>$cardId
  `,
      {
        cardId: data.cardId,
      },
    );

    await client.query(
      `
    update Card
    filter .id = <uuid>$cardId
    set {
        user := (
            select User
            filter .id = <uuid>$user
            limit 1
        )
    }
  `,
      {
        user: session?.user?.id,
        cardId: data.cardId,
      },
    );

    console.log({
      user: bin.card.userId,
      price: data.price,
    });

    await client.query(
      `
    update User
    filter .id = <uuid>$user
    set {
        balance := .balance + <int64>$price
    }
    `,
      {
        user: bin.card.userId,
        price: data.price,
      },
    );

    await client.query(
      `
    insert AuctionEntry {
        card := (
            select Card
            filter .id = <uuid>$cardId
            limit 1
        ),
        seller := (
            select User
            filter .id = <uuid>$seller
            limit 1
        ),
        buyer := (
            select User
            filter .id = <uuid>$buyer
            limit 1
        ),
        soldAt := <datetime>$soldAt,
        createdAt := <datetime>$createdAt,
        price := <int64>$price
    }
  `,
      {
        cardId: data.cardId,
        seller: bin.card.userId,
        buyer: session?.user?.id,
        soldAt: new Date(),
        createdAt: bin.createdAt,
        price: data.price,
      },
    );
  } catch (e) {
    console.log(e);
  }

  //   if (binExist.length > 0) {
  //     await client.query(
  //       `
  //       update BinAuction
  //       filter .card.id = <uuid>$cardId
  //       set price := <int64>$price
  //     `,
  //       {
  //         cardId: data.cardId,
  //         price: data.price,
  //       }
  //     );
  //     return new Response(
  //       JSON.stringify({ error: "Bin already exists, updating price" }),
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //   }

  //   const r = await client.query(
  //     `
  // insert BinAuction {
  //     card := (
  //         select Card
  //         filter .id = <uuid>$cardId
  //         limit 1
  //     ),
  //     price := <int64>$price
  // }
  // `,
  //     {
  //       cardId: data.cardId,
  //       price: data.price,
  //     }
  //   );
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  //   try {
  //     const card = await client.query(
  //       `
  // select(insert Card {
  //     meme := (
  //         select Meme
  //         order by random()
  //         limit 1
  //     ),
  //     user := (
  //         select User
  //         filter .id = <uuid>$user
  //         limit 1
  //     ),
  //     number := <int64>$number
  // }) {
  //   meme: {
  //     name,
  //     description,
  //     slug,
  //     img
  //   },
  //   number
  // }
  // `,
  //       {
  //         user: session?.user?.id,
  //         number: (Math.random() * 200) | 0,
  //       }
  //     );
  //     return new Response(JSON.stringify(card), {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //   } catch (e) {
  //     return new Response(
  //       JSON.stringify({
  //         error: e,
  //       }),
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //   }
};
