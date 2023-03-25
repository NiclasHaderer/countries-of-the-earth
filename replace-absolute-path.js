// @ts-check
const { readdir } = require("fs-extra");
const { resolve } = require("path");
const fs = require("fs-extra");

/**
 *
 * @param dir {string}
 * @param filter {(filename: string)=> boolean}
 * @returns {string[]}
 */
async function* getFiles(dir, filter) {
  const dirOrFileList = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirOrFileList) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res, filter);
    } else if (filter(dirent.name)) {
      yield res;
    }
  }
}

(async () => {
  fs.existsSync("dist") && fs.removeSync("dist", { recursive: true });
  fs.copySync("out", "dist");
  for await (const file of getFiles("dist", filname => /\.(js|css|html|json)$/.test(filname))) {
    let content = await fs.promises.readFile(file, "utf-8");
    content = content.replaceAll("/_next/", "_next/");
    await fs.promises.writeFile(file, content);
  }
  await fs.promises.rm("out", { recursive: true });
  console.log("Removed absolute paths successfully. You can now deploy the dist folder.");
})();
