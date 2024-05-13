import { TRPCError } from "@trpc/server";
import type { User } from "@db/schema";
import { client } from "client";
import { getCardsView } from "@/lib/queries";
import { protectedProcedure } from "../trpc";

export const mycards = protectedProcedure.query(async ({ ctx }) => {
  const cards = await getCardsView(ctx.session.user!.id!);
  return cards;
});
