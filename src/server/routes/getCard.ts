import { getCard as getCardView } from "@/lib/queries";
import { publicProcedure } from "../trpc";
import { z } from "zod";

export const getCard = publicProcedure
  .input(
    z.object({
      cardId: z.string().uuid("Invalid UUID"),
    }),
  )
  .query(async ({ input: data }) => {
    const c = await getCardView(data.cardId);
    return c;
  });
