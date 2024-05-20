import type { APIRoute } from "astro";
import type { Card } from "@db/schema";
import { getCard } from "@/lib/queries";

export const GET: APIRoute = async ({ params }) => {
  const cardId = params.card;
  let cardData: Card;
  try {
    cardData = await getCard(cardId!);
  } catch (e) {
    return Response.redirect("/");
  }
  return Response.json({
    type: "photo",
    version: "1.0",
    title: `DankDeck | ${cardData.meme.name} #${cardData.number}`,
    author_name: cardData.user.name,
    author_url: `https://dankdeck.xyz/user/${cardData.user.id}`,
    provider_name: "DankDeck",
    provider_url: "https://dankdeck.xyz",
    thumbnail_url: cardData.user.picture,
    thumbnail_width: 500,
    thumbnail_height: 500,
    cache_age: 60 * 60,
    url: `https://dankdeck.xyz/card/${cardId}`,
    width: 700,
    height: 800,
  });
};
