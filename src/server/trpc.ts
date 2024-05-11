import { TRPCError, initTRPC } from '@trpc/server';

import type { getSession } from 'auth-astro/server';

interface Context {
	session: Awaited<ReturnType<typeof getSession>> | null;
}

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
	const { ctx } = opts;

	if (!ctx.session?.user) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'NOT_AUTHENTICATED'
		});
	}
	return opts.next({
		ctx: {
			session: ctx.session
		}
	});
});
