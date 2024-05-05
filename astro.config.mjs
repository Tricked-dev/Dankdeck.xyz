import auth from "auth-astro";
import { defineConfig } from 'astro/config';
import { fileURLToPath } from "bun";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
    output: "server",
    adapter: vercel({}),
    integrations: [svelte(), tailwind(), auth()],
    vite: {
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url).toString()), // ts likes to cry without .toString() for some reason

            }
        }
    }
});