import { DAY, claimDelay, dailyMoney } from "@/lib/interfaces";

import { TRPCError } from "@trpc/server";
import type { User } from "@db/schema";
import { client } from "client";
import { protectedProcedure } from "../trpc";
import themes from "themes";
import { z } from "zod";

export const profileUpdate = protectedProcedure
  .input(
    z.object({
      name: z.string().min(3, "Name too short").max(50, "Name too long"),
      theme: z.enum(themes),
      nsfw: z.boolean(),
      showGithub: z.boolean(),
      showDiscord: z.boolean(),
    }),
  )
  .mutation(async ({ ctx, input: data }) => {
    const id = ctx.session?.user?.id;
    const user = await client.querySingle<User>(
      `
        select(
            update User
            filter
                .id = <uuid>$user
            set {
                name := <str>$name,
                theme := <str>$theme,
                nsfw := <bool>$nsfw,
                displayGithubName := <bool>$showGithub,
                displayDiscordName := <bool>$showDiscord
            }) {
            name,
            theme,
            nsfw,
            email,
            displayGithubName,
            displayDiscordName,
            id
        }`,
      {
        user: id,
        name: data.name,
        theme: data.theme,
        nsfw: data.nsfw,
        showGithub: data.showGithub,
        showDiscord: data.showDiscord,
      },
    );
    console.log(user);
    if (!user) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "User not found",
      });
    }
    return user;
  });
