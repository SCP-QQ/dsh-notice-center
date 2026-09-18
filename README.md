# dsh-notice-center 🔔🐋

DeepSeek Harness 的**通知中心**：把标签页鲸鱼图标变成状态灯，并在你不在看的时候主动提醒你 —— 会话跑完了，或者有事情等你拍板。

包名 `dsh-notice-center`、插件实例 id `notice-center`、设置命名空间 `notice-center`。

## 功能

### 1. 鲸鱼状态灯（favicon 状态机）

| 鲸鱼颜色 | 含义 | 什么时候恢复 |
|---|---|---|
| 🟢 绿色 | 有会话在您没看它的时候**跑完了** | 点开该会话后自动恢复；全部看完回黑 |
| 🟠 琥珀色 | 有会话**有事等您处理**：提问 / 审批 / 计划审核 | 处理完后自动消失 |
| ⚫ 黑色 | 一切正常（官方原版图标） | 默认状态 |

颜色与侧边栏的绿点、琥珀点**用的是同一份官方信号**，永远同步。只响应主会话，子代理不影响。绿色与琥珀同时存在时显示绿色。

### 2. 系统通知（本项目的增量）

- **完成通知**：会话 `completed` 由 false → true 时触发
- **待处理通知**：出现新的待处理交互（提问 / 审批）时触发
- 必居其一才弹：**仅在页面不在前台时提醒**（固定策略）——「前台」= 标签页可见**且**窗口有焦点；切到别的标签页、最小化、或浏览器被别的应用压在后面时都会提醒，只有你正看着 DSH 时才不打扰
- **聚合与去重**：300ms 窗口合并，同一会话同一类型只弹一次；多条合并为「标题 +N」
- **点击通知** = 聚焦窗口并打开对应会话
- **提示音**：完成与待处理两种预置音，音量可调；开启提示音时会静音系统提示音，改用插件自带音
- 通知图标跟随您配置的状态灯颜色（绿 / 琥珀）

### 3. 设置页

设置 → **通知中心**（导航项），分两组：

| 分组 | 项 |
|---|---|
| 颜色 | 完成色、待处理色、默认色（未配置=官方原版）、颜色状态灯总开关 |
| 通知 | 系统通知总开关（默认**关闭**）、提示音开关、提示音音量、浏览器授权状态与授权按钮 |

系统通知为 opt-in：首次开启需在设置页点击授权按钮（浏览器要求用户手势），拒绝后需到站点设置里重置。

## 要求

- 官方版本 DeepSeek Harness（本机实测：Harness 0.1.5-rc.1 + 客户端包 0.1.5-rc.2，适配范围 0.1.2-rc.1+）
- 系统通知需要**安全上下文**：`http://127.0.0.1:3080` 或 `localhost` 可用；用**局域网 IP** 访问时浏览器 Notification API 不可用

## 安装

发布形态（推荐）：

```sh
dsh plugin --profile web add dsh-notice-center
```

本机当前用的是本地 link：profile 的 `dependencies` 加
`"dsh-notice-center": "link:<项目目录>/dsh-notice-center"`，
`dsh.profile.bundles` 加 `"dsh-notice-center"`。

**重启要求分两半**：改浏览器半 `lib/client.cjs` 免重启（HMR 会 stat-poll 并通知浏览器重载该插件 bundle，刷新页面可确保干净重载）；**改宿主半 `lib/index.mjs` 必须重启 Harness**（宿主半热重载依赖 `cordis-plugin-hmr`，需 loader 带 `--expose-internals`，实测未生效）。首次安装与任何改名也必须重启。

## 卸载

```sh
dsh plugin --profile web remove dsh-notice-center
```

移除依赖与 `dsh.profile.bundles` 条目后重启即无残留。

## 已知限制

- 浏览器**标签页关闭后收不到通知**（Web Push 需要服务端 + HTTPS，本地插件场景不现实；要覆盖需宿主 Toast 方案）
- 非安全上下文（局域网 IP）下 Notification API 不可用
- 刷新页面后绿色状态丢失：这是官方「已完成通知」的内存态语义，属正常现象
- 系统级勿扰模式（Windows 专注助手等）会吞掉通知，插件无法感知

## 目录结构

```
package.json          包元数据（dsh-notice-center）
cordis.patch.yml      bundle patch 层（insert id: notice-center）
lib/index.mjs         宿主半：向 settings 注册 notice-center 命名空间 schema
lib/client.cjs        浏览器半：favicon 状态机 + 系统通知 + 设置页
test/host-half.smoke.mjs  宿主半冒烟测试（npm test）
```

## License

MIT，完整许可文本见 [`LICENSE`](./LICENSE)。
