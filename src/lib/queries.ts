import type { Card } from "@db/schema";
import { client } from "client";

export async function getCardsView(id: string) {
  const cards = await client.query(
    `
    select Card {
        id,
        number,
        meme: {
            id,
            img,
            name,
            description
        }
    }
    filter .userId = <uuid>$id
    limit 200
`,
    {
      id,
    },
  );

  return cards as Card[];
}
