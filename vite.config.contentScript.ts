import { defineConfig } from "vite";
import { r } from "./scripts/utility";

export default defineConfig({
    build: {
        outDir: r("dist/js"),
        emptyOutDir: false,
        lib: {
            entry: r("src/contentScript.js"),
            name: "contentScript",
            fileName: () => "contentScript.js",
            formats: ["iife"],
        },
    },
});
