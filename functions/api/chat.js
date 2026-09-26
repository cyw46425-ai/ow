const MAX_QUERY_LENGTH = 800;
const MAX_CONTEXT_ITEMS = 6;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

function cleanText(value, maxLength) {
  return String(value || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").slice(0, maxLength);
}

export async function onRequestPost({ request, env }) {
  if (!env.DEEPSEEK_API_KEY) {
    return json({ error: "model_not_configured", message: "DeepSeek 尚未配置，客户端将使用本地检索答案。" }, 503);
  }

  let input;
  try {
    input = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const query = cleanText(input.query, MAX_QUERY_LENGTH).trim();
  const context = Array.isArray(input.context) ? input.context.slice(0, MAX_CONTEXT_ITEMS).map((item, index) => ({
    source_id: cleanText(item.source_id || `S${index + 1}`, 12),
    document_id: cleanText(item.document_id, 80),
    title: cleanText(item.title, 160),
    category: cleanText(item.category, 40),
    content: cleanText(item.content, 2000),
    as_of: cleanText(item.as_of, 24),
    version: cleanText(item.version, 60),
    source_type: cleanText(item.source_type, 30)
  })) : [];

  if (!query) return json({ error: "empty_query" }, 400);
  if (!context.length) return json({ error: "no_evidence" }, 422);

  const history = Array.isArray(input.history) ? input.history.slice(-4).map((turn) => ({
    role: turn.role === "assistant" ? "assistant" : "user",
    content: cleanText(turn.content, 500)
  })) : [];

  const system = `你的名字是“安娜”，是《守望先锋》新手决策助手，也是一名可靠、可爱的女仆情报官。语气亲切轻快，可以偶尔称呼用户“主人”，并在整段回答里最多一次于句尾加入“啾咪～”或简短颜文字（例如“(｡•̀ᴗ-)✧”）；不要每句卖萌，不要让人设干扰事实、风险提示和专业判断。如果用户问你是谁，明确回答“我是安娜，守望先锋女仆情报官”。你必须只依据提供的检索资料回答，不得使用资料之外的具体数值、活动日期、赛果或版本改动。资料不足时明确说无法确认，并说明还需要什么信息。区分总体胜率、对位克制和玩家熟练度。动态信息必须提醒用户注意资料日期。回答结构必须依次为“结论、引用的知识、联想出来的其他问题”。输出合法 JSON，格式严格为：{"conclusion":"一句直接答案，保持可爱但专业","cited_knowledge":["1至4条真正支撑结论的知识与可执行建议"],"related_questions":["2至3个用户接下来可能想问的问题"],"caveat":"限制、不确定性或需要补充的条件","used_sources":["S1","S2"]}。related_questions 必须是问句；used_sources 只能填写真正支持答案的资料编号。`;
  const evidence = context.map((item) => `[${item.source_id}] ${item.title}\n类别：${item.category}；版本：${item.version}；截至：${item.as_of}；来源类型：${item.source_type}\n${item.content}`).join("\n\n");
  const user = `用户问题：${query}\n\n检索资料：\n${evidence}\n\n请根据资料输出 JSON。`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);
  try {
    const response = await fetch(`${env.DEEPSEEK_BASE_URL || "https://api.deepseek.com"}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: env.DEEPSEEK_MODEL || "deepseek-chat",
        messages: [{ role: "system", content: system }, ...history, { role: "user", content: user }],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 900,
        stream: false
      })
    });
    const payload = await response.json();
    if (!response.ok) return json({ error: "model_error", details: payload?.error?.message || "DeepSeek 请求失败" }, 502);
    const raw = payload?.choices?.[0]?.message?.content;
    if (!raw) return json({ error: "empty_model_output" }, 502);
    let answer;
    try {
      answer = JSON.parse(raw);
    } catch {
      return json({ error: "invalid_model_json" }, 502);
    }
    const allowedSources = new Set(context.map((item) => item.source_id));
    answer = {
      conclusion: cleanText(answer.conclusion, 600),
      cited_knowledge: Array.isArray(answer.cited_knowledge) ? answer.cited_knowledge.slice(0, 4).map((item) => cleanText(item, 420)) : [],
      related_questions: Array.isArray(answer.related_questions) ? answer.related_questions.slice(0, 3).map((item) => cleanText(item, 180)) : [],
      caveat: cleanText(answer.caveat, 600),
      used_sources: Array.isArray(answer.used_sources) ? answer.used_sources.filter((id) => allowedSources.has(id)).slice(0, 6) : []
    };
    return json({ answer, model: payload.model, usage: payload.usage || null });
  } catch (error) {
    return json({ error: error.name === "AbortError" ? "model_timeout" : "gateway_error" }, 504);
  } finally {
    clearTimeout(timeout);
  }
}

export function onRequest() {
  return json({ error: "method_not_allowed" }, 405);
}
