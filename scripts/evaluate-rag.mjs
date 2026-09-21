import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sandbox = { window: {}, console, fetch: async () => { throw new Error("offline_eval"); } };
vm.createContext(sandbox);
for (const file of ["dist/knowledge.js", "dist/rag-engine.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), sandbox, { filename: file });
}

const cases = JSON.parse(fs.readFileSync(path.join(root, "eval/golden-set.json"), "utf8"));
const rag = sandbox.window.OW_RAG;
let categoryHits = 0;
let recallAt3Hits = 0;
let recallAt5Hits = 0;
let reciprocalRank = 0;
const failures = [];

for (const item of cases) {
  const category = rag.classify(item.query, sandbox.window.OW_CATEGORIES).id;
  if (category === item.category) categoryHits += 1;
  const results = rag.retriever.search(item.query, { category, topK: 5 });
  const ids = results.map((result) => result.doc.id);
  const ranks = item.expected.map((expected) => ids.indexOf(expected)).filter((rank) => rank >= 0);
  const bestRank = ranks.length ? Math.min(...ranks) : -1;
  if (bestRank >= 0 && bestRank < 3) recallAt3Hits += 1;
  if (bestRank >= 0 && bestRank < 5) recallAt5Hits += 1;
  if (bestRank >= 0) reciprocalRank += 1 / (bestRank + 1);
  if (category !== item.category || bestRank < 0 || bestRank >= 3) failures.push({ id: item.id, query: item.query, expectedCategory: item.category, actualCategory: category, expected: item.expected, retrieved: ids });
}

const result = {
  evaluated_at: new Date().toISOString(),
  rag_version: rag.VERSION,
  cases: cases.length,
  metrics: {
    category_accuracy: Number((categoryHits / cases.length).toFixed(4)),
    recall_at_3: Number((recallAt3Hits / cases.length).toFixed(4)),
    recall_at_5: Number((recallAt5Hits / cases.length).toFixed(4)),
    mrr_at_5: Number((reciprocalRank / cases.length).toFixed(4))
  },
  failure_count: failures.length,
  failures
};

const outputDirectory = path.join(root, "eval/results");
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(path.join(outputDirectory, "latest.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));


