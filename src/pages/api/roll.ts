import { createResponse, requireSession } from "../../lib/apiUtils";

import type { APIRoute } from "astro";
import { client } from "../../../client";
import e from "../../../dbschema/edgeql-js";
import { getSession } from "auth-astro/server";

export const GET: APIRoute = async ({ request }) => {
  const { session, r } = await requireSession(request);
  if (r) return r;

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
