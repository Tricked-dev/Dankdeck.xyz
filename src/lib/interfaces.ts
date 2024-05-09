import type { User } from "@db/schema";
import { z, type infer as inf } from "zod";

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const claimDelay = 1000 * 60 * 15;
// export const claimDelay = 0;

export const dailyMoney = 100;

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

export const cancelAuction = z.object({
  cardId: z.string().uuid("Invalid UUID"),
});
// infer import doesnt work lol
export type CancelAuction = inf<typeof cancelAuction>;

export type ApiUser = User & {
  cardCount: number;
  cardsClaimedCount: number;
};
