import { DAY, claimDelay, dailyMoney } from "@/lib/interfaces";
import { createResponse, requireSession } from "@/lib/apiUtils.ts";

import type { APIRoute } from "astro";
import type { User } from "@db/schema";
import { client } from "../../../client";
import e from "../../../dbschema/edgeql-js";
import { getSession } from "auth-astro/server";

export const GET: APIRoute = async ({ request }) => {
  const { session, r } = await requireSession(request);
  if (r) return r;

  const [{ dailyClaimedAt }] = (await client.query(
    `select User {
     dailyClaimedAt
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

  if (dailyClaimedAt && Date.now() - +dailyClaimedAt < DAY) {
    return createResponse(429, {
      error: "Daily already claimed recently",
      date: +dailyClaimedAt,
    });
  }

  const [{ balance }] = await client.query(
    `
select(
    update User
    filter
        .id = <uuid>$user
    set {
        balance := .balance + <int64>$number,
        dailyClaimedAt := <datetime>$now
    }
) {
  balance
}
`,
    {
      user: session?.user?.id,
      number: dailyMoney,
      now: new Date(),
    },
  );
  return createResponse(200, { balance });
};
