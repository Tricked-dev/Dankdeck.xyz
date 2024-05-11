import {client} from "@/client"
import {getCard} from "@/lib/queries"
export const load: LayoutServerLoad = async (event) => {

	return {
		cardData: await getCard(event.params.card)
	};
};
