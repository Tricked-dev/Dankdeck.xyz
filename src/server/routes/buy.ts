import type { BinAuction, User } from "@db/schema";
import { DAY, claimDelay, dailyMoney } from "@/lib/interfaces";

import { TRPCError } from "@trpc/server";
import { client } from "client";
import { protectedProcedure } from "../trpc";
import { z } from "zod";

export const buy = protectedProcedure
  .input(
    z.object({
      cardId: z.string().uuid("Invalid UUID"),
      price: z
        .number({ coerce: true })
        .max(9999999, "Price too high")
        .min(1, "Price too low"),
    }),
  )
  .mutation(async ({ ctx, input: data }) => {
    const [{ balance }] = await client.query<User>(
      `
    select User {
      balance
    }
    filter User.id = <uuid>$user
    limit 1
  `,
      {
        user: ctx.session?.user?.id,
      },
    );

    if (balance < data.price) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Insufficient funds",
      });
    }

    //   console.log(balance, data);

    const [bin] = (await client.query(
      `
    select BinAuction {
        price,
        createdAt,
        card: {
            userId
        }
    }
    filter .card.id = <uuid>$cardId
    limit 1
  `,
      {
        cardId: data.cardId,
      },
    )) as BinAuction[];

    if (bin.price !== data.price) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Card already on sale",
      });
    }

    console.log({
      user: ctx.session?.user?.id,
      bal: balance - data.price,
    });

    const r = await client.query(
      `
    update User
    filter .id = <uuid>$user
    set {
        balance := <int64>$bal
    }
  `,
      {
        user: ctx.session?.user?.id,
        bal: balance - data.price,
      },
    );

    await client.query(
      `
    delete BinAuction
    filter .card.id = <uuid>$cardId
  `,
      {
        cardId: data.cardId,
      },
    );

    await client.query(
      `
    update Card
    filter .id = <uuid>$cardId
    set {
        user := (
            select User
            filter .id = <uuid>$user
            limit 1
        )
    }
  `,
      {
        user: ctx.session?.user?.id,
        cardId: data.cardId,
      },
    );

    console.log({
      user: bin.card.userId,
      price: data.price,
    });

    await client.query(
      `
    update User
    filter .id = <uuid>$user
    set {
        balance := .balance + <int64>$price
    }
    `,
      {
        user: bin.card.userId,
        price: data.price,
      },
    );

    await client.query(
      `
    insert AuctionEntry {
        card := (
            select Card
            filter .id = <uuid>$cardId
            limit 1
        ),
        seller := (
            select User
            filter .id = <uuid>$seller
            limit 1
        ),
        buyer := (
            select User
            filter .id = <uuid>$buyer
            limit 1
        ),
        soldAt := <datetime>$soldAt,
        createdAt := <datetime>$createdAt,
        price := <int64>$price
    }
  `,
      {
        cardId: data.cardId,
        seller: bin.card.userId,
        buyer: ctx.session?.user?.id,
        soldAt: new Date(),
        createdAt: bin.createdAt,
        price: data.price,
      },
    );

    return {};
  });
