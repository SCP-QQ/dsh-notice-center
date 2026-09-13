# 历史补丁流水线（已归档，禁止再执行）

这里存放 `dsh-notice-center` 在「产物补丁期」用来把功能注入上游构建产物的脚本与片段。**它们只作历史记录，不再参与任何构建流程，也不要再执行。**

## 为何不能执行

- `apply-notify.mjs` 采用「字面锚点唯一命中 + 插入」策略，**不是幂等的**。例如片段 `a-module.js` 的锚点是 `const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;`，插入后该锚点依然存在且唯一 —— 再次执行会插入第二份 `SETTINGS_NAMESPACE` / `NOTIFY_DEFAULTS` 声明，直接 `SyntaxError`。
- 锚点绑定上游特定版本的产物文本，上游一发版即失效（本目录的 `find` / `findRegex` 会 `[FAIL]`）。

## 目录内容

| 文件 | 用途 |
|---|---|
| `apply-notify.mjs` | 主补丁脚本：颜色组 + 系统通知 + 通知中心导航，18 处插入（A0/A/P/D/L/M/N/O/O2/O3/O4/Q/E/F/G/I/J/K） |
| `apply-gallery.mjs` | 早期色板画廊方案（已被颜色组取代） |
| `a-module.js` `a0-require.txt` | 模块级常量、权限工具、官方 UI 原语引入 |
| `b-colors.js` `b-component.js` `b1-inline.js` `b3-notify-block.js` | 设置页主体重构片段 |
| `d-apply.js` | `apply` 内的通知状态机（跃迁检测 / 聚合 / 发送） |
| `l-nav-icon.js` `icon-*.txt` | 导航图标换成官方 `IconQueueOutline14` 的片段与图标名清单 |
| `e/f/g/q-*.txt` | 状态跃迁接入、清理定时器、`targetOf` 颜色总开关 |
| `h-locale-zh.txt` `i-locale-en.txt` `j-schema.txt` | 中英文案与宿主 schema 片段 |
| `smoke-notify.mjs` `check-schema-unknown.mjs` | 冒烟/校验脚本（仍可参考，用于将来回归测试） |
| `commit-msg-*.txt` | 当时的提交信息草稿 |

## 现在的开发方式

`lib/client.cjs`、`lib/index.mjs` **就是本项目的源码**（上游产物未压缩，保留 `src/*.ts` 分区标记与注释），直接编辑即可，改动由 git 提交记录承载，不再需要补丁脚本。
