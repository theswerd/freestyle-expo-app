# Freestyle Expo Deploy Guide

This guide will walk you through the process of configuring and deploying an Expo app to Freestyle. This guide shows you how to deploy a Static Expo app. If you want to deploy a server-side rendered Expo app, the general same steps should apply, except for the server implementation.

## Creating the App

The first command will create a new Expo app in the current directory.

The second command goes into your app's directory (change `my-app` with the name of your app's directory).

The third command installs the required dependencies for web.

```bash
npx create-expo-app@latest
cd my-app
npx expo install react-dom react-native-web @expo/metro-runtime
```

## Preparing the App for Deployment

Let's export the app for web.

```bash
npx expo export --platform web
```

Now, we slightly modify the output so that it works with freestyle module resolution by changing the dists `node_modules` folder to `modules`. Freestyle doesn't support uploading `node_modules` as we have a special carveout for caching them, however expo build outputs a directory called `dist/assets/node_modules` which we can rename to `dist/assets/modules` so it will work.

This is an example way to do it

```bash
find dist -type f -name "*.js" -exec sed -i '' 's/node_modules/modules/g' {} +
mv dist/assets/node_modules dist/assets/modules
```

Finally, we host servers, so you need a simple server to serve the files. You can find our example in `main.ts` in this repo. It looks like:

First install hono

```bash
npm i hono
```

Then you can use the following code to serve the files.

```ts
import { Hono } from "hono";
import { serveStatic } from "hono/deno";

const app = new Hono();

app.use("*", serveStatic({ root: "./dist" }));

Deno.serve(app.fetch);
```

An easy way to do this whole process together is to use the `build.sh` script provided in the root of this repo.

```bash
sh build.sh
```

## Deploying the App

### CLI

Install the Freestyle CLI.

```bash
npm i freestyle-sh
```

Now deploy it

```bash
npx freestyle deploy --domain some.style.dev --web main.ts
```

### API

You can also deploy the app using the API.

Get your API key from the [Freestyle dashboard](https://admin.freestyle.sh), and create a .env file with the following content:

```env
FREESTYLE_API_KEY=your-api-key
```

Install the Freestyle Sandboxes Client

```bash
npm i freestyle-sandboxes
```

Now you need a script to deploy the app. This is an example script that deploys the app.

```ts
import { Freestyle } from "freestyle-sandboxes";

import { FreestyleSandboxes } from "freestyle-sandboxes";
import { prepareDirForDeploymentSync } from "freestyle-sandboxes/utils";

// Create a sandboxes client
const sandboxes = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
});

async function deploy() {
  await sandboxes.deployWeb(
    {
      kind: "files",
      files: prepareDirForDeploymentSync("."),
    },
    {
      entrypoint: "main.ts",
      // put whatever domains you want here
      domains: ["example.style.dev"],
    }
  );
}

deploy();
```

If you've cloned this repo, you can just run `deploy.ts` and it will work.

### Notes

As it turns out, the `freestyle-sandboxes` doesn't work with older versions of node module resolution, I changed the `tsconfig.json` a little bit, adding the following lines to `compilerOptions` to make it work in my IDE

```json
"moduleResolution": "nodenext",
"module": "NodeNext",
```
