# V2 Features: Word of the Day & Most Searched Leaderboard

下个版本计划实现的两个功能模块说明。

---

## 1. Word of the Day（每日一词）

### 功能描述

每天向用户展示一个精选的 7 字母单词，附带词义和词性说明，增加工具的内容属性和用户回访动力。

### 设计要求

**展示内容：**
- 单词本身（7 个字母逐格呈现，视觉上与输入框呼应）
- 词性（noun / verb / adjective 等）
- 简短定义（1-2 句，英文）
- Scrabble 得分徽章（根据字母分值计算）
- 日期显示（如：Monday, August 4）

**交互：**
- 「Try these letters」按钮：点击后自动填充字母到输入框并执行搜索
- 「Copy word」按钮：复制单词到剪贴板

**轮换规则：**
- 按天数取模，保证同一天所有用户看到同一个词
- 凌晨 0 点自动切换（基于用户本地时间）

### 实现方案

**方案 A（纯前端，当前推荐）：**

在 JS 中维护一个精选词库数组，每条记录包含：

```js
{ word: 'CLARION', pos: 'noun', def: 'A shrill, narrow-tubed war trumpet.' }
```

用日期戳取模选词，无需后端：

```js
const dayIndex = Math.floor(Date.now() / 86400000) % words.length;
```

**方案 B（后端，未来扩展）：**
- 管理后台维护词库
- API 返回当天的词
- 可支持编辑推荐、节日特供词等

### 词库建议

- 优先选择有趣、生僻但可验证的词（避免过于常见）
- 覆盖不同词性，避免连续多天都是名词
- 建议词库规模：100–200 条，足够覆盖半年不重复
- 高分值字母（J/Q/X/Z）单词可高亮展示，吸引 Scrabble 玩家

### UI 参考

```
┌──────────────────────────────────────────────┐
│  ● WORD OF THE DAY          Monday, Aug 4    │
│                                              │
│  [C][L][A][R][I][O][N]    ★ 9 pts            │
│                                              │
│  CLARION  noun                               │
│  A shrill, narrow-tubed war trumpet;         │
│  also used to describe a clear ringing sound │
│                                              │
│  [↗ Try these letters]  [⧉ Copy word]        │
└──────────────────────────────────────────────┘
```

- 深色背景（indigo 渐变），与页面主体白色区域形成对比
- 字母格与主工具输入格视觉风格一致
- 高分字母（J/Q/X/Z）用高亮色标记

---

## 2. Most Searched This Week（本周热门搜索）

### 功能描述

展示本周被搜索最多的 7 字母字母组合排行榜，引导用户探索高频组合，同时体现工具的活跃度。

### 设计要求

**展示内容（每条）：**
- 排名序号（前三名用金银铜图标）
- 字母组合（等宽字体，大写）
- 本周搜索次数
- 该组合能找到的单词数量（实时从词库计算）
- 「↑ HOT」标签（本周搜索量高于历史均值时显示）

**交互：**
- 点击任意一行，自动填充字母到输入框并搜索

**刷新频率：**
- 每周一更新（基于周数取模，保证同一周内数据稳定）

### 实现方案

**方案 A（静态数据池，当前推荐）：**

维护一个 30 条以上的数据池，每周从中抽取 8 条展示：

```js
const LB_POOL = [
  { letters: 'AEINRST', base: 1840 },
  { letters: 'AILERON', base: 1203 },
  // ...
];
```

- 用周数作为随机种子，保证每周组合不同
- 搜索量在基准值基础上做 ±25% 的周期性波动，避免数据看起来一成不变
- `letters` 必须是合法 7 字母组合，能找到至少 1 个有效单词
- `words` 字段不写死，运行时从词库实时计算（`matchWords(letters).length`）

**方案 B（真实统计，后端方案）：**

每次用户点击「Find Words」时上报字母组合：

```
POST /api/track
{ letters: 'AEINRST', timestamp: 1234567890 }
```

服务器按周聚合，返回真实 Top 8。推荐技术栈：
- Cloudflare Workers + KV（零成本，全球低延迟）
- 或 Supabase（有免费额度，带 dashboard）

方案 B 能反映真实用户行为，对 SEO 内容也更有价值，建议 V3 实现。

### 数据池维护建议

- 优先选择 Scrabble 高频 bingo 词根（SATINE、RETAINS、AEINRST 系列）
- 包含一些玩家熟悉的常见词（MONSTER、FRIENDS、PLANETS）以增加亲切感
- 数据池 ≥ 30 条，保证 4 周内不重复
- 每条 `base` 搜索量设置要有梯度，头部和尾部差距不超过 5 倍，排名变化才自然

### UI 参考

```
┌──────────────────────────────────────────────────┐
│  🔥 Most Searched This Week    Aug 4 – Aug 10    │
│  Top 7-letter combinations by players            │
│                                                  │
│  🥇 AEINRST  ████████████  1.8k searches  671词  │
│  🥈 AILERON  ████████      1.2k searches    1词  │
│  🥉 STRANGE  ██████  ↑HOT    856 searches    4词  │
│   4  PAINTER  █████          987 searches    7词  │
│   5  MONSTER  ████           823 searches    5词  │
│  ...                                             │
└──────────────────────────────────────────────────┘
```

- 每行有等比例的背景进度条，直观表达搜索量占比
- 点击整行触发搜索

---

## 优先级建议

| 功能 | 实现难度 | 用户价值 | 建议版本 |
|------|---------|---------|---------|
| Word of the Day（静态词库） | 低 | 高（增加回访） | V2 |
| Most Searched（静态数据池） | 低 | 中（氛围感） | V2 |
| Most Searched（真实统计后端） | 中 | 高（真实数据） | V3 |

两个功能均可纯前端实现，无需服务器，V2 可以一起上线。
