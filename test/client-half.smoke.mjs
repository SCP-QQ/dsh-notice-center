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
 *  15. 同一会话连续完成两次 → 弹两次（去重只管「同一次完成」；completed 路径与
 *      选中会话的 running 边沿路径都覆盖）
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
let sessionState = { byId: {} };
let pendingMap = new Map();
/**
 * 0.1.7：插件只认 uiSession.sessionStatus（Map<会话 id, {running, pendingInteraction,
 * completionUnread}>）—— 会话行的 completed / pendingInteraction 字段已删。这里把上面的
 * 测试模型（行上的 completed/running + pendingMap）投影成官方状态。
 */
const statusListeners = [];
let statusSnapshot = new Map();
const deriveStatus = () => {
  const next = new Map();
  for (const row of Object.values(sessionState.byId)) {
    const status = { running: row.running === true, completionUnread: row.completed === true };
    const pending = pendingMap.get(row.id);
    if (pending !== void 0) status.pendingInteraction = pending;
    next.set(row.id, status);
  }
  return next;
};
const sessionStatus = {
  getSnapshot: () => statusSnapshot,
  subscribe: (fn) => {
    statusListeners.push(fn);
    return () => {};
  }
};
const settingsValue = {};
const strings = {};
/** en 字典：第 13 节断言 zh/en key 集合一致。 */
const stringsEn = {};
/** 第 13 节：apply 期间从 slots.register 截获的设置页组件。 */
let registeredSection;
const listListeners = [];

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
/** 第 23 节：requestPermission 的调用记录 + 「用户在授权窗上选了什么」。
 *  真浏览器里这个请求必须由用户手势发起（否则根本不弹窗），这里能断言的正是**同步性**：
 *  调用发生的时机是不是在 onChange 返回之前。 */
FakeNotification.requests = [];
FakeNotification.answer = "granted";
FakeNotification.requestPermission = (callback) => {
  FakeNotification.requests.push(FakeNotification.permission);
  FakeNotification.permission = FakeNotification.answer;
  if (typeof callback === "function") callback(FakeNotification.answer);
  return Promise.resolve(FakeNotification.answer);
};

const linkEl = { href: "http://127.0.0.1:3080/favicon.svg" };
/* 宿主 index.html 挂两枚 icon：dark / light 各一枚，靠 media="(prefers-color-scheme)" 区分，
 * 浅色系统渲染的是第二枚。回归（2026-09-26「标签页图标一直默认色」）正是这么来的 ——
 * 代码只写 querySelector 命中的第一枚，浅色主题那枚永远没被碰过。 */
const linkElDark = { href: "http://127.0.0.1:3080/favicon-dark.svg" };
const iconLinks = [linkElDark, linkEl];
const createdLinks = [];

/* ==================== 导航图标桩 ====================
 * 官方 settings.section 的导航图标按 section id 硬编码，notice-center 回退成齿轮
 * （viewBox 0 0 16 16、stroke 型 path）；插件要把「通知中心」那颗 svg 换成主人给的
 * 铃铛（viewBox 0 0 1024 1024、合并后两块 fill path）。这里造一颗真 nav：
 * 2-path 的齿轮（常规路径）+ 1-path 的（走「只追加克隆」兜底）+ 一行不相干的（别动）。 */
const writes = { set: 0, remove: 0 };
const makeEl = (tagName, attrs = {}) => {
  const own = new Map(Object.entries(attrs));
  const children = [];
  return {
    tagName,
    children,
    textContent: "",
    getAttribute: (name) => (own.has(name) ? own.get(name) : null),
    setAttribute: (name, value) => {
      writes.set += 1;
      own.set(name, String(value));
    },
    removeAttribute: (name) => {
      writes.remove += 1;
      own.delete(name);
    },
    appendChild: (child) => {
      children.push(child);
      return child;
    },
    cloneNode: () => makeEl(tagName, Object.fromEntries(own)),
    querySelectorAll: (selector) => (selector === "path" ? children.filter((child) => child.tagName === "path") : []),
    querySelector: (selector) => (selector === "svg" ? children.find((child) => child.tagName === "svg") ?? null : null)
  };
};
const makeSvg = (viewBox, paths) => {
  const svg = makeEl("svg", { viewBox, width: "16", height: "16", fill: "none" });
  for (const attrs of paths) svg.appendChild(makeEl("path", attrs));
  return svg;
};
const makeNavButton = (label, svg) => {
  const button = makeEl("button");
  button.textContent = label;
  button.appendChild(svg);
  return button;
};
/* path 的 d 用占位串就够 —— 断言的是「被换掉」，不是官方齿轮的真实矢量数据。 */
const gearSvg = makeSvg("0 0 16 16", [
  { d: "M0 0 gear-1", stroke: "currentColor" },
  { d: "M0 0 gear-2" }
]);
const singleSvg = makeSvg("0 0 16 16", [{ d: "M0 0 single" }]);
const otherSvg = makeSvg("0 0 16 16", [{ d: "M0 0 other" }]);
const navButtons = [
  makeNavButton("通知中心", gearSvg),
  makeNavButton("通知中心", singleSvg),
  makeNavButton("别的设置项", otherSvg)
];
const navEl = { querySelectorAll: (selector) => (selector === "button" ? navButtons : []) };

/** 假 document 的事件登记表：第 24 节要手动触发"用户的第一次交互"（pointerdown / keydown）。 */
const documentListeners = new Map();
const fakeDocument = {
  head: {
    querySelector: () => iconLinks[0] ?? null,
    querySelectorAll: () => [...iconLinks],
    appendChild: (element) => {
      createdLinks.push(element);
      iconLinks.push(element);
      return element;
    }
  },
  /* 插件只在「页面一枚 icon 都没有」时走 createElement 自建。 */
  createElement: (tagName) => ({ tagName, rel: "", type: "", href: "" }),
  /* 全项目只有导航图标这一处用 document.querySelector，其余选择器一律 null。 */
  querySelector: (selector) => (selector === '[role="dialog"] nav' ? navEl : null),
  querySelectorAll: () => [],
  documentElement: {},
  addEventListener: (type, fn) => {
    const list = documentListeners.get(type) ?? [];
    list.push(fn);
    documentListeners.set(type, list);
  },
  removeEventListener: (type, fn) => {
    const list = documentListeners.get(type);
    if (list === void 0) return;
    const index = list.indexOf(fn);
    if (index >= 0) list.splice(index, 1);
  },
  hasFocus: () => focused
};
Object.defineProperty(fakeDocument, "visibilityState", { get: () => visibility });
/** 手动触发一次 document 上的事件（模拟用户交互 / 可见性变化）。 */
const fireDocument = (type, event = {}) => {
  for (const fn of [...(documentListeners.get(type) ?? [])]) fn(event);
};

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
let navIconObserverCallback = null;
globalThis.MutationObserver = class {
  constructor(callback) {
    navIconObserverCallback = callback;
  }
  observe() {}
  disconnect() {}
};
/* rAF 全项目只有导航图标在用：改成入队、由测试手动 flush —— 真浏览器里 rAF 一定在
   apply() 同步跑完（含 locale.register）之后才触发，同步立即执行会拿到还没注册的文案。 */
const rafQueue = [];
globalThis.requestAnimationFrame = (callback) => {
  rafQueue.push(callback);
  return 0;
};
const flushRaf = () => {
  while (rafQueue.length > 0) rafQueue.shift()();
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
/** 第 18 节：以 undefined 为初值的 useState（音量回显草稿）的 setter —— 断言「当帧先画草稿」。 */
const valueSetters = [];
/** 第 22 节：以对象为初值的 useState（每字段写入态 busy/failed）的 setter —— 断言官方
 *  DeveloperToolsRow 那套「写在途禁用 + 失败行内报错」。全组件只有它一个对象初值 state。 */
const flagSetters = [];
/** 第 23 节：以字符串为初值的 useState（通知权限态 granted/denied/default）的 setter。 */
const permissionSetters = [];
const jsx = (type, props, key) => {
  const node = { type, props: props ?? {}, key };
  jsxNodes.push(node);
  return node;
};
/* 宿主静态模块表里 primitives 的**真名**（@deepseek-ai/dsh-client-ui-primitives@0.1.7-rc.2
 * 的导出节选：图标命名是 Icon<Name>Outline<Regular|Medium>，没有 `…14` 那一套）。
 * 名单外的成员直接抛错 —— 旧桩对任何名字都造一个假组件，于是「宿主根本没有这个
 * 导出」的白屏（IconChevronDownOutline14 / IconRefreshOutline14）一路绿灯放行，
 * 设置页在真宿主上是空的、测试却全绿。新增 primitive 引用前先在宿主包里确认导出。 */
const primitivesExports = new Set([
  "Switch",
  "Tooltip",
  "IconChevronDownOutlineRegular",
  "IconRefreshOutlineRegular",
  "IconQuestionOutlineRegular",
  "IconWarningOutlineRegular"
]);
const primitivesStub = new Proxy({}, {
  get: (_target, name) => {
    if (typeof name === "string" && !primitivesExports.has(name)) {
      throw new Error(`host primitives has no export "${name}"`);
    }
    const marker = (props) => ({ primitive: String(name), props: props ?? {} });
    marker.__primitive = String(name);
    return marker;
  }
});
/** 设置页 hook 调用计数（第 15 节：hook 数量不得随 status 变化，否则 React 抛错白屏）。 */
const hookCalls = { count: 0 };
/** 假 BroadcastChannel：默认每个实例一条独立总线（多个测试实例互不串台），
 *  需要模拟「另一个标签页」时往实例的 bus 里 post 消息即可（第 20 节）。 */
const fakeChannels = [];
const makeBus = () => {
  const listeners = new Set();
  return {
    post(message) {
      for (const fn of [...listeners]) fn({ data: message });
    },
    add(fn) {
      listeners.add(fn);
    },
    remove(fn) {
      listeners.delete(fn);
    }
  };
};
class FakeBroadcastChannel {
  constructor(name) {
    this.name = name;
    this.bus = makeBus();
    this.sent = [];
    this.handler = void 0;
    fakeChannels.push(this);
  }
  postMessage(message) {
    this.sent.push(message);
    this.bus.post(message);
  }
  addEventListener(type, fn) {
    if (type === "message") {
      this.handler = fn;
      this.bus.add(fn);
    }
  }
  removeEventListener(_type, fn) {
    this.bus.remove(fn);
  }
  close() {
    if (this.handler !== void 0) this.bus.remove(this.handler);
  }
}
globalThis.BroadcastChannel = FakeBroadcastChannel;
/** 假 localStorage：只给假 store 用，让「刷新后绿灯还在」可断言。 */
const fakeStorage = new Map();
/** 假 store：与官方 createSnapshotStore 同形（getSnapshot / set / update / subscribe），
 *  persist 名字即存储键 —— 官方注释说明 persist key 就是存储身份，这里照此实现。 */
const clientStoreStub = {
  createSnapshotStore: (init, opts) => {
    const key = opts?.persist?.name;
    const listeners = new Set();
    let state = key !== void 0 && fakeStorage.has(key) ? fakeStorage.get(key) : init;
    return {
      getSnapshot: () => state,
      set: (next) => {
        state = next;
        if (key !== void 0) fakeStorage.set(key, next);
        for (const fn of [...listeners]) fn();
      },
      update: (mutator) => {
        const draft = JSON.parse(JSON.stringify(state));
        mutator(draft);
        state = draft;
        if (key !== void 0) fakeStorage.set(key, draft);
        for (const fn of [...listeners]) fn();
      },
      subscribe: (fn) => {
        listeners.add(fn);
        return () => listeners.delete(fn);
      }
    };
  }
};
const requireMock = (name) => {
  if (name === "@deepseek-ai/dsh-client-ui-primitives") return primitivesStub;
  if (name === "@deepseek-ai/dsh-client-store") return clientStoreStub;
  if (name === "react") return {
    /* 必须返回真实快照：否则设置页读到的 value 是 {}，所有行都落默认值，断言就没有意义。 */
    useSyncExternalStore: (_subscribe, getSnapshot) => {
      hookCalls.count += 1;
      return getSnapshot();
    },
    useState: (init) => {
      hookCalls.count += 1;
      const setter = (value) => setter.calls.push(value);
      setter.calls = [];
      if (typeof init === "boolean") expandSetters.push(setter);
      if (init === void 0) valueSetters.push(setter); /* 回显草稿（全配置共用，唯一初值为 undefined 的 state） */
      if (init !== null && typeof init === "object") flagSetters.push(setter); /* 写入态 busy/failed */
      if (typeof init === "string") permissionSetters.push(setter); /* 通知权限态 */
      return [typeof init === "boolean" ? true : init, setter];
    },
    useRef: () => {
      hookCalls.count += 1;
      return { current: void 0 };
    },
    useEffect: () => {
      hookCalls.count += 1;
    }
  };
  if (name === "react/jsx-runtime") return { jsx, jsxs: jsx };
  return {};
};
const client = record.factory(requireMock);
check("导出 apply()", typeof client.apply === "function");
check("导出 inject 数组", Array.isArray(client.inject), JSON.stringify(client.inject));

/* ==================== 装配 ctx 并 apply ==================== */
const scope = {
  /* 0.1.7 的快照形状：status / value / writable / revision。 */
  getSnapshot: () => ({ status: "ready", value: settingsValue, writable: true, revision: 1 }),
  subscribe: (fn) => {
    scopeListeners.push(fn);
    return () => {};
  },
  set: (key, value) => {
    settingsValue[key] = value;
    scopeListeners.forEach((fn) => fn());
    return Promise.resolve(true);
  },
  unset: (key) => {
    delete settingsValue[key];
    scopeListeners.forEach((fn) => fn());
    return Promise.resolve(true);
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
  configForms: { get: () => scope },
  inject: (deps, callback) => {
    if (deps.includes("uiSession")) callback({ uiSession: { sessionStatus } });
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
  flushRaf(); /* 导航图标在 apply 的最后一帧才画（此时 locale 已注册） */
  check("apply() 执行无异常", true);
} catch (error) {
  check("apply() 执行无异常", false, String(error));
}

/* ==================== 驱动工具 ==================== */
/* 每次状态推进都要先发布官方 status 快照，再通知会话列表订阅者 —— 插件两个都订阅。 */
const tick = () => {
  statusSnapshot = deriveStatus();
  statusListeners.forEach((fn) => fn());
  listListeners.forEach((fn) => fn());
};
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

/* ==================== 3b. 同一会话连续完成两次 → 弹两次 ==================== */
/* 去重键只管「同一次完成事件」：会话重新运行会让 completed 归 false，键随即被清掉，
   所以再次跑完必须重新提醒。曾经把它误读成「同一会话只提醒一次」（2026-09-20 澄清）。 */
reset();
runToDone("c-twice", "修复登录失败的问题");
await settle();
check("第一次完成发一条", notifications.length === 1, `发了 ${notifications.length} 条`);
runToDone("c-twice", "修复登录失败的问题");
await settle();
check("同一会话再次完成要再发一条（去重只管同一次完成）", notifications.length === 2, `发了 ${notifications.length} 条`);

/* 3c. running 边沿路径：同一会话连续跑完两次要发两条（与 3b 的 completed 跃迁同语义）。
   0.1.7 已没有「当前选中会话」这个行字段（SessionListState.current 已删），
   running 边沿对每个主会话一视同仁 —— favicon 本来就是跨会话聚合。 */
reset();
sessionState = { byId: {} };
tick();
reset();
sessionState = { byId: { "c-sel-twice": row("c-sel-twice", "选中的会话", false, true) } };
tick();
sessionState = { byId: { "c-sel-twice": row("c-sel-twice", "选中的会话", false, false) } };
tick();
await settle();
check("跑完发一条", notifications.length === 1, `发了 ${notifications.length} 条`);
sessionState = { byId: { "c-sel-twice": row("c-sel-twice", "选中的会话", false, true) } };
tick();
sessionState = { byId: { "c-sel-twice": row("c-sel-twice", "选中的会话", false, false) } };
tick();
await settle();
check("再次跑完要再发一条", notifications.length === 2, `发了 ${notifications.length} 条`);

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
sessionState = { byId: {} };
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
   0.1.7 的 completionUnread 只标「主视图之外的停顿」，所以这里的通知由 running 边沿补齐；
   但台前完成不得因此点绿灯（绿灯只记没看着时跑完，V0-02）。 */
reset();
sessionState = { byId: {} };
tick();
reset();
sessionState = { byId: { "sel-1": row("sel-1", "从选中会话等结果", false, true) } };
tick();
sessionState = { byId: { "sel-1": row("sel-1", "从选中会话等结果", false, false) } };
tick();
await settle();
check("前台跑完也发通知（completionUnread 不置位）", notifications.length === 1, "发了 " + notifications.length + " 条");
check("前台通知标题＝会话名", notifications[0]?.title === "从选中会话等结果", String(notifications[0]?.title));
check("前台完成不点绿灯（台前完成不记）", linkEl.href.endsWith("/favicon.svg"), linkEl.href);

/* 收尾：关掉开关，不影响收尾检查。 */
delete settingsValue.notifyForeground;

/* ==================== 10. 本轮用时（通知正文） ==================== */
/* 清场并切到后台：用时只在能算出起点时出现。Date.now 已换成受控时钟。 */
reset();
sessionState = { byId: {} };
tick();
reset();
visibility = "hidden";
focused = false;

/* 10a 空闲 → 运行 → 完成：133000ms = 2分13秒 */
clock.now = 1000;
sessionState = { byId: { "dur-1": row("dur-1", "计时会话", false, false) } };
tick();
clock.now = 3000;
sessionState = { byId: { "dur-1": row("dur-1", "计时会话", false, true) } };
tick();
clock.now = 3000 + 133000;
sessionState = { byId: { "dur-1": row("dur-1", "计时会话", true, false) } };
tick();
await settle();
check("完成通知正文带本轮总用时（分+秒补零）", notifications[0]?.options?.body === "会话已完成 · 本轮总用时 2分13秒", String(notifications[0]?.options?.body));

/* 10b 不足 1 分钟只显示秒 */
reset();
sessionState = { byId: {} };
tick();
reset();
clock.now = 500000;
sessionState = { byId: { "dur-2": row("dur-2", "短任务", false, false) } };
tick();
clock.now += 5000;
sessionState = { byId: { "dur-2": row("dur-2", "短任务", false, true) } };
tick();
clock.now += 9000;
sessionState = { byId: { "dur-2": row("dur-2", "短任务", true, false) } };
tick();
await settle();
check("不足一分钟只显示秒", notifications[0]?.options?.body === "会话已完成 · 本轮总用时 9秒", String(notifications[0]?.options?.body));

/* 10c 首次观察时已在跑 → 没有起点 → 正文不带用时（而不是显示 0 秒） */
reset();
sessionState = { byId: {} };
tick();
reset();
clock.now = 900000;
runToDone("dur-3", "无起点会话");
await settle();
check("没有起点时不显示用时", notifications[0]?.options?.body === "会话已完成", String(notifications[0]?.options?.body));

/* 10d 同批聚合为一条时不附加用时（两条各自都有用时） */
reset();
sessionState = { byId: {} };
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
sessionState = { byId: {} };
pendingMap = new Map();
tick();
sessionState = { byId: { "pl-done": row("pl-done", "跑完了", true, false) } };
tick();
check("只有完成 → 绿", linkEl.href.includes(GREEN_URI), linkEl.href.slice(0, 48));
/* 回归：宿主两枚 icon 都得改 —— 只改第一枚的话，浅色系统渲染第二枚，状态灯永远看不见。 */
check("两枚 icon（dark/light）都换上绿", linkEl.href.includes(GREEN_URI) && linkElDark.href.includes(GREEN_URI), JSON.stringify([linkElDark.href.slice(0, 40), linkEl.href.slice(0, 40)]));

/* 12b 只有待处理 → 琥珀 */
sessionState = { byId: { "pl-wait": row("pl-wait", "等我答复", false, false) } };
pendingMap = new Map([["pl-wait", { key: "pl-wait", kind: "question", sessionId: "pl-wait", questions: [] }]]);
tick();
check("只有待处理 → 琥珀", linkEl.href.includes(AMBER_URI), linkEl.href.slice(0, 48));

/* 12c 两者并存 → 琥珀优先（修复前这里返回绿，审批被完成提醒掩盖） */
sessionState = { byId: {
  "pl-done2": row("pl-done2", "跑完了", true, false),
  "pl-wait2": row("pl-wait2", "等我审批", false, false)
} };
pendingMap = new Map([["pl-wait2", { key: "pl-wait2", kind: "approval", sessionId: "pl-wait2", toolName: "Bash" }]]);
tick();
check("完成与待处理并存 → 琥珀优先（不被掩盖）", linkEl.href.includes(AMBER_URI), linkEl.href.slice(0, 48));

/* 12d 待处理处理完 → 回落到绿 */
pendingMap = new Map();
tick();
check("待处理清掉后回落到绿", linkEl.href.includes(GREEN_URI), linkEl.href.slice(0, 48));

/* 12e 清场 → 回到官方原样：两枚各还原各的原 href（不能把 dark 的原值写到 light 上） */
sessionState = { byId: {} };
tick();
check("清场后两枚 icon 各自还原原样", linkEl.href.endsWith("/favicon.svg") && linkElDark.href.endsWith("/favicon-dark.svg"), JSON.stringify([linkElDark.href, linkEl.href]));

/* 12f 页面一枚 icon 都没有 → 自建一枚再上色（静默什么都不改 = 又一种「一直默认色」） */
const keptIcons = iconLinks.slice();
iconLinks.length = 0;
createdLinks.length = 0;
sessionState = { byId: { "pl-noicon": row("pl-noicon", "跑完了", true, false) } };
tick();
check("一枚 icon 都没有时自建一枚并上色", createdLinks.length === 1 && createdLinks[0].href.includes(GREEN_URI), JSON.stringify({ created: createdLinks.length, href: createdLinks[0]?.href?.slice(0, 40) }));
/* 收场：清掉自建的那枚、列表还原成原来的两枚，别影响后面的用例 */
iconLinks.length = 0;
iconLinks.push(...keptIcons);
createdLinks.length = 0;
sessionState = { byId: {} };
tick();

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
/** 把 setter.calls 按 React 语义依次归约（函数式更新要吃上一轮 state）—— 回显草稿是 {字段: 值}，
 *  直接看 calls 只会看到一串 updater 函数。 */
const reduce = (setter, initial = void 0) => setter.calls.reduce((state, call) => (typeof call === "function" ? call(state) : call), initial);
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
/* ==================== 15. 0.1.7 设置 API 迁移（2026-09-26 新增） ==================== */
/* 旧 API 在 0.1.7 已彻底删除：inject 里必须换成 configForms，写错服务名浏览器半整个不加载。 */
check("inject 用 configForms（settingsScope 在 0.1.7 已删除）", client.inject.includes("configForms") && !client.inject.includes("settingsScope"), JSON.stringify(client.inject));

/* 快照的 status / writable：不可读写时只给说明，不画一堆写了不生效的控件。 */
for (const [snapshot, key] of [
  [{ status: "unavailable", value: settingsValue, writable: false }, "settingsUnavailable"],
  [{ status: "ready", value: settingsValue, writable: false }, "settingsReadOnly"]
]) {
  jsxNodes.length = 0;
  let tree = null;
  let error = null;
  try {
    tree = registeredSection({ scope: Object.assign({}, scope, { getSnapshot: () => snapshot }), t: t13 });
  } catch (caught) {
    error = caught;
  }
  const text = tree !== null && typeof tree === "object" ? tree.props?.children : void 0;
  const interactive = jsxNodes.filter((node) => node.type === "input" || (typeof node.type === "function" && node.type.__primitive === "Switch")).length;
  check("status=" + snapshot.status + " / writable=false → 只给说明（" + key + "）", error === null && text === t13(key) && interactive === 0, String(text) + " | 交互控件 " + interactive);
}
jsxNodes.length = 0;
const loadingTree = registeredSection({ scope: Object.assign({}, scope, { getSnapshot: () => ({ status: "loading", value: void 0, writable: false }) }), t: t13 });
check("status=loading → 不渲染（不先用默认值画一遍再跳变）", loadingTree === null && jsxNodes.length === 0, String(loadingTree));

/* 写入返回值：set/unset 在 0.1.7 返回 Promise<boolean> —— 被拒（false）或传输故障都不能同步抛。 */
let writeError = null;
try {
  jsxNodes.length = 0;
  registeredSection({ scope: Object.assign({}, scope, { set: () => Promise.reject(new Error("transport down")), unset: () => Promise.resolve(false) }), t: t13 });
  for (const node of jsxNodes.filter((item) => item.type === "button" && typeof item.props.onClick === "function")) node.props.onClick({ stopPropagation() {} });
} catch (caught) {
  writeError = caught;
}
await settle();
check("写入被拒 / 传输失败都不会同步抛异常", writeError === null, String(writeError));
/* 回归（2026-09-26 白屏事故）：所有 hook 必须在 status 分支之前无条件跑完。
   loading 那次提前 return 过，React 在 ready 那次渲染抛 "Rendered more hooks than during
   the previous render"，插槽的错误边界把整页吞成空白 —— 这里对齐两次渲染的 hook 数量。 */
hookCalls.count = 0;
jsxNodes.length = 0;
registeredSection({ scope: Object.assign({}, scope, { getSnapshot: () => ({ status: "loading", value: void 0, writable: false }) }), t: t13 });
const loadingHooks = hookCalls.count;
hookCalls.count = 0;
jsxNodes.length = 0;
registeredSection({ scope, t: t13 });
const readyHooks = hookCalls.count;
check("loading 与 ready 的 hook 数量一致（提前 return 会让整页白屏）", loadingHooks === readyHooks && readyHooks >= 4, "loading=" + loadingHooks + " ready=" + readyHooks);
/* ==================== 16. 导航图标换成主人给的铃铛 ====================
   回归（2026-09-26）：官方导航图标按 section id 硬编码、notice-center 只有齿轮，
   插件靠改写那颗 svg 的 path 属性换图 —— 只改属性、不增删 React 管的节点，
   幂等由「画过就整块跳过」保证（否则每次写属性都会再触发 observer，rAF 死循环）。 */
const gearPaths = gearSvg.querySelectorAll("path");
check("导航图标 viewBox 换成 1024 坐标系", gearSvg.getAttribute("viewBox") === "0 0 1024 1024", String(gearSvg.getAttribute("viewBox")));
check("导航图标尺寸仍与官方一致（16×16）", gearSvg.getAttribute("width") === "16" && gearSvg.getAttribute("height") === "16", gearSvg.getAttribute("width") + "×" + gearSvg.getAttribute("height"));
check("第 1 块 path＝铃身＋底座（同色两块合并）", String(gearPaths[0]?.getAttribute("d")).startsWith("M921.6 880.64") && String(gearPaths[0]?.getAttribute("d")).includes("M512 1024"), String(gearPaths[0]?.getAttribute("d")).slice(0, 24));
check("铃身填色跟随主题（currentColor）", gearPaths[0]?.getAttribute("fill") === "currentColor", String(gearPaths[0]?.getAttribute("fill")));
check("官方 stroke 画法已清掉（不清会再描一圈）", gearPaths[0]?.getAttribute("stroke") === null, String(gearPaths[0]?.getAttribute("stroke")));
check("第 2 块 path＝蓝色高光 #3399FF", gearPaths[1]?.getAttribute("fill") === "#3399FF" && String(gearPaths[1]?.getAttribute("d")).startsWith("M665.6 353.6896"), String(gearPaths[1]?.getAttribute("fill")));
check("官方 path 只有 1 个时只追加克隆、不删节点", singleSvg.querySelectorAll("path").length === 2, String(singleSvg.querySelectorAll("path").length));
check("不认识的导航行一律不动", otherSvg.querySelectorAll("path")[0]?.getAttribute("d") === "M0 0 other" && otherSvg.getAttribute("viewBox") === "0 0 16 16", String(otherSvg.querySelectorAll("path")[0]?.getAttribute("d")));
const writesAfterDraw = writes.set;
navIconObserverCallback?.();
flushRaf();
check("重复调度不再写属性（防 rAF 死循环）", writes.set === writesAfterDraw, `多写了 ${writes.set - writesAfterDraw} 次`);

/* ==================== 17. 写入被宿主瞬时拒绝 → 自动重试 ====================
   回归（2026-09-26 用户反馈「音量点击有时生效有时不生效」）：宿主
   dsh-config-editor.edit 在条目正在 reload、fiber 不是 ACTIVE、文件锁被占时抛错，
   revision 冲突则回 false —— 都是瞬时的，而 set/unset 是幂等标量赋值，重试即自愈。
   三条约束一起钉：首次同步发起（不推迟调用点的即时反馈）、抛错与被拒都要重试、
   同字段被新值取代时放弃旧重试（否则 200ms 后旧值会把新值盖回去）。 */
check("重试用例拿到音量滑杆", slider !== void 0 && typeof slider.props.onChange === "function", String(slider));
const realScopeSet = scope.set;

/* a) 宿主抛错（例：Configuration plugin is no longer active）→ 重试后落盘 */
let rejectCalls = 0;
scope.set = (key, value) => {
  rejectCalls += 1;
  if (rejectCalls === 1) return Promise.reject(new Error("Configuration plugin is no longer active"));
  return realScopeSet(key, value);
};
delete settingsValue.notifyVolume;
slider.props.onChange({ target: { value: "55" } });
check("首次写入同步发起（不等微任务）", rejectCalls === 1, String(rejectCalls));
await new Promise((resolve) => setTimeout(resolve, 400));
check("写入抛错后自动重试并落盘", settingsValue.notifyVolume === 0.55 && rejectCalls >= 2, JSON.stringify({ value: settingsValue.notifyVolume, calls: rejectCalls }));

/* b) 宿主回 false（revision 冲突）→ 同样重试 */
let conflictCalls = 0;
scope.set = (key, value) => {
  conflictCalls += 1;
  if (conflictCalls === 1) return Promise.resolve(false);
  return realScopeSet(key, value);
};
delete settingsValue.notifyVolume;
slider.props.onChange({ target: { value: "30" } });
await new Promise((resolve) => setTimeout(resolve, 400));
check("写入被拒（false）后自动重试并落盘", settingsValue.notifyVolume === 0.3 && conflictCalls >= 2, JSON.stringify({ value: settingsValue.notifyVolume, calls: conflictCalls }));

/* c) 失败的写入还在等重试，同字段又来了新值 → 放弃旧重试，不能把新值盖回去 */
let staleCalls = 0;
scope.set = (key, value) => {
  staleCalls += 1;
  if (value === 0.35) return Promise.resolve(false);
  return realScopeSet(key, value);
};
slider.props.onChange({ target: { value: "35" } }); /* 必失败 → 排在 200ms 后的重试 */
slider.props.onChange({ target: { value: "65" } }); /* 随后的新值 */
await new Promise((resolve) => setTimeout(resolve, 900));
check("同字段新值胜出（旧重试被丢弃）", settingsValue.notifyVolume === 0.65, String(settingsValue.notifyVolume));
check("旧值 0.35 没有被重试写回", staleCalls === 2, String(staleCalls));
scope.set = realScopeSet;

/* ==================== 18. 拖动滑杆：手势内合并写 + 当帧回显草稿 ====================
   2026-09-26 23:00 现场取证（.watch-patch.log 逐笔记录 profile 的 cordis.patch.yml）：
   每笔 set 都要重写整份 patch 并热重载插件条目，实测约 1s/笔；而原生滑杆每挪一格就发
   一次 input，一次拖动几十笔全排进写队列，回显被拖到好几秒之后，受控 value 又一直被旧
   快照拽回去 —— 用户看到的就是「改音量没反应、等半天才变、还一直往回掉（每次固定 -5%）」。
   这里钉住两条：手势内只落「首笔立即写 + 静默后补一笔」；回显当帧先出草稿，不等宿主往返。 */
jsxNodes.length = 0;
registeredSection({ scope, t: t13 });
const slider18 = jsxNodes.find((node) => node.type === "input" && node.props.type === "range");
const draftSetter = valueSetters[valueSetters.length - 1];
check("拖动用例拿到音量滑杆与草稿 setter", slider18 !== void 0 && typeof draftSetter === "function", `slider=${slider18 !== void 0} setter=${typeof draftSetter}`);

let volumeWrites = 0;
const realSet18 = scope.set;
scope.set = (key, value) => {
  if (key === "notifyVolume") volumeWrites += 1;
  return realSet18(key, value);
};

/* 一次连发：模拟拖动，5 个 input 事件挤在同一个手势里 */
for (const v of ["20", "25", "30", "35", "40"]) slider18.props.onChange({ target: { value: v } });
check("手势内首笔立即写（不是逐 input 写 5 笔）", volumeWrites === 1, `共写 ${volumeWrites} 笔`);
check("拖动当帧写回显草稿（回显不等宿主往返）", reduce(draftSetter)?.notifyVolume === 0.4, JSON.stringify(reduce(draftSetter)));
await new Promise((resolve) => setTimeout(resolve, 400));
check("静默后只补最后一笔（5 连发最终落 2 笔）", volumeWrites === 2 && settingsValue.notifyVolume === 0.4, JSON.stringify({ writes: volumeWrites, value: settingsValue.notifyVolume }));
scope.set = realSet18;

/* ==================== 19. 颜色行：当帧回显 + 手势合并写 ====================
   回归（2026-09-27 用户反馈「点完复位按钮，要等一会儿预览的鲸鱼才变色」）：预览读的是
   快照，而一次写 = 重写整份 profile patch + Loader 热重载条目（约 1s），干等回显预览就
   先僵在旧色上。修法与音量滑杆同源：当帧先画草稿，写宿主按手势合并（取色器拖动会连发
   input）。回显草稿现在是全配置共用的一张 {字段: 值} 表（一个 useState(void 0)），所以
   每次渲染只 push 一个 setter —— 它就是倒数第一个。 */
jsxNodes.length = 0;
registeredSection({ scope, t: t13 });
const colorDraftSetter = valueSetters[valueSetters.length - 1];
const colorInputs19 = jsxNodes.filter((node) => node.type === "input" && node.props.type === "color");
const resetButtons19 = jsxNodes.filter((node) => node.type === "button" && node.props["aria-label"] === t13("restore") && typeof node.props.onClick === "function");
check("颜色用例拿到 3 个取色器与 3 个复位按钮", colorInputs19.length === 3 && resetButtons19.length === 3, JSON.stringify({ pickers: colorInputs19.length, resets: resetButtons19.length }));
check("回显草稿是本次渲染的最后一个 useState(void 0)", typeof colorDraftSetter === "function", String(typeof colorDraftSetter));

/* 19a 取色当帧写草稿（预览鲸鱼立刻换色，不等宿主往返） */
colorDraftSetter.calls.length = 0;
colorInputs19.find((node) => node.props["aria-label"] === "完成")?.props.onChange({ target: { value: "#445566" } });
check("取色当帧写回显草稿", reduce(colorDraftSetter)?.green === "#445566", JSON.stringify(reduce(colorDraftSetter)));
await new Promise((resolve) => setTimeout(resolve, 300));

/* 19b 连发只落「首笔 + 静默补笔」—— 原生取色器拖动时会连发 input，逐帧写会把宿主热重载打爆 */
let colorPickWrites = 0;
const realSet19 = scope.set;
scope.set = (key, val) => {
  if (key === "green") colorPickWrites += 1;
  return realSet19(key, val);
};
for (const hex of ["#010203", "#040506", "#070809"]) colorInputs19.find((node) => node.props["aria-label"] === "完成")?.props.onChange({ target: { value: hex } });
check("取色连发只落首笔（不逐 input 写宿主）", colorPickWrites === 1, `共写 ${colorPickWrites} 笔`);
await new Promise((resolve) => setTimeout(resolve, 400));
check("静默后只补最后一笔", colorPickWrites === 2 && settingsValue.green === "#070809", JSON.stringify({ writes: colorPickWrites, green: settingsValue.green }));
scope.set = realSet19;

/* 19c 复位：当帧先显示默认色，落定后撤草稿交还快照 */
colorDraftSetter.calls.length = 0;
resetButtons19[0]?.props.onClick();
check("复位当帧把预览改成默认色（不等 unset 回显）", reduce(colorDraftSetter)?.green === "#22C55E", JSON.stringify(reduce(colorDraftSetter)));
check("复位立即落盘（unset 同步执行）", settingsValue.green === void 0, String(settingsValue.green));
await new Promise((resolve) => setTimeout(resolve, 300));
check("落定后草稿撤掉、交还快照", reduce(colorDraftSetter)?.green === void 0, JSON.stringify(reduce(colorDraftSetter)));

/* ==================== 20. 跨标签页选主 + 未读持久化 ====================
   回归三处真缺陷（2026-09-27 取证）：① 两个标签页都不在前台时，同一次完成弹两条通知、
   响两次铃；② 「前台」判定只看本标签页 —— B 标签正在看时，隐藏的 A 标签仍以为没人在看；
   ③ 未读绿灯只存内存，刷新即丢（README 已知限制）。
   这里用假 BroadcastChannel 充当「另一个标签页」（默认实例间总线隔离，见 FakeBroadcastChannel），
   用假 store + 假 localStorage 模拟刷新回放。 */
const ownChannel = fakeChannels.at(-1);
/* 前置：本节断言的是「选主 + 持久化」，通知/状态灯的开关先前 19 节动过 —— 显式摆到能弹、能绿，
   免得失败原因落在「开关没开」而不是本节逻辑上。 */
settingsValue.notifyEnabled = true;
settingsValue.colorsEnabled = true;
FakeNotification.permission = "granted";
check("20 节前置：通知开关与权限就绪", settingsValue.notifyEnabled === true && FakeNotification.permission === "granted", JSON.stringify({ enabled: settingsValue.notifyEnabled, permission: FakeNotification.permission }));
check("启动即广播心跳与问路（state?）", ownChannel?.sent.some((m) => m.t === "heartbeat") === true && ownChannel?.sent.some((m) => m.t === "state?") === true, JSON.stringify(ownChannel?.sent));

/* 20a 邻居 id 更小（"0" 必然小于任何随机 id）→ 本标签页非主：完成事件不许弹。 */
reset();
visibility = "hidden";
focused = false;
ownChannel?.bus.post({ t: "heartbeat", id: "0", visible: false, focused: false });
runToDone("c-20a", "跨标签页用例 A");
await settle();
check("非主标签页不弹通知（副作用单一写者）", notifications.length === 0, `发了 ${notifications.length} 条`);

/* 20b 邻居告别 → 本标签页接管：同一个完成事件这次要弹，而且未读集合要落盘。 */
ownChannel?.bus.post({ t: "bye", id: "0" });
reset();
runToDone("c-20b", "跨标签页用例 B");
await settle();
check("接管后主标签页照常弹通知", notifications.length === 1, `发了 ${notifications.length} 条`);
const persistedUnread = fakeStorage.get("dsh-notice-center:v1:unread");
check("未读集合按官方 store 的 persist 键落盘", (persistedUnread?.items ?? []).some((entry) => entry[0] === "c-20b"), JSON.stringify(persistedUnread));

/* 20c 聚合前台：本标签页隐藏，但邻居说它正在看 → 不该弹（旧代码只看本标签页，会弹）。 */
reset();
visibility = "hidden";
focused = false;
ownChannel?.bus.post({ t: "heartbeat", id: "0", visible: true, focused: true });
runToDone("c-20c", "跨标签页用例 C");
await settle();
check("别的标签页在前台时不弹（聚合前台判定）", notifications.length === 0, `发了 ${notifications.length} 条`);
ownChannel?.bus.post({ t: "bye", id: "0" });

/* 20d 刷新回放：新实例启动即读到落盘的未读 → favicon 立刻是绿。
   先把会话表清成「只有一个 completed=false 的会话」，否则绿是官方 completed 给的、
   证明不了持久化。 */
sessionState = { ...sessionState, byId: { "c-20b": row("c-20b", "跨标签页用例 B", false, false) } };
visibility = "visible";
focused = true;
client.apply(ctx);
flushRaf();
check("刷新后绿灯还在（未读状态不再随刷新丢失）", linkEl.href.includes(GREEN_URI), linkEl.href.slice(0, 48));

/* 20e 收到邻居的状态广播必须**立刻重画**。
   用户实测回归（2026-09-27）：A 标签回到前台 → clearAll 广播 → B 采纳了空集合却一直是绿灯，
   因为状态变了却没人重画 favicon，只有刷新 / 切换会话再切回（下一次 sync）才恢复。 */
const channel20e = fakeChannels.at(-1);
reset();
visibility = "hidden";
focused = false;
sessionState = { ...sessionState, byId: { "c-20e": row("c-20e", "跨标签页用例 E", false, false) } };
channel20e?.bus.post({ t: "state", id: "0", items: [["c-20e", 0]] });
check("收到邻居的未读集合 → 立刻变绿", linkEl.href.includes(GREEN_URI), linkEl.href.slice(0, 48));
channel20e?.bus.post({ t: "state", id: "0", items: [] });
check("收到邻居清空 → 立刻恢复默认色（不再等下一次 sync）", !linkEl.href.includes(GREEN_URI), linkEl.href.slice(0, 48));

/* ==================== 21. 开关 / 音效下拉：当帧回显（全配置共用一张草稿表） ====================
   回归（2026-09-27 用户要求「检查其他配置项也存在修改需要等会儿才生效的问题，整体过一遍」）：
   官方 Switch 原语是 fully controlled（只认 props.checked，本组件不改 props 它就不动）、音效
   下拉的选中项与 trigger 文案只认 props.value —— 只读快照的控件在回显到达前一直显示旧值，
   和滑杆/颜色一样有「点了要等一会儿才生效」。修法统一：所有字段共用一张 {字段: 值} 草稿表，
   写入当帧先画，快照追平后交还；写入侧仍是每字段一条手势管道（首笔立即 + 静默补笔）。 */
jsxNodes.length = 0;
registeredSection({ scope, t: t13 });
const draftSetter21 = valueSetters[valueSetters.length - 1];
const switches21 = jsxNodes.filter((node) => typeof node.type === "function" && node.type.__primitive === "Switch");
const switchByLabel21 = (label) => switches21.find((node) => node.props.label === label);
check("21 节拿到 5 个开关", switches21.length === 5, String(switches21.length));

/* 21a 开关：点完当帧就是新状态（断言草稿，而不是等回显） */
draftSetter21.calls.length = 0;
switchByLabel21("自动隐藏")?.props.onChange(true);
check("开关当帧写回显草稿", reduce(draftSetter21)?.notifyAutoHide === true, JSON.stringify(reduce(draftSetter21)));
check("开关同时落盘", settingsValue.notifyAutoHide === true, String(settingsValue.notifyAutoHide));

/* 21b 音效下拉：选中项当帧跟随（trigger 文案与 aria-selected 都读这个值） */
draftSetter21.calls.length = 0;
const pickers21 = jsxNodes.filter((node) => node.props !== void 0 && "groups" in node.props && typeof node.props.onChange === "function");
check("21 节拿到 2 个音效下拉", pickers21.length === 2, String(pickers21.length));
pickers21.find((node) => node.props.kind === "done")?.props.onChange("yup-09");
check("音效下拉当帧写回显草稿", reduce(draftSetter21)?.notifyDoneSound === "yup-09", JSON.stringify(reduce(draftSetter21)));
check("音效下拉同时落盘", settingsValue.notifyDoneSound === "yup-09", String(settingsValue.notifyDoneSound));

/* ==================== 22. 连点开关后「自己关掉」：照官方「代码工作工具」开关的实现 ====================
   回归（2026-09-27 用户反馈「连点几次开关后，最后落在开启上，没过一会儿自动关闭」）。

   官方同一个坑是这么写的（@deepseek-ai/dsh-client-ui-settings-general/lib/client.js 的
   DeveloperToolsRow，即「通用设置 → 代码工作工具」那一行）：
     const enabled = useDeveloperTools((value) => value);          // 受控值
     checked={enabled} disabled={busy}                             // 一笔写在途就禁用控件
     onChange: (next) => { setFailed(false); setBusy(true);
       setEnabled(next).catch(() => setFailed(true)).finally(() => setBusy(false)); }
     failed && <div role="alert">保存失败，请重试</div>              // 失败行内报错
   官方写入同样走 configEditor.edit（重写 profile patch + Loader 热重载，约 1s/笔），快不起来 ——
   它靠的是 **写在途 disabled**：一次交互只产生一笔写，连点被掐掉，于是不存在「写完又自己变
   回去」的竞态。本插件照搬这套结构（额外保留当帧草稿，给「点了要等一会儿才生效」补即时反馈）：
     - 写在途 → writeFlags[key].busy = true → 开关 disabled；
     - 落盘   → busy=false；被拒 → failed=true → 行内 role="alert" 报「保存失败，请重试」，
                画面回滚交还宿主真值（**不后台重推**：后台重推会和用户下一次点击抢着写）；
     - 最后一次操作提到模块级 lastIntents，只作显示兜底（组件重建后不闪回更早的旧值）。 */
jsxNodes.length = 0;
settingsValue.notifyAutoHide = false; /* 宿主停在更早的「关」上 */
registeredSection({ scope, t: t13 });
const switch22 = jsxNodes.find((node) => typeof node.type === "function" && node.type.__primitive === "Switch" && node.props.label === "自动隐藏");
check("设置区重建后画面仍认最后一次操作（不闪回宿主旧值）", switch22?.props.checked === true, String(switch22?.props.checked));
check("22 节拿到写入态 setter（对象初值 state）", flagSetters.length > 0, String(flagSetters.length));

/* 22a 写在途 busy（＝ disabled，连点被掐掉）；三次都被拒 → failed + 回滚，且不后台重推 */
const draftSetter22 = valueSetters[valueSetters.length - 1];
const flagSetter22 = flagSetters[flagSetters.length - 1];
let refused22 = 0;
const realSet22 = scope.set;
scope.set = (key, val) => {
  if (key === "notifyAutoHide" && refused22 < 3) {
    refused22 += 1;
    return Promise.resolve(false);
  }
  return realSet22(key, val);
};
draftSetter22.calls.length = 0;
flagSetter22.calls.length = 0;
const answer22 = switch22?.props.onChange(true);
check("点下去当帧置 busy（＝开关 disabled，连点只会产生一笔写）", reduce(flagSetter22)?.notifyAutoHide?.busy === true, JSON.stringify(reduce(flagSetter22)));
check("同帧先画草稿（即时反馈不丢）", reduce(draftSetter22)?.notifyAutoHide === true, JSON.stringify(reduce(draftSetter22)));
await new Promise((resolve) => setTimeout(resolve, 1000)); /* submit 三次尝试 0/200/600ms */
check("前三笔确实都被拒", refused22 === 3, String(refused22));
check("被拒 → onChange 返回 false（行上据此报错）", (await answer22) === false, String(await answer22));
check("失败态落定：busy=false 且 failed=true（行内报「保存失败，请重试」）", reduce(flagSetter22)?.notifyAutoHide?.busy === false && reduce(flagSetter22)?.notifyAutoHide?.failed === true, JSON.stringify(reduce(flagSetter22)));
check("失败 → 回滚画面交还宿主真值，不后台重推", reduce(draftSetter22)?.notifyAutoHide === void 0 && settingsValue.notifyAutoHide === false, JSON.stringify({
  draft: reduce(draftSetter22),
  host: settingsValue.notifyAutoHide
}));
await new Promise((resolve) => setTimeout(resolve, 900)); /* 旧实现会在 400ms 后补写一笔 */
check("等过一个补写周期也没有后台补写（写次数停在 3）", refused22 === 3 && settingsValue.notifyAutoHide === false, JSON.stringify({
  refused: refused22,
  host: settingsValue.notifyAutoHide
}));
scope.set = realSet22;

/* 22b 写成功：failed 清掉、宿主拿到新值、草稿交给快照 */
jsxNodes.length = 0;
registeredSection({ scope, t: t13 });
const switch22b = jsxNodes.find((node) => typeof node.type === "function" && node.type.__primitive === "Switch" && node.props.label === "自动隐藏");
const flagSetter22b = flagSetters[flagSetters.length - 1];
flagSetter22b.calls.length = 0;
check("写成功 → onChange 返回 true", (await switch22b?.props.onChange(true)) === true, "n/a");
check("写成功：busy/failed 都归位", reduce(flagSetter22b)?.notifyAutoHide?.busy === false && reduce(flagSetter22b)?.notifyAutoHide?.failed === false, JSON.stringify(reduce(flagSetter22b)));
check("写成功：宿主已带上新值", settingsValue.notifyAutoHide === true, String(settingsValue.notifyAutoHide));

/* ==================== 23. 开启通知时的浏览器授权窗（手势安全 + 四种权限态） ====================
   调研结论（2026-09-27，出处见 lib/client.cjs 里 requestNotificationPermission 的注释）：
   MDN 明确「浏览器会直接拒绝不在用户手势里发起的通知权限请求」（Firefox 72 起、Safari 更早），
   另外要求 secure context（https 或 localhost/127.0.0.1）、不能跨域 iframe；权限只有
   granted / denied / default 三态，其中 denied 之后浏览器**不再弹窗**，网页也打不开站点设置页。
   所以落地方式：
     - 打开开关的那一刻，在**同一个同步调用栈**里调 Notification.requestPermission()；
     - default（从没问过，或用户把授权窗直接关掉了）→ 行内提示 + 「授权」按钮；
     - denied → 给出用户自己恢复的具体路径；granted → 什么都不提示。
   本节盯住最容易悄悄回归的一点：**权限请求必须在 onChange 返回之前发出** —— 中间一旦插了
   await，浏览器就不弹窗了，而桌面上手测的表现只是「点开关没反应」，极难查。 */
jsxNodes.length = 0;
settingsValue.notifyEnabled = false;
FakeNotification.permission = "default";
FakeNotification.answer = "granted";
FakeNotification.requests = [];
registeredSection({ scope, t: t13 });
const switch23 = jsxNodes.find((node) => typeof node.type === "function" && node.type.__primitive === "Switch" && node.props.label === t13("groupNotify"));
const permissionSetter23 = permissionSetters[permissionSetters.length - 1];
const draftSetter23 = valueSetters[valueSetters.length - 1];
permissionSetter23.calls.length = 0;
draftSetter23.calls.length = 0;
const answer23 = switch23?.props.onChange(true);
const notificationsBefore23 = notifications.length;
check("23 default + 打开 → 权限请求在 onChange 返回前就发出（手势内同步调用，浏览器才肯弹窗）", FakeNotification.requests.length === 1, `requests=${FakeNotification.requests.length}`);
check("23 同帧仍把开关写下去（要权限不是漏写配置的借口）", settingsValue.notifyEnabled === true, String(settingsValue.notifyEnabled));
check("23 同帧也画了回显草稿", reduce(draftSetter23)?.notifyEnabled === true, JSON.stringify(reduce(draftSetter23)));
await answer23;
check("23 用户点「允许」→ 权限态变 granted（chip 随之消失）", reduce(permissionSetter23) === "granted", String(reduce(permissionSetter23)));
check("23 授权成功当场弹一条确认通知（用户不用等下一次任务跑完才知道生效）", notifications.length === notificationsBefore23 + 1 && notifications[notifications.length - 1]?.title === t13("notifyPermissionTitle"), String(notifications[notifications.length - 1]?.title));

/* 23b 用户在授权窗上点了 × / Esc（浏览器返回 default）：仍是未决 —— 不能静默 */
FakeNotification.requests = [];
FakeNotification.answer = "default";
FakeNotification.permission = "default";
jsxNodes.length = 0;
settingsValue.notifyEnabled = true;
registeredSection({ scope, t: t13 });
/* 方案一（2026-09-27 评审）：chip 挂在「系统通知」开关正下方 —— 短状态常驻、长解释进官方 Tooltip。 */
const chipTooltip23 = (label) => jsxNodes.find((node) => typeof node.type === "function" && node.type.__primitive === "Tooltip" && node.props?.label === label);
const chipButton23 = () => jsxNodes.find((node) => node.type === "button" && Array.isArray(node.props?.children) && node.props.children.some((child) => child?.props?.children === t13("permissionPendingChip")));
const notifySwitch23 = () => jsxNodes.find((node) => typeof node.type === "function" && node.type.__primitive === "Switch" && node.props.label === t13("groupNotify"));
check("23b 未决 → chip 常驻显示「未授权 · 授权」（不悬停也看得懂）", jsxNodes.some((node) => node.props?.children === t13("permissionPendingChip")), t13("permissionPendingChip"));
check("23b 未决 → 长解释在官方 Tooltip 里（hover + focus 都触发）", chipTooltip23(t13("permissionPendingHint")) !== void 0, t13("permissionPendingHint"));
check("23b 未决 → Tooltip 包着的正是那个可点按钮（问号图标 + 文案）", chipTooltip23(t13("permissionPendingHint"))?.props?.children === chipButton23() && chipButton23() !== void 0, "anchor=button");
check("23b chip 挂在开关正下方（开关仍在行里，没有被 chip 取代）", notifySwitch23() !== void 0, "switch-still-there");
check("23b 只是显示 chip 不会自己去请求（必须用户点）", FakeNotification.requests.length === 0, `requests=${FakeNotification.requests.length}`);
const permissionSetter23b = permissionSetters[permissionSetters.length - 1];
permissionSetter23b.calls.length = 0;
const askAnswer23 = chipButton23()?.props.onClick();
check("23b 点 chip → 当场（同步）再发一次请求", FakeNotification.requests.length === 1, `requests=${FakeNotification.requests.length}`);
await askAnswer23;
check("23b 用户又关掉授权窗 → 权限态仍是未决，chip 不消失", reduce(permissionSetter23b) === "default", String(reduce(permissionSetter23b)));

/* 23c 已被拒绝：浏览器不会再弹窗 —— 页面不许再调 requestPermission，chip 只讲恢复路径 */
FakeNotification.requests = [];
FakeNotification.permission = "denied";
jsxNodes.length = 0;
settingsValue.notifyEnabled = true;
registeredSection({ scope, t: t13 });
const deniedTooltip23 = chipTooltip23(t13("permissionDeniedHint"));
check("23c 被拒 → chip 显示叹号 + 「已被拒绝」", jsxNodes.some((node) => node.props?.children === t13("permissionDeniedChip")) && jsxNodes.some((node) => typeof node.type === "function" && node.type.__primitive === "IconWarningOutlineRegular"), t13("permissionDeniedChip"));
check("23c 被拒 → 恢复路径在 Tooltip 里（地址栏图标 / chrome://settings/content/notifications）", deniedTooltip23 !== void 0, t13("permissionDeniedHint"));
check("23c 被拒 → chip 是键盘可聚焦的锚点（Tooltip 的 focus 触发才有意义）", deniedTooltip23?.props?.children?.props?.tabIndex === 0, String(deniedTooltip23?.props?.children?.props?.tabIndex));
check("23c 被拒 → 不再显示可点的「授权」（点了也弹不出来）", chipButton23() === void 0, "no-grant-chip");
check("23c 被拒 → 开关仍在，用户随时能把通知关掉（方案二做不到的那条）", notifySwitch23() !== void 0, "switch-still-there");
notifySwitch23()?.props.onChange(true);
check("23c 被拒后点开关 → 不再调 requestPermission（调了也不会弹，只会白等）", FakeNotification.requests.length === 0, `requests=${FakeNotification.requests.length}`);

/* 23d 已授权：不请求、也没有 chip（行保持干净） */
FakeNotification.requests = [];
FakeNotification.permission = "granted";
jsxNodes.length = 0;
settingsValue.notifyEnabled = true;
registeredSection({ scope, t: t13 });
notifySwitch23()?.props.onChange(true);
check("23d 已授权 → 不请求、也没有任何权限 chip", FakeNotification.requests.length === 0 && jsxNodes.every((node) => typeof node.type !== "function" || node.type.__primitive !== "Tooltip") && jsxNodes.every((node) => node.props?.children !== t13("permissionPendingChip")), `requests=${FakeNotification.requests.length}`);

/* 23e 非安全上下文（例如用局域网 IP 打开）：Notification 根本不存在 → 提示不支持，且不请求 */
const realNotification23 = globalThis.Notification;
delete globalThis.Notification;
FakeNotification.requests = [];
jsxNodes.length = 0;
settingsValue.notifyEnabled = true;
registeredSection({ scope, t: t13 });
const unsupportedSwitch23 = jsxNodes.find((node) => typeof node.type === "function" && node.type.__primitive === "Switch" && node.props.label === t13("groupNotify"));
unsupportedSwitch23?.props.onChange(true);
check("23e 不支持 → 提示「当前浏览器不支持系统通知」，且不发请求", jsxNodes.some((node) => node.props?.children === t13("permissionUnsupported")) && FakeNotification.requests.length === 0, `requests=${FakeNotification.requests.length}`);
globalThis.Notification = realNotification23;

/* ==================== 24. 首次安装：默认开启 + 自动请求授权（借第一次交互） ====================
   需求（2026-09-27）：系统通知配置项**默认开启**，装完插件后**自动**请求通知授权。
   硬约束：浏览器不允许没有用户手势的权限请求（MDN：Firefox 72 起、Safari 更早直接拒绝无手势
   请求），页面自己弹不出来 —— 所以"自动"只能落到：装完第一次打开页面 → 挂一次性监听 →
   用户第一次交互（点一下 / 按一下键）的那个手势里同步请求；只做一次并落盘标记，
   之后想补授权去设置页点状态 chip。 */
const emptyScope24 = Object.assign({}, scope, {
  getSnapshot: () => ({ status: "ready", value: {}, writable: true, revision: 1 })
});
jsxNodes.length = 0;
registeredSection({ scope: emptyScope24, t: t13 });
const defaultSwitch24 = jsxNodes.find((node) => typeof node.type === "function" && node.type.__primitive === "Switch" && node.props.label === t13("groupNotify"));
check("24 未配置时「系统通知」默认就是开着的", defaultSwitch24?.props.checked === true, String(defaultSwitch24?.props.checked));

/* 24a 回归（用户实测反馈）：权限**已经授权**时交互，什么都不该发生，更不能写任何持久标记。 */
FakeNotification.requests = [];
FakeNotification.answer = "granted";
FakeNotification.permission = "granted";
check("24a apply 时已挂上首次交互监听（还没交互就绝不请求）", FakeNotification.requests.length === 0, `requests=${FakeNotification.requests.length}`);
fireDocument("pointerdown");
check("24a 权限已授权时交互 → 不请求", FakeNotification.requests.length === 0, `requests=${FakeNotification.requests.length}`);

/* 24b 用户把权限重置回「询问」→ 下一次交互就该自动请求（不用刷新、也不用清任何标记） */
FakeNotification.permission = "default";
FakeNotification.requests = [];
fireDocument("pointerdown");
check("24b 权限回到「询问」后的首次交互自动请求授权（浏览器只认手势，这是能做到的最自动形态）", FakeNotification.requests.length === 1, `requests=${FakeNotification.requests.length}`);

/* 24c 同一次会话里问过就不再问（用户在授权窗上点 × 也不会被连环弹） */
FakeNotification.requests = [];
fireDocument("pointerdown");
fireDocument("keydown");
check("24c 本次会话已经问过 → 再交互不重复弹窗", FakeNotification.requests.length === 0, `requests=${FakeNotification.requests.length}`);

/* 24d 回归（用户实测反馈第二轮）：**不落任何"已问过"标记** —— 用户在授权窗上既没允许也没阻止
   （点了 × / Esc）时权限仍是 default，下次刷新页面必须还能自动问一次；
   上一版把标记落了盘，于是"点了 × 再刷新就永远不问了"。 */
check("24d 全程不落盘任何「已问过」标记（没做选择就等于还能再问）", fakeStorage.get("dsh-notice-center:v1:permission-asked") === void 0, JSON.stringify(fakeStorage.get("dsh-notice-center:v1:permission-asked")));

console.log(failed === 0 ? "\n全部通过" : `\n有 ${failed} 项失败`);
process.exit(failed === 0 ? 0 : 1);
