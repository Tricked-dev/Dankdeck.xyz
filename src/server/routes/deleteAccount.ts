import { protectedProcedure, publicProcedure } from "../trpc";

import { TRPCError } from "@trpc/server";
import { type Card, type TradeOffer } from "@db/schema";
import { client } from "client";
import { z } from "zod";

export const deleteAccount = protectedProcedure.mutation(
  async ({ ctx, input: data }) => {
    const userId = ctx.session.user!.id;

    await client.transaction(async (transaction) => {
      await transaction.query(
        `
    update User
    filter
      .id = <uuid>$userId
    set {
      email := <str>$email,
      name := <str>$newName,
      image := <optional str>$image,
      balance := 0,
      theme := "light"
    }
    `,
        {
          userId,
          email: `${userId}@gone.dankdeck.xyz`,
          newName: "Deleted User",
          image: null,
        },
      );
      await transaction.query(
        `
    delete Session filter .userId = <uuid>$userId
    `,
        {
          userId,
        },
      );
      await transaction.query(
        `
    delete Account filter .userId = <uuid>$userId
    `,
        {
          userId,
        },
      );
      const cards = await transaction.query<Card>(
        `select Card filter .userId = <uuid>$userId`,
        {
          userId,
        },
      );
      for (const card of cards) {
        await transaction.query(
          `
        delete BinAuction
        filter .cardId = <uuid>$cardId
        `,
          {
            cardId: card.id,
          },
        );
        await transaction.query(
          `
        insert BinAuction {
            card := (
                select Card
                filter .id = <uuid>$cardId
                limit 1),
            price := <int64>10
        }
        `,
          {
            cardId: card.id,
          },
        );
      }
    });
  },
);
