# OW 助手 V2｜守望先锋新手决策助手

面向《守望先锋》新手的 AI 决策产品。它不是把用户问题直接丢给大模型，而是组合了确定性规则、本地混合检索、DeepSeek 受控生成、来源引用和离线评测。

助手角色名为 **安娜**：以可靠、轻快的女仆情报官语气回答，在不影响事实准确性的前提下偶尔使用“啾咪”或简短颜文字。所有问答统一采用“结论 → 引用的知识 → 联想出来的其他问题”结构，便于用户快速决策并继续追问。

## 产品能力

- 新手问答：规则、职责、英雄学习、对局策略、背景故事、活动、版本和赛事。
- 对局决策：英雄克制和地图推荐使用结构化规则，避免大模型凭空给出关键结论。
- RAG 问答：BM25 + 哈希 TF-IDF 余弦相似度 + 元数据加权，召回知识后再交给 DeepSeek 组织答案。
- 可解释性：展示识别类别、命中文档、检索分数、回答模式和引用来源。
- 可靠降级：DeepSeek 未配置、超时或失败时，自动返回本地知识库答案。
- 反馈闭环：用户可标记“有帮助/需改进”，反馈保存在浏览器本地，可用于扩充评测集。
- 内容中心：53 位英雄、完整技能档案、8 张地图，以及活动、版本、赛事和视频直播入口。
- 社区与电竞：玩家黑话/梗、技能联动、24 支代表战队、41 名知名选手档案，以及 2026 OWCS/世界杯体系。

## 系统流程

```text
用户问题
  ├─ 英雄克制 / 地图选人 ─→ 结构化决策规则 ─→ 可执行答案
  └─ 其他问题
       └─ 意图分类
            └─ 混合检索（BM25 + TF-IDF + 元数据）
                 └─ Top 5 证据
                      ├─ DeepSeek 可用 ─→ JSON 结构化回答 + 引用
                      └─ DeepSeek 不可用 ─→ 本地最佳证据答案
```

详细原理见 [RAG-DESIGN.md](docs/RAG-DESIGN.md)，产品复盘见 [AI-PRODUCT-CASE-STUDY.md](docs/AI-PRODUCT-CASE-STUDY.md)。

## 评测结果

黄金集包含 95 个问题，覆盖 7 类主意图、实体别名、时效查询、英雄技能、技能联动、社区语言、职业战队、选手、赛事和对抗性问题。

| 指标 | 当前结果 |
| --- | ---: |
| 分类准确率 | 100% |
| Recall@3 | 100% |
| Recall@5 | 100% |
| MRR@5 | 0.9346 |

该结果只代表仓库内黄金集，不等于真实用户流量表现。生产阶段应持续收集匿名失败问题并建立独立测试集，避免针对固定样本过拟合。

## 本地运行

```bash
npm run build
npm test
python -m http.server 8080 --directory dist
```

访问 `http://localhost:8080`。静态模式不需要 API Key，会自动使用本地检索答案。

## Cloudflare Pages + DeepSeek

构建设置：

- 构建命令：`npm run build`
- 输出目录：`dist`
- Functions 目录：仓库根目录的 `functions/`

在 Cloudflare Pages 项目的 **Settings → Variables and Secrets** 添加：

| 变量 | 必填 | 值 |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | 是 | DeepSeek API Key，必须设为 Secret |
| `DEEPSEEK_MODEL` | 否 | 默认 `deepseek-chat` |
| `DEEPSEEK_BASE_URL` | 否 | 默认 `https://api.deepseek.com` |

不要把 API Key 写入 `dist/app.js`、GitHub 仓库或任何以 `VITE_`、`NEXT_PUBLIC_` 开头的前端变量。浏览器只请求同源 `/api/chat`，Pages Function 才能读取密钥并调用模型。

## 项目结构

```text
dist/                  静态前端、基础知识库与扩展知识模块
functions/api/chat.js  Cloudflare Pages 服务端模型网关
data/                  来源注册表与更新策略
eval/                  黄金评测集和评测结果
scripts/               构建、评测与接口测试
docs/                  产品案例与 RAG 设计说明
```

## 知识库扩充与更新

- `dist/hero-skills.js`：53 名英雄的职责、生命构成和完整技能效果；每名英雄独立成片。
- `dist/knowledge-expanded.js`：社区术语/梗、技能联动、职业选手与赛事知识。
- `dist/esports-profiles.js`：分赛区职业战队、选手别名、招牌英雄、荣誉与阵容快照。
- `data/hero-skills.zh-tw.json`：来自暴雪繁体中文英雄页的结构化快照，已转换为简体中文展示。
- `scripts/sync-hero-skills.mjs`：从 OverFast API 同步暴雪英雄页结构化资料的维护脚本。

英雄技能机制核验于 2026-09-26；具体数值和模式差异仍以客户端及最新补丁为准。职业选手所属战队属于动态字段，回答时必须再次核验。

## 数据边界

- 胜率、选取率、活动、补丁与赛事属于动态数据，界面必须同时展示日期、口径和来源。
- 英雄克制不是“胜率榜”的同义词；答案同时考虑机制、地图、阵容与玩家熟练度。
- 历史活动和版本进入归档，不得冒充当前资讯。
- 项目为非官方玩家工具，与 Blizzard Entertainment 无隶属关系。
