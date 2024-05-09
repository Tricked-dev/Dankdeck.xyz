import { TRPCError } from "@trpc/server";
import type { User } from "@db/schema";
import { claimDelay } from "@/lib/interfaces";
import { client } from "client";
import { protectedProcedure } from "../trpc";

export const roll = protectedProcedure.query(async ({ ctx }) => {
  const [{ cardClaimedAt }] = (await client.query(
    `select User {
     cardClaimedAt
    }
  filter
    .id = <uuid>$user
  limit
    1
  `,
    {
      user: ctx.session?.user?.id,
    },
  )) as User[];

  if (cardClaimedAt && Date.now() - +cardClaimedAt < claimDelay) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Card already claimed recently",
    });
  }

  await client.query(
    `
  update User
  filter
    .id = <uuid>$user
  set {
    cardClaimedAt := <datetime>$now
  }
  `,
    {
      now: new Date(),
      user: ctx.session?.user?.id,
    },
  );

  const [randomMeme] = await client.query(
    `
  select Meme
  order by random()
  limit 1
  `,
  );

  const card = await client.query(
    `
with
  data := (select Card.number filter Card.meme.id = <uuid>$memeId),
  min_val := min(data),
  all_nums := range_unpack(range(1, min({min_val+1+count(data), 999999}))),
  number := min(all_nums FILTER NOT (all_nums in data)),
select(insert Card {
    meme :=  (
      select Meme
      filter .id = <uuid>$memeId
    ),
    user := (
        select User
        filter .id = <uuid>$user
        limit 1
    ),
    claimedBy := (
        select User
        filter .id = <uuid>$user
        limit 1
    ),
    number := number,
}) {
  meme: {
    name,
    description,
    slug,
    shortId
  },
  number
}
`,
    {
      user: ctx.session?.user?.id,
      memeId: randomMeme,
    },
  );
  return card;
});
