import { getCard as getCardView, getCardsView } from '@/lib/queries';
import { protectedProcedure, publicProcedure } from '../trpc';

import { TRPCError } from '@trpc/server';
import type { User } from '@db/schema';
import { client } from '@/client';
import { z } from 'zod';

export const getCard = publicProcedure
	.input(
		z.object({
			cardId: z.string().uuid('Invalid UUID')
		})
	)
	.query(async ({ input: data }) => {
		const c = await getCardView(data.cardId);
		return c;
	});
