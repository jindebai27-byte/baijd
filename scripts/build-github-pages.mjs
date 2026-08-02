import { copyFile, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pagesDir = new URL("../dist/pages/", import.meta.url);
const repositoryBase = "/baijd";

const unusedAssets = [
  "hero-cinematic-glass.mp4",
  "hero-liquid-metal.mp4",
  "hero-black-liquid-source.mp4",
  "hero-tech-tunnel.mp4",
  "hero-glass-flow.mp4",
  "hero-cinematic-glass-web.mp4",
  "hero-tech-tunnel-poster.jpg",
  "hero-glass-tunnel-poster.jpg",
  "hero-glass-flow-poster.jpg",
  "hero-liquid-metal-poster.jpg",
  "hero-cinematic-glass-poster.jpg",
  "smart-handheld-hero.png",
  "case-studies/competitor-aosu.png",
  "case-studies/competitor-eufy.png",
  "case-studies/other/qihang/beijing-detail.png",
  "case-studies/other/qihang/math-detail.png",
  "case-studies/other/qihang/school-poster.png",
  "case-studies/other/qihang/summer-poster.png",
  "case-studies/other/qihang/trial-popup.png",
  "case-studies/other/qihang/summer-popup.png",
  "case-studies/other/qihang/school-popup.png",
  "case-studies/other/spring-privileges.png",
];

for (const asset of unusedAssets) {
  await rm(new URL(asset, pagesDir), { force: true });
}

async function collectTextFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectTextFiles(path));
    else if ([".html", ".js", ".css"].includes(extname(entry.name))) files.push(path);
  }
  return files;
}

const publicRoots = [
  "case-studies/",
  "hero-black-cubes-poster.jpg",
  "hero-black-cubes.mp4",
  "bai-jinde-portrait.jpg",
  "smart-phone-duo-plinth-hero.png",
  "favicon.svg",
];

for (const file of await collectTextFiles(fileURLToPath(pagesDir))) {
  let source = await readFile(file, "utf8");
  for (const root of publicRoots) {
    const escapedRoot = root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    source = source.replace(new RegExp(`(?<!${repositoryBase})/${escapedRoot}`, "g"), `${repositoryBase}/${root}`);
  }
  source = source.replace(new RegExp(`(?<!${repositoryBase})/project/`, "g"), `${repositoryBase}/project/`);
  source = source.replace(new RegExp(`(?<!${repositoryBase})/#catalog`, "g"), `${repositoryBase}/#catalog`);
  source = source.replace(/href:`\/`/g, `href:\`${repositoryBase}/\``);
  source = source.replace(/href:"\/"/g, `href:"${repositoryBase}/"`);
  await writeFile(file, source);
}

await copyFile(new URL("index.html", pagesDir), new URL("404.html", pagesDir));
