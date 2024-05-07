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

export async function getCard(id: string) {
  let card = await client.query(
    `
  select Card {
    id,
    number,
    createdAt,
    meme: {
      id,
      img,
      name,
      description
    },
    userId,
    user: {
      name
    },
    auction: {
      price
    }
  }
  filter .id = <uuid>$cardId
  limit 1
`,
    {
      cardId: id,
    },
  );

  return card[0] as Card;
}
