import { protectedProcedure, publicProcedure } from "../trpc";

import { TRPCError } from "@trpc/server";
import type { TradeOffer } from "@db/schema";
import { client } from "client";
import { z } from "zod";

export const createOffer = protectedProcedure
  .input(
    z.object({
      user: z.string().uuid(),
      offeredCards: z.array(z.string().uuid()),
      receivedCards: z.array(z.string().uuid()),
    }),
  )
  .mutation(async ({ ctx, input: data }) => {
    const myId = ctx.session.user!.id;
    const { user, offeredCards, receivedCards } = data;
    const [res] = await client.query(
      `
    insert TradeOffer {
      offerer := (
        select User
        filter .id = <uuid>$myId
        limit 1
      ),
      offeredCards := (
        select Card
        filter .id in {${offeredCards.map((id) => `<uuid>"${id}"`).join(",")}} and .userId = <uuid>$myId
        limit 5
      ),
      receiver := (
        select User
        filter .id = <uuid>$user
        limit 1
      ),
      receivedCards := (
        select Card
        filter .id in {${receivedCards.map((id) => `<uuid>"${id}"`).join(",")}} and .userId = <uuid>$user
        limit 5
      )
    }
    `,
      {
        user,
        myId,
      },
    );
    return {
      id: res.id as string,
    };
  });

export const getOffer = publicProcedure
  .input(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .query(async ({ input: data }) => {
    const [offer] = await client.query(
      `
    select TradeOffer {
      id,
      receiver: {
        id
      },
      offerer: {
        id
      },
      offeredCards: {
        id
      },
      receivedCards: {
        id
      }
    }
    filter .id = <uuid>$id
    limit 1
  `,
      {
        id: data.id,
      },
    );
    return offer as TradeOffer;
  });

export const acceptOffer = protectedProcedure
  .input(
    z.object({
      offerId: z.string().uuid(),
    }),
  )
  .mutation(async ({ ctx, input: data }) => {
    const [offer] = (await client.query(
      `
      select TradeOffer {
        id,
        offerer: {
          id
        },
        receiver: {
          id
        },
        offeredCards: {
          id
        },
        receivedCards: {
          id
        }
      }
      filter .id = <uuid>$id
      limit 1
    `,
      {
        id: data.offerId,
      },
    )) as TradeOffer[];
    if (!offer) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Offer not found",
      });
    }
    if (offer.receiver.id !== ctx.session.user?.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized that offer is not for you :)",
      });
    }
    const offeredCards = offer.offeredCards.map((c) => c.id);
    const receivedCards = offer.receivedCards.map((c) => c.id);
    await client.query(
      `
      update TradeOffer
      filter .id = <uuid>$id
      set {
        completedAt := <datetime>$now
      }
      `,
      {
        now: new Date(),
        id: data.offerId,
      },
    );
    await client.query(
      `
      update Card
      filter .id in {${offeredCards.map((id) => `<uuid>"${id}"`).join(",")}}
      set {
        user := (
          select User
          filter .id = <uuid>$userId
          limit 1
        )
      }
      `,
      {
        userId: ctx.session.user?.id,
      },
    );
    await client.query(
      `
      update Card
      filter .id in {${receivedCards.map((id) => `<uuid>"${id}"`).join(",")}}
      set {
        user := (
            select User
            filter .id = <uuid>$userId
            limit 1
        )
      }
      `,
      {
        userId: offer.offerer.id,
      },
    );
    await client.query(
      `
      delete BinAuction
      filter .cardId in {${[...receivedCards, ...offeredCards].map((id) => `<uuid>"${id}"`).join(",")}}
      `,
    );
  });
