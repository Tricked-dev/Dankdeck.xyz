import { client } from '@/client';
import { getCardsView } from '@/lib/queries';
export const load: LayoutServerLoad = async (event) => {
	return {
		cardData: await getCardsView((await event.locals.auth()).user.id)
	};
};
