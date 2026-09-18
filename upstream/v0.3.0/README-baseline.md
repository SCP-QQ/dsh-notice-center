# upstream/v0.3.0 —— 上游纯净基线（只读，不参与运行）

本目录是派生来源 [wally8-8/dsh-done-whale](https://github.com/wally8-8/dsh-done-whale) **tag `v0.3.0`（commit `bf4a3d2`）** 的完整产物快照，用 `git archive v0.3.0` 逐字节取自该 commit 的 git 对象，未做任何修改。

## 为什么要留它

本项目采用「冻结式独立」：不自动合并上游，但必须保留与上游的对照能力。

1. **看清自己改了什么**

   ```sh
   git diff --no-index upstream/v0.3.0/lib/client.cjs lib/client.cjs
   git diff --no-index upstream/v0.3.0/lib/index.mjs  lib/index.mjs
   ```

   （当前规模：`client.cjs` 上游 942 行 → 本包 806 行；`index.mjs` 上游 1084 行 → 本包 62 行。
   注意行数不代表改动量——上游 v0.3.0 宿主半几乎全被「一键自更新」占满，本包则把它换成了系统通知等增量。）

2. **将来移植上游修复时做三方合并**

   ```sh
   git merge-file -p lib/client.cjs upstream/v0.2.2/lib/client.cjs upstream/v0.3.0/lib/client.cjs > merged.cjs
   ```

## v0.3.0 相对 v0.2.2 的变化（对照用）

- **宿主半从 62 行级膨胀到 1084 行**：新增浏览器端「一键自更新」的后端——
  解析 profile 里本插件的安装 spec（github: / git+https / bare owner/repo / link: / file: 都识别）、
  推导 GitHub 仓库、拉取最新 tag 做版本比较、跑 `dsh plugin add` 并解析 pnpm 进度输出，
  另开 4 个 HTTP 端点：`/api/whale/update-check`、`/api/whale/update`、
  `/api/whale/update/status`、`/api/whale/update/cancel`；并注册 `whale_update` 模型工具
  （`action=check|update`）。
- **浏览器半**新增「版本与更新」块（`UpdateBlock` / `createUpdateController` / `Progress`，
  500ms 轮询进度、可取消），颜色行重构为独立的 `ColorRows` 组件。
- `dsh.client.inject` 增加 `@deepseek-ai/dsh-api-session-controller` —— `sessions` 服务的提供者
  （v0.2.2 用的还是已停发的 `@deepseek-ai/dsh-client-runtime`）。
- `package.json` 增加 `repository` 字段：自更新靠它推导 GitHub 仓库，缺了就没法自更新。

## 基线内容

| 文件 | 说明 |
|---|---|
| `lib/client.cjs` | 上游浏览器半（状态灯 + 颜色设置 + 一键更新；命名空间 `done-whale`；**无系统通知 / 提示音 / 通知中心导航**） |
| `lib/index.mjs` | 上游宿主半（自更新服务 + `whale_update` 工具 + 设置 schema） |
| `package.json` `cordis.patch.yml` `LICENSE` `README.md` | 上游元数据与文档原文 |

## 注意

- 本目录**不参与构建、不参与运行**，仅为对照基线；修改它等于修改上游定义，请勿改动。
- 上游许可证：MIT（`LICENSE` 原文在此目录与仓库根各一份）。
