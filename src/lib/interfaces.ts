import { z, type infer as inf } from "zod";

export const createAuction = z.object({
  cardId: z.string().uuid("Invalid UUID"),
  price: z
    .number({ coerce: true })
    .max(9999999, "Price too high")
    .min(1, "Price too low"),
});
// infer import doesnt work lol
export type CreateAuction = inf<typeof createAuction>;

export const buyAuction = z.object({
  cardId: z.string().uuid("Invalid UUID"),
  price: z
    .number({ coerce: true })
    .max(9999999, "Price too high")
    .min(1, "Price too low"),
});
// infer import doesnt work lol
export type BuyAuction = inf<typeof buyAuction>;
