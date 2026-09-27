window.__ModuleLoader__.load({
	id: "dsh-notice-center",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		/* 官方快照 store：`persist` 参数就是 localStorage 封装（静态模块表里的基座键，
		   与 primitives 同类，无需在 package.json 里声明 external）。 */
		let client_store = require("@deepseek-ai/dsh-client-store");
		//#region src/favicon.ts
		function whaleSvg(color) {
			return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50\" height=\"50\" viewBox=\"0 0 50 50\" fill=\"none\"><path d=\"M48.8354 10.0479C48.3232 9.79199 48.1025 10.2798 47.8032 10.5278C47.7007 10.6079 47.6143 10.7119 47.5273 10.8076C46.7793 11.624 45.9048 12.1597 44.7622 12.0957C43.0923 12 41.666 12.5356 40.4058 13.8398C40.1377 12.2319 39.2476 11.272 37.8926 10.6558C37.1836 10.3359 36.4668 10.0156 35.9702 9.31982C35.6235 8.82373 35.5293 8.27197 35.356 7.72754C35.2456 7.3999 35.1353 7.06396 34.7651 7.00781C34.3633 6.94385 34.2056 7.2876 34.0479 7.57568C33.418 8.75195 33.1733 10.0479 33.1973 11.3599C33.2524 14.312 34.4736 16.6641 36.8999 18.3359C37.1758 18.5278 37.2466 18.7197 37.1597 19C36.9946 19.5757 36.7974 20.1357 36.624 20.7119C36.5137 21.0801 36.3486 21.1597 35.9624 21C34.6309 20.4321 33.481 19.5918 32.4644 18.5757C30.7393 16.8721 29.1792 14.9917 27.2334 13.52C26.7764 13.1758 26.3193 12.856 25.8467 12.5518C23.8618 10.584 26.1069 8.96777 26.627 8.77588C27.1704 8.57568 26.8159 7.8877 25.0591 7.896C23.3022 7.90381 21.6953 8.50391 19.647 9.30371C19.3477 9.42383 19.0322 9.51172 18.7095 9.58398C16.8501 9.22363 14.9199 9.14355 12.9033 9.37598C9.10596 9.80762 6.07275 11.6396 3.84326 14.7681C1.16455 18.5278 0.53418 22.7998 1.30664 27.2559C2.11768 31.9521 4.46582 35.8398 8.07373 38.8799C11.8159 42.0322 16.1255 43.5762 21.041 43.2803C24.0269 43.104 27.3516 42.6963 31.1016 39.4561C32.0469 39.936 33.0396 40.1279 34.686 40.272C35.9546 40.3921 37.1758 40.208 38.1211 40.0078C39.6021 39.688 39.4995 38.2881 38.9639 38.0322C34.623 35.9678 35.5762 36.8081 34.71 36.1279C36.9155 33.4639 40.2402 30.6958 41.54 21.728C41.6426 21.0161 41.5557 20.5679 41.54 19.9917C41.5322 19.6396 41.6108 19.5039 42.0049 19.4639C43.0923 19.3359 44.1479 19.0317 45.1167 18.4878C47.9292 16.9199 49.064 14.3438 49.3315 11.2559C49.3711 10.7837 49.3237 10.2959 48.8354 10.0479ZM24.3262 37.8398C20.1196 34.4639 18.0791 33.3521 17.2358 33.3999C16.4482 33.4482 16.5898 34.3682 16.7632 34.9678C16.9443 35.5601 17.1812 35.9683 17.5117 36.4878C17.7402 36.832 17.8979 37.3442 17.2832 37.728C15.9282 38.584 13.5728 37.4399 13.4624 37.3838C10.7207 35.7358 8.42822 33.5601 6.81348 30.584C5.25342 27.7197 4.34766 24.6479 4.19775 21.3677C4.1582 20.5757 4.38672 20.2959 5.15869 20.1519C6.17529 19.96 7.22314 19.9199 8.23926 20.0718C12.5327 20.7119 16.1885 22.6719 19.2529 25.7759C21.002 27.5439 22.3252 29.6558 23.6885 31.7202C25.1377 33.9121 26.6978 36 28.6831 37.7119C29.3843 38.312 29.9434 38.7681 30.479 39.104C28.8643 39.2881 26.1699 39.3281 24.3262 37.8398ZM26.3433 24.6001C26.3433 24.248 26.6191 23.9678 26.9658 23.9678C27.0444 23.9678 27.1152 23.9839 27.1782 24.0078C27.2651 24.04 27.3438 24.0879 27.4067 24.1602C27.5171 24.272 27.5801 24.4321 27.5801 24.6001C27.5801 24.9521 27.3042 25.2319 26.9575 25.2319C26.6108 25.2319 26.3433 24.9521 26.3433 24.6001ZM32.6064 27.8799C32.2046 28.0479 31.8027 28.1919 31.4165 28.208C30.8179 28.2397 30.1641 27.9922 29.8096 27.688C29.2583 27.2158 28.8643 26.9521 28.6987 26.1279C28.6279 25.7759 28.6675 25.2319 28.7305 24.9199C28.8721 24.248 28.7144 23.8159 28.2495 23.4238C27.8716 23.104 27.3911 23.0161 26.8633 23.0161C26.666 23.0161 26.4849 22.9277 26.3511 22.856C26.1304 22.7441 25.9492 22.4639 26.1226 22.1201C26.1777 22.0078 26.4458 21.7358 26.5088 21.688C27.2256 21.272 28.0527 21.4077 28.8169 21.7197C29.5259 22.0161 30.0615 22.5601 30.834 23.3281C31.6216 24.2559 31.7632 24.5117 32.2124 25.208C32.5669 25.752 32.8901 26.312 33.1104 26.9521C33.2446 27.3521 33.0713 27.6802 32.6064 27.8799Z\" fill=\"" + color + "\" fill-opacity=\"1\" fill-rule=\"nonzero\"/></svg>";
		}
		//#endregion
		//#region src/shared.ts
		/**
		* 宿主/浏览器共享的常量与类型（纯值，不引入任何 @deepseek-ai 运行时依赖，
		* 保证浏览器 bundle 只 import 类型）。
		*/
		const SETTINGS_NAMESPACE = "notice-center";
		/** 插件身份：设置页页脚展示用。版本号必须与 package.json 的 version 一致 ——
		*  这份 bundle 是预构建产物，运行时读不到 package.json，漂移由宿主半冒烟测试
		*  （test/host-half.smoke.mjs）守护，别在发版流程之外单独改这里。 */
		const PLUGIN_NAME = "dsh-notice-center";
		const PLUGIN_VERSION = "1.4.0";
		/** 插件仓库：页脚点击后在新标签页打开。 */
		const PLUGIN_REPO = "https://github.com/SCP-QQ/dsh-notice-center";
		/** 官方侧边栏状态点颜色（静态色板，明暗主题同值）。 */
		const DEFAULT_GREEN = "#22C55E";
		const DEFAULT_AMBER = "#F59E0B";
		/** 6 位 hex 校验（ColorPicker 输出与手输均为此格式）。 */
		const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;
/** 系统通知默认值（与宿主 schema 保持一致；客户端仅用于设置页回显）。 */
const NOTIFY_DEFAULTS = {
	/** 默认开启：装完插件即默认订阅，授权交给"首次交互自动请求 + 设置页状态 chip"。 */
	notifyEnabled: true,
	notifySound: true,
	notifyVolume: 0.6,
	notifyAutoHide: true,
	notifyForeground: false,
	notifyDoneSound: "builtin-up",
	notifyPendingSound: "builtin-down"
};
/** 颜色状态灯的默认值（green/amber 为官方侧边栏色；black 未配置表示沿用官方图标）。 */
const COLOR_DEFAULTS = {
	green: "#22C55E",
	amber: "#F59E0B",
	black: "#000000"
};
/** 颜色状态灯总开关的默认值（与宿主 schema 一致）。 */
const COLORS_ENABLED_DEFAULT = true;
/** 未读集合（绿灯）的 localStorage 键：官方 store 的 persist name。 */
const UNREAD_PERSIST_NAME = "dsh-notice-center:v1:unread";
/** 跨标签页协调用的 BroadcastChannel 名。 */
const CROSS_TAB_CHANNEL = "dsh-notice-center";
/** 心跳间隔 / 判死窗口 / 未读记录的保鲜期与上限。 */
const CROSS_TAB_HEARTBEAT_MS = 2000;
const CROSS_TAB_PEER_TTL_MS = 6000;
const UNREAD_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const UNREAD_MAX = 50;
/**
* 未读集合的持久化端口：官方 `createSnapshotStore` + `persist: { name }`（localStorage）。
*
* 为什么要它：未读绿灯原本只存在内存里（一个 Set），刷新页面就丢 —— 这是 README「已知限制」里
* 那条「刷新页面后绿色状态丢失」。官方 store 的 persist 就是 localStorage 封装，省得自己裸写
* key 与反序列化。
*
* ⚠️ 官方注明 persist key 就是存储身份，**同一个 key 的多个活实例会互相污染**
* （`dsh-client-store/lib/types/index.d.ts:60-67`）。所以只有主标签页写盘（见 createCrossTab），
* 其它标签页只读不写。
*
* 读写全程吞异常：隐私模式、配额满、store 不可用时降级成「不持久化」，不能让插件挂掉。
*
* @param clientStore - `@deepseek-ai/dsh-client-store` 模块（测试可注入假货）。
* @param name - persist 键名。
* @returns `{ load, save }`；`load()` 返回 `[[sessionId, atMs], …]`。
*/
function createUnreadStore(clientStore, name) {
	let store;
	try {
		store = clientStore.createSnapshotStore({ items: [] }, { persist: { name } });
	} catch {
		store = void 0;
	}
	const valid = (items) => (Array.isArray(items) ? items : []).filter((entry) => Array.isArray(entry) && typeof entry[0] === "string" && typeof entry[1] === "number");
	return {
		load: () => {
			try {
				return valid(store?.getSnapshot()?.items);
			} catch {
				return [];
			}
		},
		save: (items) => {
			try {
				store?.set({ items: valid(items) });
			} catch {}
		}
	};
}
/**
* 跨标签页协调 + 未读状态共享（单一写者、确定性选主、聚合前台判定）。
*
* 为什么需要（2026-09-27 取证）：同一份 DSH 页面常被开成多个标签页，每个标签页各跑一套状态机，
* 而官方**没有任何**跨标签页机制（全仓 BroadcastChannel / SharedWorker / storage 事件监听均
* 0 命中）。于是有三个问题：
*  1. 两个标签页都不在前台时，同一次完成会**弹两条通知、响两次铃**（各自检测、各自弹）；
*  2. 「前台」判定是 per-tab 的：B 标签正在看时，隐藏的 A 标签仍以为没人在看而弹通知；
*  3. 未读绿灯只存内存，刷新即丢（README 已知限制）。
*
* 做法：一个 BroadcastChannel 承担「心跳 + 全量状态复制」；存活集合里 **tabId 最小者当主**
* （纯函数比较，不抢主、切换确定）；只有主标签写持久化；未读集合与聚合前台状态对全标签页广播，
* 所有标签页据此各画自己的 favicon（favicon 是每标签页独立的 DOM，必须各自更新）。
*
* 降级：没有 BroadcastChannel 时 peers 恒空 → 退化成「单标签页 + 持久化」，行为与改造前一致。
*
* @param opts.channelName - BroadcastChannel 名。
* @param opts.visible - 本标签页是否可见。
* @param opts.focused - 本窗口是否有焦点。
* @param opts.load - 读盘端口：返回 `[[sessionId, atMs], …]`。
* @param opts.save - 写盘端口。
* @param opts.tabId - 本标签页 id（测试注入，缺省随机）。
* @param opts.now - 时钟（测试注入）。
* @param opts.onChange - 采纳了邻居状态后的回调（用来重画 favicon）。
* @returns 协调器：isLeader / isForeground / 未读读写 / start / destroy。
*/
function createCrossTab(opts) {
	const tabId = opts.tabId ?? Math.random().toString(36).slice(2, 10);
	const now = opts.now ?? (() => Date.now());
	/** tabId → { at, visible, focused }：最近一次心跳（同时携带前台状态）。 */
	const peers = new Map();
	/** 未读（绿灯）会话：sessionId → 记录时间。 */
	const unread = new Map();
	let channel;
	try {
		channel = typeof BroadcastChannel === "function" ? new BroadcastChannel(opts.channelName) : void 0;
	} catch {
		channel = void 0;
	}
	/* Node（冒烟测试）里 BroadcastChannel 会 ref 住事件循环；浏览器没有 unref，可选调用即空操作。 */
	channel?.unref?.();
	let timer;
	let wasLeader = null;
	const post = (message) => {
		try {
			channel?.postMessage(message);
		} catch {}
	};
	/** 丢弃过期 / 超量的未读记录：刷新很久之后再回来不该看到陈年绿灯。 */
	const prune = () => {
		const cutoff = now() - UNREAD_TTL_MS;
		for (const [id, at] of [...unread]) if (at < cutoff) unread.delete(id);
		while (unread.size > UNREAD_MAX) unread.delete(unread.keys().next().value);
	};
	/** 清掉超时未心跳的邻居（崩溃的标签页不会告别）。 */
	const live = () => {
		const cutoff = now() - CROSS_TAB_PEER_TTL_MS;
		for (const [id, peer] of [...peers]) if (peer.at < cutoff) peers.delete(id);
		return peers;
	};
	/** 主标签页 = 存活集合里 tabId 最小者（含自己）。 */
	const isLeader = () => {
		let min = tabId;
		for (const [id] of live()) if (id < min) min = id;
		return min === tabId;
	};
	/** 聚合前台：**任一**存活标签页可见且有焦点 === 用户在看。 */
	const isForeground = () => {
		if (opts.visible() && opts.focused()) return true;
		for (const [, peer] of live()) if (peer.visible && peer.focused) return true;
		return false;
	};
	const broadcastState = () => post({
		t: "state",
		id: tabId,
		items: [...unread]
	});
	const announce = () => post({
		t: "heartbeat",
		id: tabId,
		visible: opts.visible(),
		focused: opts.focused()
	});
	const persist = () => {
		if (!isLeader()) return;
		try {
			opts.save([...unread]);
		} catch {}
	};
	const replace = (items) => {
		unread.clear();
		for (const entry of Array.isArray(items) ? items : []) if (Array.isArray(entry) && typeof entry[0] === "string" && typeof entry[1] === "number") unread.set(entry[0], entry[1]);
		prune();
		/* ⚠️ 采纳了邻居的状态必须**立刻重画**：favicon 是每标签页自己的 DOM，不重画就停在旧颜色上。
		   2026-09-27 用户实测：A 标签回前台 → clearAll 广播 → B 采纳了空集合却仍显示绿灯，
		   直到刷新或切换会话才恢复（那时 onForeground 因「集合已空」整段跳过）。 */
		if (opts.onChange !== void 0) {
			try {
				opts.onChange();
			} catch {}
		}
	};
	const onMessage = (event) => {
		const message = event?.data;
		if (message === null || typeof message !== "object" || message.id === tabId) return;
		if (message.t === "bye") {
			peers.delete(message.id);
			return;
		}
		if (message.t === "heartbeat") {
			peers.set(message.id, {
				at: now(),
				visible: message.visible === true,
				focused: message.focused === true
			});
			return;
		}
		if (message.t === "state") {
			/* 全量复制、后到者为准：清空动作（用户回到前台）也必须能覆盖别人的旧集合。 */
			replace(message.items);
			persist();
			return;
		}
		/* 新标签页问路：只有主标签页应答，避免多份应答互相覆盖。 */
		if (message.t === "state?" && isLeader()) broadcastState();
	};
	return {
		tabId,
		isLeader,
		isForeground,
		has: (id) => unread.has(id),
		size: () => unread.size,
		/** 记一条未读：任何标签页都能记（并集），但只有主标签页落盘。 */
		add: (id) => {
			if (unread.has(id)) return;
			unread.set(id, now());
			prune();
			broadcastState();
			persist();
		},
		remove: (id) => {
			if (!unread.delete(id)) return;
			broadcastState();
			persist();
		},
		/** 回到前台 → 绿灯全灭（保留原有语义，只是判定改为聚合前台）。 */
		clearAll: () => {
			if (unread.size === 0) return;
			unread.clear();
			broadcastState();
			persist();
		},
		start: () => {
			/* 先吃下自己那份持久化记录（两个标签页同时启动也只做并集，不丢）。 */
			try {
				for (const [id, at] of opts.load() ?? []) if (!unread.has(id)) unread.set(id, at);
			} catch {}
			prune();
			try {
				channel?.addEventListener("message", onMessage);
			} catch {}
			timer = setInterval(() => {
				live();
				announce();
				const leader = isLeader();
				/* 接管（或首次确认自己是主）→ 广播一次权威集合，并把状态写盘。 */
				if (leader && wasLeader !== true) broadcastState();
				wasLeader = leader;
				persist();
			}, CROSS_TAB_HEARTBEAT_MS);
			/* 测试环境（Node）里别让心跳计时器吊住事件循环；浏览器里 setInterval 返回数字，无 unref。 */
			timer?.unref?.();
			wasLeader = isLeader();
			announce();
			post({
				t: "state?",
				id: tabId
			});
		},
		destroy: () => {
			if (timer !== void 0) clearInterval(timer);
			post({
				t: "bye",
				id: tabId
			});
			try {
				channel?.removeEventListener("message", onMessage);
				channel?.close();
			} catch {}
		}
	};
}
/** 鲸鱼轮廓的 path 数据（从 whaleSvg 提取，供设置页颜色行的鲸鱼图标预览使用）。 */
const WHALE_SHAPE_PATH = (() => {
	const match = /d="([^"]+)"/.exec(whaleSvg("currentColor"));
	return match === null ? "" : match[1];
})();
/**
* 当前系统通知权限："granted" | "denied" | "default"；浏览器不支持时为 "unsupported"。
* @returns 权限字符串。
*/
function notificationSupport() {
	try {
		if (typeof Notification === "undefined" || typeof Notification.permission !== "string") return "unsupported";
		return Notification.permission;
	} catch {
		return "unsupported";
	}
}
/**
* 请求系统通知权限 —— 会弹出浏览器自己的授权窗。
*
* ⚠️ **必须**在用户手势的同步调用栈里发起：MDN 写明浏览器「will explicitly disallow
* notification permission requests not triggered in response to a user gesture」（Firefox 72
* 起、Safari 更早）。所以调用点前面不能有 await —— 写配置那一步是异步的，别等它。
* 另外要求 secure context（https 或 localhost/127.0.0.1），且不能是跨域 iframe。
*
* 只在权限为 "default"（从没问过、或用户上次把授权窗直接关掉了）时才有意义：已经是 denied
* 的话浏览器立刻返回 denied 且**不再弹窗**，只能由用户自己去站点设置里改（网页无权打开
* chrome:// 页面）。
* @returns Promise<"granted" | "denied" | "default" | "unsupported"> 用户的选择/浏览器给出的结果。
*/
function requestNotificationPermission() {
	try {
		if (typeof Notification === "undefined" || typeof Notification.requestPermission !== "function") return Promise.resolve("unsupported");
		return new Promise((resolve) => {
			let settled = false;
			const done = (result) => {
				if (settled) return;
				settled = true;
				resolve(typeof result === "string" ? result : notificationSupport());
			};
			let answer;
			try {
				/* 新版返回 Promise，老版只认回调 —— 两个都给，谁先到算谁的（done 幂等）。 */
				answer = Notification.requestPermission(done);
			} catch {
				done(notificationSupport());
				return;
			}
			if (answer !== void 0 && typeof answer.then === "function") answer.then(done, () => done(notificationSupport()));
		});
	} catch {
		return Promise.resolve("unsupported");
	}
}
/**
* 订阅权限态变化：用户在浏览器站点设置里改完通知权限回到页面时，页面要立刻反映，
* 而不是一直挂着「已被拒绝」。用 Permissions API 的 onchange（Chrome / Firefox 支持；
* Safari 可能不支持 → 返回 null，由调用方在 focus / visibilitychange 时兜底重读）。
* @param listener - 权限态可能变化时的回调。
* @returns 取消订阅的函数；不支持时返回 null。
*/
function watchNotificationPermission(listener) {
	try {
		const permissions = navigator === void 0 ? void 0 : navigator.permissions;
		if (permissions === void 0 || typeof permissions.query !== "function") return null;
		let status;
		let cancelled = false;
		permissions.query({ name: "notifications" }).then((result) => {
			if (cancelled) return;
			status = result;
			result.onchange = () => listener();
		}, () => {});
		return () => {
			cancelled = true;
			if (status !== void 0) status.onchange = null;
		};
	} catch {
		return null;
	}
}
/** 上次弹「通知已开启」确认的时间戳：首次自动请求与设置页点授权可能同时命中，去重一次。 */
let lastPermissionConfirmAt = 0;
/**
* 授权成功后的当场确认通知 —— 让用户立刻看到「通知真的能弹出来」，不必等下一次任务跑完。
* 不指定 icon：浏览器用站点图标（就是这只鲸鱼），也省得跟颜色配置耦合。
* @param title - 通知标题（调用方从 locale 取，避免这里依赖 ctx）。
* @param body - 通知正文。
*/
function showPermissionConfirmation(title, body) {
	const now = Date.now();
	if (now - lastPermissionConfirmAt < 3000) return;
	lastPermissionConfirmAt = now;
	try {
		const notification = new Notification(title, {
			body,
			silent: true
		});
		setTimeout(() => notification.close(), 4000);
	} catch (error) {
		console.warn("[notice-center] 确认通知失败", error);
	}
}
/**
* "首次安装自动请求通知授权" —— 借用户的第一次交互发起。
*
* 为什么不能"页面一打开就弹"：浏览器**不允许**没有用户手势的权限请求（MDN：Firefox 72 起、
* Safari 更早就会直接拒绝这类请求，Chrome 同理），页面自己弹不出来。能落地的最"自动"的形态
* 就是：打开页面时挂一个监听，用户干任何事（点一下、按一下键）的那个手势里**同步**发起请求。
*
* 频率规则（2026-09-27 按用户实测反馈定稿）：**每次打开页面最多问一次**，而且**不落任何持久标记**。
* - 用户在授权窗上点了「允许」/「阻止」→ 权限有了定论，之后 `shouldAsk` 自然为 false，不再打扰；
* - 用户在授权窗上点了 × / Esc（**什么也没选**）→ 权限仍是 `default` → 下次刷新页面会**再问一次**，
*   直到他做出选择为止；
* - 同一次会话里问过就不再问（请求一发出就解除监听）—— 免得点一下弹一次。
* 想彻底不被问：把「系统通知」关掉（`shouldAsk` 里的开关那道门），或在授权窗里选「阻止」。
* @param options.shouldAsk - 此刻该不该问（权限仍未定论 + 通知开关没被关掉）。
* @param options.onGranted - 用户点了「允许」时回调（弹一条确认通知）。
*/
function armFirstGesturePermissionRequest(options) {
	try {
		let armed = true;
		const disarm = () => {
			if (!armed) return;
			armed = false;
			document.removeEventListener("pointerdown", handler, true);
			document.removeEventListener("keydown", handler, true);
		};
		const handler = () => {
			if (!armed) return;
			/* 权限已有定论（granted/denied）或用户把通知关了 → 什么都不问，监听继续留着：
			   他之后重置权限 / 重新打开开关时，还能自动问一次。 */
			if (!options.shouldAsk()) return;
			/* 真问过就解除：本次会话不再重复弹（用户在授权窗点 × 也不会被连环骚扰）。 */
			disarm();
			console.info("[notice-center] 借这次交互请求通知权限（浏览器不允许无手势请求）");
			requestNotificationPermission().then((result) => {
				if (result === "granted") options.onGranted();
			});
		};
		document.addEventListener("pointerdown", handler, true);
		document.addEventListener("keydown", handler, true);
	} catch (error) {
		console.warn("[notice-center] 首次授权请求未挂上", error);
	}
}
/** 复用的音频上下文（提示音用 Web Audio 合成，不依赖任何音频资源文件）。 */
let chimeContext;
/**
* 取（或创建）音频上下文；浏览器不支持时返回 null。
* @returns AudioContext 实例或 null。
*/
function chimeAudioContext() {
	if (chimeContext !== void 0) return chimeContext;
	try {
		const Ctor = window.AudioContext ?? window.webkitAudioContext;
		chimeContext = Ctor === void 0 ? null : new Ctor();
	} catch {
		chimeContext = null;
	}
	return chimeContext;
}
/** 在用户手势中预热音频上下文（浏览器自动播放策略要求先有交互才能出声）。 */
function primeChime() {
	try {
		const audio = chimeAudioContext();
		if (audio !== null && audio.state === "suspended") audio.resume?.();
	} catch {}
}
/**
* 把任意输入收敛为 0–1 的音量系数。
* @param volume - 原始音量值。
* @returns 归一化后的音量（缺省 0.6）。
*/
function normalizeVolume(volume) {
	if (typeof volume !== "number" || !Number.isFinite(volume)) return 0.6;
	return Math.min(Math.max(volume, 0), 1);
}
/**
* 播放提示音：完成 = Chime Up（上行 660 → 990Hz），待处理 = Chime Down（下行 880 → 587Hz）。
* 两种音高走向不同，便于不看屏幕也能区分。合成失败时静默。
* @param kind - "done" | "pending"。
* @param volume - 音量 0–1（缺省 0.6）；为 0 时不出声。
*/
function playChime(kind, volume) {
	try {
		const level = normalizeVolume(volume);
		if (level <= 0) return;
		const audio = chimeAudioContext();
		if (audio === null) return;
		if (audio.state === "suspended") audio.resume?.();
		const notes = kind === "done" ? [660, 990] : [880, 587];
		const base = audio.currentTime;
		notes.forEach((frequency, index) => {
			const oscillator = audio.createOscillator();
			const gain = audio.createGain();
			const start = base + index * 0.14;
			oscillator.type = "sine";
			oscillator.frequency.value = frequency;
			gain.gain.setValueAtTime(0.0001, start);
			gain.gain.exponentialRampToValueAtTime(0.12 * level, start + 0.02);
			gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
			oscillator.connect(gain);
			gain.connect(audio.destination);
			oscillator.start(start);
			oscillator.stop(start + 0.2);
		});
	} catch {}
}
		//#endregion
/* ---------- 音效库（opencode 内置音效，MIT） ---------- */
/** 音效静态路由前缀（宿主半 lib/index.mjs 注册；路由缺席时自动回退合成音）。 */
const SOUND_ROUTE = "/notice-center-sounds";
/** opencode 内置音效包（取自 anomalyco/opencode packages/ui/src/assets/audio，MIT）。 */
const SOUND_PACKS = [
	{ name: "Alert", prefix: "alert", count: 10 },
	{ name: "Bip-bop", prefix: "bip-bop", count: 10 },
	{ name: "Staplebops", prefix: "staplebops", count: 7 },
	{ name: "Nope", prefix: "nope", count: 12 },
	{ name: "Yup", prefix: "yup", count: 6 }
];
/** 内置合成音（无资源依赖，也是默认值）。 */
const BUILTIN_SOUNDS = [
	{ id: "builtin-up", labelKey: "soundBuiltinUp" },
	{ id: "builtin-down", labelKey: "soundBuiltinDown" }
];
/**
* 音效库分组（内置 + opencode 五个包），下拉与 id→显示名都走这里。
* @param t - 命名空间文案函数。
* @returns 分组数组 [{ group, items: [{ id, label }] }]。
*/
function soundLibrary(t) {
	const packs = [{
		group: t("soundPackBuiltin"),
		items: BUILTIN_SOUNDS.map((item) => ({ id: item.id, label: t(item.labelKey) }))
	}];
	for (const pack of SOUND_PACKS) {
		const items = [];
		for (let index = 1; index <= pack.count; index += 1) {
			const number = String(index).padStart(2, "0");
			items.push({ id: pack.prefix + "-" + number, label: pack.name + " " + number });
		}
		packs.push({ group: pack.name, items });
	}
	return packs;
}
/**
* 音效 id → 显示名（设置页下拉按钮回显用）。
* @param t - 命名空间文案函数。
* @returns id→名称映射。
*/
function soundNames(t) {
	const names = {};
	for (const pack of soundLibrary(t)) for (const item of pack.items) names[item.id] = item.label;
	return names;
}
/** 当前正在播放的音频元素（同一时刻只放一条，避免悬浮扫过时叠音）。 */
let activeSound = null;
/** 停止当前音频（无音频时静默）。 */
function stopSound() {
	const audio = activeSound;
	activeSound = null;
	if (audio === null) return;
	try {
		audio.pause();
		audio.currentTime = 0;
	} catch {}
}
/**
* 播放音效：builtin-* 走 Web Audio 合成；其余走宿主半静态路由下的 mp3。
* 音频取不到或播放被拒（路由缺席、被浏览器策略拦截）时回退合成音，
* 保证「有动静」这件事不丢。
* @param id - 音效 id。
* @param volume - 音量 0–1。
* @param kind - "done" | "pending"，仅决定回退合成音的音高走向。
*/
function playSound(id, volume, kind) {
	const level = normalizeVolume(volume);
	if (level <= 0) return;
	const name = typeof id === "string" ? id : "";
	stopSound();
	if (name === "" || name.startsWith("builtin-")) {
		playChime(name === "builtin-up" ? "done" : name === "builtin-down" ? "pending" : kind, level);
		return;
	}
	try {
		const audio = new Audio(SOUND_ROUTE + "/" + name + ".mp3");
		audio.volume = level;
		activeSound = audio;
		const played = audio.play();
		if (played !== void 0 && typeof played.catch === "function") played.catch(() => {
			if (activeSound === audio) activeSound = null;
			playChime(kind, level);
		});
	} catch {
		playChime(kind, level);
	}
}
		//#region src/sound-picker.tsx
		/**
		* 音效下拉（自绘，不用原生 select）：原生下拉的选项由操作系统绘制，
		* 拿不到 hover 事件，做不到「悬浮哪个听哪个」。这里用绝对定位面板自绘：
		* - 悬浮选项 120ms 后试听（轻微防抖，鼠标扫过整列时不会连成一片）；
		* - 点击选中并收起；点面板外或按 Esc 收起。
		* 样式照官方：触发按钮＝LanguageRow 的 .selector（36px/18px 圆角/bg-module-platform），
		* 面板＝primitives Menu（bg-layer-3 + .5px 边框 + 6px 圆角 + padding 4px），条目标高用 interactive-bg-hover。
		*/
		function SoundPicker(props) {
			const value = props.value;
			const groups = props.groups;
			const names = props.names;
			const volume = props.volume;
			const kind = props.kind;
			const t = props.t;
			const onChange = props.onChange;
			const state = (0, react.useState)(false);
			const open = state[0];
			const setOpen = state[1];
			/** 触发按钮悬停态（官方下拉没有可用的 CSS 类，用行内样式复刻 hover 换填充色）。 */
			const hoverState = (0, react.useState)(false);
			const hover = hoverState[0];
			const setHover = hoverState[1];
			/** 面板里当前悬浮的选项 id（给出与官方菜单一致的 hover 反馈）。 */
			const hoverIdState = (0, react.useState)(void 0);
			const hoverId = hoverIdState[0];
			const setHoverId = hoverIdState[1];
			const wrapRef = (0, react.useRef)(null);
			const hoverTimer = (0, react.useRef)(void 0);
			(0, react.useEffect)(() => {
				if (!open) return void 0;
				const onPointerDown = (event) => {
					const node = wrapRef.current;
					if (node !== null && node !== void 0 && !node.contains(event.target)) setOpen(false);
				};
				const onKeyDown = (event) => {
					if (event.key === "Escape") setOpen(false);
				};
				document.addEventListener("mousedown", onPointerDown);
				document.addEventListener("keydown", onKeyDown);
				return () => {
					document.removeEventListener("mousedown", onPointerDown);
					document.removeEventListener("keydown", onKeyDown);
				};
			}, [open]);
			/** 清掉待触发的悬浮试听（离开列表或收起面板时用）。 */
			const clearHover = () => {
				if (hoverTimer.current !== void 0) {
					clearTimeout(hoverTimer.current);
					hoverTimer.current = void 0;
				}
			};
			(0, react.useEffect)(() => clearHover, []);
			/** 悬浮试听：120ms 防抖，避免鼠标扫过整列时连响。 */
			const hoverPreview = (id) => {
				clearHover();
				hoverTimer.current = setTimeout(() => {
					hoverTimer.current = void 0;
					playSound(id, volume, kind);
				}, 120);
			};
			const panelStyle = {
				position: "absolute",
				zIndex: 30,
				top: 40,
				right: 0,
				width: "100%",
				minWidth: 96,
				maxHeight: 284,
				overflowY: "auto",
				padding: 4,
				boxSizing: "border-box",
				display: "flex",
				flexDirection: "column",
				background: "var(--dsw-alias-bg-layer-3)",
				border: "0.5px solid var(--dsw-alias-border-l2)",
				borderRadius: 6
			};
			const groupStyle = {
				padding: "6px 8px 2px",
				color: "var(--dsw-alias-label-tertiary)",
				fontSize: 11,
				lineHeight: "16px"
			};
			const optionStyle = {
				display: "flex",
				alignItems: "center",
				gap: 6,
				width: "100%",
				boxSizing: "border-box",
				padding: "5px 8px",
				border: "none",
				borderRadius: 4,
				background: "transparent",
				color: "var(--dsw-alias-label-primary)",
				fontSize: "var(--dsh-content-font-size-secondary, 13px)",
				textAlign: "left",
				cursor: "pointer"
			};
			return (0, react_jsx_runtime.jsxs)("div", {
				ref: wrapRef,
				style: {
					position: "relative",
					flex: "0 0 auto"
				},
				children: [
					(0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-haspopup": "listbox",
						"aria-expanded": open,
						title: t("soundPick"),
						onClick: () => setOpen(!open),
						onMouseEnter: () => setHover(true),
						onMouseLeave: () => setHover(false),
						/* 官方下拉配方（LanguageRow.module.css 的 .selector 原样搬过来）：
						   36px 高 / 18px 圆角 / bg-module-platform 填充，hover 换 interactive-bg-hover。 */
						style: {
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "space-between",
							gap: 12,
							boxSizing: "border-box",
							minWidth: 132,
							maxWidth: 220,
							height: 36,
							padding: "0 14px",
							border: "none",
							borderRadius: 18,
							background: hover ? "var(--dsw-alias-interactive-bg-hover)" : "var(--dsw-alias-bg-module-platform)",
							color: "var(--dsw-alias-label-primary)",
							font: "inherit",
							fontSize: 14,
							lineHeight: "22px",
							cursor: "pointer"
						},
						children: [
							(0, react_jsx_runtime.jsx)("span", {
								style: {
									flex: 1,
									minWidth: 0,
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
									textAlign: "left"
								},
								children: names[value] ?? value
							}),
							(0, react_jsx_runtime.jsx)(primitives.IconChevronDownOutlineRegular, { style: { flex: "none" } })
						]
					}),
					open ? (0, react_jsx_runtime.jsxs)("div", {
						role: "listbox",
						style: panelStyle,
						onMouseLeave: () => {
						clearHover();
						setHoverId(void 0);
					},
						children: groups.flatMap((pack) => [
							(0, react_jsx_runtime.jsx)("div", {
								style: groupStyle,
								children: pack.group
							}, "group-" + pack.group),
							...pack.items.map((item) => {
								const selected = item.id === value;
								return (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									role: "option",
									"aria-selected": selected,
									onMouseEnter: () => {
									setHoverId(item.id);
									hoverPreview(item.id);
								},
									onFocus: () => hoverPreview(item.id),
									onClick: () => {
										clearHover();
										setOpen(false);
										onChange(item.id);
									},
									style: {
										...optionStyle,
										background: item.id === hoverId ? "var(--dsw-alias-interactive-bg-hover)" : selected ? "var(--dsw-alias-button-ghost-active-fill)" : "transparent",
										color: selected ? "var(--dsw-alias-brand-primary)" : "var(--dsw-alias-label-primary)"
									},
									children: [
										(0, react_jsx_runtime.jsx)("span", {
											style: {
												flex: 1,
												minWidth: 0,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap"
											},
											children: item.label
										}),
										selected ? (0, react_jsx_runtime.jsx)("span", { children: "✓" }) : null
									]
								}, item.id);
							})
						])
					}) : null
				]
			});
		}
		//#endregion
		//#region src/settings-section.tsx
		/**
		* 写入辅助：0.1.7 的 set/unset 返回 Promise<boolean> —— Host 业务拒绝给 false
		* （含 revision 冲突，控制器会自己重读镜像），传输/宿主故障则 reject。
		* 设置页是即时生效的（没有暂存/保存按钮），UI 不回滚。
		*
		* 但「只 warn 不重试」会把瞬时失败变成静默 bug：宿主 dsh-config-editor.edit 在
		* 条目正在 reload、fiber 不是 ACTIVE、文件锁被占时抛错，revision 冲突则回 false
		* —— 这些都是**瞬时**的，而 set/unset 是幂等的标量赋值，重试安全。失败时滑杆
		* 会因受控 value 回弹，看着像「点了没反应」，实际是压根没写进 profile
		* （2026-09-26 用户反馈：音量点击有时生效有时不生效）。
		*
		* 200ms / 600ms 各重试一次；同字段被更新的写入取代就放弃旧重试，免得旧值盖回新值。
		* 首次尝试是同步发起的（调用点紧跟着的断言/交互反馈不被推迟到微任务）。
		* 定义在模块级：设置页组件不在 apply 的作用域内，scope 由槽位注入。
		*
		* 返回值（供音量滑杆判断「这一笔到底落盘没有」）：true = 宿主已接受；false = 用尽重试
		* 被拒，或已被同一字段的更新写入接管（此时真值归新写入，调用方按值比对决定是否回滚）。
		* @param perform - 执行一次写入，返回 Promise<boolean>。
		* @param label - 字段名：日志定位 + 同字段重试的去重键。
		* @returns Promise<boolean> —— true 表示已落盘。
		*/
		const WRITE_RETRY_DELAYS = [200, 600];
		const writeEpochs = /* @__PURE__ */ new Map();
		const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
		/**
		* 作废同字段更早发起、还没落地的重试（新值已经接管）。
		* 只影响 retry 判定，正在途中的那次 perform 不受干扰。
		* @param label - 字段名（与 submit 的去重键同一个）。
		*/
		const supersede = (label) => {
			writeEpochs.set(label, (writeEpochs.get(label) ?? 0) + 1);
		};
		const submit = (perform, label = "settings") => {
			const epoch = (writeEpochs.get(label) ?? 0) + 1;
			writeEpochs.set(label, epoch);
			const run = async (attempt) => {
				if (attempt > 0 && writeEpochs.get(label) !== epoch) return false;
				let accepted;
				try {
					accepted = await perform();
				} catch (error) {
					if (attempt >= WRITE_RETRY_DELAYS.length) {
						console.warn(`dsh-notice-center: settings write failed (${label}, 第 ${attempt + 1} 次)`, error);
						return false;
					}
					await wait(WRITE_RETRY_DELAYS[attempt]);
					return run(attempt + 1);
				}
				if (accepted !== false) return true;
				if (attempt >= WRITE_RETRY_DELAYS.length) {
					console.warn(`dsh-notice-center: settings write was not accepted (${label}, 第 ${attempt + 1} 次)`);
					return false;
				}
				await wait(WRITE_RETRY_DELAYS[attempt]);
				return run(attempt + 1);
			};
			return run(0);
		};
		/**
		* 手势静默窗口：多久没再动过，就把攒下的最新值写出去（并结束这个手势）。
		*
		* 为什么必须合并写（2026-09-26 现场取证）：每笔 set/unset 都走 dsh-config-editor.edit
		* —— 重写整份 profile 的 cordis.patch.yml + Loader 热重载插件条目，实测约 1s/笔；而
		* 原生滑杆每挪一格、原生取色器每拖一下就发一次 input，一次拖动几十笔全排进写队列，
		* 回显被拖到好几秒之后，受控 value 又一直被旧快照拽回去 —— 表现就是「改了没反应、等
		* 半天才变、还一直往回掉」。手势内改值时用 supersede() 作废上一笔还没落地的重试，
		* 所以再短的窗口也不会让旧值盖回新值。
		*/
		const VOLUME_QUIET_MS = 150;
		/**
		* 手势合并写（音量滑杆 + 颜色取色器共用）：一次拖动/连点只落「首笔立即 + 静默后补一笔」。
		*
		* 拆成模块级工厂而不是每处手写：滑杆那次排查踩过的坑（逐 input 写宿主 → 写队列堆积
		* → 受控回显被旧快照拽回去）在取色器上一模一样，逻辑只留一份，行为由
		* test/client-half.smoke.mjs 第 17/18 节钉死。
		*
		* @param label - 字段名：日志定位 + 同字段重试去重键（手势内改值会 supersede 旧重试）。
		* @param commit - 实际写入，返回 Promise<boolean>（宿主是否已接受）。
		* @param onSettle - 一笔写入落定后的回调：（本次写的值, 是否落盘, 是否还有排队值）。
		* @returns push / drop / dispose 三个操作。
		*/
		const createGestureWriter = (label, commit, onSettle) => {
			const state = { started: false, inFlight: false, queued: void 0, quiet: void 0, disposed: false };
			const armQuiet = () => {
				if (state.quiet !== void 0) clearTimeout(state.quiet);
				if (state.disposed) return;
				state.quiet = setTimeout(() => {
					state.quiet = void 0;
					if (state.inFlight) return;
					if (state.queued !== void 0) flush();
					else state.started = false;
				}, VOLUME_QUIET_MS);
			};
			const flush = () => {
				const value = state.queued;
				if (value === void 0) return;
				state.queued = void 0;
				state.inFlight = true;
				submit(() => commit(value), label).then((landed) => {
					state.inFlight = false;
					onSettle?.(value, landed, state.queued !== void 0);
					/* 已卸载：不再排静默窗口，攒下的尾笔立刻补写 —— 丢了它，画面已经按最后一
					   次操作画了，宿主却停在更早的值上，草稿一撤就是「自己关掉了」。 */
					if (state.disposed) {
						flush();
						return;
					}
					armQuiet();
				});
			};
			return {
				/** 手势内的值：首笔立即写（点一下就生效），其后只攒最新值等静默窗口。 */
				push: (value) => {
					state.queued = value;
					if (state.started) {
						supersede(label);
						armQuiet();
						return;
					}
					state.started = true;
					flush();
				},
				/** 丢掉排队中的值并作废旧重试 —— 复位按钮这类「整笔覆盖」的直写要用。 */
				drop: () => {
					state.queued = void 0;
					if (state.quiet !== void 0) {
						clearTimeout(state.quiet);
						state.quiet = void 0;
					}
					supersede(label);
					state.started = false;
				},
				/** 卸载：清计时器，并把还没写出去的尾笔当场写掉（见 flush 里的 disposed 分支）。 */
				dispose: () => {
					state.disposed = true;
					if (state.quiet !== void 0) {
						clearTimeout(state.quiet);
						state.quiet = void 0;
					}
					if (!state.inFlight && state.queued !== void 0) flush();
				}
			};
		};
		/**
		* 最后一次用户操作的记录（**模块级**：跨组件实例存活）——只作**显示兜底**，不后台重推。
		*
		* 为什么不能只放在组件 state 里（2026-09-27 用户反馈「连点几次开关后，最后落在开启上，
		* 没过一会儿自动关闭」）：回显草稿是 React state，设置区会随热重载 / 面板开合重建，草稿
		* 随旧实例一起没掉，画面于是跌回一个更早的宿主值，看起来就是「自己关掉了」。所以谁渲染
		* 都先认最后一次操作（shownOf 兜底），直到快照追平（追平即交还）或超过兜底窗口。
		*
		* 写失败怎么处理**照官方「代码工作工具」开关（DeveloperToolsRow）的实现**：一次写在途
		* 就把开关禁用（busy），失败时回滚画面 + 行内报「保存失败，请重试」（failed），绝不
		* 后台悄悄重推 —— 后台重推反而会和用户接下来的点击抢着写，制造「自己变了」的现场。
		*/
		const INTENT_WINDOW_MS = 5000;
		/** key -> { value: 要写进宿主的值(undefined=unset), display: 画面上该显示的值, at } */
		const lastIntents = /* @__PURE__ */ new Map();
		/** 记下这次用户操作：新操作覆盖旧操作。 */
		const rememberIntent = (key, value, display) => {
			lastIntents.set(key, { value, display, at: Date.now() });
		};
		/** 取仍在兜底窗口内的最后操作；过期顺手清掉（画面从此只认快照）。 */
		const freshIntent = (key) => {
			const intent = lastIntents.get(key);
			if (intent === void 0) return void 0;
			if (Date.now() - intent.at > INTENT_WINDOW_MS) {
				lastIntents.delete(key);
				return void 0;
			}
			return intent;
		};
		/** 放弃这次操作（写被拒）：清掉操作记录与回显草稿，画面交还快照真值。 */
		const giveUpIntent = (key, clearDraft) => {
			const intent = lastIntents.get(key);
			lastIntents.delete(key);
			if (intent !== void 0 && clearDraft !== void 0) clearDraft(key, intent.display);
		};
		/**
		* 设置页组件 —— 注册进官方设置面板的 `settings.section` 槽。
		*
		* 三行颜色（完成/待处理/默认），每行原生 ColorPicker + hex 文本框（约 1/3 宽）
		* + 行内「恢复默认颜色」按钮（unset 该字段）：
		* - 输入合法（#RRGGBB）即写入 settings（live 生效，宿主 schema 校验兜底）；
		* - 输入非法时提示错误、不写入（拒绝写入并提示）。
		* 每行恢复按钮只清对应字段：绿/琥珀回官方默认，黑 → 官方原版。
		*
		* ⚠️ this 绑定：ConfigFormController 的方法是类方法（依赖 this.store），
		* 直接传裸引用给 useSyncExternalStore 会丢 this 导致渲染崩溃，必须箭头包装。
		*/
		function WhaleSettingsSection({ scope, t }) {
			if (scope === void 0 || t === void 0) return null;
			/* ⚠️ 所有 hook 必须在这一个函数体里无条件跑完，再进入下面的 status 分支。
			   提前 return 会让 hook 数量在两次渲染之间变化（loading 时 1 个、ready 时 6 个），
			   React 直接抛 "Rendered more hooks than during the previous render"，
			   插槽的错误边界把整页吞成空白 —— 2026-09-26 就这么白过一次。 */
			const snapshot = (0, react.useSyncExternalStore)((listener) => scope.subscribe(listener), () => scope.getSnapshot(), () => scope.getSnapshot());
			/** 通知权限的本地态（未授权提示 + 开启通知时自动请求）。 */
			const [permission, setPermission] = (0, react.useState)(notificationSupport());
			/** 两个分组的展开态（本地 UI 状态，均默认折叠）。 */
			const [colorsExpanded, setColorsExpanded] = (0, react.useState)(false);
			const [notifyExpanded, setNotifyExpanded] = (0, react.useState)(false);
			/** 音量试听的防抖计时器（拖动过程中不连响，停手后放一遍）。 */
			const volumeTimer = (0, react.useRef)(void 0);
			/**
			* 配置回显草稿（{字段: 值}）：设置区**每个**控件写入都当帧先画新值，快照追平后交还。
			*
			* 为什么每个字段都要有（2026-09-27 全量排查）：每笔写都走 dsh-config-editor.edit ——
			* 重写整份 profile 的 cordis.patch.yml + Loader 热重载插件条目，实测约 1s/笔；而官方
			* Switch 原语是 fully controlled（只认 props.checked，本组件不改 props 它就不动）、
			* 音效下拉的选中项与 trigger 文案只认 props.value、滑杆/取色器的受控 value 也会被旧
			* 快照拽回去 —— 只读快照的控件在回显到达前一直显示旧值，表现就是「点了要等一会儿
			* 才生效」。滑杆与取色器还会连发 input，写入侧同时用 createGestureWriter 合并。
			*/
			/**
			* 每字段的写入态 —— 照官方「代码工作工具」开关（DeveloperToolsRow）：
			* { busy: 一笔写在途, failed: 上一笔没写进去 }。busy → 开关 disabled（连点只会产生
			* 一笔写，这正是「连点几次后自己关掉」的官方解法）；failed → 行内 role="alert"
			* 报「保存失败，请重试」，而不是把画面悄悄摔回旧值。
			* 刻意用 useState({}) 而非 undefined：冒烟测试靠「唯一初值 undefined 的 state」定位
			* 回显草稿的 setter，多一个 undefined state 会让测试取错。
			*/
			const [writeFlags, setWriteFlags] = (0, react.useState)({});
			const draftState = (0, react.useState)(void 0);
			const drafts = draftState[0];
			const setDrafts = draftState[1];
			/** 画面读某个字段：草稿优先（当帧反馈），其次认最后一次用户操作（组件重建后草稿
			*  随旧实例没掉了，宿主又还没追平 —— 至少别闪回更早的旧值），再回快照/默认值。 */
			const shownOf = (key, fallback) => {
				if (drafts !== void 0 && drafts[key] !== void 0) return drafts[key];
				const intent = freshIntent(key);
				return intent === void 0 ? fallback : intent.display;
			};
			/** 手势写管道容器（每个字段一条，互不合并 —— 不同字段本来就是不同手势）。 */
			const writersRef = (0, react.useRef)(void 0);
			(0, react.useEffect)(() => () => {
				if (volumeTimer.current !== void 0) clearTimeout(volumeTimer.current);
				const writers = writersRef.current;
				if (writers !== void 0) for (const key of Object.keys(writers)) writers[key].dispose();
			}, []);
			/* 权限态实时化：用户在浏览器站点设置里改完通知权限回到页面，这里要立刻跟上
			   （否则一直显示「已被拒绝」，用户会以为插件坏了）。Permissions API 的 onchange
			   优先（Chrome/Firefox），focus / visibilitychange 兜底（Safari 等没有它）。 */
			(0, react.useEffect)(() => {
				const syncPermission = () => setPermission(notificationSupport());
				const stopWatching = watchNotificationPermission(syncPermission);
				window.addEventListener("focus", syncPermission);
				document.addEventListener("visibilitychange", syncPermission);
				return () => {
					if (stopWatching !== null) stopWatching();
					window.removeEventListener("focus", syncPermission);
					document.removeEventListener("visibilitychange", syncPermission);
				};
			}, []);
			/* 草稿被宿主回显追平 → 交还给快照（两者同值，画面无跳变）。
			   正常情况下 acceptView 在 mutate 应答里先折叠再 resolve，所以落定那一下就撤了；
			   这条兜的是「世代被后来的写抢先、折叠晚一步」（ConfigFormController.mutate 的
			   writeGeneration 分支）—— 不留着草稿，画面会先弹回旧值再跳回来。
			   同一次 effect 里顺带收尾最后一次操作的记录：宿主已追平就删掉（此时快照就是它，
			   显示不需要再兜底）。 */
			(0, react.useEffect)(() => {
				const snapshotValue = snapshot.value ?? {};
				if (drafts !== void 0) {
					const settled = Object.keys(drafts).filter((key) => snapshotValue[key] === drafts[key]);
					if (settled.length > 0) {
						setDrafts((draft) => {
							if (draft === void 0) return draft;
							const next = { ...draft };
							for (const key of settled) if (next[key] === snapshotValue[key]) delete next[key];
							return Object.keys(next).length > 0 ? next : void 0;
						});
					}
				}
				for (const key of [...lastIntents.keys()]) {
					const intent = freshIntent(key);
					if (intent === void 0) continue;
					if (snapshotValue[key] === intent.value) lastIntents.delete(key);
				}
			}, [snapshot, drafts]);
			/* ===== hook 到此结束，以下才可以按状态分支渲染 ===== */
			/* 0.1.7 的快照多了 status / writable：unavailable 表示宿主没提供这个条目（或页面是
			   memory 模式＝非 loopback 访问），此时没有可读写的值 —— 给一句说明，而不是画一堆
			   写了不生效的控件；loading 期间先不渲染。 */
			if (snapshot.status === "loading") return null;
			if (snapshot.status === "unavailable" || snapshot.writable === false) {
				return (0, react_jsx_runtime.jsx)("p", {
					style: {
						color: "var(--dsw-alias-label-tertiary)",
						fontSize: 13,
						lineHeight: "20px",
						margin: 0
					},
					children: t(snapshot.status === "unavailable" ? "settingsUnavailable" : "settingsReadOnly")
				});
			}
			const value = snapshot.value ?? {};
			/** 当前值（未配置回默认；本字段写过就先看草稿，保证当帧反馈）。 */
			const colorsEnabled = shownOf("colorsEnabled", value.colorsEnabled ?? COLORS_ENABLED_DEFAULT);
			const notifyEnabled = shownOf("notifyEnabled", value.notifyEnabled ?? NOTIFY_DEFAULTS.notifyEnabled);
			const notifySound = shownOf("notifySound", value.notifySound ?? NOTIFY_DEFAULTS.notifySound);
			/** 画面用的音量：草稿优先（拖动当帧反馈），否则用快照。 */
			const shownVolume = shownOf("notifyVolume", normalizeVolume(value.notifyVolume ?? NOTIFY_DEFAULTS.notifyVolume));
			const notifyAutoHide = shownOf("notifyAutoHide", value.notifyAutoHide ?? NOTIFY_DEFAULTS.notifyAutoHide);
			const notifyForeground = shownOf("notifyForeground", value.notifyForeground ?? NOTIFY_DEFAULTS.notifyForeground);
			/** 撤掉某个字段的回显草稿：只有值仍是我们当时写下的那个才撤 —— 中途被更新的
			*  手势接管时撤，会把新草稿一起抹掉。 */
			const clearDraft = (key, expected) => {
				setDrafts((draft) => {
					if (draft === void 0 || draft[key] !== expected) return draft;
					const next = { ...draft };
					delete next[key];
					return Object.keys(next).length > 0 ? next : void 0;
				});
			};
			/** 字段的手势写（每字段一条管道）：首笔立即 + 静默补笔；落定后决定草稿怎么交还。
			*  只有滑杆 / 取色器这类会连发 input 的手势才走它（一次点击 = 一笔写的走 writeField）。 */
			const writerOf = (key) => {
				if (writersRef.current === void 0) writersRef.current = {};
				return writersRef.current[key] ?? (writersRef.current[key] = createGestureWriter(key, (next) => scope.set(key, next), (next, landed, hasQueued) => {
					/* 期间又有更新的值排队 → 草稿归它管，这里不动。 */
					if (hasQueued) return;
					/* 没写进去（被拒 / 被热重载打断）→ 照官方语义回滚画面、交还真值；
					   不后台重推（后台重推会和用户接下来的手势抢着写）。 */
					if (landed !== true) {
						giveUpIntent(key, clearDraft);
						return;
					}
					/* 已落盘且快照已带上新值 → 当下交还；否则留给「追平即交还」的 effect。 */
					if ((scope.getSnapshot().value ?? {})[key] === next) clearDraft(key, next);
				}));
			};
			/**
			* 离散写（开关 / 音效下拉 / 分组开关：一次点击 = 一笔写）—— **照官方「代码工作工具」
			* 开关 DeveloperToolsRow 的实现**：当帧先画草稿（保留「点了要等一会儿才生效」的即时
			* 反馈），把 busy/failed 交给行上，由行维持 disabled 与行内报错；失败 → 回滚画面交还
			* 真值并报「保存失败」，不后台重推。
			* @returns Promise<boolean> 落盘与否（行上 busy/failed 与测试都读它）。
			*/
			const writeField = (key, next) => {
				rememberIntent(key, next, next);
				setDrafts((draft) => ({ ...(draft ?? {}), [key]: next }));
				setWriteFlags((flags) => ({ ...flags, [key]: { busy: true, failed: false } }));
				return submit(() => scope.set(key, next), key).then((landed) => {
					setWriteFlags((flags) => ({ ...flags, [key]: { busy: false, failed: landed !== true } }));
					if (landed !== true) {
						giveUpIntent(key, clearDraft);
						return false;
					}
					/* 已落盘且快照已带上新值 → 当下交还；否则留给「追平即交还」的 effect。 */
					if ((scope.getSnapshot().value ?? {})[key] === next) clearDraft(key, next);
					return true;
				});
			};
			/** 手势写（滑杆 / 取色器会连发 input）：当帧先画草稿，再交手势管道合并。 */
			const gestureField = (key, next) => {
				rememberIntent(key, next, next);
				setDrafts((draft) => ({ ...(draft ?? {}), [key]: next }));
				writerOf(key).push(next);
			};
			/** 恢复默认：当帧先显示默认值，再 unset —— 整笔覆盖，所以先丢掉排队中的取色值直写。 */
			const resetField = (key, show) => {
				rememberIntent(key, void 0, show);
				setDrafts((draft) => ({ ...(draft ?? {}), [key]: show }));
				writerOf(key).drop();
				submit(() => scope.unset(key), key).then((landed) => {
					if (landed !== true) {
						giveUpIntent(key, clearDraft);
						return;
					}
					clearDraft(key, show);
				});
			};
			/** 取色：走手势写（原生取色器拖动会连发 input，靠手势合并防写队列堆爆）。 */
			const pickColor = (key, hex) => gestureField(key, hex);
			/** 恢复默认颜色：快照里 unset 后为 undefined，画面回 COLOR_DEFAULTS。 */
			const resetColor = (key) => resetField(key, COLOR_DEFAULTS[key]);
			/** 画面用的颜色：草稿优先（当帧反馈），否则快照，再回默认。 */
			const colorOf = (key) => shownOf(key, value[key] ?? COLOR_DEFAULTS[key]);
			/**
			* 拖动/点按滑杆：走通用写（当帧画草稿 + 手势合并 —— 首笔立即写，其后只攒最新值、
			* 静默 150ms 后补最后一笔）。试听照旧 250ms 防抖；primeChime 必须在这个用户手势里调，
			* 否则防抖后 resume 可能被自动播放策略拦。
			*/
			const previewVolume = (next) => {
				gestureField("notifyVolume", next);
				primeChime();
				if (volumeTimer.current !== void 0) clearTimeout(volumeTimer.current);
				volumeTimer.current = setTimeout(() => {
					volumeTimer.current = void 0;
					const snapshot = scope.getSnapshot().value ?? {};
					playSound(snapshot.notifyDoneSound ?? NOTIFY_DEFAULTS.notifyDoneSound, next, "done");
				}, 250);
			};
			/** 官方设置行规格（对齐「通用设置 → 权限」字段的 row/title/desc 样式）。 */
			const rowStyle = {
				display: "flex",
				alignItems: "center",
				gap: 8,
				padding: "16px 0",
				borderBottom: "0.5px solid var(--dsw-alias-border-l2)"
			};
			const rowTextStyle = {
				display: "flex",
				flexDirection: "column",
				flex: 1,
				gap: 4,
				minWidth: 0,
				paddingRight: 48
			};
			const titleStyle = {
				color: "var(--dsw-alias-label-primary)",
				fontSize: 14,
				fontWeight: 400,
				lineHeight: "22px"
			};
			const descStyle = {
				color: "var(--dsw-alias-label-tertiary)",
				fontSize: 12,
				fontWeight: 400,
				lineHeight: "18px"
			};
			/** 写失败的行内报错（照官方 DeveloperToolsRow：role="alert" + 官方错误色）。 */
			const errorStyle = {
				color: "var(--dsw-alias-state-error-primary)",
				fontSize: 12,
				fontWeight: 400,
				lineHeight: "18px"
			};
			/** 权限状态 chip：贴在「系统通知」开关正下方的小胶囊。
			*  设计取舍（2026-09-27 评审，方案一）：**短状态常驻**（触摸屏、不悬停的用户也能看懂
			*  当前到底什么状态），长解释交给官方 Tooltip（hover 与 focus 都触发，键盘可达）。 */
			const chipStyle = {
				display: "inline-flex",
				alignItems: "center",
				gap: 4,
				padding: "2px 8px",
				border: "0.5px solid var(--dsw-alias-border-l2)",
				borderRadius: 999,
				color: "var(--dsw-alias-label-secondary)",
				fontSize: 12,
				lineHeight: "16px",
				whiteSpace: "nowrap"
			};
			/** 可点的「未授权 · 授权」：品牌色，是这一格里唯一能干活的东西。 */
			const chipButtonStyle = {
				...chipStyle,
				background: "transparent",
				color: "var(--dsw-alias-brand-primary)",
				cursor: "pointer"
			};
			/** 纯文字状态（不支持系统通知时用，不是可点项）。 */
			const chipTextStyle = {
				color: "var(--dsw-alias-label-tertiary)",
				fontSize: 12,
				lineHeight: "18px",
				textAlign: "right"
			};
			/** 小图标按钮（展开箭头 / 恢复默认共用）。 */
			const iconButtonStyle = {
				flex: "0 0 auto",
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				width: 28,
				height: 28,
				padding: 0,
				border: "none",
				borderRadius: 6,
				background: "transparent",
				color: "var(--dsw-alias-label-secondary)",
				cursor: "pointer"
			};
			/** 分组条目：主标题 + 描述 + 官方 Switch + 折叠展开箭头（子项由展开态控制显示）。
			*  整行可点：鼠标落在行内任意处都能折叠/展开，不必去够最右边的箭头。
			*  开关与箭头各自拦住冒泡 —— 否则点开关会连带折叠，点箭头会折叠两次（等于没反应）。
			*  箭头仍是带 aria-expanded 的真按钮，键盘可达；整行点击只是给鼠标加热区。
			*  开关本体照官方 DeveloperToolsRow：一笔写在途 disabled（连点只会产生一笔写），
			*  写没落进去就在标题下 role="alert" 报一句，不把画面悄悄摔回旧值。
			*  action（可选）＝开关正下方那一格：本插件用它挂「通知权限」状态 chip（方案一，2026-09-27）。
			*  chip 出现时整行会高一点、开关随视觉居中 —— 与官方 DeveloperToolsRow 里 description /
			*  error 撑高行的行为一致，比"偷偷偏移到别处"更不容易让人看漏。 */
			const sectionRow = (key, title, hint, checked, onChange, expanded, onToggle, expandLabel, action) => {
				const flags = writeFlags[key] ?? {};
				const switchNode = /* @__PURE__ */ (0, react_jsx_runtime.jsx)(primitives.Switch, {
					checked,
					disabled: flags.busy === true,
					label: title,
					onChange: (next) => onChange(typeof next === "boolean" ? next : !checked)
				});
				/* 开关外面这层 span 负责拦冒泡；带 chip 时它再套一层纵向列，chip 落在开关正下方。 */
				const switchCell = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					style: {
						flex: "0 0 auto",
						display: "inline-flex"
					},
					onClick: (event) => event?.stopPropagation?.(),
					children: switchNode
				});
				const switchColumn = action === void 0 || action === null ? switchCell : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					style: {
						flex: "0 0 auto",
						display: "inline-flex",
						flexDirection: "column",
						alignItems: "flex-end",
						gap: 6
					},
					onClick: (event) => event?.stopPropagation?.(),
					children: [switchCell, action]
				});
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						...rowStyle,
						cursor: "pointer"
					},
					onClick: onToggle,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: rowTextStyle,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									style: titleStyle,
									children: title
								}),
								hint === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									style: descStyle,
									children: hint
								}),
								/* 写没落进去：行内报错（照官方 DeveloperToolsRow 的 role="alert"）。 */
								flags.failed === true ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									role: "alert",
									style: errorStyle,
									children: t("saveFailed")
								}) : null
							]
						}),
					switchColumn,
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-expanded": expanded,
						"aria-label": expandLabel,
						title: expandLabel,
						onClick: (event) => {
							event?.stopPropagation?.();
							onToggle();
						},
						style: iconButtonStyle,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: {
								display: "inline-flex",
								transform: expanded ? "rotate(180deg)" : "none",
								transition: "transform 0.2s"
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(primitives.IconChevronDownOutlineRegular, { size: 14 })
						})
					})
					]
				}, key);
			};
			/** 一行子项设置：左侧标题（可带描述），右侧官方 Switch 原语（缩进 16px）。
			*  开关本体同 sectionRow：写在途 disabled、失败行内 role="alert"（照官方
			*  DeveloperToolsRow 的 busy/failed）。 */
			const switchRow = (key, label, hint, checked, onChange) => {
				const flags = writeFlags[key] ?? {};
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					...rowStyle,
					paddingLeft: 16
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: rowTextStyle,
						children: [
							label === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: titleStyle,
								children: label
							}),
							hint === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: descStyle,
								children: hint
							}),
							/* 写没落进去：行内报错（照官方 DeveloperToolsRow 的 role="alert"）。 */
							flags.failed === true ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								role: "alert",
								style: errorStyle,
								children: t("saveFailed")
							}) : null
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(primitives.Switch, {
						checked,
						disabled: flags.busy === true,
						label: label ?? hint,
						onChange: (next) => onChange(typeof next === "boolean" ? next : !checked)
					})
				]
			}, key);
			};
			/** 音量行：左侧标签，右侧原生滑杆（accent-color 跟随主题）+ 百分比。 */
			const volumeRow = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					...rowStyle,
					paddingLeft: 16
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: rowTextStyle,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: titleStyle,
							children: t("notifyVolume")
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 100,
						step: 5,
						value: Math.round(shownVolume * 100),
						"aria-label": t("notifyVolume"),
						onChange: (e) => previewVolume(Number(e.target.value) / 100),
						style: {
							flex: "0 0 auto",
							width: 140,
							accentColor: "var(--dsw-alias-brand-primary)",
							cursor: "pointer"
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						style: {
							flex: "0 0 auto",
							minWidth: 36,
							textAlign: "right",
							color: "var(--dsw-alias-label-tertiary)",
							fontSize: 12,
							lineHeight: "18px"
						},
						children: [Math.round(shownVolume * 100), "%"]
					})
				]
			}, "volume");
			/** 音效行：左侧标题，右侧官方样式下拉（悬浮选项即试听，点选生效）。 */
			const soundRow = (kind, label) => {
				const soundKey = kind === "done" ? "notifyDoneSound" : "notifyPendingSound";
				const currentSound = shownOf(soundKey, value[soundKey] ?? NOTIFY_DEFAULTS[soundKey]);
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					...rowStyle,
					paddingLeft: 16
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: rowTextStyle,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: titleStyle,
							children: label
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SoundPicker, {
						value: currentSound,
						groups: soundLibrary(t),
						names: soundNames(t),
						volume: shownVolume,
						kind,
						t,
						onChange: (next) => writeField(soundKey, next)
					})
				]
			}, kind);
			};
			/** 一行颜色子项：左侧标签，右侧鲸鱼图标（按配置色填充，点击调起取色器）+ ↺ 恢复默认。 */
			const colorRow = (key, label, onReset) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					...rowStyle,
					paddingLeft: 16
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: rowTextStyle,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: titleStyle,
							children: label
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						style: {
							flex: "0 0 auto",
							position: "relative",
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							width: 28,
							height: 28,
							cursor: "pointer"
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								style: {
									display: "inline-flex",
									color: colorOf(key)
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
									viewBox: "0 0 50 50",
									width: 22,
									height: 22,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: WHALE_SHAPE_PATH,
										fill: "currentColor"
									})
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "color",
								value: colorOf(key),
								onChange: (e) => pickColor(key, e.target.value),
								"aria-label": label,
								style: {
									position: "absolute",
									inset: 0,
									width: "100%",
									height: "100%",
									padding: 0,
									border: "none",
									opacity: 0,
									cursor: "pointer"
								}
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						title: t("restore"),
						"aria-label": t("restore"),
						onClick: onReset,
						style: iconButtonStyle,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(primitives.IconRefreshOutlineRegular, { size: 14 })
					})
				]
			}, key);
			/** 在手势里要权限（会弹浏览器授权窗）并把结果写回权限态。
			*  ⚠️ 只能在点击处理函数的**同步**路径里调用：中间插一个 await，浏览器就直接不弹了
			*  （表现为「点开关没反应」，桌面手测很难发现）。 */
			const askPermission = () => requestNotificationPermission().then((result) => {
				setPermission(result);
				if (result === "granted") showPermissionConfirmation(t("notifyPermissionTitle"), t("permissionGranted"));
				return result;
			});
			/**
			* 打开通知总开关：**先**在手势里要权限（浏览器只认用户手势，晚一步就被拒），
			* 再写配置、最后预热音频（音频预热对是否手势不敏感，权限弹窗优先）。
			* @returns 权限请求的 promise（没要权限时 undefined）—— 行上/测试用它等落定。
			*/
			const setNotifyEnabled = (next) => {
				const asked = next && notificationSupport() === "default" ? askPermission() : void 0;
				writeField("notifyEnabled", next);
				if (next) primeChime();
				return asked;
			};
			/**
			* 通知权限状态 chip —— 挂在「系统通知」开关正下方，只在开着通知、又还没拿到权限时出现。
			* - default（从没问过 / 用户上次把授权窗直接点掉了）：「未授权 · 授权」按钮 → 当场再要一次；
			* - denied：叹号 + 「已被拒绝」，浏览器不会再弹窗，恢复路径在悬浮提示里；
			* - unsupported：一句话（多半不是安全上下文，例如用局域网 IP 打开）；
			* - granted：不渲染，行保持干净。
			* 取舍（2026-09-27 评审方案一）：**短状态常驻**（触摸屏、不悬停的用户也能看懂现在到底是什么
			* 状态），长解释交给官方 Tooltip（hover 与 focus 都触发，键盘可达）。Tooltip 的长文案按官方
			* 注释设 maxWidth，免得糊成一条比行还宽的板子；side 用 bottom —— 这个位置在行右下角，
			* right 容易贴边。chip 独立于开关的 busy/disabled：它只调权限请求，不写配置。
			*/
			const permissionChip = () => {
				if (!notifyEnabled || permission === "granted") return null;
				if (permission === "unsupported") return (0, react_jsx_runtime.jsx)("span", {
					style: chipTextStyle,
					children: t("permissionUnsupported")
				}, "permission-chip");
				if (permission === "denied") return (0, react_jsx_runtime.jsx)(primitives.Tooltip, {
					label: t("permissionDeniedHint"),
					side: "bottom",
					maxWidth: 320,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						tabIndex: 0,
						style: chipStyle,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(primitives.IconWarningOutlineRegular, { size: 14 }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("permissionDeniedChip") })
						]
					})
				}, "permission-chip");
				return (0, react_jsx_runtime.jsx)(primitives.Tooltip, {
					label: t("permissionPendingHint"),
					side: "bottom",
					maxWidth: 320,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: askPermission,
						style: chipButtonStyle,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(primitives.IconQuestionOutlineRegular, { size: 14 }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("permissionPendingChip") })
						]
					})
				}, "permission-chip");
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column"
				},
				children: [
					/* 页脚占标题那一行：「鲸鱼状态灯」分组行之上，官方 .options 自身没有标题。
					   它不是设置项，所以不带 borderBottom，只是居中的一行小字链接。 */
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PluginFooter, {
						name: t("nav"),
						version: PLUGIN_VERSION,
						repo: PLUGIN_REPO,
						t
					}),
					sectionRow("colorsEnabled", t("groupColors"), t("colorsHint"), colorsEnabled, (next) => writeField("colorsEnabled", next), colorsExpanded, () => setColorsExpanded((current) => !current), t("colorsExpand")),
					colorsExpanded ? colorRow("green", t("greenLabel"), () => resetColor("green")) : null,
					colorsExpanded ? colorRow("amber", t("amberLabel"), () => resetColor("amber")) : null,
					colorsExpanded ? colorRow("black", t("blackLabel"), () => resetColor("black")) : null,
					sectionRow("notifyEnabled", t("groupNotify"), t("notifyEnabledHint"), notifyEnabled, setNotifyEnabled, notifyExpanded, () => setNotifyExpanded((current) => !current), t("notifyExpand"), permissionChip()),
					notifyExpanded ? switchRow("notifyAutoHide", t("notifyAutoHide"), t("notifyAutoHideHint"), notifyAutoHide, (next) => writeField("notifyAutoHide", next)) : null,
					notifyExpanded ? switchRow("notifyForeground", t("notifyForeground"), t("notifyForegroundHint"), notifyForeground, (next) => writeField("notifyForeground", next)) : null,
					notifyExpanded ? switchRow("notifySound", t("notifySound"), void 0, notifySound, (next) => writeField("notifySound", next)) : null,
					notifyExpanded ? volumeRow() : null,
					notifyExpanded ? soundRow("done", t("notifyDoneSound")) : null,
					notifyExpanded ? soundRow("pending", t("notifyPendingSound")) : null
				]
			});
		}
		/**
		* 设置页页脚（标题行）：插件名 + 版本号，整块是打开仓库的链接。
		*
		* 位置：设置区第一项，即「鲸鱼状态灯」分组行上方。官方 .options 自身没有标题，
		* 这一行就占标题位 —— 左对齐（justifyContent:flex-start，与分组标题文字同一条左边缘；
		* 外层无左 padding，容器 .options 的 24px 就是共同左边界）。"贴底"那套
		* （minHeight:100% + marginTop:auto）已随位置调整一并去掉。
		* 独立组件而非内联，原因同 SoundPicker —— hover 态要 useState，而设置在
		* WhaleSettingsSection 里多一个布尔 state 会污染冒烟测试对展开态 setter 的计数
		* （test/client-half.smoke.mjs 断言「两个折叠分组各有一个展开态 setter」）。
		*/
		function PluginFooter({ name, version, repo, t }) {
			const [hover, setHover] = (0, react.useState)(false);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				"data-plugin": PLUGIN_NAME,
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "flex-start",
					padding: "2px 0 14px"
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("a", {
					href: repo,
					target: "_blank",
					rel: "noreferrer",
					title: t("footerRepoTitle"),
					"aria-label": t("footerRepoTitle"),
					onMouseEnter: () => setHover(true),
					onMouseLeave: () => setHover(false),
					onFocus: () => setHover(true),
					onBlur: () => setHover(false),
					style: {
						display: "inline-flex",
						alignItems: "center",
						gap: 6,
						color: hover ? "var(--dsw-alias-brand-primary)" : "var(--dsw-alias-label-tertiary)",
						fontSize: 12,
						lineHeight: "18px",
						textDecoration: hover ? "underline" : "none",
						cursor: "pointer"
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: name }, "name"),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: { fontVariantNumeric: "tabular-nums" },
							children: "v" + version
						}, "version")
					]
				})
			});
		}
//#endregion
		//#region src/client.ts
		const DEFAULT_HREF = "/favicon.svg";
		const inject = [
			"sessions",
			"slots",
			"locale",
			"configForms"
		];
		/**
		* 本轮用时文案（格式照官方 formatRunDuration：满 60 秒进位到分，秒补零）。
		* 官方在会话气泡的「本轮用时和速度」里用的是同一套模板，两处读起来一致。
		* @param ms - 毫秒；负数按 0 处理。
		* @param t - 命名空间文案函数。
		* @returns 形如「13秒」/「2分05秒」。
		*/
		function formatRunDuration(ms, t) {
			const total = Math.max(0, Math.floor(ms / 1e3));
			const minutes = Math.floor(total / 60);
			const seconds = total % 60;
			return minutes > 0 ? t("durationMinutes", {
				minutes,
				seconds: String(seconds).padStart(2, "0")
			}) : t("durationSeconds", { seconds });
		}
		function apply(ctx) {
			const list = ctx.sessions.list;
			/**
			* 绑定本体设置条目。0.1.7 起旧的 `settingsScope` 服务已删除，改用
			* `configForms.get(条目 id)` —— 这个 id 就是 SETTINGS_NAMESPACE，也是
			* cordis.patch.yml 插入的 Loader 条目 id（`id: notice-center`）。
			* 快照多出 status / writable / revision：status 为 unavailable 表示宿主没有
			* 这个条目（或页面是 memory 模式＝非 loopback），此时读写都不生效。
			*/
			const scope = ctx.configForms.get(SETTINGS_NAMESPACE);
			/**
			* 官方会话状态（0.1.7 的 uiSession.sessionStatus）：Map<会话 id,
			* {running, pendingInteraction, completionUnread}>。旧的行字段 completed /
			* pendingInteraction 与 uiSession.pendingInteractions store 都已删除 ——
			* 官方 workspace 的会话行用同一套映射（completed = completionUnread）。
			*/
			let statusMap = new Map();
			/** 已完成/待处理通知的去重键（sessionId 加冒号加 kind）。 */
			const notified = new Set();
			/** 聚合队列与窗口：同一批状态跃迁合并成一条通知，避免刷屏。 */
			const notifyQueue = new Map();
			let notifyTimer;
			/** 已通知过的会话完成态，用于识别 false → true 跃迁。 */
			const prevCompleted = new Map();
			/** 本轮运行起点（running false→true 时记下）。首次观察时已在跑的会话不记 ——
			*  那样只能算出「我们看了多久」而不是本轮用时，宁可不出这个数。 */
			const runStartedAt = new Map();
			/** 每会话最近一次运行的用时（毫秒）：completed 跃迁那条路径晚于 running 边沿，需要它。 */
			const lastRunMs = new Map();
			/** 上一轮待处理会话集合与首帧标记（首帧不通知，避免刷新页面时轰炸）。 */
			let prevPending = new Set();
			let pendingSeen = false;
			/** 跨标签页协调器（在下面的未读集合处真正创建并 start）。 */
			let crossTab = null;
			/** 页面是否真的处于前台：**任一**标签页可见 **且** 该窗口有焦点。
			*  只看本标签页的 document.visibilityState，会把「浏览器被别的应用压在后面」误判成
			*  「正在看」——而那恰恰是最该提醒的时候，因此补上 document.hasFocus()；
			*  再往下还有一层：多标签页时 B 标签正在看，隐藏的 A 标签不能以为没人在看
			*  （聚合判定在 createCrossTab.isForeground，2026-09-27 修）。 */
			function isForeground() {
				if (crossTab !== null) return crossTab.isForeground();
				return document.visibilityState === "visible" && document.hasFocus();
			}
			/** 读取通知配置（未配置回默认值）。 */
			function notifyConfig() {
				const snapshot = scope.getSnapshot().value ?? {};
				return {
					enabled: snapshot.notifyEnabled ?? NOTIFY_DEFAULTS.notifyEnabled,
					sound: snapshot.notifySound ?? NOTIFY_DEFAULTS.notifySound,
					volume: normalizeVolume(snapshot.notifyVolume ?? NOTIFY_DEFAULTS.notifyVolume),
					autoHide: snapshot.notifyAutoHide ?? NOTIFY_DEFAULTS.notifyAutoHide,
					foreground: snapshot.notifyForeground ?? NOTIFY_DEFAULTS.notifyForeground,
					doneSound: snapshot.notifyDoneSound ?? NOTIFY_DEFAULTS.notifyDoneSound,
					pendingSound: snapshot.notifyPendingSound ?? NOTIFY_DEFAULTS.notifyPendingSound
				};
			}
			/**
			* 记录一条待发通知（总开关关闭时跳过 + 去重 + 300ms 聚合）。
			* @param kind - 通知类别："done" | "pending"。
			* @param sessionId - 会话 id。
			* @param label - 会话显示名；聚合后作为通知**标题**。
			* @param typeLabel - 通知**正文**（仅 pending 用）：交互类型文案；缺省回退到通用标题。
			* @param durationMs - 本轮用时（仅 done 用）；算不出起点时传 undefined，正文就不带这个数。
			*/
			function queueNotification(kind, sessionId, label, typeLabel, durationMs) {
				if (!notifyConfig().enabled) return;
				const key = sessionId + ":" + kind;
				if (notified.has(key)) return;
				notified.add(key);
				notifyQueue.set(key, {
					kind,
					sessionId,
					label,
					typeLabel,
					durationMs
				});
				if (notifyTimer === void 0) notifyTimer = setTimeout(flushNotifications, 300);
			}
			/** 发送聚合后的系统通知（仅在已授权、且按配置允许时真正弹出）。 */
			function flushNotifications() {
				notifyTimer = void 0;
				const entries = [...notifyQueue.values()];
				notifyQueue.clear();
				if (entries.length === 0) return;
				if (notificationSupport() !== "granted") return;
				/* 副作用（通知 + 提示音）只由一个标签页执行：否则两个标签页都不在前台时，
				   同一次完成会各弹一条、各响一次（多标签页重复提醒，2026-09-27 修）。
				   非主标签页直接丢掉自己那份队列 —— 主标签页也检测到了同一个边沿。 */
				if (crossTab !== null && !crossTab.isLeader()) return;
				const config = notifyConfig();
				/* 前台策略：「前台」= 标签页可见 且 窗口有焦点（见 isForeground）。默认只在不在
				   前台时打扰；开启「前台也提醒」(notifyForeground) 后正在看也弹 —— 用于人还停在
				   当前会话、却已离开屏幕（刷手机等）的场景。 */
				if (!config.foreground && isForeground()) return;
				const t = ctx.locale.bind(SETTINGS_NAMESPACE);
				const grouped = new Map();
				for (const entry of entries) {
					const list = grouped.get(entry.kind) ?? [];
					list.push(entry);
					grouped.set(entry.kind, list);
				}
				for (const [kind, list] of grouped) {
					const head = list[0];
					const extra = list.length - 1;
					/* 标题＝会话名（聚合时补「 +N」）；正文＝通知类型。 */
					let title = head.label ?? head.sessionId;
					if (extra > 0) title = title + " +" + String(extra);
					let type = kind === "done" ? t("notifyDoneTitle") : head.typeLabel ?? t("notifyPendingTitle");
					/* 用时只在「单独一条完成通知」时附加：聚合时一条正文挂 N 个用时无从表达。 */
					if (kind === "done" && extra === 0 && head.durationMs !== void 0) type = type + " · " + t("notifyDuration", { duration: formatRunDuration(head.durationMs, t) });
					try {
						const notification = new Notification(title, {
							body: type,
							/* 不要设置 tag：同一会话反复跑完会复用同一个 tag，Windows/Chrome 会把它当成
							   「更新已有通知」（静默替换、不再弹横幅）——表现为「同一对话只有第一条会弹」
							   「同一条命令第一次全弹、第二次全不弹」。每条事件本就该各自弹一次，故整条去掉。 */
							icon: uri(kind === "done" ? colors().green : colors().amber),
							silent: config.sound,
							/* 关闭「自动隐藏」＝请求常驻：通知会一直显示，直到用户激活或关闭它。 */
							requireInteraction: !config.autoHide
						});
						if (config.sound) playSound(kind === "done" ? config.doneSound : config.pendingSound, config.volume, kind);
						notification.onclick = () => {
							try {
								window.focus();
							} catch {}
							try {
								ctx.sessions.open(head.sessionId);
							} catch {}
							notification.close();
						};
					} catch (error) { console.warn("[notice-center] 通知构造失败", error); }
				}
			}
			/** 待处理交互 kind → i18n key。kind 由各域自行声明：approval 来自
			*  dsh-client-ui-approval；question 与 plan-review 来自 dsh-client-ui-user-questions。 */
			const PENDING_KIND_KEYS = {
				approval: "pendingKindApproval",
				question: "pendingKindQuestion",
				"plan-review": "pendingKindPlanReview"
			};
			/** 工具名上限：超长会撑破通知正文（Windows 通知一两行就截断），超出截断加省略号。 */
			const TOOL_NAME_LIMIT = 32;
			/**
			* 待处理交互 → 通知正文文案。
			*
			* kind 只到「审批 / 提问 / 计划待审核」这一层（官方 SessionPendingInteractionStatus
			* 就这三种），更细的信息在 entry 的 domain 字段上：审批的 toolName、提问的 questions
			* 批次。这里读这些字段做细化，**全部防御式读取** —— bundle 不 import 那些类型，
			* 字段缺席、类型不符（第三方域自造 kind）时逐级降级，绝不显示错误的类型名。
			* @param interaction - sessionStatus 里的 pendingInteraction；缺席时为 undefined。
			* @returns 正文文案；完全认不出时 undefined，调用方回退「有交互等待处理」。
			*/
			function pendingTypeLabel(interaction) {
				const t = ctx.locale.bind(SETTINGS_NAMESPACE);
				const kind = interaction?.kind;
				if (kind === "approval") {
					const tool = interaction.toolName;
					if (typeof tool !== "string" || tool === "") return t("pendingKindApproval");
					const shown = tool.length > TOOL_NAME_LIMIT ? tool.slice(0, TOOL_NAME_LIMIT) + "…" : tool;
					return t("pendingApprovalTool", { tool: shown });
				}
				if (kind === "question") {
					const questions = Array.isArray(interaction.questions) ? interaction.questions : [];
					if (questions.length > 1) return t("pendingQuestionBatch", { count: questions.length });
					const first = questions[0];
					/* 只有一条也要能读出「要不要动键盘」：有选项＝选择，无选项＝自己写。 */
					if (first === null || typeof first !== "object") return t("pendingKindQuestion");
					const options = Array.isArray(first.options) ? first.options : [];
					if (options.length === 0) return t("pendingQuestionFill");
					return first.multiSelect === true ? t("pendingQuestionMulti") : t("pendingQuestionChoose");
				}
				const key = PENDING_KIND_KEYS[kind];
				return key === void 0 ? void 0 : t(key);
			}
			/**
			* 0.1.7 的会话行视图：把官方 sessionStatus 合并进 list 的行。
			* 旧行字段 completed / pendingInteraction 已删，running 也可能缺省，因此三个
			* 状态字段一律取自官方状态（映射同官方 workspace 的 sessionNode）。
			* @param state - ctx.sessions.list 的快照。
			* @returns 扁平化的行数组（id/origin/title/running/completed/pending）。
			*/
			function sessionRows(state) {
				return Object.values(state.byId).map((row) => {
					const status = statusMap.get(row.id);
					return {
						id: row.id,
						origin: row.origin,
						title: row.displayTitle ?? row.title ?? row.id,
						running: status?.running ?? row.running === true,
						completed: status?.completionUnread === true,
						pending: status?.pendingInteraction
					};
				});
			}
			/** 状态跃迁检测：completed 由 false 变 true、以及新出现的待处理会话。 */
			function detectTransitions(state) {
				const rows = sessionRows(state);
				for (const row of rows) {
					if (row.origin === "subagent") continue;
					const before = prevCompleted.get(row.id);
					const now = row.completed === true;
					if (before === false && now) queueNotification("done", row.id, row.title, void 0, lastRunMs.get(row.id));
					if (!now) notified.delete(row.id + ":done");
					prevCompleted.set(row.id, now);
				}
				const alive = new Set(rows.map((row) => row.id));
				for (const id of [...prevCompleted.keys()]) if (!alive.has(id)) {
					prevCompleted.delete(id);
					notified.delete(id + ":done");
				}
				const pendingNow = new Map(rows.filter((row) => row.pending !== void 0).map((row) => [row.id, row]));
				const current = new Set(pendingNow.keys());
				if (pendingSeen) for (const id of current) {
					if (prevPending.has(id)) continue;
					const row = pendingNow.get(id);
					if (row !== void 0 && row.origin === "subagent") continue;
					queueNotification("pending", id, row?.title ?? id, pendingTypeLabel(row?.pending));
				}
				for (const id of prevPending) if (!current.has(id)) notified.delete(id + ":pending");
				prevPending = current;
				pendingSeen = true;
			}
			/**
			* 页面里的**全部** favicon link。宿主 index.html 挂了两枚 —— dark / light 各一枚，
			* 靠 media="(prefers-color-scheme: …)" 区分，浏览器按系统主题挑一枚用。
			* 早先这里用 querySelector 只拿到**第一枚**（dark 那枚），浅色系统实际渲染的是
			* 第二枚 —— 于是状态灯改了也看不见：2026-09-26 用户反馈「标签页图标一直默认色」。
			* 一枚都没有就自建一枚，否则整条改色路径会静默失效（什么也不改，也不报错）。
			*/
			const faviconLinks = () => {
				const found = [...document.head.querySelectorAll("link[rel~=\"icon\"]")];
				if (found.length > 0) return found;
				const link = document.createElement("link");
				link.rel = "icon";
				link.type = "image/svg+xml";
				link.href = DEFAULT_HREF;
				document.head.appendChild(link);
				return [link];
			};
			/**
			* 导航图标：官方 settings.section 的图标由 shell 按 section id 硬编码（未知 id
			* 回退默认齿轮），注册选项里没有 icon 字段；这里把「通知中心」导航项那颗 svg 的
			* path 数据换成主人指定的铃铛（viewBox 0 0 1024 1024，原图三块 path）。
			*
			* 只改属性、不增删 React 管理的节点 —— 节点归 React 所有，插件增删会被下一次渲染
			* 打回齿轮。官方回退齿轮正好只有 2 个 path，所以把同为 #333333 的两块（铃身 + 底座）
			* 合并成一条 path、高光单独一条，正好复用这 2 个节点；万一官方给的图标 path 更少，
			* 只追加克隆节点（绝不删）—— React 插入时引用的是它自己管的节点，不会因此抛错。
			* 铃身/底座原色 #333333 改成 currentColor 跟随主题（深色主题下 #333333 几乎看不见），
			* 高光保留原图的 #3399FF；想要原汁原味的深灰，把 fill 改回 "#333333" 即可。
			*/
			const NAV_ICON_VIEWBOX = "0 0 1024 1024";
			const NAV_ICON_PATHS = [
				{ fill: "currentColor", d: "M921.6 880.64h-819.2A51.2 51.2 0 0 1 51.2 829.44v-66.56A107.7248 107.7248 0 0 1 158.72 655.36a30.72 30.72 0 0 0 30.72-30.72V376.832A319.6928 319.6928 0 0 1 399.36 78.2336a112.0256 112.0256 0 0 1 213.6064 0A319.6928 319.6928 0 0 1 824.32 376.832v247.808a30.72 30.72 0 0 0 30.72 30.72h10.24A107.7248 107.7248 0 0 1 972.8 762.88v66.56a51.2 51.2 0 0 1-51.2 51.2zM112.64 819.2h798.72v-56.32A46.08 46.08 0 0 0 865.28 716.8h-10.24a92.16 92.16 0 0 1-92.16-92.16V376.832a257.8432 257.8432 0 0 0-184.32-245.76l-19.0464-5.7344-2.6624-20.48a50.7904 50.7904 0 0 0-100.7616 0l-2.6624 20.48-19.0464 5.7344a257.8432 257.8432 0 0 0-184.32 245.76v247.808A92.16 92.16 0 0 1 158.72 716.8 46.08 46.08 0 0 0 112.64 762.88z M512 1024a174.2848 174.2848 0 0 1-174.08-174.08h61.44a112.64 112.64 0 0 0 225.28 0h61.44a174.2848 174.2848 0 0 1-174.08 174.08z" },
				{ fill: "#3399FF", d: "M665.6 353.6896a30.72 30.72 0 0 1-25.6-13.9264A259.4816 259.4816 0 0 0 542.72 251.904a30.72 30.72 0 0 1 28.2624-54.4768 320.9216 320.9216 0 0 1 120.6272 108.7488A30.72 30.72 0 0 1 665.6 353.6896z" }
			];
			let navIconScheduled = false;
			/** 把「通知中心」导航项的图标换成上面的铃铛（幂等：已经画过就整块跳过 —— 
			*  每次写属性都会再触发 observer，不跳过就是无限 rAF 循环）。 */
			function applyNavIcon() {
				const nav = document.querySelector("[role=\"dialog\"] nav");
				if (nav === null) return;
				const label = ctx.locale.bind(SETTINGS_NAMESPACE)("nav");
				for (const cell of nav.querySelectorAll("button")) {
					if (cell.textContent === null || !cell.textContent.includes(label)) continue;
					const svg = cell.querySelector("svg");
					if (svg === null) continue;
					let paths = [...svg.querySelectorAll("path")];
					if (paths.length === 0) continue;
					const drawn = svg.getAttribute("viewBox") === NAV_ICON_VIEWBOX
						&& paths.length >= NAV_ICON_PATHS.length
						&& NAV_ICON_PATHS.every((spec, index) => paths[index].getAttribute("d") === spec.d && paths[index].getAttribute("fill") === spec.fill)
						&& paths.slice(NAV_ICON_PATHS.length).every((path) => (path.getAttribute("d") ?? "") === "");
					if (drawn) continue;
					/* 官方图标的 path 不够用时只追加克隆节点（不删 React 管的节点）。 */
					while (paths.length < NAV_ICON_PATHS.length) {
						svg.appendChild(paths[paths.length - 1].cloneNode(false));
						paths = [...svg.querySelectorAll("path")];
					}
					svg.setAttribute("viewBox", NAV_ICON_VIEWBOX);
					svg.setAttribute("width", "16");
					svg.setAttribute("height", "16");
					paths.forEach((path, index) => {
						const spec = NAV_ICON_PATHS[index];
						if (spec === void 0) {
							path.setAttribute("d", "");
							return;
						}
						path.setAttribute("d", spec.d);
						path.setAttribute("fill", spec.fill);
						/* 官方图标是 stroke 画法（fill:none + stroke:currentColor），
						   不去掉 stroke 会在实心轮廓外再描一圈，1024 坐标下会糊成一团。 */
						path.removeAttribute("stroke");
						path.removeAttribute("fill-rule");
					});
				}
			}
			/** rAF 合并：DOM 变动频繁时每个渲染帧最多检查一次。 */
			function scheduleNavIcon() {
				if (navIconScheduled) return;
				navIconScheduled = true;
				requestAnimationFrame(() => {
					navIconScheduled = false;
					applyNavIcon();
				});
			}
			const navIconObserver = new MutationObserver(scheduleNavIcon);
			navIconObserver.observe(document.documentElement, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ["d"]
			});
			scheduleNavIcon();
			/** 每枚 icon 的原始 href —— 还原目标（比硬编码路径更稳，前端改路径也能正确还原）；
			*  两枚各记各的，dark 还原成 favicon-dark.svg、light 还原成 favicon.svg。 */
			const faviconOriginals = faviconLinks().map((link) => ({ link, href: link.href }));
			/** 应用之后才出现的 link（或自建的那枚）补记原始值，别把别人的 href 当我们的还原。 */
			const rememberFavicon = (link) => {
				if (!faviconOriginals.some((item) => item.link === link)) faviconOriginals.push({ link, href: link.href });
			};
			const setHref = (href) => {
				for (const link of faviconLinks()) {
					rememberFavicon(link);
					link.href = href;
				}
			};
			const restoreHrefs = () => {
				for (const item of faviconOriginals) item.link.href = item.href;
			};
			/** 我们最后一次设置的 href；null = 官方原样。 */
			let applied = null;
			/** 自跟踪：每会话最后观察到的 running 位（镜像官方 prevRunning 语义）。 */
			const prevRunning = /* @__PURE__ */ new Map();
			/** 未读（绿灯）集合：跨标签页共享 + 落盘（官方 completionUnread 之外的本地兜底）。
			*  只有主标签页写盘；所有标签页靠广播对齐，并各自更新自己的 favicon。 */
			const unreadStore = createUnreadStore(client_store, UNREAD_PERSIST_NAME);
			crossTab = createCrossTab({
				channelName: CROSS_TAB_CHANNEL,
				visible: () => document.visibilityState === "visible",
				focused: () => document.hasFocus(),
				load: unreadStore.load,
				save: unreadStore.save,
				/* 邻居的未读集合一到就重画 —— favicon 是每标签页独立的 DOM，不重画会停在旧颜色。 */
				onChange: () => sync()
			});
			crossTab.start();
			/**
			* 首次安装的自动授权：通知开关现在**默认开启**，打开页面后借用户的第一次交互
			* （点一下 / 按一下键）自动请求一次浏览器通知权限 —— 浏览器不允许无手势请求，页面自己
			* 弹不出来，这是能做到的最自动的形态（详见 armFirstGesturePermissionRequest）。
			* 每次打开页面最多问一次、**不落盘**：用户在授权窗上既没允许也没阻止时，权限仍算未定论，
			* 下次刷新会再问一次，直到他做出选择（或把通知开关关掉）。
			*/
			armFirstGesturePermissionRequest({
				shouldAsk: () => notificationSupport() === "default" && ((scope.getSnapshot().value ?? {}).notifyEnabled ?? NOTIFY_DEFAULTS.notifyEnabled) === true,
				onGranted: () => {
					const locale = ctx.locale.bind(SETTINGS_NAMESPACE);
					showPermissionConfirmation(locale("notifyPermissionTitle"), locale("permissionGranted"));
				}
			});
			const restore = () => {
				if (applied !== null) {
					restoreHrefs();
					applied = null;
				}
			};
			/** 当前生效的配置色（未配置回官方默认）。 */
			function colors() {
				const value = scope.getSnapshot().value ?? {};
				return {
					green: value.green ?? "#22C55E",
					amber: value.amber ?? "#F59E0B",
					black: value.black
				};
			}
			const uri = (hex) => `data:image/svg+xml,${encodeURIComponent(whaleSvg(hex))}`;
			/** running true→false 边沿跟踪（只跟踪主会话）：标签页不在台前时跑完 →
			*  绿灯记入 crossTab（跨标签页共享 + 落盘）；通知无条件入队，由 flush 按「前台也提醒」统一裁决。
			*  0.1.7 的 list 行已没有「当前选中会话」字段（state.current 已删），favicon 本来
			*  就是跨会话聚合，因此对所有主会话一视同仁；completed 的语义也已搬到
			*  status.completionUnread（官方只标「主视图之外的停顿」），这条运行边沿是
			*  「选中会话完成也提醒」的来源。重新运行、会话移除均清除。 */
			function trackEdges(state) {
				const rows = sessionRows(state);
				for (const row of rows) {
					if (row.origin === "subagent") continue;
					const prev = prevRunning.get(row.id);
					if (prev === void 0) {
						prevRunning.set(row.id, row.running);
						continue;
					}
					if (!prev && row.running) {
						runStartedAt.set(row.id, Date.now());
						/* 重新开始跑 → 清掉完成去重键，「同一会话连续完成两次」才会弹两次。 */
						notified.delete(row.id + ":done");
					}
					if (prev && !row.running) {
						const startedAt = runStartedAt.get(row.id);
						const elapsed = startedAt === void 0 ? void 0 : Date.now() - startedAt;
						runStartedAt.delete(row.id);
						if (elapsed !== void 0) lastRunMs.set(row.id, elapsed);
						/* 绿灯只记「没看着时跑完」；台前完成不记（V0-02）。 */
						if (!isForeground()) crossTab.add(row.id);
						queueNotification("done", row.id, row.title, void 0, elapsed);
					} else if (row.running) crossTab.remove(row.id);
					prevRunning.set(row.id, row.running);
				}
				const alive = new Set(rows.map((row) => row.id));
				for (const id of [...prevRunning.keys()]) if (!alive.has(id)) {
					prevRunning.delete(id);
					crossTab.remove(id);
					runStartedAt.delete(id);
					lastRunMs.delete(id);
				}
			}
			/** 回到前台（聚合判定：任一标签页可见且有焦点）→ 绿灯熄灭（V0-02）。
			*  无论集合是否非空都重画一次：集合可能已被邻居清空（那时 size() 为 0），
			*  但本标签页的 favicon 仍可能停在旧颜色上。 */
			const onForeground = () => {
				if (!isForeground()) return;
				crossTab.clearAll();
				sync();
			};
			document.addEventListener("visibilitychange", onForeground);
			window.addEventListener("focus", onForeground);
			/** 绿/琥珀判定：主会话 only；**琥珀优先于绿**。返回目标 href；null = 官方原版。 */
			function targetOf(state) {
				if ((scope.getSnapshot().value ?? {}).colorsEnabled === false) return null;
				const c = colors();
				let green = false;
				/* 顺序照官方 sessionStatuses：pending interaction 是首要状态，live activity
				   压过 completion reminder。favicon 是跨会话聚合，套用同一原则 —— 任意会话
				   「卡住等你」都压过任意会话「跑完了」，否则审批会被完成提醒整片掩盖。 */
				for (const row of sessionRows(state)) {
					if (row.origin === "subagent") continue;
					if (row.pending !== void 0) return uri(c.amber);
					if (row.completed === true || crossTab.has(row.id)) green = true;
				}
				if (green) return uri(c.green);
				return c.black ? uri(c.black) : null;
			}
			function sync() {
				const state = list.getSnapshot();
trackEdges(state);
				detectTransitions(state);
				const next = targetOf(state);
				if (next === null) restore();
				else if (applied !== next) {
					setHref(next);
					applied = next;
				}
			}
			const unsubscribeList = list.subscribe(sync);
			const unsubscribeScope = scope.subscribe(sync);
			sync();
			/**
			* 官方会话状态通道（0.1.7）：uiSession.sessionStatus 是 getSnapshot/subscribe
			* 一对的只读源。旧的 uiSession.pendingInteractions store 已变成私有实现细节，
			* 会话行上的 pendingInteraction 也被删了，所有「待处理 / 跑完 / 在跑」都从这里读。
			* ctx.inject 声明的是必需服务，服务缺席时该子 fiber 不加载（琥珀判定随之失效）。
			*/
			ctx.inject(["uiSession"], (uiCtx) => {
				const source = uiCtx.uiSession.sessionStatus;
				statusMap = source.getSnapshot();
				const unsubscribe = source.subscribe(() => {
					statusMap = source.getSnapshot();
					sync();
				});
				sync();
				return () => {
					unsubscribe();
					statusMap = /* @__PURE__ */ new Map();
					sync();
				};
			});
			ctx.effect(() => ctx.locale.register(SETTINGS_NAMESPACE, {
				zh: {
					nav: "通知中心",
					settingsUnavailable: "该插件当前未加载，暂时无法配置",
					settingsReadOnly: "本部署的设置为只读",
					greenLabel: "完成",
					amberLabel: "待处理",
					blackLabel: "默认色",
					blackHint: "不设置时使用官方图标",
					reset: "恢复默认颜色",
					invalidHex: "颜色格式应为 #RRGGBB",
					groupColors: "鲸鱼状态灯",
					groupNotify: "系统通知",
					colorsHint: "标签页图标根据任务状态显示不同颜色",
					colorsExpand: "颜色设置",
					notifyExpand: "更多通知设置",
					restore: "恢复默认颜色",
					notifyEnabledHint: "会话完成及有交互等待处理时发送通知",
					notifySound: "提示音",
					notifyAutoHide: "自动隐藏",
					notifyAutoHideHint: "开启后自动收起；关闭后常驻屏幕，需手动关闭",
					notifyForeground: "前台提醒",
					notifyForegroundHint: "开启后，即使你正看着该页面也会提醒",
					notifyVolume: "音量",
					notifyDoneSound: "完成提示音",
					notifyPendingSound: "待处理提示音",
					soundPick: "选择音效",
					soundPackBuiltin: "内置",
					soundBuiltinUp: "Chime Up",
					soundBuiltinDown: "Chime Down",
					permissionDeniedChip: "已被拒绝",
					permissionDeniedHint: "网页无法再弹授权窗（浏览器只允许用户自己改回）：点地址栏左侧的图标 → 通知 → 允许，或打开 chrome://settings/content/notifications",
					permissionPendingChip: "未授权 · 授权",
					permissionPendingHint: "浏览器还没有授权，通知不会弹出：点这里会让浏览器重新弹出授权窗口。",
					notifyPermissionTitle: "通知已开启",
					permissionGranted: "授权已允许：任务跑完、或需要你处理时，会在这里提醒你",
					saveFailed: "保存失败，请重试",
					permissionUnsupported: "当前浏览器不支持系统通知",
					footerRepoTitle: "在 GitHub 上打开 dsh-notice-center 仓库",
					notifyDoneTitle: "会话已完成",
					notifyPendingTitle: "有交互等待处理",
					notifyDuration: "本轮总用时 {duration}",
					durationSeconds: "{seconds}秒",
					durationMinutes: "{minutes}分{seconds}秒",
					pendingKindApproval: "待审批",
					pendingKindQuestion: "向你提问",
					pendingKindPlanReview: "计划待审核",
					pendingApprovalTool: "待审批 · {tool}",
					pendingQuestionChoose: "请你选择",
					pendingQuestionMulti: "请你多选",
					pendingQuestionFill: "请你填写",
					pendingQuestionBatch: "向你提问（{count} 个）",
				},
				en: {
					nav: "Notification center",
					settingsUnavailable: "This plugin is not loaded, so it cannot be configured right now.",
					settingsReadOnly: "This deployment stores settings read-only.",
					greenLabel: "Done",
					amberLabel: "Pending",
					blackLabel: "Default color",
					blackHint: "Uses the official icon when unset",
					reset: "Reset colors",
					invalidHex: "Color must be #RRGGBB",
					groupColors: "Tab whale light",
					groupNotify: "System notifications",
					colorsHint: "The tab icon changes color with the task state",
					colorsExpand: "Colors",
					notifyExpand: "More notification options",
					restore: "Reset to default",
					notifyEnabledHint: "Sent when a session finishes or something awaits you",
					notifySound: "Sound",
					notifyAutoHide: "Auto hide",
					notifyAutoHideHint: "On: it fades away on its own. Off: it stays on screen until you close it",
					notifyForeground: "Notify in the foreground",
					notifyForegroundHint: "Also notify while you are looking at the page",
					notifyVolume: "Volume",
					notifyDoneSound: "Done sound",
					notifyPendingSound: "Pending sound",
					soundPick: "Choose a sound",
					soundPackBuiltin: "Built-in",
					soundBuiltinUp: "Chime Up",
					soundBuiltinDown: "Chime Down",
					permissionDeniedChip: "Blocked",
					permissionDeniedHint: "A page cannot show the permission prompt again (only you can change it): click the icon at the left of the address bar -> Notifications -> Allow, or open chrome://settings/content/notifications",
					permissionPendingChip: "Not granted - Grant",
					permissionPendingHint: "No permission yet: notifications will not appear. Click here to let the browser ask again.",
					notifyPermissionTitle: "Notifications enabled",
					permissionGranted: "Permission granted: you will be notified here when a run finishes or needs your attention.",
					saveFailed: "Could not save. Please try again.",
					permissionUnsupported: "This browser does not support notifications",
					footerRepoTitle: "Open the dsh-notice-center repository on GitHub",
					notifyDoneTitle: "Session finished",
					notifyPendingTitle: "Something awaits you",
					notifyDuration: "turn took {duration}",
					durationSeconds: "{seconds}s",
					durationMinutes: "{minutes}m{seconds}s",
					pendingKindApproval: "Approval needed",
					pendingKindQuestion: "Question",
					pendingKindPlanReview: "Plan review",
					pendingApprovalTool: "Approval · {tool}",
					pendingQuestionChoose: "Choose an option",
					pendingQuestionMulti: "Choose options",
					pendingQuestionFill: "Type an answer",
					pendingQuestionBatch: "{count} questions",
				}
			}));
			ctx.slots.inject("settings.section", () => {
				const t = ctx.locale.bind(SETTINGS_NAMESPACE);
				const injected = { scope };
				return ctx.slots.register({
					name: "settings.section",
					id: SETTINGS_NAMESPACE,
					order: 100,
					label: () => t("nav"),
					locale: SETTINGS_NAMESPACE,
					inject: () => injected
				}, WhaleSettingsSection);
			});
			ctx.effect(() => () => {
if (notifyTimer !== void 0) clearTimeout(notifyTimer);
				notifyQueue.clear();
				navIconObserver.disconnect();
				unsubscribeList();
				unsubscribeScope();
				document.removeEventListener("visibilitychange", onForeground);
				window.removeEventListener("focus", onForeground);
				crossTab.destroy();
				restore();
			});
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
