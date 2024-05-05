import { createResponse, requireSession } from "@/lib/apiUtils.ts";

import type { APIRoute } from "astro";
import { client } from "../../../client";

export const GET: APIRoute = async ({ request }) => {
  const { session, r } = await requireSession(request);
  if (r) return r;

  const [body] = await client.query(
    `
    select User {
        id,
        balance,
        dailyClaimedAt,
        cardClaimedAt,
        name,
        email,
        image,
        cardCount := count(.cards),
        cardsClaimedCount := count(.cardsClaimed),
        createdAt
    }
    filter User.id = <uuid>$user
    limit 1
  `,
    {
      user: session?.user?.id,
    },
  );
  return createResponse(200, body);
};
