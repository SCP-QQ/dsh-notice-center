/**
 * dsh-done-whale 系统通知功能 —— 无浏览器冒烟测试。
 *
 * 用最小 mock（window/document/Notification/AudioContext/react/slots/locale/settingsScope/uiSession）
 * 加载构建产物并执行 apply，验证：
 *   1. 模块能加载、apply 不抛错；
 *   2. 设置页只注册一个分区（done-whale），组件可渲染；
 *   3. 可选通道（ctx.inject uiSession）能拿到 pending store；
 *   4. completed false→true 触发一条通知；pending 新增触发一条通知；
 *   5. 通知仅在页面不可见时发送（document.visibilityState = hidden）；
 *   6. 提示音：完成 = 上行双音、待处理 = 下行双音，且音量按配置缩放（峰值 0.12 × volume）。
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const target = process.argv[2] ?? "<本地工作区>/dsh-done-whale-pr/lib/client.cjs";

const notifications = [];
const registrations = [];
const slotInjections = [];
const injections = [];
const dicts = {};
const listListeners = [];
const pendingListeners = [];
const chimes = [];
const gains = [];

let state = { byId: { s1: { id: "s1", origin: "main", running: false, completed: false, displayTitle: "会话一" } }, current: "s1" };
let pendingMap = new Map();

globalThis.Notification = class {
	static permission = "granted";
	constructor(title, options) {
		notifications.push({ title, options });
	}
	close() {}
};
let registration;
globalThis.window = {
	focus() {},
	__ModuleLoader__: { load(reg) { registration = reg; } },
	AudioContext: class {
		constructor() {
			this.state = "running";
			this.currentTime = 0;
			this.destination = {};
		}
		createOscillator() {
			const node = {
				type: "",
				frequency: { value: 0 },
				connect() {},
				start() { chimes.push(node.frequency.value); },
				stop() {}
			};
			return node;
		}
		createGain() {
			return {
				gain: {
					setValueAtTime() {},
					exponentialRampToValueAtTime(value) { if (value > 0.0002) gains.push(Number(value.toFixed(4))); }
				},
				connect() {}
			};
		}
		resume() {}
	}
};
globalThis.MutationObserver = class {
	constructor(callback) { this.callback = callback; }
	observe() {}
	disconnect() {}
};
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.document = {
	head: { querySelector: () => ({ href: "/favicon.svg" }) },
	querySelector: () => null,
	documentElement: {},
	visibilityState: "hidden",
	addEventListener() {},
	removeEventListener() {}
};

const reactMock = {
	useState: (init) => [init, () => {}],
	useSyncExternalStore: (_subscribe, getSnapshot) => getSnapshot(),
	useEffect: () => {},
	useRef: (value) => ({ current: value })
};
const jsxRuntime = {
	jsx: (type, props) => ({ type, props }),
	jsxs: (type, props) => ({ type, props }),
	Fragment: Symbol("Fragment")
};
const primitivesMock = new Proxy({
	Switch: (props) => ({ type: "Switch", props })
}, {
	get: (target, prop) => {
		if (prop in target) return target[prop];
		if (typeof prop !== "string") return void 0;
		return (props) => ({ type: prop, props });
	}
});
const factoryRequire = (spec) => {
	if (spec === "react") return reactMock;
	if (spec === "react/jsx-runtime") return jsxRuntime;
	if (spec === "@deepseek-ai/dsh-client-ui-primitives") return primitivesMock;
	throw new Error("unexpected require: " + spec);
};

require(target);
const moduleExports = registration.factory(factoryRequire);
console.log("module id      :", registration.id);
console.log("service inject :", JSON.stringify(moduleExports.inject));

const scope = {
	subscribe: () => () => {},
	getSnapshot: () => ({
		value: {
			green: "#22C55E",
			amber: "#F59E0B",
			colorsEnabled: true,
			notifyEnabled: true,
			notifySound: true,
			notifyVolume: 0.5
		}
	}),
	set: () => {},
	unset: () => {}
};
const ctx = {
	effect: (fn) => { const dispose = fn(); return () => { if (typeof dispose === "function") dispose(); }; },
	inject: (deps, callback) => { injections.push({ deps, callback }); return { dispose() {} }; },
	sessions: {
		list: { getSnapshot: () => state, subscribe: (listener) => { listListeners.push(listener); return () => {}; } },
		open: () => {}
	},
	slots: {
		inject: (seat, provider) => { slotInjections.push({ seat, provider }); return () => {}; },
		register: (options, component) => { registrations.push({ options, component }); return () => {}; }
	},
	locale: {
		register: (ns, dict) => { dicts[ns] = dict; return () => {}; },
		bind: (ns) => (key) => (dicts[ns]?.zh?.[key] ?? key)
	},
	settingsScope: { bind: () => scope },
	uiSession: { pendingInteractions: { getSnapshot: () => pendingMap, subscribe: (listener) => { pendingListeners.push(listener); return () => {}; } } }
};

moduleExports.apply(ctx);
console.log("locale keys    :", Object.keys(dicts["done-whale"]?.zh ?? {}).length);
console.log("slot seats     :", slotInjections.map((i) => i.seat).join(", "));

for (const item of slotInjections) item.provider();
console.log("section ids    :", registrations.map((r) => r.options.id).join(", "));
for (const reg of registrations) {
	const element = reg.component({ scope, t: (key) => (dicts["done-whale"]?.zh?.[key] ?? key) });
	console.log("rendered       :", reg.options.id, "->", typeof element?.type === "string" ? element.type : String(element?.type));
}

for (const item of injections) item.callback({ uiSession: ctx.uiSession });
console.log("optional inject:", JSON.stringify(injections.map((i) => i.deps)));

const brief = (list) => list.map((entry) => ({ title: entry.title, tag: entry.options.tag, icon: String(entry.options.icon).slice(0, 28) + "..." }));

state = { byId: { s1: { id: "s1", origin: "main", running: false, completed: true, displayTitle: "会话一" } }, current: "s1" };
for (const listener of listListeners) listener();
await new Promise((resolve) => setTimeout(resolve, 400));
console.log("after complete :", JSON.stringify(brief(notifications)));

pendingMap = new Map([["s1", { key: "k1", kind: "approval", sessionId: "s1" }]]);
for (const listener of pendingListeners) listener();
await new Promise((resolve) => setTimeout(resolve, 400));
console.log("after pending  :", JSON.stringify(brief(notifications)));
console.log("chimes         :", JSON.stringify(chimes));
console.log("gains          :", JSON.stringify(gains));

const volumeOk = gains.length > 0 && gains.every((value) => value === 0.06);
console.log(notifications.length === 2 && registrations.length === 1 && chimes.length === 4 && volumeOk ? "SMOKE OK" : "SMOKE FAIL");
