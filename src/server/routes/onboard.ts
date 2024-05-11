import { protectedProcedure, publicProcedure } from "../trpc";

import { TRPCError } from "@trpc/server";
import type { TradeOffer } from "@db/schema";
import { client } from "client";
import { rollOnce } from "./roll";
import { z } from "zod";

export const onBoard = protectedProcedure.mutation(async ({ ctx }) => {
  const userId = ctx.session.user!.id;
  const [selectedCount] = await client.query(
    `
    select User {
        cardsClaimedCount := count(.cardsClaimed)
    }  filter .id = <uuid>$userId
    `,
    {
      userId,
    },
  );

  if (selectedCount.cardsClaimedCount != 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Already onboarded",
    });
  }
  const cards = await Promise.all([
    rollOnce(userId),
    rollOnce(userId),
    rollOnce(userId),
    rollOnce(userId),
    rollOnce(userId),
  ]);

  return {
    cards,
  };
});
