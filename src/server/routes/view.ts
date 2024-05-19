import { client } from "client";
import { publicProcedure } from "../trpc";
import { z } from "zod";

export const view = publicProcedure
  .input(z.object({ cardId: z.string().uuid() }))
  .mutation(async ({ input: data }) => {
    await client.query(
      `
    update Card
    filter .id = <uuid>$id
    set {
        views := .views + 1
    }
    `,
      {
        id: data.cardId,
      },
    );
    return {};
  });
