import { search, type Search } from "@/lib/interfaces";
import { publicProcedure } from "../trpc";

import { client } from "client";

async function searchCard(query: Search) {
  const q = `
  with
    query := <optional str>$query,
    res := (
    select fts::search(Meme, query ?? "", language := 'eng')
  )
  select res.object.shortId
  order by res.score desc;
  `;

  const res = await client.query<number>(
    `
  ${q}`,
    {
      query: query.query,
    },
  );
  const bigQuery = `
  select BinAuction {
    price,
    card: {
      id,
      number,
      meme: {
        shortId,
        name,
        description
      }
    }
  } filter ${opGenerator(query, res)}
  `;
  let opts: Record<string, any> | undefined = undefined;

  if (query.origin) {
    if (!opts) opts = {};
    opts.origin = query.origin;
  }
  if (query.type) {
    if (!opts) opts = {};
    opts.type = query.type;
  }
  if (query.partOf) {
    if (!opts) opts = {};
    opts.partOf = query.partOf;
  }

  return await client.query(bigQuery, opts);
}

function opGenerator(search: Search, shortIds?: number[]) {
  let p = `.card.meme.`;
  const ops = [];
  if (search.nsfw) {
    ops.push(`${p}nsfw = ${search.nsfw}`);
  }
  if (search.origin) {
    ops.push(`contains(<array<str>>$origin, ${p}origin)`);
  }
  if (search.type) {
    ops.push(`contains(<array<str>>$type, ${p}type)`);
  }
  if (search.year) {
    ops.push(`${p}year = ${search.year}`);
  }
  if (search.query) {
    ops.push(`contains(<array<int64>>[${shortIds?.join(",")}], ${p}shortId)`);
  }
  if (search.partOf) {
    ops.push(`contains(<array<str>>$partOf, ${p}partOf)`);
  }
  if (search.priceRange) {
    ops.push(
      `.price >= ${search.priceRange.min} AND .price <= ${search.priceRange.max}`,
    );
  }
  if (!ops.length) return `true = true`;

  return ops.join(" AND ");
}

export const binSearch = publicProcedure
  .input(search)
  .query(async ({ input: data }) => {
    const res = await searchCard(data);
    return res;
  });
