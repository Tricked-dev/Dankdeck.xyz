import { DAY, claimDelay, dailyMoney } from "@/lib/interfaces";

import { TRPCError } from "@trpc/server";
import { type Card, type User } from "@db/schema";
import { client } from "client";
import { protectedProcedure } from "../trpc";
import { z } from "zod";

export const cancel = protectedProcedure
  .input(
    z.object({
      cardId: z.string().uuid("Invalid UUID"),
    }),
  )
  .mutation(async ({ ctx, input: data }) => {
    const id = data.cardId;

    const [card] = await client.query<Card>(
      `
    select Card {
      userId
    }
    filter .id = <uuid>$id
    limit 1
  `,
      {
        id,
      },
    );

    if (card.userId !== ctx.session?.user?.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    await client.query(
      `
    delete BinAuction
    filter .cardId = <uuid>$id
    `,
      {
        id,
      },
    );

    return {};
  });
