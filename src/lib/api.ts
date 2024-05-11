import type { AppRouter } from '../server';
import { signIn, signOut } from '@auth/sveltekit/client';
import toast from 'svelte-french-toast';

import type { Router } from '$lib/trpc/router';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';
import { TRPCClientError } from '@trpc/client';
let browserClient: ReturnType<typeof createTRPCClient<AppRouter>>;

export function trpc(init?: TRPCClientInit) {
	const isBrowser = typeof window !== 'undefined';
	if (isBrowser && browserClient) return browserClient;
	const client = createTRPCClient<Router>({ init });
	if (isBrowser) browserClient = client;
	return client;
}

// export const trpc = createTRPCClient<AppRouter>({
//   links: [
//     httpBatchLink({
//       get url() {
//         // console.log("Get!");
//         if (typeof window !== "undefined") {
//           return `${window.location.origin}/trpc`;
//         } else {
//           if (import.meta.env.DEV) {
//             return "http://localhost:4321/trpc";
//           } else {
//             return "https://dankdeck.xyz/trpc";
//           }
//         }
//       },
//     }),
//   ],
// });

export const tr = async <T>(
	fn: () => Promise<T>,
	err?: (err: any) => Promise<unknown> | unknown
): Promise<Awaited<T> | null> => {
	try {
		return await fn();
	} catch (e) {
		if (e instanceof TRPCClientError) {
			if (e.message == 'NOT_AUTHENTICATED') {
				await signIn('github');
			}
			toast.error(e.message);
		} else {
			console.error(e);
			console.error('A error occurred check logs for more info');
		}
		await err?.(e);
		return null;
	}
};
