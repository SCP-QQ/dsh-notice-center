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
 *
 * 用法：node test/client-half.smoke.mjs
 * 退出码 0 = 全部通过；1 = 有失败项。
 */
import { readFileSync } from "node:fs";

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
  if (name === "react") return { useSyncExternalStore: () => ({}), useState: () => [void 0, () => {}] };
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
    bind: () => (key) => strings[key] ?? key,
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

console.log(failed === 0 ? "\n全部通过" : `\n有 ${failed} 项失败`);
process.exit(failed === 0 ? 0 : 1);
