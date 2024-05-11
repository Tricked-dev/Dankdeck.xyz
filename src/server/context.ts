import type { RequestEvent } from '@sveltejs/kit';
export async function createContext({ req, locals, ...rest }: RequestEvent) {
	// const session = await getSession(req);
	console.log(locals, req, ...rest);
	console.log(locals, req, ...rest);
	console.log(locals, req, ...rest);
	console.log(locals, req, ...rest);
	console.log(locals, req, ...rest);
	return {
		session: locals.auth()
	};
}
export type Context = Awaited<ReturnType<typeof createContext>>;
