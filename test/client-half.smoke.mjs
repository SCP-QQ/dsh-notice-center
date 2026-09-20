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
 *  11. 待处理细化：审批带工具名（超长截断）、提问分选择/多选/填写/批量；字段缺失逐级降级
 *  12. 状态灯优先级：待处理（琥珀）压过完成（绿），并存时不被掩盖
 *  13. 设置页真的渲染一次：开关/滑杆/下拉/取色器各自写对字段，复位只清对应字段，
 *      分组行整行可点且开关/箭头各自拦住冒泡
 *  14. 设置页页脚：插件名 + 版本号，整块是指向仓库的链接（href/target/rel 正确），
 *      位置在「鲸鱼状态灯」分组行上方那一行（根节点的第一个子项），左对齐且不靠 marginTop:auto
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
/** en 字典：第 13 节断言 zh/en key 集合一致。 */
const stringsEn = {};
/** 第 13 节：apply 期间从 slots.register 截获的设置页组件。 */
let registeredSection;
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

/* ---------- 记录型桩 ----------
 * 这些桩不只是"能跑通"，而是把渲染结果记录下来，好让第 13 节真的能检查设置页：
 *   jsx/jsxs 记录节点而不返回 null；原语带 __primitive 标记便于在树里辨认；
 *   useState 对布尔初值返回 true（两个折叠分组一开始就展开，11 行子项才会都渲染）。
 * 为什么不用真 React：仓库里没有 react / react-dom，装一套只为跑测试会给这个零依赖
 * 插件增加开发依赖，而且跑的不是宿主那份 React。 */
const jsxNodes = [];
/** 第 13 节：布尔 state 的 setter 按调用顺序记下来，用来断言「整行点击折叠的是哪一组」。 */
const expandSetters = [];
const jsx = (type, props, key) => {
  const node = { type, props: props ?? {}, key };
  jsxNodes.push(node);
  return node;
};
const primitivesStub = new Proxy({}, {
  get: (_target, name) => {
    const marker = (props) => ({ primitive: String(name), props: props ?? {} });
    marker.__primitive = String(name);
    return marker;
  }
});
const requireMock = (name) => {
  if (name === "@deepseek-ai/dsh-client-ui-primitives") return primitivesStub;
  if (name === "react") return {
    /* 必须返回真实快照：否则设置页读到的 value 是 {}，所有行都落默认值，断言就没有意义。 */
    useSyncExternalStore: (_subscribe, getSnapshot) => getSnapshot(),
    useState: (init) => {
      const setter = (value) => setter.calls.push(value);
      setter.calls = [];
      if (typeof init === "boolean") expandSetters.push(setter);
      return [typeof init === "boolean" ? true : init, setter];
    },
    useRef: () => ({ current: void 0 }),
    useEffect: () => {}
  };
  if (name === "react/jsx-runtime") return { jsx, jsxs: jsx };
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
      Object.assign(stringsEn, dicts.en);
    }
  },
  slots: {
    inject: (_name, callback) => {
      callback();
    },
    /* 截获注册进来的设置页组件 —— 第 13 节要亲手渲染它（原先直接丢掉）。 */
    register: (_options, component) => {
      registeredSection = component;
      return {};
    }
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
const arisePending = (id, kind, title, extra) => {
  sessionState = { ...sessionState, byId: { ...sessionState.byId, [id]: row(id, title, false, false) } };
  /* extra 用来构造 domain 字段（toolName / questions），缺省时等价于「字段缺失」。 */
  pendingMap = new Map([[id, { key: id, kind, sessionId: id, ...(extra ?? {}) }]]);
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
check("同一次完成不重复发", notifications.length === 1, `发了 ${notifications.length} 条`);

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

/* ==================== 11. 待处理细化（审批工具名 / 提问形态） ==================== */
/* 第 5 节已覆盖「字段缺失」的降级：approval 无 toolName → 待审批，question 无 questions → 向你提问。 */

/* 11a 审批带工具名（官方 escalation 文案同样展示 toolName） */
reset();
arisePending("pd-tool", "approval", "改权限", { toolName: "Bash" });
await settle();
check("审批带工具名", notifications[0]?.options?.body === "待审批 · Bash", String(notifications[0]?.options?.body));

/* 11b 工具名超长截断，别撑破通知正文 */
reset();
arisePending("pd-tool-long", "approval", "长工具名", { toolName: "mcp__some-very-long-server-name__do-something-useful" });
await settle();
check("超长工具名截断到 32 字 + 省略号", notifications[0]?.options?.body === "待审批 · mcp__some-very-long-server-name_…", String(notifications[0]?.options?.body));

/* 11c 有选项＝选择、多选、无选项＝填写 */
reset();
arisePending("pd-choose", "question", "选择题", { questions: [{ id: "q1", question: "选哪个", options: [{ label: "A" }, { label: "B" }] }] });
await settle();
check("提问·有选项＝请你选择", notifications[0]?.options?.body === "请你选择", String(notifications[0]?.options?.body));

reset();
arisePending("pd-multi", "question", "多选题", { questions: [{ id: "q1", question: "选哪些", options: [{ label: "A" }], multiSelect: true }] });
await settle();
check("提问·多选＝请你多选", notifications[0]?.options?.body === "请你多选", String(notifications[0]?.options?.body));

reset();
arisePending("pd-fill", "question", "填空题", { questions: [{ id: "q1", question: "说说你的想法" }] });
await settle();
check("提问·无选项＝请你填写", notifications[0]?.options?.body === "请你填写", String(notifications[0]?.options?.body));

/* 11d 批量提问报数量；计划待审核仍走官方 kind，不受细化影响 */
reset();
arisePending("pd-batch", "question", "批量提问", { questions: [{ id: "q1", question: "a" }, { id: "q2", question: "b" }] });
await settle();
check("提问·多问题＝向你提问（2 个）", notifications[0]?.options?.body === "向你提问（2 个）", String(notifications[0]?.options?.body));

reset();
arisePending("pd-plan2", "plan-review", "计划", { questions: [{ id: "q1", question: "批准吗", detail: "# 计划", intent: { kind: "plan-review", approve: "Approve" } }] });
await settle();
check("计划待审核不受细化影响", notifications[0]?.options?.body === "计划待审核", String(notifications[0]?.options?.body));

/* ==================== 12. 状态灯优先级：待处理压过完成 ==================== */
/* 官方 sessionStatuses 的顺序是 pending > running > completed；favicon 是跨会话聚合，
   应用同一原则：任意会话「卡住等你」压过任意会话「跑完了」。 */
const GREEN_URI = "%2322C55E";
const AMBER_URI = "%23F59E0B";

/* 12a 只有完成 → 绿 */
reset();
sessionState = { byId: {}, current: void 0 };
pendingMap = new Map();
tick();
sessionState = { byId: { "pl-done": row("pl-done", "跑完了", true, false) }, current: void 0 };
tick();
check("只有完成 → 绿", linkEl.href.includes(GREEN_URI), linkEl.href.slice(0, 48));

/* 12b 只有待处理 → 琥珀 */
sessionState = { byId: { "pl-wait": row("pl-wait", "等我答复", false, false) }, current: void 0 };
pendingMap = new Map([["pl-wait", { key: "pl-wait", kind: "question", sessionId: "pl-wait", questions: [] }]]);
tick();
check("只有待处理 → 琥珀", linkEl.href.includes(AMBER_URI), linkEl.href.slice(0, 48));

/* 12c 两者并存 → 琥珀优先（修复前这里返回绿，审批被完成提醒掩盖） */
sessionState = { byId: {
  "pl-done2": row("pl-done2", "跑完了", true, false),
  "pl-wait2": row("pl-wait2", "等我审批", false, false)
}, current: void 0 };
pendingMap = new Map([["pl-wait2", { key: "pl-wait2", kind: "approval", sessionId: "pl-wait2", toolName: "Bash" }]]);
tick();
check("完成与待处理并存 → 琥珀优先（不被掩盖）", linkEl.href.includes(AMBER_URI), linkEl.href.slice(0, 48));

/* 12d 待处理处理完 → 回落到绿 */
pendingMap = new Map();
tick();
check("待处理清掉后回落到绿", linkEl.href.includes(GREEN_URI), linkEl.href.slice(0, 48));

/* ==================== 13. 设置页渲染（记录型桩） ==================== */
/* 让设置页组件真的执行一次并检查它产出的界面结构 —— 在此之前它从未被渲染过，
   所以「开关接错字段」这类 bug 完全抓不到。jsxNodes 在渲染期被 jsx/jsxs 填充。 */
jsxNodes.length = 0;
const t13 = ctx.locale.bind();
let sectionTree = null;
let renderError = null;
try {
  sectionTree = registeredSection({ scope, t: t13 });
} catch (error) {
  renderError = error;
}
check("截获到了设置页组件", typeof registeredSection === "function", typeof registeredSection);
check("设置页组件能渲染（不抛异常）", renderError === null, renderError === null ? "" : String(renderError));
check("组件返回了界面树", sectionTree !== null && typeof sectionTree === "object", String(sectionTree));

/* 5 个开关：label 与它写入的字段必须一一对应。每次只让目标字段可能翻真，
   这样「接错字段」会表现为别的字段被写、目标字段没动，断言直接抓住。 */
const switches = jsxNodes.filter((node) => typeof node.type === "function" && node.type.__primitive === "Switch");
const switchByLabel = (label) => switches.find((node) => node.props.label === label);
const switchLabels = switches.map((node) => node.props.label);
check("渲染出 5 个开关", switches.length === 5, switchLabels.join(" / "));
check("开关标题与顺序正确", JSON.stringify(switchLabels) === JSON.stringify(["鲸鱼状态灯", "系统通知", "自动隐藏", "前台提醒", "提示音"]), switchLabels.join(" / "));
const switchWrites = [
  ["鲸鱼状态灯", "colorsEnabled"],
  ["系统通知", "notifyEnabled"],
  ["自动隐藏", "notifyAutoHide"],
  ["前台提醒", "notifyForeground"],
  ["提示音", "notifySound"]
];
for (const [label, field] of switchWrites) {
  for (const [, f] of switchWrites) settingsValue[f] = false;
  switchByLabel(label)?.props.onChange(true);
  const flipped = switchWrites.filter(([, f]) => settingsValue[f] === true).map(([, f]) => f);
  check("开关「" + label + "」只写 " + field, flipped.length === 1 && flipped[0] === field, "实际写入: " + (flipped.join(",") || "(无)"));
}

/* 两个音效下拉：done / pending 不能接反（SoundPicker 节点靠 groups prop 辨认）。 */
const pickers = jsxNodes.filter((node) => node.props !== void 0 && "groups" in node.props && typeof node.props.onChange === "function");
check("渲染出 2 个音效下拉", pickers.length === 2, pickers.map((node) => node.props.kind).join(" / "));
for (const [kind, field] of [["done", "notifyDoneSound"], ["pending", "notifyPendingSound"]]) {
  const other = kind === "done" ? "notifyPendingSound" : "notifyDoneSound";
  delete settingsValue.notifyDoneSound;
  delete settingsValue.notifyPendingSound;
  pickers.find((node) => node.props.kind === kind)?.props.onChange("yup-01");
  check("音效下拉 " + kind + " 写的是 " + field, settingsValue[field] === "yup-01" && settingsValue[other] === void 0, JSON.stringify({ done: settingsValue.notifyDoneSound, pending: settingsValue.notifyPendingSound }));
}

/* 音量滑杆 */
const slider = jsxNodes.find((node) => node.type === "input" && node.props.type === "range");
delete settingsValue.notifyVolume;
slider?.props.onChange({ target: { value: "50" } });
check("音量滑杆写 notifyVolume", settingsValue.notifyVolume === 0.5, String(settingsValue.notifyVolume));

/* 三行颜色：取色器写入 + ↺ 只清对应字段 */
const colorInputs = jsxNodes.filter((node) => node.type === "input" && node.props.type === "color");
check("渲染出 3 个取色器", colorInputs.length === 3, colorInputs.map((node) => node.props["aria-label"]).join(" / "));
const colorWrites = [["完成", "green"], ["待处理", "amber"], ["默认色", "black"]];
for (const [label, field] of colorWrites) {
  for (const [, f] of colorWrites) delete settingsValue[f];
  colorInputs.find((node) => node.props["aria-label"] === label)?.props.onChange({ target: { value: "#123456" } });
  const written = colorWrites.filter(([, f]) => settingsValue[f] === "#123456").map(([, f]) => f);
  check("取色器「" + label + "」只写 " + field, written.length === 1 && written[0] === field, "实际写入: " + (written.join(",") || "(无)"));
}
settingsValue.green = "#111111";
settingsValue.amber = "#222222";
settingsValue.black = "#333333";
const resetButtons = jsxNodes.filter((node) => node.type === "button" && node.props["aria-label"] === t13("restore") && typeof node.props.onClick === "function");
check("渲染出 3 个复位按钮", resetButtons.length === 3, String(resetButtons.length));
resetButtons[0]?.props.onClick();
check("复位按钮只清对应颜色", settingsValue.green === void 0 && settingsValue.amber === "#222222" && settingsValue.black === "#333333", JSON.stringify({ green: settingsValue.green, amber: settingsValue.amber, black: settingsValue.black }));

/* 分组行整行可点：点标题行折叠/展开的是它自己那一组，不必去够最右边的箭头。 */
check("两个折叠分组各有一个展开态 setter", expandSetters.length === 2, String(expandSetters.length));
const groupRows = jsxNodes.filter((node) => node.type === "div" && typeof node.props.onClick === "function");
check("两个分组行整行可点", groupRows.length === 2, String(groupRows.length));
check("分组行显示为可点", groupRows.every((node) => node.props.style?.cursor === "pointer"), JSON.stringify(groupRows.map((node) => node.props.style?.cursor)));
const clearSetterCalls = () => expandSetters.forEach((setter) => { setter.calls.length = 0; });
/* setter 收到的是 updater 函数（调用点写的是 setColorsExpanded((current) => !current)），
   所以断言把它作用在当前值 true 上，验的是「语义上确实折成 false」而不是原始实参。 */
const appliedCalls = (setter) => setter.calls.map((value) => (typeof value === "function" ? value(true) : value));
clearSetterCalls();
groupRows[0]?.props.onClick();
check("点「鲸鱼状态灯」行只折叠这一组", expandSetters[0]?.calls.length === 1 && appliedCalls(expandSetters[0])[0] === false && expandSetters[1]?.calls.length === 0, JSON.stringify(expandSetters.map(appliedCalls)));
clearSetterCalls();
groupRows[1]?.props.onClick();
check("点「系统通知」行只折叠这一组", expandSetters[1]?.calls.length === 1 && appliedCalls(expandSetters[1])[0] === false && expandSetters[0]?.calls.length === 0, JSON.stringify(expandSetters.map(appliedCalls)));

/* 反例保护：开关与箭头必须各自拦住冒泡 —— 否则点开关会连带折叠，点箭头会折叠两次（等于没反应）。 */
const chevrons = jsxNodes.filter((node) => node.type === "button" && "aria-expanded" in node.props);
const switchGuards = jsxNodes.filter((node) => node.type === "span" && typeof node.props.onClick === "function" && node.props.children?.type?.__primitive === "Switch");
check("两个折叠箭头仍是可访问按钮", chevrons.length === 2, String(chevrons.length));
check("两个开关外层各有冒泡拦截", switchGuards.length === 2, String(switchGuards.length));
clearSetterCalls();
const guardEvent = { stopped: 0, stopPropagation() { this.stopped += 1; } };
switchGuards[0]?.props.onClick(guardEvent);
check("点开关不触发折叠", guardEvent.stopped === 1 && expandSetters.every((setter) => setter.calls.length === 0), JSON.stringify({ stopped: guardEvent.stopped, calls: expandSetters.map((setter) => setter.calls) }));
const chevronEvent = { stopped: 0, stopPropagation() { this.stopped += 1; } };
chevrons[0]?.props.onClick(chevronEvent);
check("点箭头只折叠一次（不叠加整行点击）", chevronEvent.stopped === 1 && expandSetters[0]?.calls.length === 1, JSON.stringify({ stopped: chevronEvent.stopped, calls: expandSetters.map((setter) => setter.calls) }));

/* ==================== 14. 设置页页脚（插件名 + 版本，点击开仓库） ==================== */
/* 页脚有两个只在渲染期能抓的坑：链接写没写对（href/target/rel），以及「位置」——它占的
   是「鲸鱼状态灯」上方那一行（官方 .options 自身没有标题），必须留在根节点子项的最前面，
   而不是随便挪到末尾；同时它不再是"贴底"那一版（没有 marginTop:auto）。 */
const manifestVersion = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).version;
const repoUrl = "https://github.com/SCP-QQ/dsh-notice-center";
const sectionChildren = sectionTree?.props?.children;
check("页脚是设置页第一项（「鲸鱼状态灯」上方那一行）", sectionChildren?.[0]?.props?.repo === repoUrl, JSON.stringify(sectionChildren?.[0]?.props?.name));
check("页脚下方紧邻「鲸鱼状态灯」分组行", typeof sectionChildren?.[1]?.props?.onClick === "function" && sectionChildren?.[1]?.props?.style?.cursor === "pointer", JSON.stringify(Object.keys(sectionChildren?.[1]?.props ?? {})));
check("页脚已不再是贴底版（根节点没有 minHeight 撑高）", sectionTree?.props?.style?.minHeight === void 0, JSON.stringify(sectionTree?.props?.style));
const footerNode = jsxNodes.find((node) => typeof node.type === "function" && node.props !== void 0 && typeof node.props.repo === "string");
check("设置页渲染出页脚组件", footerNode !== void 0);
check("页脚版本号 = package.json 的 version", footerNode?.props.version === manifestVersion, `${footerNode?.props.version} vs ${manifestVersion}`);
check("页脚链接指向仓库", footerNode?.props.repo === repoUrl, String(footerNode?.props.repo));
/* 记录型桩只记节点、不执行组件函数，所以这里显式把页脚渲染一次再检查它产出的链接。
   PluginFooter 内部的 useState 会把 setter 推进 expandSetters —— 上面所有关于
   expandSetters 的断言都已跑完，这里多推一次不影响任何结论。 */
jsxNodes.length = 0;
let footerError = null;
try {
  footerNode?.type(footerNode.props);
} catch (error) {
  footerError = error;
}
check("页脚能渲染（不抛异常）", footerError === null, String(footerError));
const footerWrap = jsxNodes.find((node) => node.type === "div" && node.props["data-plugin"] === "dsh-notice-center");
check("页脚左对齐且不靠 marginTop:auto", footerWrap?.props.style?.justifyContent === "flex-start" && footerWrap?.props.style?.marginTop === void 0, JSON.stringify(footerWrap?.props.style));
const repoLink = jsxNodes.find((node) => node.type === "a");
check("页脚链接新标签打开且带 noreferrer", repoLink?.props.href === repoUrl && repoLink?.props.target === "_blank" && repoLink?.props.rel === "noreferrer", JSON.stringify({ href: repoLink?.props.href, target: repoLink?.props.target, rel: repoLink?.props.rel }));
check("页脚显示插件名", jsxNodes.some((node) => node.type === "span" && node.props.children === t13("nav")), t13("nav"));
check("页脚显示版本号 v" + manifestVersion, jsxNodes.some((node) => node.type === "span" && node.props.children === "v" + manifestVersion), jsxNodes.filter((node) => node.type === "span").map((node) => String(node.props.children)).join(" / "));
check("页脚悬浮提示走 i18n（不是原始 key）", repoLink?.props.title === t13("footerRepoTitle") && t13("footerRepoTitle") !== "footerRepoTitle", String(repoLink?.props.title));

/* 文案：zh / en 字典 key 集合必须一致（防止只补中文） */
check("zh / en 文案 key 集合一致", JSON.stringify(Object.keys(strings).sort()) === JSON.stringify(Object.keys(stringsEn).sort()), "zh=" + Object.keys(strings).length + " en=" + Object.keys(stringsEn).length);
console.log(failed === 0 ? "\n全部通过" : `\n有 ${failed} 项失败`);
process.exit(failed === 0 ? 0 : 1);
