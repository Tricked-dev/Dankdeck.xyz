import type { Card } from "@db/schema";
import { ImageResponse } from "@vercel/og";
import { cardImage } from "@/components/og/card";
import { getCard } from "@/lib/queries";

export const ALL = async ({ params }) => {
  const cardId = params.card;
  let cardData: Card;
  try {
    cardData = await getCard(cardId!);
  } catch (e) {
    return Response.redirect("/");
  }
  return cardImage(cardData);
};
