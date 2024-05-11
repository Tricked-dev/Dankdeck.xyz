import { DAY, claimDelay, dailyMoney } from '@/lib/interfaces';

import { TRPCError } from '@trpc/server';
import type { User } from '@db/schema';
import { client } from '@/client';
import { protectedProcedure } from '../trpc';

export const daily = protectedProcedure.query(async ({ ctx }) => {
	const [{ dailyClaimedAt }] = (await client.query(
		`select User {
     dailyClaimedAt
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

	if (dailyClaimedAt && Date.now() - +dailyClaimedAt < DAY) {
		throw new TRPCError({
			code: 'TOO_MANY_REQUESTS',
			message: 'Daily reward already claimed recently'
		});
	}

	const [{ balance }] = await client.query(
		`
select(
    update User
    filter
        .id = <uuid>$user
    set {
        balance := .balance + <int64>$number,
        dailyClaimedAt := <datetime>$now
    }
) {
  balance
}
`,
		{
			user: ctx.session?.user?.id,
			number: dailyMoney,
			now: new Date()
		}
	);

	return { balance };
});
