# upstream/v0.2.2 —— 上游纯净基线（只读，不参与运行）

本目录是派生来源 [wally8-8/dsh-done-whale](https://github.com/wally8-8/dsh-done-whale) **tag `v0.2.2`（commit `f278787`）** 的完整产物快照，逐字节取自该 commit 的 git 对象（`git archive f278787`），未做任何修改。

## 为什么要留它

本项目采用「冻结式独立」：不再自动合并上游，但必须保留与上游的对照能力。

1. **看清自己改了什么**

   ```sh
   git diff --no-index upstream/v0.2.2/lib/client.cjs lib/client.cjs
   git diff --no-index upstream/v0.2.2/lib/index.mjs  lib/index.mjs
   ```

   （当前规模：上游 `client.cjs` 316 行 → 本包 849 行，其中 `feat/system-notification` 单次提交即 +594/−132；`index.mjs` 为宿主半的命名空间兼容写法 + 通知配置 schema。）

2. **将来移植上游修复时做三方合并**

   ```sh
   # 把上游新版本另存为 upstream/v0.X.Y/ 后：
   git merge-file -p lib/client.cjs upstream/v0.2.2/lib/client.cjs upstream/v0.3.0/lib/client.cjs > merged.cjs
   ```

## 基线内容

| 文件 | 说明 |
|---|---|
| `lib/client.cjs` | 上游浏览器半（无系统通知、无通知中心导航；命名空间 `done-whale`） |
| `lib/index.mjs` | 上游宿主半（`settingsNamespace()` 具名导入写法，仅适配 ≤0.1.1-rc.2） |
| `package.json` `cordis.patch.yml` `LICENSE` `README.md` | 上游元数据与文档原文 |

## 注意

- 本目录**不参与构建、不参与运行**，仅为对照基线；修改它等于修改上游定义，请勿改动。
- 上游许可证：MIT（`LICENSE` 原文在此目录与仓库根各一份）。
