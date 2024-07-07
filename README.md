#### 🍱 ollesvege

- [sveltekit package](https://kit.svelte.dev/docs/packaging) boilerplate by lé. for building reusable `<Component />`s.
- powered by sveltekit 2, svelte 4, and vite.
- `npm i`, `npm run dev` to preview the component. default port is 3000.
- deploy component: tweak `package.json`, `npm run build`, `npm login`, `npm version patch` (if needed), `npm publish`.
- third-party usage in javascript: `import { Ollesvege, ... } from 'ollesvege'`, `<Ollesvege ... />`.
- ts & scss support, base assets & styles, and session storage.
- support for socket.io and/or rest api.
- this [article](https://dylandupasquier.medium.com/creating-an-npm-package-using-sveltekit-c08349b8d69b) and this [repo](https://github.com/Ddupasquier/mysvelte_ui) are helpful—though not complete—for reference.
- migrating to the latest version of `@sveltejs/package` requires `npx svelte-migrate package`. see [#8825](https://github.com/sveltejs/kit/discussions/8825) and [#8922](https://github.com/sveltejs/kit/pull/8922). may need to tweak `package.json` to serve `exports['.']:string` instead of `exports['.']:object{types, svelte}` before doing so.
- once migrated, may need to add `main: "./package/pkg/index.js"` to properly serve module (ie. index.js) to clients.