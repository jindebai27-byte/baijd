import { copyFile, mkdir, readdir, rm } from "node:fs/promises";

const distUrl = new URL("../dist/", import.meta.url);
const clientUrl = new URL("../dist/client/", import.meta.url);

// Vite copies everything in public/. Several superseded visual experiments are
// intentionally kept locally for iteration, but they are not referenced by the
// live portfolio and make production uploads unnecessarily large.
const unusedClientAssets = [
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
  "smart-phone-plinth-hero.png",
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

for (const entry of await readdir(distUrl, { withFileTypes: true })) {
  if (entry.name !== "client") {
    await rm(new URL(entry.name, distUrl), { recursive: true, force: true });
  }
}

for (const asset of unusedClientAssets) {
  await rm(new URL(asset, clientUrl), { force: true });
}

await mkdir(new URL("../dist/server/", import.meta.url), { recursive: true });
await copyFile(
  new URL("../worker/index.js", import.meta.url),
  new URL("../dist/server/index.js", import.meta.url),
);
