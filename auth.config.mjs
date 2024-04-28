import { EdgeDBAdapter } from "@auth/edgedb-adapter"
import GitHub from "@auth/core/providers/github";
import { createClient } from "edgedb"
import { defineConfig } from "auth-astro";

const client = createClient()



export default defineConfig({
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  adapter: EdgeDBAdapter(client),
});
