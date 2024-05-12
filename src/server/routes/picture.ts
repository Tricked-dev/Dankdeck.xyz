import { DAY, claimDelay, dailyMoney } from "@/lib/interfaces";

import { TRPCError } from "@trpc/server";
import type { User } from "@db/schema";
import { client } from "client";
import { protectedProcedure } from "../trpc";
import { z } from "zod";

export const picture = protectedProcedure
  .input(
    z.object({
      memeId: z.string().uuid("Invalid UUID"),
    }),
  )
  .mutation(async ({ ctx, input: data }) => {
    const id = ctx.session?.user?.id;
    const [user] = await client.query(
      `
    select(update User
    filter
        .id = <uuid>$id
    set {
        memePicture := (
            select Meme
            filter .id = <uuid>$memeId
            limit 1
        )
    }) {
        picture
    }
    `,
      {
        id,
        memeId: data.memeId,
      },
    );
    return user as User;
  });
