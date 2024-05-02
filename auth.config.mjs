import { EdgeDBAdapter } from "@auth/edgedb-adapter"
import GitHub from "@auth/core/providers/github";
import { client } from "./client"
import { defineConfig } from "auth-astro";

export default defineConfig({
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  adapter: EdgeDBAdapter(client),
  callbacks: {
    session: async ({ session, user }) => {
      session.user.id = user.id;
      return session;
    }
  }
});
