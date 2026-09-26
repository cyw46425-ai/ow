(function (global) {
  "use strict";

  const VERSION = "2.0.0";
  const DEFAULT_AS_OF = "2026-09-26";
  const CATEGORY_HINTS = {
    basics: ["新手", "入门", "第一次", "没玩过", "从哪里开始", "规则", "模式", "设置", "准星", "灵敏度", "怎么玩", "团灭", "集火", "掉点", "突然死", "追着人杀", "等队友", "黑话", "外号", "玩家梗", "空耳", "c9", "白给", "炸鱼", "坐牢"],
    heroes: ["英雄", "技能", "胜率", "选取率", "数据", "职责", "重装", "输出", "辅助", "坦克", "t位", "c位", "奶位"],
    strategy: ["克制", "反制", "怎么打", "阵容", "站位", "地图", "高台", "开盾", "能量", "换谁", "选什么", "技能联动", "大招组合", "净化", "禁疗", "打断", "互动"],
    lore: ["背景", "故事", "剧情", "关系", "组织", "世界观"],
    news: ["活动", "联动", "新闻", "返场", "线下", "奖励"],
    patch: ["版本", "补丁", "改动", "增强", "削弱", "更新", "热修", "热修改", "天赋", "子职责", "英雄禁用"],
    esports: ["比赛", "赛事", "赛程", "冠军", "战队", "直播", "owcs", "世界杯", "职业选手", "guxue", "leave", "shy", "farway", "sunzo", "mmonk", "proper", "lip"]
  };

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFKC")
      .replace(/[，。！？、,.!?;；:：()（）\[\]【】"'“”‘’]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function hashToken(token) {
    let hash = 2166136261;
    for (let i = 0; i < token.length; i += 1) {
      hash ^= token.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function tokenize(value) {
    const text = normalize(value);
    const latin = text.match(/[a-z0-9][a-z0-9._+-]*/g) || [];
    const chineseRuns = text.match(/[\u3400-\u9fff]+/g) || [];
    const tokens = [...latin];
    chineseRuns.forEach((run) => {
      const chars = [...run];
      tokens.push(...chars);
      for (let i = 0; i < chars.length - 1; i += 1) tokens.push(chars[i] + chars[i + 1]);
      for (let i = 0; i < chars.length - 2; i += 1) tokens.push(chars[i] + chars[i + 1] + chars[i + 2]);
    });
    return tokens.filter(Boolean);
  }

  function flattenAnswer(answer) {
    if (!answer) return "";
    return [
      answer.conclusion,
      answer.why,
      ...(answer.steps || []),
      answer.pitfall
    ].filter(Boolean).join(" ");
  }

  function inferMetadata(item) {
    const links = (item.answer?.links || []).map((link) => ({ label: link.label, url: link.url }));
    const evidenceText = [item.title, item.summary, item.answer?.conclusion, item.answer?.pitfall].filter(Boolean).join(" ");
    const historical = /历史|往期|已结束|当年|归档/.test(evidenceText) || /archive|2023|2024|2025/.test(item.id);
    return {
      category: item.cat,
      dynamic: Boolean(item.dynamic),
      asOf: item.asOf || DEFAULT_AS_OF,
      version: item.version || (historical ? "historical" : item.dynamic ? "current-snapshot" : "evergreen"),
      sourceType: links.some((link) => /blizzard|overwatch\.com|ow\.blizzard\.cn|esports\.overwatch/.test(link.url)) ? "official" : links.length ? "mixed" : "curated",
      links
    };
  }

  function buildDocuments(kb) {
    return (kb || []).filter((item) => item && item.id && item.cat !== "fallback").map((item) => {
      const metadata = inferMetadata(item);
      const content = [item.title, item.summary, ...(item.keywords || []), flattenAnswer(item.answer)].filter(Boolean).join("\n");
      return { id: item.id, title: item.title, summary: item.summary, content, keywords: item.keywords || [], item, metadata };
    });
  }

  class HybridRetriever {
    constructor(documents) {
      this.documents = documents;
      this.docTokens = documents.map((doc) => tokenize(doc.content));
      this.avgLength = this.docTokens.reduce((sum, tokens) => sum + tokens.length, 0) / Math.max(1, documents.length);
      this.df = new Map();
      this.docTokens.forEach((tokens) => new Set(tokens).forEach((token) => this.df.set(token, (this.df.get(token) || 0) + 1)));
      this.vectors = this.docTokens.map((tokens) => this.vectorize(tokens));
    }

    idf(token) {
      const n = this.documents.length;
      const df = this.df.get(token) || 0;
      return Math.log(1 + (n - df + 0.5) / (df + 0.5));
    }

    vectorize(tokens) {
      const dims = 256;
      const vector = new Float32Array(dims);
      const counts = new Map();
      tokens.forEach((token) => counts.set(token, (counts.get(token) || 0) + 1));
      counts.forEach((count, token) => {
        const index = hashToken(token) % dims;
        const sign = hashToken(token + "#") % 2 ? 1 : -1;
        vector[index] += sign * (1 + Math.log(count)) * this.idf(token);
      });
      let norm = 0;
      vector.forEach((value) => { norm += value * value; });
      norm = Math.sqrt(norm) || 1;
      for (let i = 0; i < vector.length; i += 1) vector[i] /= norm;
      return vector;
    }

    bm25(queryTokens, docIndex) {
      const tokens = this.docTokens[docIndex];
      const counts = new Map();
      tokens.forEach((token) => counts.set(token, (counts.get(token) || 0) + 1));
      const k1 = 1.35;
      const b = 0.72;
      return [...new Set(queryTokens)].reduce((score, token) => {
        const tf = counts.get(token) || 0;
        if (!tf) return score;
        const denominator = tf + k1 * (1 - b + b * tokens.length / Math.max(1, this.avgLength));
        return score + this.idf(token) * (tf * (k1 + 1)) / denominator;
      }, 0);
    }

    cosine(queryVector, docIndex) {
      const docVector = this.vectors[docIndex];
      let score = 0;
      for (let i = 0; i < queryVector.length; i += 1) score += queryVector[i] * docVector[i];
      return Math.max(0, score);
    }

    search(query, options = {}) {
      const queryTokens = tokenize(query);
      const queryVector = this.vectorize(queryTokens);
      const requestedCategory = options.category && options.category !== "fallback" ? options.category : null;
      const currentOnly = Boolean(options.currentOnly);
      const scores = this.documents.map((doc, index) => {
        const bm25 = this.bm25(queryTokens, index);
        const vector = this.cosine(queryVector, index);
        const phrase = doc.keywords.reduce((sum, keyword) => normalize(query).includes(normalize(keyword)) ? sum + Math.min(5, normalize(keyword).length) : sum, 0);
        const categoryBoost = requestedCategory && doc.metadata.category === requestedCategory ? 2.4 : 0;
        const sourceBoost = doc.metadata.sourceType === "official" ? 0.25 : 0;
        const freshnessBoost = currentOnly
          ? (doc.metadata.version === "current-snapshot" ? 1.1 : doc.metadata.version === "historical" ? -0.65 : 0)
          : 0;
        const combined = bm25 * 0.62 + vector * 7.5 * 0.28 + phrase * 0.1 + categoryBoost + sourceBoost + freshnessBoost;
        return { doc, score: combined, bm25, vector, phrase, categoryBoost };
      }).filter(Boolean).sort((a, b) => b.score - a.score);
      const topK = Math.max(1, Math.min(8, options.topK || 5));
      return scores.slice(0, topK).map((result, rank) => ({
        ...result,
        rank: rank + 1,
        match: Math.min(99, Math.max(1, Math.round(42 + result.score * 5.5)))
      }));
    }
  }

  function classify(query, categories) {
    const text = normalize(query);
    if (/(胜率|选取率|登场率|样本|数据).*(克制|英雄)|克制.*(胜率|选取率|数据)/.test(text)) return { id: "heroes", score: 120 };
    if (/(t位|c位|奶位|重装|输出|辅助).*(分别|负责什么|区别)/.test(text)) return { id: "basics", score: 120 };
    if (/bo\d|ft\d|单败|双败|胜者组|败者组/.test(text)) return { id: "esports", score: 120 };
    if (/c9|玩家梗|什么梗|空耳|外号|黑话|掉点|白给|炸鱼|坐牢|毛妹大锤和尚|午时已到|天降正义/.test(text)) return { id: "basics", score: 120 };
    if (/吸勾锤|矩阵.*(光束|挡|吃)|源氏.*闪|查莉娅.*(泡|屏障)|卢西奥.*加速|生命之梭.*(拉|花瓣)|纳米激素.*(配|大招)|禁疗.*(联动|配合)|技能.*联动|大招.*(组合|配合)|铃.*(解|净化)/.test(text)) return { id: "strategy", score: 120 };
    const priorityRules = [
      ["esports", /owcs|世界杯|职业赛|职业比赛|赛事|赛程|战队|选手|冠军|大神直播|直播间|guxue|leave|shy|farway|kyo|sunzo|mmonk|lengsa|diya|jinmu|proper|lip/],
      ["patch", /版本|补丁|改动|增强|削弱|更新|热修|天赋|子职责|英雄禁用/],
      ["news", /活动|联动|新闻|返场|线下|奖励|皮肤/],
      ["lore", /背景|故事|剧情|关系|组织|世界观|黑爪|守望先锋为什么解散/],
      ["strategy", /克制|反制|怎么打|阵容|站位|地图|高台|开盾|能量|换谁|选什么|团战|技能联动|大招组合|净化|禁疗|打断|互动/],
      ["heroes", /英雄|技能|胜率|选取率|数据|重装|输出|辅助|坦克|t位|c位|奶位/],
      ["basics", /新手|入门|第一次|没玩过|从哪里开始|规则|模式|设置|准星|灵敏度|怎么玩|团灭|集火|掉点|突然死|追着人杀|等队友|黑话|外号|玩家梗|空耳|c9|白给|炸鱼|坐牢/]
    ];
    const ruled = priorityRules.find(([, pattern]) => pattern.test(text));
    if (ruled) return { id: ruled[0], score: 100 };
    let best = { id: "fallback", score: 0 };
    (categories || []).filter((category) => category.id !== "fallback").forEach((category) => {
      const hints = [...(category.keywords || []), ...(CATEGORY_HINTS[category.id] || [])];
      const score = hints.reduce((sum, hint) => text.includes(normalize(hint)) ? sum + Math.max(1, normalize(hint).length) : sum, 0);
      if (score > best.score) best = { id: category.id, score };
    });
    return best;
  }

  function toContext(results) {
    return results.map((result, index) => ({
      source_id: `S${index + 1}`,
      document_id: result.doc.id,
      title: result.doc.title,
      category: result.doc.metadata.category,
      content: result.doc.content.slice(0, 1800),
      as_of: result.doc.metadata.asOf,
      version: result.doc.metadata.version,
      source_type: result.doc.metadata.sourceType,
      links: result.doc.metadata.links
    }));
  }

  function relatedQuestions(category) {
    const suggestions = {
      basics: ["我应该先练哪两个英雄？", "怎样判断这一波该撤退还是续点？", "还有哪些常用玩家黑话？"],
      heroes: ["这个英雄最适合哪些地图和阵容？", "这个英雄能和谁形成技能联动？", "被针对时应该怎么调整或换人？"],
      strategy: ["这套打法在哪些地图更好用？", "对方有哪些技能可以反制这套联动？", "如果队友不配合，我能先做好哪一步？"],
      lore: ["这个角色和哪些英雄关系最密切？", "这段故事发生在什么时间线？", "还有哪些官方短片或漫画可以看？"],
      news: ["这个活动什么时候结束？", "奖励需要完成哪些条件？", "还有哪些历史联动可以查看？"],
      patch: ["这次改动会影响哪些英雄对位？", "旧攻略中哪些内容已经过期？", "哪里可以查看完整官方补丁？"],
      esports: ["这名选手擅长哪些英雄？", "下一场比赛在哪里看？", "新手观赛应该重点看什么？"]
    };
    return suggestions[category] || ["我需要补充哪些信息？", "知识库里还有哪些相关内容？"];
  }

  function localAnswer(result) {
    const answer = result?.doc?.item?.answer;
    if (!answer) return null;
    const base = answer.conclusion || result.doc.summary;
    // 保留安娜的人设，但不要让每一条回答都出现口癖。
    const cuteEnding = result.doc.id.length % 3 === 0 ? " 啾咪～" : "";
    return {
      conclusion: `主人，${base}${cuteEnding}`,
      cited_knowledge: [answer.why, ...(answer.steps || [])].filter(Boolean).slice(0, 4),
      related_questions: relatedQuestions(result.doc.metadata.category).slice(0, 3),
      caveat: answer.pitfall || "如果条件不同，请补充英雄、职责、地图和当前版本。",
      used_sources: ["S1"]
    };
  }

  const documents = buildDocuments(global.OW_KB || []);
  const retriever = new HybridRetriever(documents);

  async function ask(query, options = {}) {
    const category = options.category || classify(query, global.OW_CATEGORIES || []).id;
    const currentOnly = /最新|现在|当前|近期|今天|本周|本赛季/.test(query);
    const results = retriever.search(query, { category, currentOnly, topK: options.topK || 5 });
    const context = toContext(results);
    const diagnostics = {
      version: VERSION,
      category,
      currentOnly,
      topK: context.length,
      retrieval: results.map((result) => ({
        id: result.doc.id,
        title: result.doc.title,
        score: Number(result.score.toFixed(3)),
        bm25: Number(result.bm25.toFixed(3)),
        vector: Number(result.vector.toFixed(3)),
        match: result.match
      }))
    };
    if (!context.length) return { mode: "no_evidence", answer: null, context, diagnostics };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          category,
          context,
          history: (options.history || []).slice(-4),
          client: { rag_version: VERSION, as_of: DEFAULT_AS_OF }
        })
      });
      if (!response.ok) throw new Error(`api_${response.status}`);
      const payload = await response.json();
      if (!payload.answer?.conclusion) throw new Error("invalid_answer");
      return { mode: "deepseek_rag", answer: payload.answer, usage: payload.usage || null, model: payload.model || "deepseek", context, diagnostics };
    } catch (error) {
      return { mode: "local_retrieval", answer: localAnswer(results[0]), context, diagnostics, fallbackReason: String(error.message || error) };
    }
  }

  global.OW_RAG = { VERSION, documents, retriever, tokenize, classify, ask, buildDocuments };
})(window);
