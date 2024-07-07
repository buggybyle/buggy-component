import { sveltekit } from "@sveltejs/kit/vite";
import inject from '@rollup/plugin-inject';
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			sveltekit(),
		],

		server: {
			port: 3000,
			fs: {
				strict: false
			}
		},

		preview: {
			port: 3000
		},

		// define process.env here to fix dependencies not using import.meta.env instead of deprecated process.env --- based on this fix: https://github.com/vitejs/vite/issues/1973#issuecomment-787571499
		define: {
			'process.env': {},
		},

		build : {
			target: "es2022",
			rollupOptions: {
				plugins: [
					// Important for wallet adapter to work.
					inject({ Buffer: ['buffer', 'Buffer'] })
				]
			}
		},

		// esbuild: {
		// 	target: "es2022"
		// },
		
		// fix vite build error with esnext - https://github.com/remix-run/remix/issues/7969#issuecomment-1916042039
		optimizeDeps: {
			esbuildOptions: {
				target: "esnext",
			},
		},
		
		// Important for wallet adapter to work.
		// update: not required? solana wallet adapter still works when commented out. when activated and wallet adapter is used in code, it actually causes error 500.
		// resolve: {
		// 	alias: {
		// 		path: 'path-browserify',
		// 	},
		// },
	};
});