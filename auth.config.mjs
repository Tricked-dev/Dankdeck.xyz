import Discord from "@auth/core/providers/discord";
import { EdgeDBAdapter } from "@auth/edgedb-adapter"
import GitHub from "@auth/core/providers/github";
import Resend from "@auth/core/providers/resend";
import { client } from "./client"
import { defineConfig } from "auth-astro";
import { sendVerificationRequest } from "./src/lib/emailLogin"

let extraProviders = []

if (import.meta.env.AUTH_DISCORD_ID) {
  extraProviders.push(Discord({
    clientId: import.meta.env.AUTH_DISCORD_ID,
    clientSecret: import.meta.env.AUTH_DISCORD_SECRET,

  }))
}
if (import.meta.env.AUTH_RESEND_KEY) {
  extraProviders.push(Resend({
    apiKey: import.meta.env.AUTH_RESEND_KEY,
    from: "hello@l.dankdeck.xyz",
    sendVerificationRequest: sendVerificationRequest
  }))
}

const userProps = `
          id,
          email,
          emailVerified,
          name,
          picture,
          theme,
          nsfw,
          bio,
          githubName,
          discordName,
          image
`

export default defineConfig({
  baseUrl: import.meta.env.AUTH_URL,
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
      redirectProxyUrl: import.meta.env.AUTH_URL ? `${import.meta.env.AUTH_URL}api/auth/callback/github` : undefined,
    }),
    ...extraProviders
  ],
  adapter: {
    ...EdgeDBAdapter(client),
    async createUser({ email, emailVerified, name, image, ...rest }) {
      return await client.queryRequiredSingle(
        `
        with
          image := <optional str>$image,
          name := <optional str>$name,
          emailVerified := <optional str>$emailVerified

        select (
          insert User {
            email:= <str>$email,
            emailVerified:= <datetime>emailVerified,
            name:= name,
            image:= image,
          }
        ) {
            ${userProps}
          }
        `,
        {
          email,
          emailVerified: emailVerified && new Date(emailVerified).toISOString(),
          name,
          image,
        }
      )
    },
    async createUser({ email, emailVerified, name, image, ...props }) {
      return await client.queryRequiredSingle(
        `
        with
          image := <optional str>$image,
          name := <optional str>$name,
          emailVerified := <optional str>$emailVerified

        select (
          insert User {
            email:= <str>$email,
            emailVerified:= <datetime>emailVerified,
            name:= name,
            image:= image,
          }
        ) {
            ${userProps}
          }
        `,
        {
          email,
          emailVerified: emailVerified && new Date(emailVerified).toISOString(),
          name,
          image,
        }
      )
    },
    async getUser(id) {
      return await client.querySingle(
        `
        select User {
            ${userProps}
        } filter .id = <uuid>$id;
        `,
        { id }
      )
    },
    async getUserByEmail(email) {
      return await client.querySingle(
        `
        select User {
            ${userProps}
        } filter .email = <str>$email;
        `,
        { email }
      )
    },
    async getUserByAccount({ providerAccountId, provider, ...props }) {
      return await client.querySingle(
        `
        with account := (
          select Account
          filter .providerAccountId = <str>$providerAccountId
             and .provider = <str>$provider
        )
        select account.user {
            ${userProps}
        }
        `,
        { providerAccountId, provider }
      )
    },
    async updateUser({ email, emailVerified, id, image, name, ...props }) {
      return await client.queryRequiredSingle(
        `
        with
          email := <optional str>$email,
          emailVerified := <optional str>$emailVerified, 
          image := <optional str>$image,
          name := <optional str>$name
        
        select (
          update User
          filter .id = <uuid>$id
          set {
            email := email ?? .email,
            emailVerified := <datetime>emailVerified ?? .emailVerified,
            image := image ?? .image,
            name := name ?? .name,
          }
        ) {
            ${userProps}
        }
        `,
        {
          email,
          emailVerified: emailVerified && new Date(emailVerified).toISOString(),
          id,
          image,
          name,
        }
      )
    },
    async getSessionAndUser(sessionToken) {
      const sessionAndUser = await client.querySingle(
        `
        select Session {
          userId,
          id,
          expires,
          sessionToken,
          user: {
            ${userProps}
          }
        } filter .sessionToken = <str>$sessionToken;
      `,
        { sessionToken }
      )

      if (!sessionAndUser) {
        return null
      }

      const { user, ...session } = sessionAndUser

      if (!user || !session) {
        return null
      }

      return {
        user,
        session,
      }
    },
  },

  pages: {
    signIn: "/login",
    newUser: "/cards?onboard=1"
  },
  callbacks: {
    session: async ({ session, user, ...props }) => {
      session.user.id = user.id;
      session.user.picture = user.picture
      return session;
    },
    signIn: async ({ user, account, profile, ...props }) => {
      // little trick :)
      setTimeout(async () => {
        try {
          if (account.provider == "github" && user.githubName != profile.login) {
            await client.querySingle(`
          update User
          filter
            .id = <uuid>$userId
          set {
            githubName := <str>$login
          }
          `, {
              userId: user.id,
              login: profile.login
            })
          }
          else if (account.provider == "discord" && user.discordName != profile.username) {
            await client.querySingle(`
          update User
          filter
            .id = <uuid>$userId
          set {
            discordName := <str>$login
          }
          `, {
              userId: user.id,
              login: profile.username
            })
          }
        } catch (e) {
          // non essential no need to handle errors lol
          console.log(e)
        }
      }, 0)

      return true
    },
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      if (url.includes("app.github.dev")) return url;
      return baseUrl
    },
  }
});
