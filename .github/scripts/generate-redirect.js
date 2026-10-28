const { existsSync } = require("fs");
const { writeFile, mkdir } = require("fs/promises");
const { join } = require("path");
const {
  clean,
  EXCLUDED_PAGES,
  findAllPages,
  pathWithoutLocaleReducer
} = require("./find-all-pages");

// Next.js export directory
const OUTPUT_DIR = join(process.cwd(), "out");
const DEFAULT_LOCALE = "en";

(async function generateRedirects() {
  if (!existsSync(OUTPUT_DIR)) {
    console.error("❌ Output directory 'out' not found.");
    process.exitCode = 1;
    return;
  }

  const pages = findAllPages(OUTPUT_DIR)
    .filter((page) => !["", ...EXCLUDED_PAGES].includes(page))
    .reduce(pathWithoutLocaleReducer, []);

  const redirects = await Promise.all(
    pages.map(
      async (page) =>
        await createRedirectPage(page, `/${DEFAULT_LOCALE}${clean(page)}`)
    )
  );
  for (const { fromPath, toPath } of redirects.sort()) {
    console.info(`Generated redirect: /${fromPath} -> ${toPath}`);
  }
  console.info("✅ Redirects generated");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function createRedirectPage(fromPath, toPath) {
  const dir = join(OUTPUT_DIR, fromPath);

  await mkdir(dir, { recursive: true });

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url=${toPath}" />
    <script>window.location.replace("${toPath}")</script>
    <title>Redirecting...</title>
  </head>
  <body>Redirecting to <a href="${toPath}">${toPath}</a></body>
</html>
`;

  await writeFile(join(dir, "index.html"), html.trim(), "utf8");
  return { fromPath, toPath };
}
