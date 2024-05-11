import {client} from "@/client"
import {getCard} from "@/lib/queries"
export const load: LayoutServerLoad = async (event) => {
const [user] = await client.query(
  `
    select User {
        id,
        name,
        image,
        balance,
        createdAt,
        cards: {
            id,
            number,
            meme: {
                id,
                shortId,
                name,
                description
            },
            auction: {
                price
            }
        }
    }
    filter .id = <uuid>$id
    limit 1
`,
  {
    id: event.params.user,
  }
);
	return {
		user:user
	};
};
