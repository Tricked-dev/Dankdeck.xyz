import { createTRPCClient, httpBatchLink } from "@trpc/client";

import type { AppRouter } from "../server";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      get url() {
        // console.log("Get!");
        if (typeof window !== "undefined") {
          return `${window.location.origin}/trpc`;
        } else {
          if (import.meta.env.DEV) {
            return "http://localhost:4321/trpc";
          } else {
            return "https://dankdeck.xyz/trpc";
          }
        }
      },
    }),
  ],
});
