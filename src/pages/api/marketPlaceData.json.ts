import type { APIRoute } from "astro";
import { client } from "client";

export const GET: APIRoute = async () => {
  const [data] = await client.query(`
select {
  top_parts := (
    select (select (
      group Meme by .partOf
    ) {
      origin := .key.partOf,
      num := count(.elements)
    } order by .num desc limit 200) 
      .origin
  ),
  top_origins := (
    select (select (
      group Meme by .origin
    ) {
      origin := .key.origin,
      num := count(.elements)
    } order by .num desc limit 200) 
      .origin
  )
}
    `);
  if (!data) return new Response(null, { status: 404 });
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
