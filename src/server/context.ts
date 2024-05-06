import { getSession } from "auth-astro/server";

export async function createContext({ req, ...rest }: { req: Request }) {
  const session = await getSession(req);

  return {
    session,
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
