# 音效素材（45 个 mp3）

本目录的 `*.mp3` 不是本项目原创，来源如下：

- 上游仓库：[anomalyco/opencode](https://github.com/anomalyco/opencode)
- 上游路径：`packages/ui/src/assets/audio/`
- 上游许可：MIT（与本插件一致）
- 抓取时间：2026-09-19（取自 opencode 的 web 端构建产物，文件名即插件音效 id）

音效包与条目（文件名 = `<包>-<序号>.mp3`）：

| 包 | 条目 | 个数 |
|---|---|---|
| alert | alert-01 … alert-10 | 10 |
| bip-bop | bip-bop-01 … bip-bop-10 | 10 |
| staplebops | staplebops-01 … staplebops-07 | 7 |
| nope | nope-01 … nope-12 | 12 |
| yup | yup-01 … yup-06 | 6 |

浏览器半把它们当作「音效库」列在下拉里（显示名与 opencode 官方设置页一致），
宿主半通过 `/notice-center-sounds/<文件名>` 提供读取。

**替换/新增音效**：把 mp3 放进本目录后，同步两处即可 ——
`lib/client.cjs` 的 `SOUND_PACKS`（决定下拉里出现什么）与
`test/client-half.smoke.mjs` 的 `SOUND_PACKS`（守住「库与文件一一对应」）。
