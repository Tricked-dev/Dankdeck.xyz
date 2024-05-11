import { EdgeDBAdapter } from '@auth/edgedb-adapter';
import GitHub from '@auth/sveltekit/providers/github';
import { SvelteKitAuth } from '@auth/sveltekit';
import { client } from './client';

console.log(import.meta.env.GITHUB_CLIENT_ID);
console.log(import.meta.env.GITHUB_CLIENT_SECRET);
export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [GitHub()],
	adapter: EdgeDBAdapter(client),
	pages: {
		signIn: '/login',
		newUser: '/cards?onboard=1'
	},
	callbacks: {
		session: async ({ session, user }) => {
			session.user.id = user.id;
			return session;
		}
	}
});
