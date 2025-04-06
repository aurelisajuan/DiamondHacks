import { defineConfig } from "vite";
import { r } from "./scripts/utility";

export default defineConfig({
    build: {
        outDir: r("dist/js"),
        emptyOutDir: false,
        lib: {
            entry: r("src/contentScript.js"),
            formats: ["iife"],
            name: "contentScript",
        },
        rollupOptions: {
            output: {
                entryFileNames: "contentScript.js",
            },
        },
    },
});
