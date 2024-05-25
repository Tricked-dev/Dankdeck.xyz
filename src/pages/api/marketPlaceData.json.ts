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
  ),
  top_types := (
    select (select (
      group Meme by .type
    ) {
      origin := .key.type,
      num := count(.elements)
    } order by .num desc limit 200)
      .origin
  ),
  max_price := (
    select max(BinAuction.price)
  ),
  min_price := (
    select min(BinAuction.price)
  )
}
    `);

  if (!data) return new Response(null, { status: 404 });

  if (data.max_price > 5000) {
    data.max_price = 5000;
  }
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "private, max-age=0",
    },
  });
};
