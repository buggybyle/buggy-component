// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static'; // note: while ollesvelke uses `@sveltejs/adapter-auto`, here in ollesvege the point of `npm run build` is to build the dist folder that will then be published as the npm package, facilitating the end goal of creating a reusable component importable via npm. for this dist folder to be generated, `@svelte-js/adapter-static` has to be used instead; reference - https://stackoverflow.com/a/76360609/8919391 
import preprocess from 'svelte-preprocess';
// import inject from '@rollup/plugin-inject';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	onwarn: (warning, handler) => {
		if ([
			`css-unused-selector`,
			`a11y-click-events-have-key-events`,
			`a11y-no-static-element-interactions`,
			`unused-export-let`
		].includes(warning.code)) return;
		handler(warning);
	},
	
	kit: {
		adapter: adapter({
			strict: false, // note: (console warning from sveltekit) all routes must be fully prerenderable, but found the following routes that are dynamic: - src\routes/. pass `strict: false` to `adapter-static` to ignore this error. Only do this if you are sure you don't need the routes in question in your final app, as they will be unavailable. See https://github.com/sveltejs/kit/tree/main/packages/adapter-static#strict for more info.
		})

		// hydrate the <div id="svelte"> element in src/app.html
		// target: '#svelte'
	},

	};

export default config;
