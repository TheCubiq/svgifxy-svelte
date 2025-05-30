import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import lucidePreprocess from "vite-plugin-lucide-preprocess";


export default defineConfig({
	plugins: [
		lucidePreprocess(), 
		sveltekit(),
	],
	server: {
		host: true,
		port: 6969
	},
});
