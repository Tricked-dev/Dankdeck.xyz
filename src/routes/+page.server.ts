import {client} from "@/client"
export const load: LayoutServerLoad = async (event) => {
    const auctions = await client.query(`
  select BinAuction {
    id,
    price,
    card: {
      id,
      number,
      meme: {
        id,
        shortId,
        name,
        description
      }
    }
  }
`);
	return {
		auctions
	};
};
