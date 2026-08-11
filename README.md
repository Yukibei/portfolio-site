# portfolio-site

个人作品集网站，线上地址 <https://liyilin.xyz>。

## 技术栈

- Next.js 15.4 + React 19，TypeScript
- 内容层：MDX（`next-mdx-remote` + `gray-matter`），文章位于 `web/content/notes`
- 动效：GSAP、Framer Motion、Lenis、anime.js
- 3D：`@react-three/fiber` + `drei` + `rapier`（首页挂绳卡片、恐龙跑酷）

## 目录

| 路径 | 说明 |
| --- | --- |
| `web/` | Next.js 应用主体 |
| `web/app/` | 路由与页面（home、about、work、lab、notes、services） |
| `web/components/` | 组件族（profile-desktop、evidence、notes、dino、lanyard 等） |
| `web/content/` | MDX 文章与元数据 |
| `scripts/` | 开发、构建、部署、验证脚本 |
| `docs/` | 部署与集成说明 |
| `discuss/` | 方案与评审文档 |

## 本地开发

```bash
bash scripts/install-web-deps.sh
bash scripts/dev.sh          # 启动开发服务器
bash scripts/stop-dev.sh     # 停止
bash scripts/build.sh        # 生产构建
bash scripts/lint.sh
```

## 部署

生产环境为 Next.js `standalone` 产物，由 systemd 托管，Nginx 反向代理到
`127.0.0.1:3000`，证书由 Let's Encrypt 签发。完整步骤见
[`docs/deploy-aliyun-ecs.md`](docs/deploy-aliyun-ecs.md)。

```bash
bash scripts/deploy/build-aliyun-package.sh   # 产出部署包
bash scripts/deploy/verify-package.sh         # 启动 standalone 并检查核心路由
```

服务器目录为 `/opt/portfolio-site`，采用 `releases/<时间戳>` + `current` 软链的
发布结构，可通过切换软链回滚。

> 注意：该服务器同时承载 New API 中转站，`/opt/proxy` 为保护目录，
> 且 80/443 由宿主机 Nginx 统一管理。部署会触发全局 `nginx -s reload`，
> 操作前须备份 Nginx 配置。
