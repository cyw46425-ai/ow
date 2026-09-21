import { cp, copyFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, "dist");
const files = ["index.html", "app.js", "styles.css", "heroes-data.js", "knowledge.js", "rag-engine.js"];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of files) await copyFile(path.join(root, file), path.join(output, file));
await cp(path.join(root, "assets"), path.join(output, "assets"), { recursive: true });
console.log("OW Assistant V2 prepared in dist/");
