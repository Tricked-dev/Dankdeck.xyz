import { client } from "client";
import { publicProcedure } from "../trpc";
import { z } from "zod";

export const view = publicProcedure
  .input(z.object({ id: z.string().uuid() }))
  .mutation(async () => {
    await client.query(`
    update Card
    filter .id = <uuid>$id
    set {
        views := .views + 1
    }
    `);
    return {};
  });
