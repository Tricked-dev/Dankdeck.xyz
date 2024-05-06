import type { BinAuction } from "@db/schema";
import { TRPCError } from "@trpc/server";
import { client } from "client";
import { protectedProcedure } from "../trpc";
import { z } from "zod";

export const sell = protectedProcedure
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
    const tax = Math.ceil(data.price * 0.05);

    const [{ balance }] = await client.query(
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

    if (tax > balance) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Insufficient funds",
      });
    }

    const binExist = await client.query(
      `
    select BinAuction
    filter .card.id = <uuid>$cardId
    limit 1
  `,
      {
        cardId: data.cardId,
      },
    );

    if (binExist.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Card already on sale",
      });
    }
    await client.query(
      `
  update User
  filter .id = <uuid>$user
  set {
      balance := .balance - <int64>$tax
  }
  `,
      {
        user: ctx.session?.user?.id,
        tax,
      },
    );
    const [bin] = (await client.query(
      `
select(insert BinAuction {
    card := (
        select Card
        filter .id = <uuid>$cardId
        limit 1
    ),
    price := <int64>$price
}) {
    price,
    id
}
`,
      {
        cardId: data.cardId,
        price: data.price,
      },
    )) as BinAuction[];
    return bin;
  });
