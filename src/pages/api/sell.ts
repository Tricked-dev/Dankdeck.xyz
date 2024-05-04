import { createResponse, requireSession } from "../../lib/apiUtils";

import type { APIRoute } from "astro";
import { client } from "../../../client";
import { createAuction } from "../../lib/interfaces";
import e from "../../../dbschema/edgeql-js";
import { getSession } from "auth-astro/server";

export const POST: APIRoute = async ({ request }) => {
  const { session, r } = await requireSession(request);
  if (r) return r;

  const result = await createAuction.safeParseAsync(await request.json());

  if (!result.success) {
    return new Response(JSON.stringify(result.error), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const data = result.data;
  const tax = Math.ceil(data.price * 0.05);

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

  if (tax > balance) {
    return new Response(JSON.stringify({ error: "Insufficient funds" }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const binExist = await client.query(
    `
    select BinAuction
    filter .card.id = <uuid>$cardId
    limit 1
  `,
    {
      cardId: data.cardId,
    },
  );

  if (binExist.length > 0) {
    return createResponse(409, { error: "Card already on sale" });
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
      tax,
    },
  );
  await client.query(
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
    },
  );
  return createResponse(200, { success: true });
};
