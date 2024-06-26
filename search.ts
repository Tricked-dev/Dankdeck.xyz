import { client } from "./client";

interface Search {
  query?: string;
  year?: number;
  nsfw?: boolean;
  type?: string[];
  origin?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

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

  console.log(await client.query(bigQuery, opts));
}

await searchCard({
  query: "meme",
  origin: ["Caio Slikta"],
  priceRange: {
    min: 20,
    max: 1000,
  },
});

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
  if (search.priceRange) {
    ops.push(
      `.price >= ${search.priceRange.min} AND .price <= ${search.priceRange.max}`,
    );
  }

  return ops.join(" AND ");
}
