import { client } from "../../../client";
import e from "../../../dbschema/edgeql-js";
import { getSession } from "auth-astro/server";

export async function GET({ params, request }) {
  const session = await getSession(request);
  console.log(session);
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
  //   let [meme] = await e
  //     .select(e.Meme, () => ({
  //       order_by: e.random(),
  //       limit: 1,
  //     }))
  //     .run(client);

  //   e.insert(e.Card, {
  //     // meme: e.cast(e.uuid, meme.id),
  //     meme: meme,
  //   });

  console.log("UserId:", session?.user?.id);
  try {
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
      }
    );
    console.log(card);
    return new Response(JSON.stringify(card), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({
        error: e,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
