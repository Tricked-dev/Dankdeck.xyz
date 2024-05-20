import { search, type Search } from "@/lib/interfaces";
import { publicProcedure } from "../trpc";

import { client } from "client";

async function searchCard(query: Search) {
  let ids: number[] = [];
  if (query.query) {
    try {
      const q = `
  with
    query := <optional str>$query,
    res := (
    select fts::search(Meme, query ?? "", language := 'eng')
  )
  select res.object.shortId
  order by res.score desc;
  `;
      ids = await client.query<number>(
        `
  ${q}`,
        {
          query: query.query,
        },
      );
    } catch (e) {}
  }

  function createQuery() {
    if (query.cards) {
      return `
      select Card {
        id,
        number,
        meme: {
          shortId,
          name,
          description
        }
      } filter ${opGenerator(query, ids, "")}
      `;
    }
    return `
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
  } filter ${opGenerator(query, ids)}
    `;
  }

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

  const results = await client.query(createQuery(), opts);
  if (!results.length) {
    try {
      const q = `
      with
        query := <optional str>$query,
        ids := (select Meme{shortId} filter ext::pg_trgm::word_similar(query ?? "", Meme.description)),
        ids2 := (select Meme{shortId} filter ext::pg_trgm::word_similar(query ?? "", Meme.name)),
        combo := (select {ids,ids2})
      select distinct(combo.shortId);
      `;

      ids = await client.query<number>(
        `
  ${q}`,
        {
          query: query.query,
        },
      );
    } catch (e) {}
  } else {
    return results;
  }

  return await client.query(createQuery(), opts);
}

function opGenerator(search: Search, shortIds?: number[], p = ".card") {
  let m = `${p}.meme.`;
  const ops = [];
  if (search.nsfw) {
    ops.push(`${m}nsfw = ${search.nsfw}`);
  }
  if (search.origin) {
    ops.push(`contains(<array<str>>$origin, ${m}origin)`);
  }
  if (search.type) {
    ops.push(`contains(<array<str>>$type, ${m}type)`);
  }
  if (search.year) {
    ops.push(`${m}year = ${search.year}`);
  }
  if (search.query) {
    ops.push(`contains(<array<int64>>[${shortIds?.join(",")}], ${m}shortId)`);
  }
  if (search.partOf) {
    ops.push(`contains(<array<str>>$partOf, ${m}partOf)`);
  }
  if (search.priceRange && !search.cards) {
    ops.push(
      `.price >= ${search.priceRange.min} AND .price <= ${search.priceRange.max}`,
    );
  }
  if (search.user) {
    ops.push(`${p}.userId = <uuid>"${search.user}"`);
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
