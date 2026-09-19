/**
 * 浏览器半冒烟测试 —— 只钉已经踩过的坑，不追求覆盖率。
 *
 * 覆盖（每条都对应一个真实故障或需求）：
 *   1. bundle 能自注册到 __ModuleLoader__ 并导出 apply / inject
 *   2. 总开关关闭 → 不发通知
 *   3. 页面在前台（可见 且 有焦点）→ 不发通知
 *   4. 页面不在前台 → 完成通知：标题＝会话名、正文＝「会话已完成」
 *   5. 通知**不带 tag**（同 tag 会被系统当「更新已有通知」静默替换，
 *      表现为「同一对话只有第一条会弹」——2026-09-18 实测踩过）
 *   6. 同一批多条聚合为一条通知（标题补「 +N」）
 *   7. 待处理通知正文＝交互类型；未知 kind 回退通用标题
 *   8. requireInteraction 跟随「自动隐藏」开关
 *   9. 「前台提醒」开关：默认前台不提醒，开启后前台也发
 *  10. 完成通知附本轮总用时：有起点才附、聚合不附
 *
 * 用法：node test/client-half.smoke.mjs
 * 退出码 0 = 全部通过；1 = 有失败项。
 */
import { readFileSync, readdirSync } from "node:fs";

let failed = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "[OK]  " : "[FAIL]"} ${name}${detail === "" ? "" : ` — ${detail}`}`);
  if (!ok) failed += 1;
};

/* ==================== 浏览器环境桩 ==================== */
let visibility = "hidden";
let focused = false;
const notifications = [];
const opened = [];
let sessionState = { byId: {}, current: void 0 };
let pendingMap = new Map();
const settingsValue = {};
const strings = {};
const listListeners = [];
const pendingListeners = [];
const scopeListeners = [];

class FakeNotification {
  constructor(title, options) {
    this.title = title;
    this.options = options;
    notifications.push(this);
  }
  close() {}
}
FakeNotification.permission = "granted";

const linkEl = { href: "http://127.0.0.1:3080/favicon.svg" };
const fakeDocument = {
  head: { querySelector: () => linkEl },
  querySelector: () => null,
  querySelectorAll: () => [],
  documentElement: {},
  addEventListener: () => {},
  removeEventListener: () => {},
  hasFocus: () => focused
};
Object.defineProperty(fakeDocument, "visibilityState", { get: () => visibility });

globalThis.Notification = FakeNotification;

/* 音频桩：记录被播放的音效 src 与音量（校验「按配置播放所选音效」）。 */
const playedAudio = [];
class FakeAudio {
  constructor(src) {
    this.src = src;
    this.volume = 1;
    playedAudio.push(this);
  }
  play() {
    this.playing = true;
    return Promise.resolve();
  }
  pause() {
    this.playing = false;
  }
}
globalThis.Audio = FakeAudio;
globalThis.document = fakeDocument;
globalThis.window = globalThis;
globalThis.addEventListener = () => {};
globalThis.removeEventListener = () => {};
globalThis.MutationObserver = class {
  observe() {}
  disconnect() {}
};
globalThis.requestAnimationFrame = (fn) => {
  fn();
  return 0;
};

/* 受控时钟：用时断言需要确定的毫秒差（客户端仅新增代码用 Date.now）。 */
const clock = { now: 0 };
Date.now = () => clock.now;

/* ==================== 加载 bundle ==================== */
const loaded = [];
globalThis.__ModuleLoader__ = { load: (record) => loaded.push(record) };
new Function(readFileSync(new URL("../lib/client.cjs", import.meta.url), "utf8"))();

const record = loaded[0];
check("bundle 自注册到 __ModuleLoader__", record !== void 0, `记录数 ${loaded.length}`);
check("bundle id = dsh-notice-center", record?.id === "dsh-notice-center", record?.id);

const primitivesStub = new Proxy({}, { get: () => () => null });
const requireMock = (name) => {
  if (name === "@deepseek-ai/dsh-client-ui-primitives") return primitivesStub;
  if (name === "react") return { useSyncExternalStore: () => ({}), useState: () => [void 0, () => {}], useRef: () => ({ current: void 0 }), useEffect: () => {} };
  if (name === "react/jsx-runtime") return { jsx: () => null, jsxs: () => null };
  return {};
};
const client = record.factory(requireMock);
check("导出 apply()", typeof client.apply === "function");
check("导出 inject 数组", Array.isArray(client.inject), JSON.stringify(client.inject));

/* ==================== 装配 ctx 并 apply ==================== */
const pendingStore = {
  getSnapshot: () => pendingMap,
  subscribe: (fn) => {
    pendingListeners.push(fn);
    return () => {};
  }
};
const scope = {
  getSnapshot: () => ({ value: settingsValue }),
  subscribe: (fn) => {
    scopeListeners.push(fn);
    return () => {};
  },
  set: (key, value) => {
    settingsValue[key] = value;
    scopeListeners.forEach((fn) => fn());
  },
  unset: (key) => {
    delete settingsValue[key];
    scopeListeners.forEach((fn) => fn());
  }
};
const ctx = {
  sessions: {
    list: {
      getSnapshot: () => sessionState,
      subscribe: (fn) => {
        listListeners.push(fn);
        return () => {};
      }
    },
    open: (id) => opened.push(id)
  },
  settingsScope: { bind: () => scope },
  inject: (deps, callback) => {
    if (deps.includes("uiSession")) callback({ uiSession: { pendingInteractions: pendingStore } });
  },
  effect: (fn) => {
    fn();
  },
  locale: {
    /* 支持 {name} 插值：正文带用时后，断言要读到真实文案而不是原始模板。 */
    bind: () => (key, params) => {
      const template = strings[key] ?? key;
      if (params === void 0) return template;
      return template.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match));
    },
    register: (_ns, dicts) => {
      Object.assign(strings, dicts.zh);
    }
  },
  slots: {
    inject: (_name, callback) => {
      callback();
    },
    register: () => ({})
  }
};

try {
  client.apply(ctx);
  check("apply() 执行无异常", true);
} catch (error) {
  check("apply() 执行无异常", false, String(error));
}

/* ==================== 驱动工具 ==================== */
const tick = () => listListeners.forEach((fn) => fn());
const settle = () => new Promise((resolve) => setTimeout(resolve, 400));
const reset = () => {
  notifications.length = 0;
};
const row = (id, title, completed, running) => ({ id, origin: "user", completed, running, displayTitle: title });
const runToDone = (id, title) => {
  sessionState = { ...sessionState, byId: { ...sessionState.byId, [id]: row(id, title, false, true) } };
  tick();
  sessionState = { ...sessionState, byId: { ...sessionState.byId, [id]: row(id, title, true, false) } };
  tick();
};
const arisePending = (id, kind, title) => {
  sessionState = { ...sessionState, byId: { ...sessionState.byId, [id]: row(id, title, false, false) } };
  pendingMap = new Map([[id, { key: id, kind, sessionId: id }]]);
  tick();
};

/* ==================== 1. 总开关关闭 ==================== */
reset();
settingsValue.notifyEnabled = false;
runToDone("c-off", "修复登录失败的问题");
await settle();
check("总开关关闭时不发通知", notifications.length === 0, `发了 ${notifications.length} 条`);

/* ==================== 2. 页面在前台 ==================== */
reset();
settingsValue.notifyEnabled = true;
visibility = "visible";
focused = true;
runToDone("c-front", "修复登录失败的问题");
await settle();
check("页面在前台时不发通知", notifications.length === 0, `发了 ${notifications.length} 条`);

/* ==================== 3. 不在前台 → 完成通知 ==================== */
reset();
visibility = "hidden";
focused = false;
runToDone("c-done", "修复登录失败的问题");
await settle();
check("不在前台时发一条完成通知", notifications.length === 1, `发了 ${notifications.length} 条`);
const done = notifications[0];
check("标题＝会话名", done?.title === "修复登录失败的问题", String(done?.title));
check("正文＝通知类型「会话已完成」", done?.options?.body === "会话已完成", String(done?.options?.body));
check("通知不带 tag（防「静默替换」）", done !== void 0 && !("tag" in done.options), JSON.stringify(Object.keys(done?.options ?? {})));
check("图标是鲸鱼 data URL", typeof done?.options?.icon === "string" && done.options.icon.startsWith("data:image/svg+xml,"), String(done?.options?.icon).slice(0, 32));

tick();
await settle();
check("同一会话同一类型只发一次", notifications.length === 1, `发了 ${notifications.length} 条`);

/* ==================== 4. 聚合 ==================== */
reset();
runToDone("agg-a", "会话A");
runToDone("agg-b", "会话B");
await settle();
check("同批多条聚合为一条通知", notifications.length === 1, `发了 ${notifications.length} 条`);
check("聚合时标题补「 +1」", notifications[0]?.title === "会话A +1", String(notifications[0]?.title));

/* ==================== 5. 待处理通知带交互类型 ==================== */
reset();
pendingMap = new Map();
tick();
arisePending("p-approval", "approval", "修复登录失败的问题");
await settle();
check("待处理·审批：标题＝会话名", notifications[0]?.title === "修复登录失败的问题", String(notifications[0]?.title));
check("待处理·审批：正文＝「待审批」", notifications[0]?.options?.body === "待审批", String(notifications[0]?.options?.body));

arisePending("p-question", "question", "补单元测试");
await settle();
check("待处理·提问：正文＝「向你提问」", notifications[1]?.options?.body === "向你提问", String(notifications[1]?.options?.body));

arisePending("p-plan", "plan-review", "重构通知模块");
await settle();
check("待处理·计划审核：正文＝「计划待审核」", notifications[2]?.options?.body === "计划待审核", String(notifications[2]?.options?.body));

arisePending("p-unknown", "some-future-domain", "未来域会话");
await settle();
check("未知交互类型回退「有交互等待处理」", notifications[3]?.options?.body === "有交互等待处理", String(notifications[3]?.options?.body));

/* ==================== 6. requireInteraction 跟随自动隐藏 ==================== */
reset();
settingsValue.notifyAutoHide = false;
runToDone("c-sticky", "常驻测试");
await settle();
check("关闭自动隐藏 → requireInteraction=true", notifications[0]?.options?.requireInteraction === true, String(notifications[0]?.options?.requireInteraction));

reset();
settingsValue.notifyAutoHide = true;
runToDone("c-autohide", "自动隐藏测试");
await settle();
check("开启自动隐藏 → requireInteraction=false", notifications[0]?.options?.requireInteraction === false, String(notifications[0]?.options?.requireInteraction));
check("提示音开关开启时静音系统提示音", notifications[0]?.options?.silent === true, String(notifications[0]?.options?.silent));

/* ==================== 7. 音效选择：按配置播放所选音效 ==================== */
reset();
playedAudio.length = 0;
settingsValue.notifyEnabled = true;
settingsValue.notifyDoneSound = "yup-03";
settingsValue.notifyVolume = 0.5;
runToDone("c-sound", "音效测试");
await settle();
check("完成通知播放所选音效", playedAudio.length === 1 && playedAudio[0].src.endsWith("/notice-center-sounds/yup-03.mp3"), JSON.stringify(playedAudio.map((audio) => audio.src)));
check("音效音量跟随配置", playedAudio[0]?.volume === 0.5, String(playedAudio[0]?.volume));

reset();
playedAudio.length = 0;
settingsValue.notifyPendingSound = "nope-07";
arisePending("p-sound", "approval", "待处理音效");
await settle();
check("待处理通知播放所选音效", playedAudio.length === 1 && playedAudio[0].src.endsWith("/notice-center-sounds/nope-07.mp3"), JSON.stringify(playedAudio.map((audio) => audio.src)));

reset();
playedAudio.length = 0;
delete settingsValue.notifyDoneSound;
runToDone("c-builtin", "默认音效");
await settle();
check("未配置时用内置合成音（不请求 mp3）", playedAudio.length === 0, JSON.stringify(playedAudio.map((audio) => audio.src)));

/* ==================== 8. 音效库与随包文件一一对应 ==================== */
const SOUND_PACKS = { alert: 10, "bip-bop": 10, staplebops: 7, nope: 12, yup: 6 };
const expectedSounds = [];
for (const [prefix, count] of Object.entries(SOUND_PACKS)) {
  for (let index = 1; index <= count; index += 1) expectedSounds.push(`${prefix}-${String(index).padStart(2, "0")}`);
}
const shippedSounds = readdirSync(new URL("../assets/audio/", import.meta.url)).filter((name) => name.endsWith(".mp3")).map((name) => name.replace(/\.mp3$/, ""));
check("音效库与随包文件一一对应", JSON.stringify([...shippedSounds].sort()) === JSON.stringify([...expectedSounds].sort()), `文件 ${shippedSounds.length} 个 / 库 ${expectedSounds.length} 个`);


/* ==================== 9. 前台也提醒（notifyForeground） ==================== */
/* 清场：绿灯回官方图标，避免前面用例的完成态干扰断言。 */
reset();
sessionState = { byId: {}, current: void 0 };
tick();

/* 9a 未配置＝原策略：前台保持安静。 */
reset();
visibility = "visible";
focused = true;
runToDone("fg-off", "前台默认策略");
await settle();
check("未配置时前台不提醒（保持原策略）", notifications.length === 0, "发了 " + notifications.length + " 条");

/* 9b 开启后：前台也发。 */
reset();
settingsValue.notifyForeground = true;
runToDone("fg-on", "前台提醒");
await settle();
check("开启前台也提醒后，前台也发通知", notifications.length === 1, "发了 " + notifications.length + " 条");
check("前台通知正文＝通知类型", notifications[0]?.options?.body === "会话已完成", String(notifications[0]?.options?.body));

/* 9c 主要场景：人停在当前会话（标签页可见且有焦点），却已离开屏幕。
   官方对选中会话不置 completed，通知只能由 running 边沿补齐；且不得因此点绿灯。 */
reset();
sessionState = { byId: {}, current: void 0 };
tick();
reset();
sessionState = { current: "sel-1", byId: { "sel-1": row("sel-1", "从选中会话等结果", false, true) } };
tick();
sessionState = { current: "sel-1", byId: { "sel-1": row("sel-1", "从选中会话等结果", false, false) } };
tick();
await settle();
check("选中会话在前台跑完也发通知（completed 始终不置位）", notifications.length === 1, "发了 " + notifications.length + " 条");
check("选中会话前台通知标题＝会话名", notifications[0]?.title === "从选中会话等结果", String(notifications[0]?.title));
check("前台完成不点绿灯（台前完成不记）", linkEl.href.endsWith("/favicon.svg"), linkEl.href);

/* 收尾：关掉开关，不影响收尾检查。 */
delete settingsValue.notifyForeground;

/* ==================== 10. 本轮用时（通知正文） ==================== */
/* 清场并切到后台：用时只在能算出起点时出现。Date.now 已换成受控时钟。 */
reset();
sessionState = { byId: {}, current: void 0 };
tick();
reset();
visibility = "hidden";
focused = false;

/* 10a 空闲 → 运行 → 完成：133000ms = 2分13秒 */
clock.now = 1000;
sessionState = { current: "dur-1", byId: { "dur-1": row("dur-1", "计时会话", false, false) } };
tick();
clock.now = 3000;
sessionState = { current: "dur-1", byId: { "dur-1": row("dur-1", "计时会话", false, true) } };
tick();
clock.now = 3000 + 133000;
sessionState = { current: "dur-1", byId: { "dur-1": row("dur-1", "计时会话", true, false) } };
tick();
await settle();
check("完成通知正文带本轮总用时（分+秒补零）", notifications[0]?.options?.body === "会话已完成 · 本轮总用时 2分13秒", String(notifications[0]?.options?.body));

/* 10b 不足 1 分钟只显示秒 */
reset();
sessionState = { byId: {}, current: void 0 };
tick();
reset();
clock.now = 500000;
sessionState = { current: "dur-2", byId: { "dur-2": row("dur-2", "短任务", false, false) } };
tick();
clock.now += 5000;
sessionState = { current: "dur-2", byId: { "dur-2": row("dur-2", "短任务", false, true) } };
tick();
clock.now += 9000;
sessionState = { current: "dur-2", byId: { "dur-2": row("dur-2", "短任务", true, false) } };
tick();
await settle();
check("不足一分钟只显示秒", notifications[0]?.options?.body === "会话已完成 · 本轮总用时 9秒", String(notifications[0]?.options?.body));

/* 10c 首次观察时已在跑 → 没有起点 → 正文不带用时（而不是显示 0 秒） */
reset();
sessionState = { byId: {}, current: void 0 };
tick();
reset();
clock.now = 900000;
runToDone("dur-3", "无起点会话");
await settle();
check("没有起点时不显示用时", notifications[0]?.options?.body === "会话已完成", String(notifications[0]?.options?.body));

/* 10d 同批聚合为一条时不附加用时（两条各自都有用时） */
reset();
sessionState = { byId: {}, current: void 0 };
tick();
reset();
clock.now = 2000000;
for (const id of ["agg-d-1", "agg-d-2"]) {
  sessionState = { ...sessionState, byId: { ...sessionState.byId, [id]: row(id, id, false, false) } };
  tick();
  clock.now += 2000;
  sessionState = { ...sessionState, byId: { ...sessionState.byId, [id]: row(id, id, false, true) } };
  tick();
  clock.now += 61000;
  sessionState = { ...sessionState, byId: { ...sessionState.byId, [id]: row(id, id, true, false) } };
  tick();
}
await settle();
check("同批两条聚合为一条", notifications.length === 1, "发了 " + notifications.length + " 条");
check("聚合标题补 +N", notifications[0]?.title === "agg-d-1 +1", String(notifications[0]?.title));
check("聚合时不附加用时", notifications[0]?.options?.body === "会话已完成", String(notifications[0]?.options?.body));
console.log(failed === 0 ? "\n全部通过" : `\n有 ${failed} 项失败`);
process.exit(failed === 0 ? 0 : 1);
