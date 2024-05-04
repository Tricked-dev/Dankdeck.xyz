import { errors, requireSession } from "../../lib/apiUtils";

import type { APIRoute } from "astro";
import { cancelAuction } from "../../lib/interfaces";
import { client } from "../../../client";
import { getSession } from "auth-astro/server";

export const POST: APIRoute = async ({ request }) => {
  const { session, r } = await requireSession(request);
  if (r) return r;

  const result = await cancelAuction.safeParseAsync(await request.json());

  if (!result.success) {
    return errors.zodError(result.error);
  }

  const id = result.data.cardId;

  const [card] = await client.query(
    `
    select Card {
      userId
    }
    filter .id = <uuid>$id
    limit 1
  `,
    {
      id,
    },
  );

  if (card.userId !== session?.user?.id) {
    return errors.forbidden();
  }

  await client.query(
    `
    delete BinAuction
    filter .cardId = <uuid>$id
    `,
    {
      id,
    },
  );

  return new Response(JSON.stringify({}), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
