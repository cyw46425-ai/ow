import assert from "node:assert/strict";
import { onRequestPost } from "../functions/api/chat.js";

const body = {
  query: "团灭后为什么要等队友？",
  context: [{ source_id: "S1", document_id: "regroup", title: "团灭后先集合", category: "basics", content: "人数不足时停止深入，等待队友复活。", as_of: "2026-09-20", version: "evergreen", source_type: "curated" }]
};

const missingKey = await onRequestPost({ request: new Request("https://example.test/api/chat", { method: "POST", body: JSON.stringify(body) }), env: {} });
assert.equal(missingKey.status, 503);

const originalFetch = globalThis.fetch;
globalThis.fetch = async () => new Response(JSON.stringify({
  model: "deepseek-chat",
  choices: [{ message: { content: JSON.stringify({ conclusion: "主人，先等队友集合。", cited_knowledge: ["当前人数不足。", "撤回安全位置。"], related_questions: ["什么时候可以不等队友直接续点？", "如何判断队友是否已经复活？"], caveat: "加时需结合目标进度判断。", used_sources: ["S1", "S999"] }) } }],
  usage: { total_tokens: 42 }
}), { status: 200, headers: { "Content-Type": "application/json" } });

try {
  const response = await onRequestPost({ request: new Request("https://example.test/api/chat", { method: "POST", body: JSON.stringify(body) }), env: { DEEPSEEK_API_KEY: "test-only" } });
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.deepEqual(payload.answer.used_sources, ["S1"]);
  assert.equal(payload.answer.conclusion, "主人，先等队友集合。");
  assert.deepEqual(payload.answer.cited_knowledge, ["当前人数不足。", "撤回安全位置。"]);
  assert.equal(payload.answer.related_questions.length, 2);
} finally {
  globalThis.fetch = originalFetch;
}

console.log("API gateway tests passed.");
