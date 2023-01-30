# Vite with Tailwind and Quasar

If using Tailwind with Quasar, I don't recommend adding Tailwind to a Quasar CLI setup. Instead, add Quasar and Tailwind to a Vite setup side-by-side. Prioritize using Tailwind CSS over Quasar and extend/override Quasar component CSS using `class` attribute customizations to meet your Tailwind needs.

## Requirements

- [Node.js](https://nodejs.org/en/): current LTS version (i.e., v18.13.0)
- [Git](https://git-scm.com/)

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Setup steps

### Prep

Create directory for the project.

```bash
mkdir -p my-project
cd my-project
```

Setup git (fix the remote url below).

```bash
git init
git branch -M main
```

### Install Vite

```bash
npm create vite@latest . -- --template vue-ts
npm install -D @types/node
```

### Install Tailwind css

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure the tailwind `tailwind.config.cjs` config file.

```bash
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add tailwind CSS directives to the beginning of your `src/style.css` file.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Add some tailwind classes to your `App.vue` file to test: `text-3xl font-bold underline`.

Build and run and validate that tailwind classes are recognized.

```bash
npm run dev
```

In our case above, the styles in Chrome dev tools would look like this:

```css
.underline {
    text-decoration-line: underline;
}
.font-bold {
    font-weight: 700;
}
.text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
}
```

To reduce the possibility of conflicts between Tailwind css and other frameworks, add a prefix to the
Tailwind classes in `tailwind.config.cjs`.

```js
module.exports = {
  prefix: 'my-',
  ...
}
```

You would then use classes like this intead matching your specified prefix: `my-text-3xl my-font-bold my-underline`.

### Install Quasar

Install the quasar packages.

```bash
npm install quasar @quasar/extras
npm install -D @quasar/vite-plugin sass@1.32.12
```

Modify the `vite.config.js` file to include `quasar`. We're leaving the Quasar sass variables out, to encourage using the Tailwind classes instead.

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: false,
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@/',
        replacement: `/src/`,
      },
    ],
  }
});
```

For convenience we added a path resolution alias, you'll need to add that to the `tsconfig.json` compiler options as well.

```json
{
  "compilerOptions": {
    ...
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  ...
}
```

Let's create a `tailwind.colors.json` file as a means to share colors between tailwind and quasar.

```json
{
    "colors": {      
      "primary": "#1976d2",
      "secondary": "#26a69a",
      "accent": "#9c27b0",
      "dark": "#1d1d1d",
      "dark-page": "#121212",
      "positive": "#21ba45",
      "negative": "#c10015",
      "info": "#31ccec",
      "warning": "#f2c037"
    }
}
```

Modify your `tailwind.config.cjs` file to customize your theme and include these colors.

```js
const colors = require('tailwindcss/colors')
const theme = require('./tailwind.theme.json')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      // quasar colors
      ...theme.colors
    },
    extend: {},
  },
  plugins: [],
}
```

Add quasar styles, icons, and plugins to the Vue app in `main.ts`.

```ts
import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'
import App from '@/App.vue'
import theme from '../tailwind.theme.json'

// see https://quasar.dev for further customization instructions
// NOTE: importing icons is optional, you could use individual fontawesome SVGs instead
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import './style.css'

const app = createApp(App)

app.use(Quasar, {
    plugins: [ Notify ],
    config: {
        brand: {
            // import brand colors added to tailwind config
            ...theme.colors
        }
    }
})

app.mount('#app')
```

Now try adding a quasar component or two to your application to validate component and icon availability, as well a usage of Quasar plugins.

```html
<script setup lang="ts">
import { ref } from 'vue'
import { Notify } from 'quasar'

const count = ref(0)

function notifyUser() {
  Notify.create({
    message: 'Danger, Will Robinson! Danger!'
  })
}
</script>

<template>
  <div>
    <q-btn color="secondary q-mr-sm" @click="count++" glossy text-color="white" push icon="verified_user">
      count is {{ count }}
    </q-btn>
    <q-btn @click="notifyUser" glossy text-color="primary" push icon="verified_user">
      Notify user
    </q-btn>
  </div>
</template>
```

Run the app.

```bash
npm run dev
```

You can now build the app as well.

```bash
npm run build
```

The entire quasar CSS file is added to the build though, you can reduce the size of your published CSS assets by using PurgeCSS and adapting the safelist to your needs.

### Install PurgeCSS

Install purge css to remove unused styles AFTER builds are complete for some ultimate flexibility.

```bash
npm i -D @fullhuman/postcss-purgecss purgecss
```

Create a `purgecss.mjs` file.

```js
import { writeFile, stat } from "fs/promises";
import { PurgeCSS } from "purgecss";

const purgeCSSResult = await new PurgeCSS().purge({
  content: ["./dist/index.html", "./dist/**/*.js", "./dist/**/*.html"],
  css: ["./dist/**/*.css"],
  safelist: {
    standard: [
      // include quasar bg/text color and utility classes
      /^bg-/,
      /^text-/,
      // include the Notify plugin classes
      /q-notif.*/],
  },
});

await Promise.all([
  ...purgeCSSResult.map(async ({ css, file }) => {
    const initialSize = (await stat(file)).size / 1024;

    await writeFile(file, css);

    const postSize = (await stat(file)).size / 1024;
    console.log(`${file}: ${initialSize} -> ${postSize} KB`);
  }),
]);

```

Modify the `build` script in the `package.json` file.

```json
  "scripts": {
    ...
    "build": "vue-tsc && vite build && node ./purgecss.mjs",
    ...
  },
```

### Save your changes

Push code to your remote repository

```bash
git add .
git commit -m "First checkin"
git remote add origin git@github.com:USER_OR_ORG/my-project.git push -u origin main
```
