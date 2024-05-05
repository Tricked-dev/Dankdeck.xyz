import { createResponse, requireSession } from "@/lib/apiUtils.ts";

import type { APIRoute } from "astro";
import type { User } from "@db/schema";
import { client } from "../../../client";
import e from "../../../dbschema/edgeql-js";
import { getSession } from "auth-astro/server";

const card_claim_delay = 1000 * 60 * 15;

export const GET: APIRoute = async ({ request }) => {
  const { session, r } = await requireSession(request);
  if (r) return r;

  const [{ cardClaimedAt }] = (await client.query(
    `select User {
     cardClaimedAt
    }
  filter
    .id = <uuid>$user
  limit
    1
  `,
    {
      user: session?.user?.id,
    },
  )) as User[];

  if (cardClaimedAt && Date.now() - +cardClaimedAt < card_claim_delay) {
    return createResponse(429, {
      error: "Card already claimed recently",
      date: +cardClaimedAt,
    });
  }

  await client.query(
    `
  update User
  filter
    .id = <uuid>$user
  set {
    cardClaimedAt := <datetime>$now
  }
  `,
    {
      now: new Date(),
      user: session?.user?.id,
    },
  );

  const card = await client.query(
    `
select(insert Card {
    meme := (
        select Meme
        order by random()
        limit 1
    ),
    user := (
        select User
        filter .id = <uuid>$user
        limit 1
    ),
    claimedBy := (
        select User
        filter .id = <uuid>$user
        limit 1
    ),
    number := <int64>$number
}) {
  meme: {
    name,
    description,
    slug,
    img
  },
  number
}
`,
    {
      user: session?.user?.id,
      number: (Math.random() * 200) | 0,
    },
  );
  return createResponse(200, card);
};
