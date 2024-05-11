import type { Card, User } from '@db/schema';

import { TRPCError } from '@trpc/server';
import { claimDelay } from '@/lib/interfaces';
import { client } from '@/client';
import { protectedProcedure } from '../trpc';

export async function rollOnce(userId: string | undefined) {
	const [randomMeme] = await client.query(
		`
  select Meme
  order by random()
  limit 1
  `
	);

	const card = await client.query(
		`
  with
    data := (select Card.number filter Card.meme.id = <uuid>$memeId),
    min_val := min(data),
    all_nums := range_unpack(range(1, 5000 if count(data) > 400 else 500)),
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
      number := (select all_nums FILTER NOT (all_nums in data) order by random() limit 1),
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
			user: userId,
			memeId: randomMeme.id
		}
	);
	return card[0] as Card;
}

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
			user: ctx.session?.user?.id
		}
	)) as User[];

	if (cardClaimedAt && Date.now() - +cardClaimedAt < claimDelay) {
		throw new TRPCError({
			code: 'TOO_MANY_REQUESTS',
			message: 'Card already claimed recently'
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
			user: ctx.session?.user?.id
		}
	);

	let card = await rollOnce(ctx.session?.user?.id);

	return card;
});
