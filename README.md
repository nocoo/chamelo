<p align="center">
  <img src="logo.png" width="128" alt="守宫 Logo" />
</p>
<h1 align="center">守宫</h1>
<p align="center">把中国文化意象整理成能直接落到界面上的配色：一套色板带原图、六个色块、十二个语义角色、用色比例和导出。</p>
<p align="center">
  <a href="https://chamelo.hexly.ai">站点</a> ·
  <a href="docs/README.en.md">English</a>
</p>

## 这是什么

给独立开发者、设计工程师和小团队用的配色图谱。多数「中国风配色」只给几张色卡，落到页面时仍然要自己判断谁是背景、谁是文字、按钮该用哪个色、比例怎么分。守宫把每套配色做成可以直接交给人和 Agent 的规格：一个文化意象生成一张原创画面，从画面里取出可信的颜色，再策展出背景、表面、文字、主操作、点缀等十二个语义角色，配上 60/30/10 的用色比例和一份可实现的界面说明。

当前收录 20 套已策展色板，另有 57 个意象概念处于待策展状态。它是一份策展结果，不是取色器：色块经过明度与对比度调校，不代表原图的原始像素平均值。

运行形式是纯前端静态站点，构建产物作为 Cloudflare Worker 的静态资源发布，没有登录、CMS、公开生成接口或数据库。所有画面都是 AI 创作的当代诠释，不是文物、壁画或建筑的历史记录。待策展概念只出现在本地开发构建中，不会进入生产页面。

## 功能

- **已策展色板**：20 套，覆盖壁画与石窟、山水与四时、器物与日常、诗词与梦境四类；每套包含原图、六个传统色名色块、十二个语义色、对比度记录和 60/30/10 比例。
- **明暗两种模式**：每套色板按自身场景声明浅色或深色默认值；右上角可以在两套模式间切换，切换后的配色由该色板的色块推导并保持 AA 对比。
- **直接带走**：单个颜色可按 HEX / RGB / HSL / OKLCH 复制，整套可复制为 CSS 变量，或复制成一份包含意象、色值、角色、比例与实现约束的 Agent Prompt。
- **站内预览**：用选中的配色渲染一个迷你站点，支持桌面与移动两种画幅，并可放大查看。
- **浏览与检索**：按文化来源筛选、按名称与标签搜索、键盘 `←` / `→` 翻页；原图支持查看与下载。
- **适用边界**：面向当前 Safari 与 Chrome，包含 iPhone Safari；不依赖 hover 完成必需操作；减少动态效果偏好会被尊重。

## 使用

打开 **https://chamelo.hexly.ai**，无需安装。

- 用分类标签或搜索框找到一套配色，`←` / `→` 逐套翻页。
- 点击任一色块复制它的色号，格式在右上角切换。
- 点「复制 CSS」得到十二个语义变量的 `:root` 片段；点「复制 Agent Prompt」得到一份可直接交给编码 Agent 的界面说明。
- 弹窗里可以查看完整原图、十二个语义色的对比记录、放大版预览和使用指南。

## 开发

需要 Node.js 22.12+ 与 Bun 1.4.3。

```sh
bun install
bun run dev
```

本地入口是 **https://chamelo.dev.hexly.ai**，Vite 监听 `127.0.0.1:7061`，由本机 Caddy 提供 HTTPS。

```sh
bun run build              # 类型检查并构建静态产物
bun run dev                # 开发服务器
```

生成新的配图属于内部编辑流程，需要根目录 `.env` 中的 `AZURE_OPENAI_ENDPOINT` 与 `AZURE_OPENAI_API_KEY`。这两个变量不提交、不加 `VITE_` 前缀、不进入客户端产物。

```sh
# 处理已归档的原图，生成 WebP 交付图与可复现的取色证据，不调用接口
bun run artwork:prepare -- <id> --model gpt-image-2.5-sunburst

# 准备本地版本提交（不推送、不部署）
bun run release -- --dry-run
bun run release -- minor

# 只读核对线上版本与构建产物
bun run verify:production
```

目录只需记住这几处：`src/data/palettes.ts` 是已策展内容，`src/data/draft-palettes.ts` 是待策展概念，`src/services/` 放纯逻辑，`src/views/` 放界面，`content/<id>/` 存每套色板的提示词与取色证据，`public/artworks/<id>/` 存原图与交付图。

## 测试

```sh
bun run test           # Vitest 单元测试
bun run test:coverage  # 带覆盖率的单元测试
bun run check          # Biome + 严格类型检查 + 覆盖率测试
```

单元测试覆盖色值转换与对比度计算、目录契约（色块数量、语义键、比例合计、对比度达标、文件存在）、导出内容、版本与健康产物。端到端用例目录 `tests/e2e` 尚未建立，`bun run test:e2e` 目前没有可执行用例；Playwright 配置与本地服务端口已就绪。

`artwork:prepare` 不参与测试；它依赖仓库内的原图与 `sharp`。

## 技术栈

| 技术                          | 用途                                     |
| ----------------------------- | ---------------------------------------- |
| React 19 + Vite               | 单页界面、构建与本地开发服务             |
| TypeScript（严格模式）        | 模型、服务与视图的类型约束               |
| culori                        | 色值转换、色彩空间互转与 WCAG 对比度计算 |
| liquid-glass-web-react        | 原图上的液态玻璃放大镜效果               |
| Biome                         | 格式化与静态检查                         |
| Vitest                        | 单元测试与覆盖率                         |
| Playwright                    | 端到端测试框架（用例待补）               |
| Cloudflare Workers + Wrangler | 静态资源托管与部署                       |

## 文档

- [AGENTS.md](AGENTS.md)：项目不变量、命令与发布规则的唯一维护源。
- [docs/releasing.md](docs/releasing.md)：版本策略、CI/CD 与生产校验流程。
- [docs/brand.md](docs/brand.md)：品牌命名、Logo 来源与各处尺寸用法。
- [.agents/skills/chamelo-palette/SKILL.md](.agents/skills/chamelo-palette/SKILL.md)：新增或重做一套色板的完整流程。
- [CHANGELOG.md](CHANGELOG.md)：版本变更记录。

## 许可证

[MIT](LICENSE) © 2026 Zheng Li
