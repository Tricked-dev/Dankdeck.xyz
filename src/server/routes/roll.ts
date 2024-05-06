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

  const card = await client.query(
    `
select(insert Card {
    meme := (
        select Meme
        order by random()
        limit 1
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
    number := <int64>$number
}) {
  meme: {
    name,
    description,
    slug,
    img
  },
  number
}
`,
    {
      user: ctx.session?.user?.id,
      number: (Math.random() * 200) | 0,
    },
  );
  return card;
});
