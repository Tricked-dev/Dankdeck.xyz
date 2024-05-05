import { createResponse, requireSession } from "../../lib/apiUtils";

import type { APIRoute } from "astro";
import { client } from "../../../client";

export const GET: APIRoute = async ({ request }) => {
  const { session, r } = await requireSession(request);
  if (r) return r;

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
  return createResponse(200, { balance });
};
