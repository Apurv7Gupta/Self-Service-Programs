An Electron app that overrides the default OS splash screen after login and replaces it with a custom video.

How to rebuild:

From inside resources/app:

```bash
npm install
npm run build

```

(or whatever build script is in package.json)

If there’s no build script, you can run:

```bash
npx electron .

```

or

```bash
configure electron-builder.
```
