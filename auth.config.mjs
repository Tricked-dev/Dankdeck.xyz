import Discord from "@auth/core/providers/discord";
import { EdgeDBAdapter } from "@auth/edgedb-adapter"
import GitHub from "@auth/core/providers/github";
import { client } from "./client"
import { defineConfig } from "auth-astro";

export default defineConfig({
  baseUrl: import.meta.env.AUTH_URL,
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
      redirectProxyUrl: import.meta.env.AUTH_URL ? `${import.meta.env.AUTH_URL}api/auth/callback/github` : undefined,
    }),
  ],
  adapter: EdgeDBAdapter(client),
  pages: {
    signIn: "/login",
    newUser: "/cards?onboard=1"
  },
  callbacks: {
    session: async ({ session, user }) => {
      session.user.id = user.id;
      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      if (url.includes("app.github.dev")) return url;
      return baseUrl
    },
  }
});
