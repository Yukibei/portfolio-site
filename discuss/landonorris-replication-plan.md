# Lando Norris 官网复刻方案 · 讨论稿

> 基于 xing0325/landonorris-teardown 逆向报告（8 章 / 25 demo / 全站 data-attribute 拆解）
> 原则：复刻交互骨架，内容与形象全部换成"程序员/AI 工程师"身份；不删现有代码，分区替换。
> 分工：提示词+交互代码 = Claude；图片生成（image2image）+ 视频生成 = 用户。

## 0. 对照确认：你看到的 = 我拆到的

| 你描述的效果 | 逆向报告里的实现 |
| --- | --- |
| 人物面部动态效果 | Three.js GPU 流体求解器（6 shader pass，~3000 行）+ 128×128 网格顶点位移：鼠标划过产生流体扰动；2.5s 无操作后 Lissajous 曲线自动游走 + simplex 噪声持续微动 |
| 鼠标悬浮出现头盔 | 鼠标位置驱动的图层揭示（helmet reveal swipe，被 60fps.design 收录）：底层人物图 + 上层头盔图，鼠标划过区域以流体边缘揭示上层 |
| 往下滚动画面变小出现签名 | sticky-hero pin：hero 容器钉住，滚动 scrub 驱动画面缩小，`signature.riv`（Rive 签名动画）描线浮现 |
| 横向时光轴（图片大小不一、出现字、滚完变回纵向） | on-track 页 `data-horizontal-section`：ScrollTrigger `pin:true + scrub` 把纵向滚动距离换算成卡片轨道 `translateX`——"一屏纵向 = 多屏横向"，滚完自然释放回纵向 |
| 全站那种"跟手"的高级感 | 一切 `scrub:true`（滚动条即播放头）+ Lenis 平滑滚动惯性 + 统一 ease `cubic-bezier(0.65,0.05,0,1)` / 0.75s——报告总结为"页面不是电影，是被你操控的剧场" |

他们的技术栈：Webflow + Taxi.js + Lenis + GSAP(ScrollTrigger/SplitText) + Rive(11 个 .riv) + Three.js(GLTF/Draco/KTX2/HDRI) + UnrealBloom。
我们的对应策略：**framer-motion 全部等价实现**（站点已深度使用，不引 GSAP 避免两套动画系统打架）；Lenis 可选引入（~3KB）；Rive/Three.js 流体不引——报告自己给出了简化方案：SVG feTurbulence + feDisplacementMap ≈ 90% 视觉感 / 5% 代码量。

## 1. 三大复刻点设计

### 1.1 Hero：肖像 + 鼠标揭示"电脑头"（最高优先级，亮点）

**身份适配**：赛车头盔 → **CRT 显示器头**（呼应现有 hero 视频里的 CRT 西装人——这是站点已有的视觉母题，比蜘蛛侠面罩更"我们"）。屏幕上是绿色 ReID 检测框 + 扫描线，一眼读出"AI 视觉工程师"。

**三层结构**：

```text
Layer A（底）  本人肖像 · 黑底棚拍 · 居中胸像
Layer B（上）  同构图"CRT 头"版 · mask 跟随鼠标揭示
Layer FX      SVG feTurbulence + feDisplacementMap 扰动 mask 边缘 → 流体感
```

**交互细节（全部来自报告）**：
- mask = `radial-gradient(circle Npx at var(--mx) var(--my))`，鼠标位置 rAF lerp 平滑追踪
- 无操作 2.5s → 揭示圆心走 Lissajous 曲线自动游走（页面"活着"）
- 移动端无鼠标 → 自动游走模式 + 触摸点跟随
- 与现有"鼠标擦洗视频"的关系：**替换**。擦洗的交互基因（鼠标驱动画面）被继承升级，原 CRT 视频可下移或退役——待拍板

### 1.2 Sticky-hero 滚动收缩 + 签名

hero 容器拉高到 ~300vh，内层 sticky 钉住，滚动进度 scrub 驱动：

```text
progress 0.00-0.35   肖像满屏，鼠标揭示可玩
progress 0.35-0.65   画面 scale 1→0.62 · 圆角浮现 · 退为"画框"
progress 0.45-0.85   签名 SVG stroke-dashoffset 描线画出（白色手写体）
progress 0.70-1.00   BUILD./DEPLOY./DELIVER. 字符级 stagger 入场（y:110%→0 · stagger 0.02 · power3.out）
```

签名素材：你的手写签名（纸上写"李怡霖"或"Yiling Li"拍照即可），我转 SVG 路径做描线动画——等价于他们的 signature.riv，零额外依赖。

### 1.3 Journey 时光轴 → 横向 pin 滚动（替换 JourneyMarquee）

```text
容器 h-[350vh]
└─ sticky top-0 h-screen 视口
   └─ 轨道 flex：照片卡大小不一（h-[55vh]/[38vh]/[46vh] 交错、baseline 错落）
      progress → translateX(0 → -(trackW - 100vw))
      每卡进入视口中线 → 年份大字 + 三句话标签浮现（opacity/y scrub）
      滚完自然释放回纵向
```

- 内容用现有 journey/ 照片 + 已规划的 6 个故事节点（起点工作室 → 第一个项目 → ICPC → 讯飞工位 → 智学云团队 → 交控联调）
- 中途穿插超大年份数字（2022/2023/2024/2025）做背景层视差
- 移动端降级：保留横向 pin 但缩短轨道，或退回纵向照片流——倾向前者（报告确认原站移动端保留了 pin）
- 现有拖拽 marquee 交互退役（滚动驱动与拖拽驱动二选一，避免手势打架）

### 1.4 顺带升级（低成本高级感，来自报告配方）

- **字符 stagger 入场**：SectionTitle 升级，全站章节标题逐字符抽出（配方 1，~80 行）
- **统一缓动**：`cubic-bezier(0.65, 0.05, 0, 1)` / 0.75s 全站统一
- **nav 哨兵主题切换**：零高度 div 哨兵控制导航主题色（P2 可选）
- **Lenis 平滑滚动**：P2 可选，需回归测试现有 sticky 层叠

## 2. 素材清单与提示词（你来生成）

### 素材 1 · 底图肖像（Layer A）

用你的正面半身照做 image2image（重绘强度低，保脸），目标风格：

```text
提示词（中文）：
深黑色纯背景棚拍肖像，年轻男性软件工程师，正面面对镜头，居中构图，
胸像（头顶留少量空间），穿深色极简夹克/卫衣，低调电影感布光：
左上方单一柔光主光源，肩部轻微轮廓光，面部清晰锐利，表情平静自信，
写实摄影风格，85mm 镜头，f/2.8，8k 细节

英文 prompt：
studio portrait of a young East Asian male software engineer, chest-up,
facing camera directly, centered composition, wearing a dark minimal jacket,
pure black background, dramatic low-key cinematic lighting, single soft key
light from upper left, subtle rim light on shoulders, sharp focus on face,
calm confident expression, photorealistic, shot on 85mm f/2.8, 8k detail
```

要求：**纯黑背景**（融进站点底色）、居中、胸像。出图后把这张作为素材 2 的底图。

### 素材 2 · CRT 电脑头版（Layer B）

拿素材 1 做 image2image（中等重绘强度，锁定构图姿态），只换头部：

```text
提示词（中文）：
与底图完全相同的构图、姿态、服装和布光，但头部替换为一台复古 CRT 显示器
（方正、带塑料外壳的老式电脑屏幕），屏幕发出荧光绿光，屏幕画面显示：
绿色线框人脸轮廓 + 角标检测框（目标识别 HUD 风格）+ 滚动的代码行，
屏幕有扫描线和轻微辉光，几根数据线从显示器底部融入衣领，
右侧有一道暖橙色 (#F97316) 环境反光，写实赛博极简风，不要花哨霓虹

英文 prompt：
same composition, pose, clothing and lighting as the base portrait, but the
head replaced with a vintage CRT monitor (boxy retro computer screen),
screen glowing phosphor green, displaying a green wireframe face with
corner-bracket detection boxes (object-detection HUD style) and scrolling
code lines, visible scanlines and subtle bloom, cables from the monitor
merging into the jacket collar, one warm orange (#F97316) accent light
reflection on the right side, photorealistic cyberpunk-minimal, no neon clutter
```

关键验收：两张图叠在一起时**肩线、衣服、光位完全重合**，只有头不同——这决定揭示效果成败。生成时若姿态漂移，降低重绘强度重试。

### 素材 3 · 手写签名

纸上写"李怡霖"（或英文艺术签名），高对比拍照发我。我负责矢量化 + 描线动画。

### 素材 4 · 可选视频（图生视频，P2）

素材 1 输入图生视频："subtle breathing motion, slow blink, slight head turn, static camera, seamless loop, 4s"——肖像微动态版，替代静态图做 Layer A（landonorris 的"面部动态"等价物，不依赖 GPU 流体）。

### 素材 5 · Journey 标签文案

6 个节点各三句话（当时的问题 / 我做的动作 / 留下的能力）——你口述我润色即可。

## 3. 不复刻的部分（明确丢弃，避免范围爆炸）

| 原站 | 决定 | 理由 |
| --- | --- | --- |
| GPU 流体求解器（Navier-Stokes，~3000 行） | ✗ 用 SVG displacement 简化版 | 报告原话："90% 视觉感、5% 代码量"；demoscene 级实现 ROI 极低 |
| Rive 全家桶（11 个 .riv） | ✗ SVG + framer-motion 等价 | 不引新运行时 |
| Taxi.js 无刷新路由 + 柠檬绿转场幕布 | ✗ | 我们是单页站，无路由 |
| Three.js 3D 头盔 + HDRI 滚动换打光 | ✗（已有 3D 工作证占住"真 3D"生态位） | 一站两个重 3D 场景互抢性能 |
| "Load Norris" 预加载门 | △ 可做"Load Portfolio"极简版 | 仪式感强但多一道点击，投递场景慎用——待讨论 |
| 滚动大段文字宣言区 | ✗ 你已点名不要 | — |

## 4. 实施顺序

```text
R1  Journey 横向 pin 时光轴（素材已齐：journey/ 照片）        ← ✅ 已完成 2026-06-13
R2  Hero 肖像揭示 + 加载门（用户已给底图+CRT 头图）           ← ✅ 已完成 2026-06-13
R3  签名描线（等用户手写签名图）                              ← 占位中，等签名图
R4  字符 stagger / 统一缓动 / nav 哨兵                        ← Lenis 已接入
```

每步完成跑 lint + build + Playwright 桌面/375px 截图自审，结果进 discuss/verify/。

### R2 完成记录（2026-06-13）

**用户关键指令**：① Hero **不替换、往下加**（视频 Hero 保留，肖像揭示区加在它下方）；② **要加载门**。

- **素材**：用户给 `图片/一号.png`（本人黑底白衬衫半身肖像）+ `图片/图2.png`（同构图 CRT 显示器头，屏幕两个发光眼，像机器人）。`scripts/process-hero-images.mjs`（sharp）转 WebP → `public/hero/portrait-base.webp`(75KB) / `portrait-crt.webp`(50KB)。签名图未给，R3 占位。
- **加载门** `common/LoadingGate.tsx`：进站锁滚动 + 品牌大字 + 真实进度条（readyState+最短 1s）+ 橙色 Enter；点击上掀揭门。沿用 landonorris "你不点不开始" 哲学。
- **肖像揭示** `hero/PortraitRevealScene.tsx`（three.js ShaderMaterial，dynamic ssr:false）+ `hero/PortraitHero.tsx`（section 容器）：
  - 全保真 WebGL：底图肖像 + 鼠标圆形揭示 CRT 头，揭示边缘 simplex noise 流体扰动（速度越快越汹涌）+ 暖橙描边；底图常态微动；**2.5s 无操作 Lissajous 自动游走**（移动端默认态）。coverUv 保比例铺满。
  - 滚动收缩：sticky-hero，scrollYProgress 驱动画框 scale 1→0.6 + 上移，签名占位浮现（offset `end end` 对齐 pin 释放点）。
- **踩坑（重要）**：`introOpacity = useTransform(scrollYProgress, [0,0.22], [1,0])` 在 Lenis 下表现异常——早段正确淡出但后段回弹到 1（同源的 scale/signOpacity 却正常）。**修复：introOpacity 改为从 `scale` 这个 MotionValue 派生**（`useTransform(scale,[1,0.85],[1,0])`），scale 更新可靠，问题消失。怀疑是 framer useScroll 多个窄区间 useTransform 在平滑滚动下的订阅竞态，未深究，派生方案稳定。
- **测试教训**：`lenis.scrollTo({immediate:true})` 在自动化里不可靠（不落位）；用动画 scrollTo + 1.6s settle，或真实 `mouse.wheel` 才稳。探针选元素要精确（`textContent.includes` 会命中外层容器）。`window.__lenis` 已暴露便于测试驱动。
- 验证：lint+tsc pass；Playwright 加载门→视频 Hero→肖像揭示(CRT 头+发光眼+流体环)→收缩+签名 全程截图通过，归档 `discuss/verify/2026-06-13-portrait-gate/`。

### R1 完成记录（2026-06-13）

- **基建**：装 `gsap` + `lenis`；`components/common/SmoothScroll.tsx` 全局接入 Lenis 平滑滚动 + GSAP ticker 同步 + 锚点平滑跳转；`scrollControl.ts` 让浮层锁滚动与 Lenis 协同（lockScroll/unlockScroll → lenis.stop/start）。reduced-motion 自动禁用回原生滚动。
- **横向时光轴**：`components/sections/JourneyTimeline.tsx` 替换原 `JourneyMarquee`。4 章节（START/COMPETE/BUILD/SHIP）+ Now 收束卡，超大衬底章节字、照片大小错落（lg/md/sm × start/center/end 三对齐）、章节头卡橙色编号。
- **关键技术决策（踩坑后定）**：横向 pin **不用 GSAP ScrollTrigger.pin**，改用 framer-motion `useScroll` + 原生 `sticky top-0`（与 Projects 区同款）。原因：ScrollTrigger 的 pin-spacer 测量与本站"sticky 盖层 hero"（hero sticky、内容层滑动盖上来）的滑动上下文冲突，实测 pin 不生效、整段被跳过。改用 sticky-progress 后桌面 + 375px 均稳定，且 Lenis 下 Projects 层叠卡无回归。section 高度 = `100vh + maxX`（maxX 由 ResizeObserver + img load 动态测量），尾段 0.92→1 留到底缓冲。
- 验证：lint + tsc pass；Playwright 桌面横向推进 -4706→-9637 到底、入场/章节/页脚顺序、移动端横向、Projects 回归全过。截图 `discuss/verify/2026-06-13-timeline/`。
- 原 `JourneyMarquee.tsx` 暂留文件未删（可回退），page.tsx 已切到 JourneyTimeline。

## 5. 待拍板

- [ ] Hero 方案：替换现有 CRT 擦洗视频，还是保留视频下移到其他区？
- [ ] "Load Portfolio" 预加载门做不做？
- [ ] 移动端横向 pin：保留（短轨道）还是退回纵向流？
- [ ] 素材 1/2 你生成后发我，R2 即可开工。
