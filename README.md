# dsh-notice-center 🔔🐋

**中文** | [English](./README.en.md)

[![test](https://github.com/SCP-QQ/dsh-notice-center/actions/workflows/test.yml/badge.svg)](https://github.com/SCP-QQ/dsh-notice-center/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/dsh-notice-center.svg)](https://www.npmjs.com/package/dsh-notice-center)

DeepSeek Harness 的**通知中心**：把标签页上的鲸鱼图标变成状态灯，并在你不在看的时候主动提醒你 —— 会话跑完了，或者有事情等你拍板。

包名 `dsh-notice-center`、插件实例 id `notice-center`、设置命名空间 `notice-center`。

## 界面

设置 → **通知中心**（侧栏导航项）：

<img src="docs/images/settings.png" width="440" alt="通知中心设置页">

## 功能

### 1. 鲸鱼状态灯（favicon 状态机）

| 鲸鱼颜色 | 含义 | 什么时候恢复 |
|---|---|---|
| 🟢 绿色 | 有会话在你没看它的时候**跑完了** | 该会话点开后自动恢复；全部点开过一遍即回到默认状态 |
| 🟠 琥珀色 | 有会话**有事等你处理**：提问 / 审批 / 计划审核 | 处理完后自动消失 |
| ⚫ 黑色 | 一切正常（官方原版图标） | 默认状态 |

标签页上的样子（绿 = 有会话跑完了）：

![标签页状态灯](docs/images/tab-status-light.png)

颜色与侧边栏的绿点、琥珀点**用的是同一份官方信号**，永远同步。只统计主会话，子代理不计入。绿色与琥珀同时存在时显示绿色。

三种颜色都可以在设置页改（含「默认色」，不配置则沿用官方原版图标）。

### 2. 系统通知

- **完成通知**：会话跑完时触发（官方 `completed` 由 false 变为 true；你正打开的那个会话官方不置位，由运行状态 true → false 判定）
- **待处理通知**：出现新的待处理交互时触发
- **通知文案**：标题＝会话名（多条聚合时补 `+N`），正文＝通知类型（完成＝「会话已完成」；待处理＝「待审批 / 向你提问 / 计划待审核」，未知类型回退到「有交互等待处理」）
- **默认只在你不看的时候弹**——「前台」= 标签页可见**且**窗口有焦点；切到别的标签页、最小化、被别的应用压在后面时都会提醒。想在前台也提醒（人还停在会话里、却已离开屏幕，例如在刷手机），打开「更多通知设置 → 前台提醒」
- **聚合与去重**：300ms 内的通知合并，同一会话同一类型只弹一次；多条合并为「标题 +N」
- **点击通知** = 聚焦窗口并打开对应会话
- **提示音**：完成 / 待处理各自可下拉选音效（**悬浮即试听**），音量可调（**调完音量会按新音量试听当前的完成提示音**）；开启后改播插件自带音效，系统默认提示音会被静音
- **常驻可选**：可关闭「自动隐藏」，通知就一直留在屏幕上，直到你点掉它（默认开启自动隐藏，由系统自行收起）
- 通知图标跟随你配置的状态灯颜色

| 完成通知（绿） | 待处理通知（琥珀） |
|---|---|
| ![完成通知](docs/images/notification-done.png) | ![待处理通知](docs/images/notification-pending.png) |

> 通知由浏览器发出（本机是 Chrome），所以卡片上显示的是浏览器与站点 `127.0.0.1:3080`。

### 3. 音效库

完成提示音与待处理提示音各有一个下拉，共 **47 个条目**：45 个取自 opencode 内置音效库（就是 opencode 设置里那套 `Alert` / `Bip-bop` / `Staplebops` / `Nope` / `Yup`，同名同序号）+ 2 个插件自带的合成音。

| 音效包 | 条目 |
|---|---|
| 内置（合成音） | Chime Up（完成默认，上行双音）、Chime Down（待处理默认，下行双音） |
| Alert | Alert 01–10 |
| Bip-bop | Bip-bop 01–10 |
| Staplebops | Staplebops 01–07 |
| Nope | Nope 01–12 |
| Yup | Yup 01–06 |

- **悬浮即试听**：鼠标划过下拉里的条目就播该音效（120ms 防抖，扫过整列不会连成一片）
- **点选即生效**：选中后该类型通知就播这个音，当前项打 `✓`
- **样式照官方**：触发按钮＝官方语言下拉的 `.selector`（36px 高、18px 圆角胶囊）；面板＝官方 `Menu`（`bg-layer-3` + 0.5px 描边 + 6px 圆角），条目标高用官方的 hover 填充色
- 宿主半通过 `/notice-center-sounds/<id>.mp3` 路由提供音效；路由不可用时**自动回退内置合成音**，不会变哑
- 老配置无需迁移：没配过音效时仍用 Chime Up / Chime Down

## 使用

1. **打开设置页** —— 设置 → **通知中心**
2. **开启系统通知** —— 打开「系统通知」总开关，浏览器会弹出授权请求，选「允许」（被拒绝时设置页会提示，需要到浏览器的站点设置里恢复）
3. **调音量 / 选音效 / 前台提醒** —— 展开「更多通知设置」：拖音量条，**松手后会按新音量试听完成提示音**；在「完成提示音 / 待处理提示音」下拉里**鼠标划过即可试听**，点一下选中；想让正看着页面时也提醒，打开「前台提醒」
4. **改颜色（可选）** —— 展开「鲸鱼状态灯」：点色块或直接填 `#RRGGBB`，行尾 ↺ 恢复默认
5. **就这样** —— 之后你切走或最小化时，会话跑完 / 有事等你都会收到通知；点通知直接跳回那个会话

## 安装

`dsh plugin` 是 **pnpm 的转发器**（在 profile 目录里跑 pnpm，再把新装的 bundle 补进
`dsh.profile.bundles`），所以 registry 包名、git 仓库、tarball、本地路径都能直接装。

### 1. 从 npm 安装（推荐）

```sh
dsh plugin --profile web add dsh-notice-center
```

包页：<https://www.npmjs.com/package/dsh-notice-center>（`latest` 为稳定版；预发布版在 `next` 通道）

### 2. 直接从 GitHub 装（无需先发布）

```sh
dsh plugin --profile web add github:SCP-QQ/dsh-notice-center
# 或走 SSH（本机 HTTPS 受代理影响时）
dsh plugin --profile web add git+ssh://git@github.com/SCP-QQ/dsh-notice-center.git
```

### 3. 从 tarball 装（离线 / 内网分发）

```sh
npm pack                                        # 生成 dsh-notice-center-<版本>.tgz
dsh plugin --profile web add ./dsh-notice-center-<版本>.tgz
```

### 4. 本地 link（改代码时用）

profile 的 `dependencies` 加
`"dsh-notice-center": "link:<项目目录>/dsh-notice-center"`，
`dsh.profile.bundles` 加 `"dsh-notice-center"`。

> 前三种装完都要**重启 Harness**；宿主半的依赖只有 `@deepseek-ai/schemastery`（npm 上有），
> 不需要 profile 额外提供任何 `@deepseek-ai/*` 包。

**重启要求分两半**：改浏览器半 `lib/client.cjs` 免重启（HMR 会 stat-poll 并通知浏览器重载该插件 bundle，刷新页面可确保干净重载）；**改宿主半 `lib/index.mjs` 必须重启 Harness**（宿主半热重载依赖 `cordis-plugin-hmr`，需 loader 带 `--expose-internals`，实测未生效）。首次安装与任何改名也必须重启。

### 5. 本机手动发布用的 `.npmrc`（可选）

CI 走 OIDC 发布，**不需要任何 token**。只有当你打算从本机手动 `npm publish` 时，才在项目根目录放一个 `.npmrc`：

```sh
//registry.npmjs.org/:_authToken=<你的 granular token>
```

该文件已在 `.gitignore` 里，**绝不要提交**（仓库里有真实 token 时尤其注意）。

## 要求

- 官方版本 DeepSeek Harness（本机实测：Harness 0.1.5-rc.1 + 客户端包 0.1.5-rc.2，适配范围 0.1.2-rc.1+）
- 系统通知需要**安全上下文**：`http://127.0.0.1:3080` 或 `localhost` 可用；用**局域网 IP** 访问时浏览器 Notification API 不可用

## 卸载

```sh
dsh plugin --profile web remove dsh-notice-center
```

移除依赖与 `dsh.profile.bundles` 条目后重启即无残留。

## 已知限制

- 浏览器**标签页关闭后收不到通知**（Web Push 需要服务端 + HTTPS，本地插件场景不现实；要覆盖需宿主 Toast 方案）
- 非安全上下文（局域网 IP）下 Notification API 不可用
- 刷新页面后绿色状态丢失：该状态只存在内存中，刷新即丢，属官方信号本身的行为
- 系统级勿扰模式（Windows 专注助手等）会吞掉通知，插件无法感知

## 开发

```sh
npm test            # 宿主半 + 浏览器半冒烟测试
npm run test:host   # 只跑宿主半
npm run test:client # 只跑浏览器半
```

CI 在 push / PR 时跑同一套（`.github/workflows/test.yml`）。

## 发布

发布由 **tag 触发**的 [`.github/workflows/publish.yml`](.github/workflows/publish.yml) 负责 —— 日常 commit / push **不会发包**：

| 意图 | 命令 | 结果 |
|---|---|---|
| 只提交（功能还没验证完） | `git commit` + `git push` | 只跑 `test.yml`，npm 上毫无动静 |
| 预发布（给人试用） | 版本改 `1.3.0-rc.1` → commit → `git tag v1.3.0-rc.1 && git push origin v1.3.0-rc.1` | 发到 **`next`** 通道（`npm i dsh-notice-center@next`），`latest` 不变 |
| 正式发版 | 版本改 `1.3.0` → commit → `git tag v1.3.0 && git push origin v1.3.0` | 发到 **`latest`**，自动附带 provenance |
| 只验证发布流程 | Actions → publish → Run workflow | 装依赖 + 跑测试 + `npm pack --dry-run`，**不发布** |

工作流内建三道闸：**tag 与 `package.json` 版本必须一致**、**tag 指向的提交必须已在 `main` 上**、**测试必须通过**。任一不过就发不出去。

### 一次性配置：npm Trusted Publishing (OIDC)

发布不需要任何 npm 令牌（也就没有令牌过期 / 泄漏的问题）。

打开包管理页 → **Publishing Access** → *Trusted publishers* → **Add a trusted publisher** → 选 **GitHub Actions**：

<https://www.npmjs.com/package/dsh-notice-center/access>

| 字段 | 值 |
|---|---|
| Organization or user | `SCP-QQ` |
| Repository | `dsh-notice-center` |
| Workflow filename | `publish.yml`（**只填文件名**，不带路径；重命名该文件必须同步改这里，否则 403） |
| Environment name | `npm`（与工作流里的 `environment:` 一致） |
| **Allowed actions → Allow npm publish** | ✅ **必须勾** |

> ⚠️ 那个勾选框是 npm 新版行为：trusted publisher **默认只允许 `npm stage publish`（暂存）**，不勾 *Allow npm publish* 的话，本工作流里的 `npm publish` 会被拒。
> 若你更想要「只能暂存、必须人工在浏览器批准才真发布」，就别勾，并把工作流末步改成 `npm stage publish`。

- 走 OIDC 发布时 npm **自动附带 provenance**（无需 `--provenance`），包页会显示来源证明
- 想要「tag 推上去还要人工点一下才发」：仓库 Settings → Environments → `npm` → 加 **Required reviewers**；不加也能正常发布
- 本机手动发布仍可用 granular token 兜底（见上文「安装」第 5 节的 `.npmrc` 用法）

## 目录结构

```
package.json          包元数据（dsh-notice-center）
cordis.patch.yml      bundle patch 层（insert id: notice-center）
lib/index.mjs         宿主半：settings schema + /notice-center-sounds 音效路由
lib/client.cjs        浏览器半：favicon 状态机 + 系统通知 + 音效库 + 设置页
assets/audio/*.mp3    45 个 opencode 音效（MIT；来源见 assets/audio/README.md）
docs/images/*.png     README 用的截图
test/host-half.smoke.mjs   宿主半冒烟测试
test/client-half.smoke.mjs 浏览器半冒烟测试（npm test 跑两个）
.github/workflows/test.yml  CI：push / PR 时跑 pnpm test
```

## License

MIT，完整许可文本见 [`LICENSE`](./LICENSE)。

音效素材（`assets/audio/*.mp3`，45 个）取自 [anomalyco/opencode](https://github.com/anomalyco/opencode)
的 `packages/ui/src/assets/audio/`，上游以 MIT 许可发布，这里保留同样的许可与署名；
若上游调整授权，请同步替换或移除本目录（详见 [`assets/audio/README.md`](./assets/audio/README.md)）。
