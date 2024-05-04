import type { APIRoute } from "astro";
import { client } from "../../../client";
import { getSession } from "auth-astro/server";

export const GET: APIRoute = async ({ request }) => {
  const session = await getSession(request);
  if (!session) {
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
  return new Response(JSON.stringify({ balance: parseInt(balance) }));
};
