import { client } from '@/client';
import { getCardsView } from '@/lib/queries';
export const load: LayoutServerLoad = async (event) => {
	return {
		session: await event.locals.auth(),
		room: event.params.room
	};
};
