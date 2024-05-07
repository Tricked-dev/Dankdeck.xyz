import { protectedProcedure, publicProcedure } from "../trpc";

import { TRPCError } from "@trpc/server";
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
    insert Offer {
      user: <uuid>$user,
      offeredCards: (
        select Card
        filter .id in {${offeredCards.map((id) => `<uuid>"${id}",`)}} and .userId = <uuid>$myId
        limit 5
      ),
      receivedCards: (
        select Card
        filter .id in {${receivedCards.map((id) => `<uuid>"${id}",`)}} and .userId = <uuid>$user
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
    select Offer {
      id,
      user: {
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
    return offer;
  });

export const acceptOffer = protectedProcedure
  .input(
    z.object({
      offerId: z.string().uuid(),
    }),
  )
  .mutation(async ({ ctx, input: data }) => {
    const [offer] = await client.query(
      `
      select Offer {
        id,
        user: {
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
    );
    if (!offer) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Offer not found",
      });
    }
    if (offer.user.id !== ctx.session.user?.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const offeredCards = offer.offeredCards.map((c) => c.id);
    const receivedCards = offer.receivedCards.map((c) => c.id);
    await client.query(
      `
      update Offer
      filter .id = <uuid>$id
      set {
        acceptedAt := <datetime>$now
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
      filter .id in {${offeredCards.join(",")}}
      set {
        userId := <uuid>$userId
      }
      `,
      {
        userId: ctx.session.user?.id,
      },
    );
    await client.query(
      `
      update Card
      filter .id in {${receivedCards.join(",")}}
      set {
        userId := <uuid>$userId
      }
      `,
      {
        userId: offer.user.id,
      },
    );
  });
