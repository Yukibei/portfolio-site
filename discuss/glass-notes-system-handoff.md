# 玻璃笔记系统 — 开发交接

> 状态：架构层已完成并通过 `tsc --noEmit`；功能页、内容、验证未开始。
> 完整计划见本文档末尾「剩余任务」，原始设计规格见 `web/public/glass/index.html`。

## 目标

把 `/notes` 从一屏 dashboard 扩成完整的玻璃博客系统：rail 与顶栏每个入口都在系统内部落地，不再跳回个人站其他页面；数据层支持教程专栏。

设计基准是 Figma 稿（steary.com 书籍流媒体 UI），单文件原型保留在 `web/public/glass/index.html`，**是规格来源，不要修改**。

## 关键结论（已核实，不要重复推翻）

1. **布局 CSS 与原版逐条一致，不要再调比例。** `--wincols: minmax(180px,23%) 1fr`、`side/main` 的 `1.15fr / 1fr`、卡片 4→5 列、`aspect-ratio: .821` 只在 ≤520px —— 这些当前实现和 `index.html` 完全相同，已逐条 diff 过。
2. **视觉不如原版的主因是内容密度。** 原版左栏 6 条 New Releases + 6 条 Continue Reading = 12 行塞满网格；当前只有 1 篇文章，同样骨架撑出两块空白。**补内容是修复视觉的主要手段**，不是改 CSS。
3. **已修复的真实规格偏差**：原版卡片图是独立 `.art` 层且 `opacity: .85`，旧实现把图直接铺成 `.card` 背景且不透明，导致整卡像一张贴图。现已拆成 `--card-gradient`（垫底）+ `--card-image`（.art 层，.85）。
4. **卡片语境图仍是已知遗留问题**：`public/glass/art/card-*.jpg` 是风景/静物策展图，与"读书"语境不搭。用户已同意本轮沿用，后期通过 `cover` 字段替换。项目卡现已改用项目自己的封面图。

## 已完成

### 1. 数据层 `web/content/notes/`

- `types.ts` — 新增 `RESERVED_NOTE_SLUGS`、`NoteSeriesRef`、`NoteFrontmatter.series?`、`SeriesDefinition`、`NoteSeries`
- `series.ts`（新）— 专栏元信息，目前定义了 `portfolio-v2`（个人站 V2 工程实录）
- `index.ts` — `readSeries()` 校验 frontmatter；`parseNote()` 对保留 slug fail-fast；新增 `getSeries()` / `getSeriesBySlug()`，按 `series.order` 升序并检测 order 重复

文章 frontmatter 挂专栏的写法：

```yaml
series:
  slug: "portfolio-v2"
  order: 2
```

### 2. 存储层 `web/components/notes/glass/storage/`

统一的 localStorage 抽象，**三种状态共用一套机制，不要复制**：

- `localStore.ts` — `createMapStore<T>(key, isValid)`。要点：快照必须缓存（`useSyncExternalStore` 要求 `getSnapshot` 返回稳定引用）；写入后置空缓存并派发 `notes:store-change` CustomEvent；`readServer()` 恒返回空对象供 hydration 使用；localStorage 是唯一真相源，写失败不写内存态
- `readingProgress.ts` — `progressStore`（key `notes:reading-progress`，**结构未变，旧数据可用**）、`writeProgress`、`isInProgress`、`isFinished`
- `bookmarks.ts` — `favoritesStore`（`notes:favorites`）、`queueStore`（`notes:queue`）、`toggleBookmark`、`orderedSlugs`
- `useStore.ts` — `useStoreMap(store)` 客户端 hook
- `ReadingTracker.tsx` — 从上层移入

### 3. 组件体系 `web/components/notes/glass/`

```
coverArt.ts                 策展图映射；cardArtStyle 已拆成 gradient + image 双变量
controls/  icons.tsx（16 个图标）, BookmarkButton.tsx, controls.module.css
parts/     Panel, NoteRow, RecoCard, Hero（各带 .module.css）
shell/     GlassShell.tsx, GlassShell.module.css, chrome.module.css, CategoryTabs.tsx
storage/   见上
pages/     Dashboard.tsx, ContinueReading.tsx
```

`GlassShell` 的接口：

```ts
type GlassShellProps = {
  active: RailKey;              // "home" | "favorites" | "queue" | "profile" | "settings"
  path: string;                 // 地址栏显示，如 "/notes/favorites"
  headCenter?: ReactNode;       // 首页放 <CategoryTabs>，其他页放 <PageTitle>
  side: ReactNode;
  main: ReactNode;
  sideLayout?: "split" | "single";   // split = 原版 1.15fr/1fr 双块，默认
  mainLayout?: "split" | "single";
  hasUnread?: boolean;          // 铃铛绿点
};
```

rail 五个入口已全部指向玻璃系统内部；bell → `/notes/notifications`，头像 → `/notes/profile`。

### 4. 页面

- `app/notes/page.tsx` — 换用 `pages/Dashboard`；新增 `?hero=N` 驱动 hero 真实翻页（服务端渲染，零 JS）；项目卡改用项目自己的封面（`media` 里 role=cover，video 取 `poster`，image 取 `src`）
- `app/notes/[slug]/page.tsx` — 仅修正 ReadingTracker import 路径

### 5. 脚本

- `scripts/typecheck.sh`（新）— 照 `lint.sh` 风格，日志落 `logs/typecheck.log`

已删除且无残留引用：`GlassDashboard.tsx/.module.css`、`GlassShell.tsx/.module.css`（旧）、`ContinueReadingPanel.tsx`、旧 `readingProgress.ts`。

## 剩余任务

### A. 六个功能页

`pages/` 目录**当前 2 个文件，加完这 6 个正好 8 个，达到单层上限**，不能再往里加。

| 路由 | 视图组件 | 内容 |
|---|---|---|
| `/notes/favorites` | `pages/Favorites.tsx` | main 卡片网格，side 最近收藏 + 统计 |
| `/notes/queue` | `pages/Queue.tsx` | 队列列表（带进度），side 已读完归档 |
| `/notes/profile` | `pages/Profile.tsx` | 作者卡 + 阅读统计 + 按年归档时间线 |
| `/notes/settings` | `pages/Settings.tsx` | 阅读偏好 + 本地数据导出/清除 |
| `/notes/notifications` | `pages/Notifications.tsx` | 由 `publishedAt` 与专栏更新推导，非假数据 |
| `/notes/series/[slug]` | `pages/SeriesDetail.tsx` | 目录 + 逐篇进度 + 整体完成度 |

模式：`app/notes/xxx/page.tsx` 是服务端壳，`getAllNotes()` 后把全量 notes 传给 `"use client"` 视图组件，视图用 `useStoreMap` 读本地状态。

Next.js 静态段优先于动态段，这些路径不会被 `/notes/[slug]` 截胡；`RESERVED_NOTE_SLUGS` 已做守卫。

### B. 内容填充（修复视觉的主要手段）

写 6–8 篇真实工程文章，题材取自已有项目：AI PPT 商业化平台、CAD 语义审查工作台、Word 智能编辑 Agent、智瞳篮途、反思学习。其中 3–4 篇挂 `series: portfolio-v2` 验证专栏链路。

**不要造假数据**（用户明确要求）。已有一篇 `portfolio-as-a-system.mdx` 可并入 `portfolio-v2` 作为 order 1。

### C. 验证

1. `bash scripts/typecheck.sh`
2. `bash scripts/dev.sh` 起服务
3. Playwright 逐页截图，断点 **1440 / 1130 / 900 / 680 / 520**，核对：侧栏塞满、rail 高亮跟随、≤1130 变底部 dock
4. 端到端：文章页滚动 → 收藏 → 加稍后读 → 各功能页确认出现 → 设置页清除 → 归零
5. rail 五个入口逐个点，确认不跳出玻璃系统

## 硬约束

- **`web/AGENTS.md` 声明这不是训练数据里的 Next.js**，写路由/`searchParams`/`Image` 前先查证。版本：Next 15.4.11 / React 19.2.4 / Tailwind v4
- 单文件 ≤300 行（TS 与 CSS），单层文件夹 ≤8 文件
- 不留兼容层、不留死代码、不留注释掉的代码
- 卡片内的按钮不能用 `<a>` 包 `<button>`：`RecoCard` 已改 stretched-link 模式（`.stretch::after` 铺满 z-1，按钮 z-2 并 `stopPropagation`），新增卡片类组件照此处理
- Run & Debug 一律走 `scripts/*.sh`，不直接敲 npm/npx

## 已知的未做项（不是遗漏，是明确取舍）

- **顶栏搜索框仍是静态展示**，没有交互。原版规格如此，但它现在是一个点不动的框。要么实现客户端过滤，要么去掉，不要留着假装能用。
- 卡片语境图见「关键结论 4」。
