import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const required = ["index.html", "app.js", "styles.css", "heroes-data.js", "knowledge.js", "hero-skills.js", "knowledge-expanded.js", "esports-profiles.js", "rag-engine.js"];
for (const file of required) {
  const target = path.join(root, "dist", file);
  if (!fs.existsSync(target) || fs.statSync(target).size === 0) throw new Error(`Missing static entry: dist/${file}`);
}
console.log(`Static build ready: ${required.length} entry files validated.`);
