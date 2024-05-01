import { Database } from "bun:sqlite";
import { client } from "./client";
import e from "./dbschema/edgeql-js";

const db = new Database("./memes.db");

const res = db.query("SELECT * FROM memes").all();

//  {
//     href: "https://knowyourmeme.com/memes/extended-cut-ytmnds",
//     desc: "Extended Cut YTMNDs",
//     title: "Extended Cut YTMNDs",
//     img: "https://i.kym-cdn.com/entries/icons/medium/000/000/827/f63fe9b733f92c96c6a431e4f2e35494.jpg",
//     title2: "Extended Cut YTMNDs",
//     nsfw: 0,
//     idx: 7293,
//   }
const query = e.params({ items: e.json }, (params) => {
  return e.for(e.json_array_unpack(params.items), (item) => {
    return e.insert(e.Meme, {
      description: e.cast(e.str, item.desc),
      img: e.cast(e.str, item.img),
      name: e.cast(e.str, item.title),
      slug: e.cast(e.str, item.slug),
    });
  });
});

const foundSlugs = [];

const result = await query.run(client, {
  items: res
    .map((x) => ({
      ...x,
      slug: x.href.split("/").at(-1),
    }))
    .filter((x) => {
      if (foundSlugs.includes(x.slug)) {
        return false;
      } else {
        foundSlugs.push(x.slug);
        return true;
      }
    }),
});

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
