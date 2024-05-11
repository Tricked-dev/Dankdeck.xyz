import type { ApiUser } from '@/lib/interfaces';
import { client } from '@/client';
import { protectedProcedure } from '../trpc';

export const user = protectedProcedure.query(async ({ ctx }) => {
	const [body] = await client.query(
		`
    select User {
        id,
        balance,
        dailyClaimedAt,
        cardClaimedAt,
        name,
        email,
        image,
        cardCount := count(.cards),
        cardsClaimedCount := count(.cardsClaimed),
        createdAt
    }
    filter User.id = <uuid>$user
    limit 1
  `,
		{
			user: ctx.session.user?.id
		}
	);

	return body as ApiUser;
});
