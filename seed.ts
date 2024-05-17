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
      })
      .unlessConflict((meme) => ({
        on: meme.slug,
        else: e.update(meme, () => ({
          set: {
            description: e.cast(e.str, item.desc),
            name: e.cast(e.str, item.title),
            slug: e.cast(e.str, item.slug),
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

function verySmartOriginSanitizer(origin: string): string {
  if (!origin) return "Unknown";
  const lowerCaseOrigin = origin.toLowerCase();
  if (lowerCaseOrigin.includes("youtube")) {
    return "youtube";
  }
  if (lowerCaseOrigin.includes("twitter")) {
    return "X";
  }
  if (lowerCaseOrigin.includes("reddit")) {
    return "reddit";
  }
  if (lowerCaseOrigin.includes("/r/")) {
    return "reddit";
  }
  if (lowerCaseOrigin.includes("4chan")) {
    return "4chan";
  }
  const chanTopics = [
    "/a/",
    "/b/",
    "/co/",
    "/fa/",
    "/int/",
    "/leftypol/",
    "/mu/",
    "/pol/",
    "/r9k/",
    "/sp/",
    "/tv/",
    "/v/",
  ];
  if (chanTopics.some((x) => lowerCaseOrigin.includes(x))) {
    return "4chan";
  }
  if (lowerCaseOrigin.includes("amazon")) {
    return "amazon";
  }
  if (lowerCaseOrigin.includes("avengers")) {
    return "avengers";
  }
  if (lowerCaseOrigin.includes("instagram")) {
    return "instagram";
  }
  if (lowerCaseOrigin.includes("game of thrones")) {
    return "game of thrones";
  }
  if (lowerCaseOrigin.includes("grand theft")) {
    return "grand theft auto";
  }
  if (lowerCaseOrigin.includes("harry potter")) {
    return "harry potter";
  }
  if (lowerCaseOrigin.includes("gravity falls")) {
    return "gravity falls";
  }
  if (lowerCaseOrigin.replaceAll(" ", "").includes("bodybuilding")) {
    return "body building";
  }
  if (lowerCaseOrigin.includes("it's always sunny")) {
    return "it's always sunny in philadelphia";
  }
  if (lowerCaseOrigin.replaceAll(" ", "").includes("dragonball")) {
    return "dragonball";
  }
  if (lowerCaseOrigin.includes("jojo's")) {
    return "jojo's bizarre adventure";
  }
  if (lowerCaseOrigin.includes("Jurassic")) {
    return "jurassic park";
  }
  if (lowerCaseOrigin.includes("minecraft")) {
    return "minecraft";
  }
  if (lowerCaseOrigin.includes("pokemon")) {
    return "pokemon";
  }
  if (lowerCaseOrigin.includes("spongebob")) {
    return "spongebob";
  }
  if (lowerCaseOrigin.includes("star wars")) {
    return "star wars";
  }
  if (lowerCaseOrigin.includes("star trek")) {
    return "star trek";
  }
  if (lowerCaseOrigin.includes("the simpsons")) {
    return "the simpsons";
  }
  if (lowerCaseOrigin.includes("titanic")) {
    return "titanic";
  }
  if (lowerCaseOrigin.includes("king of the")) {
    return "king of the hill";
  }
  if (lowerCaseOrigin.includes("tiktok")) {
    return "tiktok";
  }
  if (lowerCaseOrigin.includes("kuvalauta")) {
    return "kuvalauta";
  }
  if (lowerCaseOrigin.includes("final fantasy")) {
    return "final fantasy";
  }
  if (lowerCaseOrigin.includes("washington")) {
    return "washington";
  }

  if (lowerCaseOrigin.includes("Warhammer")) {
    return "warhammer";
  }
  if (lowerCaseOrigin.includes("Usenet")) {
    return "usenet";
  }
  if (lowerCaseOrigin.includes("Unknown")) {
    return "unknown";
  }
  if (lowerCaseOrigin.includes("tumblr")) {
    return "tumblr";
  }
  if (lowerCaseOrigin.includes("toonhole")) {
    return "toonhole";
  }
  if (
    lowerCaseOrigin.includes("tim and eric") ||
    lowerCaseOrigin.includes("tim & eric")
  ) {
    return "tim and eric";
  }
  if (lowerCaseOrigin.includes("thomas the tank")) {
    return "Thomas the Tank Engine";
  }
  if (lowerCaseOrigin.includes("thor: ragnarok")) {
    return "thor: ragnarok";
  }

  if (lowerCaseOrigin.includes("impsons")) {
    return "The Simpsons";
  }
  if (lowerCaseOrigin.includes("the legend of zelda")) {
    return "the legend of zelda";
  }
  if (lowerCaseOrigin.includes("the dark knight")) {
    return "the dark knight";
  }
  if (lowerCaseOrigin.includes("television")) {
    return "Television";
  }
  if (lowerCaseOrigin.includes("the office")) {
    return "the office";
  }
  if (lowerCaseOrigin.includes("south park")) {
    return "south park";
  }
  if (lowerCaseOrigin.includes("sonic")) {
    return "sonic";
  }
  if (lowerCaseOrigin.includes("lord of the r")) {
    return "lord of the rings";
  }
  if (lowerCaseOrigin.includes("bbc")) {
    return "BBC";
  }
  if (lowerCaseOrigin.includes("naruto")) {
    return "Naruto";
  }
  if (origin.includes("Monty Python")) {
    return "Monty Python";
  }
  if (lowerCaseOrigin.includes("Fate")) {
    return "Fate";
  }
  if (lowerCaseOrigin.includes("doom")) {
    return "Doom";
  }
  if (lowerCaseOrigin.includes("doctor strange")) {
    return "Doctor Strange";
  }
  if (lowerCaseOrigin.includes("twitch")) {
    return "twitch";
  }
  if (lowerCaseOrigin.includes("anime")) {
    return "anime";
  }
  const cleanerdOrigin = origin.replaceAll("<i>", "").replaceAll("</i>", "");

  return cleanerdOrigin;
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
        origin: verySmartOriginSanitizer(x.origin) ?? null,
        part_of: x.part_of?.split(",")?.[0]?.split(" / ")?.[0] ?? null,
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
