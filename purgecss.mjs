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
