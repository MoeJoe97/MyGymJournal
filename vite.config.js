import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  // Production build (GitHub Pages) keeps the repo sub-path.
  // Dev server (v0 preview) serves from root so it loads at the preview URL.
  base: command === "build" ? "/MyGymJournal/" : "/",
  build: { outDir: "dist", sourcemap: true }
}));
