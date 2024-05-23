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
    views,
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
      name,
      balance,
      picture,
      cardCount := count(.cards),
      cardsClaimedCount := count(.cardsClaimed),
      soldCount := count(.soldAuctions),
      cardNumber := math::mean(.cards.number),
      cards := (
        select .cards {
          id,
          number,
          meme: {
            id,
            shortId,
            name,
            description
          }
        }
        limit 3
      ),
      image
    },
    auction: {
      id,
      createdAt,
      price
    },
    auctionEntries: {
      seller: {
        id,
        name
      },
      buyer: {
        id,
        name
      },
      createdAt,
      soldAt,
      price
    },
    recentViews := count(
      (select View filter .cardId = <uuid>$cardId and .createdAt > (datetime_current() - <duration>'24 hours'))
    )
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
