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
  year: 2021,
  type: "Emoticon",
};

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
function opGenerator(search: Search, bin: typeof e.BinAuction) {
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
    return e.op(true, "=", true);
  } else if (ops.length === 1) {
    return ops[0];
  } else {
    const resultArray = [];
    let index = 0;
    for (const op of ops) {
      if (index === 0) {
        resultArray.push(op);
      } else {
        resultArray.push("and", op);
      }
      index++;
    }
    console.log(resultArray);
  }
}
console.log((await res).map((x) => x.card.meme));
