import type { Card, User } from "@db/schema";
import { z, type infer as inf } from "zod";

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const claimDelay = 1000 * 60 * 15;
// export const claimDelay = 0;

export const dailyMoney = 100;

export const search = z.object({
  query: z.string().min(1).max(100).optional(),
  year: z.number().min(0).max(6000).optional(),
  nsfw: z.boolean().optional(),
  type: z.array(z.string()).optional(),
  origin: z.array(z.string()).optional(),
  partOf: z.array(z.string()).optional(),
  sort: z.enum(["price", "number", "date", "random", "name"]).optional(),
  order: z.enum(["asc", "desc"]).default("asc").optional(),
  sellingOnly: z.boolean().default(false),
  priceRange: z
    .object({
      min: z.number().min(0).max(1000000000),
      max: z.number().min(0).max(1000000000),
    })
    .optional(),
  userName: z.string().min(1).max(100).optional(),
  user: z.string().uuid().optional(),
  cards: z.boolean().default(false).optional(),
});

export type Search = z.infer<typeof search>;

export type ApiUser = User & {
  cardCount: number;
  cardsClaimedCount: number;
};

export type ApplicationCard = Card & {
  unbox?: boolean;
};
