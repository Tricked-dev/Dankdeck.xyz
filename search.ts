import { client } from "./client";
import e from "./dbschema/edgeql-js";

interface Search {
  query?: string;
  year?: number;
  tags?: string[];
  nsfw?: boolean;
  type?: string;
  origin?: string;
}

let search: Search = {
  query: "Scumbag Steve",
  year: 2010,
  type: "Emoticon",
};

async function searchCard(query: Search) {
  if (query.query) {
    const searchExpr = e.for(e.fts.search(e.Meme, "search"), (search) =>
      e.select({ object: search.object, score: search.score }),
    );

    const allQuery = e.select(searchExpr, ($) => ({
      name: $.object.name,
      score: $.score,
    }));
    const all = await allQuery.run(client);
    console.log(all);
    return;
  }

  return;

  const res = e
    .select(e.BinAuction, (bin) => ({
      price: true,
      card: {
        number: true,
        meme: {
          name: true,
          description: true,
          nsfw: true,
          tags: true,
          year: true,
          stars: true,
          type: true,
        },
      },
      filter: opGenerator(search, bin as any),
    }))
    .run(client);
}

await searchCard({
  query: "Scumbag Steve",
});

function opGenerator(search: Search, bin: typeof e.BinAuction) {
  e.fts.search(bin.card.meme, "Testing!");
  const ops = [];
  if (search.nsfw) {
    ops.push(e.op(bin.card.meme.nsfw, "=", search.nsfw));
  }
  if (search.origin) {
    ops.push(e.op(bin.card.meme.origin, "=", search.origin));
  }
  if (search.type) {
    ops.push(e.op(bin.card.meme.type, "=", search.type));
  }
  if (search.year) {
    ops.push(e.op(bin.card.meme.year, "=", search.year));
  }

  if (ops.length === 0) {
    return e.bool(true);
  } else if (ops.length === 1) {
    return ops[0];
  }

  return e.all(e.set(...ops));
}
// console.log((await res).map((x) => x.card.meme));
