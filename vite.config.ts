import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url).toString()) // ts likes to cry without .toString() for some reason
		}
	}
});
