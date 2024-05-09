import { Database } from "bun:sqlite";
import { client } from "./client";
import e from "./dbschema/edgeql-js";

const db = new Database("./memes.db");

const res = db.query("SELECT * FROM combines").all();

const query = e.params({ items: e.json }, (params) => {
  return e.for(e.json_array_unpack(params.items), (item) => {
    return e
      .insert(e.Meme, {
        description: e.cast(e.str, item.desc),
        name: e.cast(e.str, item.title),
        slug: e.cast(e.str, item.slug),
      })
      .unlessConflict((meme) => ({
        on: meme.slug,
        else: e.update(meme, () => ({
          set: {
            nsfw: e.cast(e.bool, item.nsfw),
            shortId: e.cast(e.int64, item.short_id),
            idx: e.cast(e.int64, item.idx),
            origin: e.cast(e.str, item.origin),
            stars: e.cast(e.int64, item.stars),
            views: e.cast(e.int64, item.views),
            year: e.cast(e.int64, item.year),
            tags: e.cast(e.array(e.str), item.tags),
            type: e.cast(e.str, item.type),
            partOf: e.cast(e.str, item.part_of),
          },
        })),
      }));
  });
});

const foundSlugs: string[] = [];

function splitArray(array: any[], chunkSize: number) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

for (const smallerArray of splitArray(res, 500) as any[]) {
  smallerArray.forEach((element) => {
    delete element["content"];
  });
  const result = await query.run(client, {
    items: smallerArray
      .map((x: any) => ({
        ...x,
        slug: x.href.split("/").at(-1),
        tags: x.tags.split(",").map((x: string) => x.trim()),
        nsfw: x.nsfw ? true : false,
        short_id: parseInt(x.short_id),
        year: parseInt(x.year),
        idx: parseInt(x.idx),
        stars: parseInt(x.stars),
        views: parseInt(x.views.replaceAll(".", "")),
      }))
      .filter((x: any) => {
        if (foundSlugs.includes(x.slug)) {
          return false;
        } else {
          foundSlugs.push(x.slug);
          return true;
        }
      }),
  });
}

// e.insert(e.Meme, )

// const query = e.select(e.Card, (movie) => ({
//   id: true,
//   title: true,
//   actors: { name: true },
//   num_actors: e.count(movie.actors),
//   filter_single: e.op(movie.title, "=", "Dune"),
// }));

// const result = await query.run(client);
// result.actors[0].name; // => Timothee Chalamet
