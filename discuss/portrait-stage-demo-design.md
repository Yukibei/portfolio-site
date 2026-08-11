# 肖像流体舞台 Demo 设计方案

## 目标

先在隔离路由 `/lab/portrait-stage` 做一个独立 WebGL demo。它参考 landonorris.com 的核心思路：中心强主体、流体扰动、悬浮 HUD、签名身份层、鼠标驱动和 idle 自动生命感。但视觉语境改成李怡霖的 AI 工程师个人舞台，不复刻 F1 内容。

第一版目标不是“代码跑起来”，而是达到可评审的高级视觉质感：

- 初始态干净、有压迫感，人物主体清晰居中。
- 鼠标经过时，主体头部/脸部附近出现真实流体扰动。
- CRT 电脑头不是简单擦图，而是作为“数字人格层”被流体拉出。
- HUD 信息独立悬浮，不参与流体变形。
- 签名作为右侧身份锚点或底部收束层。
- demo 与当前首页完全隔离，确认满意后再迁移。

## 素材使用

当前可用素材：

- `图片/一号.png`：高清人物完整图，用作参考和背景气氛层。
- 抠图人物：作为 WebGL 主体层，避免整张矩形照片被拖拽。
- CRT 头图：作为数字人格层，需要裁切、透明化、对齐人物头部。
- 手写签名：做透明化处理，第一版先静态呈现，后续可升级描线动画。

生成/处理后的素材建议放到：

`web/public/lab/portrait-stage/`

建议文件：

- `portrait-full.png`
- `portrait-cutout.png`
- `crt-head.png`
- `signature.png`
- `shadow-neck.png`（可由代码或图像处理生成）
- `crt-glow.png`（可由代码或图像处理生成）

## 第一版视觉结构

### 1. 舞台层

全屏黑底，不做普通卡片，不做落地页式解释。画面第一眼必须是中心主体。

布局：

- 中央：人物主体 + CRT 数字人格层。
- 左侧：能力 HUD。
- 右侧：签名与身份。
- 底部：极简交互提示。
- 四角：非常克制的取景框/技术线条。

主色：

- 背景：接近纯黑。
- 主体：保留人物真实肤色和白色外套。
- 交互色：站点橙 `#f97316`。
- 屏幕光：冷白，少量淡紫/蓝。
- 文字：白色低透明度，橙色只做焦点。

### 2. WebGL 主体层

不再用“两张完整照片直接 mix”的做法。

第一版采用三层合成：

- `portrait-cutout`：默认主体。
- `crt-head`：替换头部的数字人格层。
- `reveal mask`：由流体染料场和鼠标距离共同控制。

实现意图：

- 静止时看到清晰人物。
- 鼠标进入头部区域时，CRT 头从局部被拉出。
- 流体会拖拽边缘像素，但不会把整张脸弄脏。
- CRT 的屏幕眼睛可以额外增强辉光，不依赖图片本身亮度。

### 3. 流体交互

参考逆向 demo 的 GPU Stable Fluids 思路：

- velocity ping-pong render target。
- advection。
- mouse force injection。
- divergence。
- pressure Jacobi。
- projection。
- dye/reveal 场。

第一版参数方向：

- 鼠标半径偏大，但边缘软。
- 速度强度中等，不追求夸张飞散。
- idle 状态用 Lissajous 曲线缓慢游走，保证没鼠标时也有生命感。
- 停止移动后 reveal 缓慢消散，恢复人物清晰。

### 4. HUD 文案

参考站的 HUD 思路，但改成简历能力证据。

左侧模块：

- `AI AGENT`
- `LangGraph Multi-Agent`
- `ReID mAP 91.61%`
- `Cross-platform Deployment`

右侧模块：

- 手写签名。
- `YILING LI`
- `AI Application / Full-stack / Observable Systems`

底部提示：

- `move cursor over portrait`
- `fluid reveal active`

不放大段说明，不写教程，不解释“这是一个效果”。

### 5. 响应式和降级

桌面优先。移动端第一版需要可用，但不要求完整鼠标体验：

- 移动端自动 idle reveal。
- HUD 简化为上下两组。
- 如果 WebGL 初始化失败，显示静态主体图 + HUD。
- `prefers-reduced-motion` 下关闭强流体，只保留轻微淡入和静态图层。

## 代码隔离

建议新增：

- `web/app/lab/portrait-stage/page.tsx`
- `web/components/lab/portrait-stage/PortraitStage.tsx`
- `web/components/lab/portrait-stage/PortraitStageCanvas.tsx`
- `web/components/lab/portrait-stage/PortraitStageHud.tsx`
- `web/components/lab/portrait-stage/types.ts`
- `web/scripts/prepare-portrait-stage-assets.mjs`
- `scripts/prepare-portrait-stage-assets.sh`
- `scripts/verify/portrait-stage.sh`

文件控制：

- 单个 TS/TSX 文件尽量低于 300 行。
- shader 字符串如果过长，单独拆到 `shaders.ts`。
- demo 路由不引用首页的 `PortraitHero`，避免互相污染。

## 验收标准

第一版完成后必须至少通过：

- `bash scripts/lint.sh`
- `bash scripts/build.sh`
- `bash scripts/verify/portrait-stage.sh`

视觉验收截图：

- `logs/portrait-stage-desktop-initial.png`
- `logs/portrait-stage-desktop-reveal.png`
- `logs/portrait-stage-mobile.png`

人工验收重点：

- 主体是否足够大、足够清晰。
- 鼠标流体是否像“液体拖动像素”，不是脏污遮罩。
- CRT 头是否和脖肩关系成立。
- HUD 是否增强能力表达，而不是抢主体。
- 是否比当前首页肖像区更有记忆点。

## 明确不做

第一版不做：

- 接入首页。
- 改 Claude 正在处理的现有肖像区。
- 做完整长页面。
- 做复杂路由跳转。
- 做大量说明文案。
- 追求 1:1 复制 F1 文案和品牌元素。

## 风险

- 当前抠图头发边缘如果质量不足，流体放大后会显得毛糙，需要二次清理 alpha。
- CRT 头和人物头部透视不完全一致，可能需要手工缩放/位移/阴影调整。
- WebGL 流体代码复杂，必须用隔离 demo 先验收，不应直接进首页。

