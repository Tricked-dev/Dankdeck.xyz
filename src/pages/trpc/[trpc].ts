import type { APIRoute } from "astro";
import { appRouter } from "@/server/router";
import { createContext } from "@/server/context";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export const ALL: APIRoute = (opts) => {
  return fetchRequestHandler({
    endpoint: "/trpc",
    req: opts.request,
    router: appRouter,
    createContext,
  });
};
