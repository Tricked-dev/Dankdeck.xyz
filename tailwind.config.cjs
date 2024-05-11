/** @type {import('tailwindcss').Config} */
// console.log(require("daisyui/src/theming/themes"))

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [require("daisyui")],
	daisyui: {
		logs: false
	}
}
