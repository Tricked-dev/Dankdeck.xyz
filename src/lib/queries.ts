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
            shortId,
            name,
            description
        }
    }
    filter .userId = <uuid>$id
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
      shortId,
      name,
      description,
      origin,
      year,
      type,
      partOf
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