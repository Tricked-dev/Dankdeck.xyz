import type { APIRoute } from "astro";
import { client } from "../../../client";
import { createAuction } from "../../lib/interfaces";
import e from "../../../dbschema/edgeql-js";
import { getSession } from "auth-astro/server";

export const POST: APIRoute = async ({ request }) => {
  const session = await getSession(request);
  console.log(session);
  if (!session?.user) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const result = await createAuction.safeParseAsync(await request.json());

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
    }
  );

  //   console.log(balance, data);

  const binExist = await client.query(
    `
    select BinAuction
    filter .card.id = <uuid>$cardId
    limit 1
  `,
    {
      cardId: data.cardId,
    }
  );

  if (binExist.length > 0) {
    // await client.query(
    //   `
    //   update BinAuction
    //   filter .card.id = <uuid>$cardId
    //   set {
    //     price := <int64>$price
    //   }
    // `,
    //   {
    //     cardId: data.cardId,
    //     price: data.price,
    //   }
    // );
    return new Response(
      JSON.stringify({ error: "Failed you already selling" }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  await client.query(
    `
  update User
  filter .id = <uuid>$user
  set {
      balance := .balance - <int64>$tax
  }
  `,
    {
      user: session?.user?.id,
      tax: Math.ceil(data.price * 0.05),
    }
  );
  const r = await client.query(
    `
insert BinAuction {
    card := (
        select Card
        filter .id = <uuid>$cardId
        limit 1
    ),
    price := <int64>$price
}
`,
    {
      cardId: data.cardId,
      price: data.price,
    }
  );
  return new Response(JSON.stringify(r), {
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
