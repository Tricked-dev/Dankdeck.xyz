import type { Handle } from '@sveltejs/kit';
import { appRouter } from '@/server/router';
import { handle as authHandle } from './auth';
import { createTRPCHandle } from 'trpc-sveltekit';
import { sequence } from '@sveltejs/kit/hooks';

export async function createContext({ req, locals, ...rest }: RequestEvent) {
	// const session = await getSession(req);
	return {
		session: await locals.auth()
	};
}

const trpcHandle: Handle = createTRPCHandle({ router: appRouter, createContext });

export const handle = sequence(authHandle, trpcHandle);
