import { defineConfig, passthroughImageService } from 'astro/config';

import auth from "auth-astro";
import { fileURLToPath } from "url";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
    output: "server",
    adapter: vercel({}),
    integrations: [svelte(), tailwind(), auth(), react()],
    site: "https://dankdeck.xyz",
    vite: {
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url).toString()) // ts likes to cry without .toString() for some reason
            }
        }
    },
    prefetch: {
        defaultStrategy: "hover",
        prefetchAll: false
    },
    image: {
        service: passthroughImageService()
    },
});