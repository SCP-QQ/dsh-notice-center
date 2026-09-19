window.__ModuleLoader__.load({
	id: "dsh-notice-center",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let primitives = require("@deepseek-ai/dsh-client-ui-primitives");
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
		/** 官方侧边栏状态点颜色（静态色板，明暗主题同值）。 */
		const DEFAULT_GREEN = "#22C55E";
		const DEFAULT_AMBER = "#F59E0B";
		/** 6 位 hex 校验（ColorPicker 输出与手输均为此格式）。 */
		const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;
/** 系统通知默认值（与宿主 schema 保持一致；客户端仅用于设置页回显）。 */
const NOTIFY_DEFAULTS = {
	notifyEnabled: false,
	notifySound: true,
	notifyVolume: 0.6,
	notifyAutoHide: true,
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
							(0, react_jsx_runtime.jsx)(primitives.IconChevronDownOutline14, { style: { flex: "none" } })
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
		* 设置页组件 —— 注册进官方设置面板的 `settings.section` 槽。
		*
		* 三行颜色（完成/待处理/默认），每行原生 ColorPicker + hex 文本框（约 1/3 宽）
		* + 行内「恢复默认颜色」按钮（unset 该字段）：
		* - 输入合法（#RRGGBB）即写入 settings（live 生效，宿主 schema 校验兜底）；
		* - 输入非法时提示错误、不写入（拒绝写入并提示）。
		* 每行恢复按钮只清对应字段：绿/琥珀回官方默认，黑 → 官方原版。
		*
		* ⚠️ this 绑定：SettingsScopeController 的方法是类方法（依赖 this.store），
		* 直接传裸引用给 useSyncExternalStore 会丢 this 导致渲染崩溃，必须箭头包装。
		*/
		function WhaleSettingsSection({ scope, t }) {
			if (scope === void 0 || t === void 0) return null;
			const value = (0, react.useSyncExternalStore)((listener) => scope.subscribe(listener), () => scope.getSnapshot(), () => scope.getSnapshot()).value ?? {};
			/** 通知权限的本地态（未授权提示 + 开启通知时自动请求）。 */
			const [permission, setPermission] = (0, react.useState)(notificationSupport());
			/** 两个分组的展开态（本地 UI 状态，均默认折叠）。 */
			const [colorsExpanded, setColorsExpanded] = (0, react.useState)(false);
			const [notifyExpanded, setNotifyExpanded] = (0, react.useState)(false);
			/** 当前值（未配置回默认）。 */
			const colorsEnabled = value.colorsEnabled ?? COLORS_ENABLED_DEFAULT;
			const notifyEnabled = value.notifyEnabled ?? NOTIFY_DEFAULTS.notifyEnabled;
			const notifySound = value.notifySound ?? NOTIFY_DEFAULTS.notifySound;
			const notifyVolume = normalizeVolume(value.notifyVolume ?? NOTIFY_DEFAULTS.notifyVolume);
			const notifyAutoHide = value.notifyAutoHide ?? NOTIFY_DEFAULTS.notifyAutoHide;
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
			/** 分组条目：主标题 + 描述 + 官方 Switch + 折叠展开箭头（子项由展开态控制显示）。 */
			const sectionRow = (key, title, hint, checked, onChange, expanded, onToggle, expandLabel) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: rowStyle,
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
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(primitives.Switch, {
						checked,
						label: title,
						onChange: (next) => onChange(typeof next === "boolean" ? next : !checked)
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-expanded": expanded,
						"aria-label": expandLabel,
						title: expandLabel,
						onClick: onToggle,
						style: iconButtonStyle,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: {
								display: "inline-flex",
								transform: expanded ? "rotate(180deg)" : "none",
								transition: "transform 0.2s"
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(primitives.IconChevronDownOutline14, { size: 14 })
						})
					})
				]
			}, key);
			/** 一行子项设置：左侧标题（可带描述），右侧官方 Switch 原语（缩进 16px）。 */
			const switchRow = (key, label, hint, checked, onChange) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(primitives.Switch, {
						checked,
						label: label ?? hint,
						onChange: (next) => onChange(typeof next === "boolean" ? next : !checked)
					})
				]
			}, key);
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
						value: Math.round(notifyVolume * 100),
						"aria-label": t("notifyVolume"),
						onChange: (e) => scope.set("notifyVolume", Number(e.target.value) / 100),
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
						children: [Math.round(notifyVolume * 100), "%"]
					})
				]
			}, "volume");
			/** 音效行：左侧标题，右侧官方样式下拉（悬浮选项即试听，点选生效）。 */
			const soundRow = (kind, label) => {
				const soundKey = kind === "done" ? "notifyDoneSound" : "notifyPendingSound";
				const currentSound = value[soundKey] ?? NOTIFY_DEFAULTS[soundKey];
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
						volume: notifyVolume,
						kind,
						t,
						onChange: (next) => scope.set(kind === "done" ? "notifyDoneSound" : "notifyPendingSound", next)
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
									color: value[key] ?? COLOR_DEFAULTS[key]
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
								value: value[key] ?? COLOR_DEFAULTS[key],
								onChange: (e) => scope.set(key, e.target.value),
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
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(primitives.IconRefreshOutline14, { size: 14 })
					})
				]
			}, key);
			/** 打开通知总开关时：预热音频上下文（用户手势内）并在未授权时请求通知权限。 */
			const setNotifyEnabled = (next) => {
				scope.set("notifyEnabled", next);
				if (!next) return;
				primeChime();
				if (notificationSupport() !== "default") return;
				try {
					const answer = Notification.requestPermission();
					if (answer !== void 0 && typeof answer.then === "function") answer.then((result) => setPermission(result), () => setPermission(notificationSupport()));
				} catch {
					setPermission(notificationSupport());
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column"
				},
				children: [
					sectionRow("colorsEnabled", t("groupColors"), t("colorsHint"), colorsEnabled, (next) => scope.set("colorsEnabled", next), colorsExpanded, () => setColorsExpanded((current) => !current), t("colorsExpand")),
					colorsExpanded ? colorRow("green", t("greenLabel"), () => scope.unset("green")) : null,
					colorsExpanded ? colorRow("amber", t("amberLabel"), () => scope.unset("amber")) : null,
					colorsExpanded ? colorRow("black", t("blackLabel"), () => scope.unset("black")) : null,
					sectionRow("notifyEnabled", t("groupNotify"), t("notifyEnabledHint"), notifyEnabled, setNotifyEnabled, notifyExpanded, () => setNotifyExpanded((current) => !current), t("notifyExpand")),
					notifyExpanded ? switchRow("notifyAutoHide", t("notifyAutoHide"), t("notifyAutoHideHint"), notifyAutoHide, (next) => scope.set("notifyAutoHide", next)) : null,
					notifyExpanded ? switchRow("notifySound", t("notifySound"), void 0, notifySound, (next) => scope.set("notifySound", next)) : null,
					notifyExpanded ? volumeRow() : null,
					notifyExpanded ? soundRow("done", t("notifyDoneSound")) : null,
					notifyExpanded ? soundRow("pending", t("notifyPendingSound")) : null,
					notifyEnabled && permission === "denied" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							...descStyle,
							padding: "0 0 8px 16px"
						},
						role: "alert",
						children: t("permissionDenied")
					}) : null,
					notifyEnabled && permission === "unsupported" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							...descStyle,
							padding: "0 0 8px 16px"
						},
						children: t("permissionUnsupported")
					}) : null
				]
			});
		}
//#endregion
		//#region src/client.ts
		const DEFAULT_HREF = "/favicon.svg";
		const inject = [
			"sessions",
			"slots",
			"locale",
			"settingsScope"
		];
		function apply(ctx) {
			const list = ctx.sessions.list;
			/** 绑定 `notice-center` 命名空间：读快照 + 写用户配置（宿主 schema 校验）。 */
			const scope = ctx.settingsScope.bind({ namespace: SETTINGS_NAMESPACE });
			/**
			* 待处理交互信号（0.1.2-rc.1+）：官方把「有待处理交互」从会话行字段迁到
			* dsh-client-ui-session 的 uiSession.pendingInteractions 独立 store
			* （Map<sessionId, interaction>，提问/审批处理完自动移除）。
			* 早于 0.1.2-rc.1 的版本没有该服务，因此下面用 ctx.inject 做**可选通道**：
			* 服务缺席时该子 fiber 不加载，琥珀判定自动回退到旧版行字段。
			*/
			let pendingStore;
			/** 已完成/待处理通知的去重键（sessionId 加冒号加 kind）。 */
			const notified = new Set();
			/** 聚合队列与窗口：同一批状态跃迁合并成一条通知，避免刷屏。 */
			const notifyQueue = new Map();
			let notifyTimer;
			/** 已通知过的会话完成态，用于识别 false → true 跃迁。 */
			const prevCompleted = new Map();
			/** 上一轮待处理会话集合与首帧标记（首帧不通知，避免刷新页面时轰炸）。 */
			let prevPending = new Set();
			let pendingSeen = false;
			/** 页面是否真的处于前台：标签页可见 **且** 窗口有焦点。
			*  只看 document.visibilityState，会把「浏览器被别的应用压在后面」误判成
			*  「正在看」——而那恰恰是最该提醒的时候，因此补上 document.hasFocus()。 */
			function isForeground() {
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
			*/
			function queueNotification(kind, sessionId, label, typeLabel) {
				if (!notifyConfig().enabled) return;
				const key = sessionId + ":" + kind;
				if (notified.has(key)) return;
				notified.add(key);
				notifyQueue.set(key, {
					kind,
					sessionId,
					label,
					typeLabel
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
				const config = notifyConfig();
				/* 固定策略：只在页面不在前台时打扰（原先的可配置项已移除）。
				   「前台」= 标签页可见 且 窗口有焦点 —— 只看 visibilityState 会把「浏览器被
				   别的应用压在后面」误判成正在看，而那正是最该提醒的时候。 */
				if (isForeground()) return;
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
					const type = kind === "done" ? t("notifyDoneTitle") : head.typeLabel ?? t("notifyPendingTitle");
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
			/**
			* 待处理交互类型 → 通知正文文案（如「待审批」）。
			* 未知类型返回 undefined，调用方回退到通用标题 —— 官方新增交互域时不会显示错误的类型名。
			* @param interactionKind - pendingInteraction 的 kind 字段。
			* @returns 类型文案；未知类型为 undefined。
			*/
			function pendingTypeLabel(interactionKind) {
				const key = PENDING_KIND_KEYS[interactionKind];
				return key === void 0 ? void 0 : ctx.locale.bind(SETTINGS_NAMESPACE)(key);
			}
			/** 状态跃迁检测：官方 completed 由 false 变 true、以及 pending store 新增会话。 */
			function detectTransitions(state) {
				for (const row of Object.values(state.byId)) {
					if (row.origin === "subagent") continue;
					const before = prevCompleted.get(row.id);
					const now = row.completed === true;
					if (before === false && now) queueNotification("done", row.id, row.displayTitle ?? row.title ?? row.id);
					if (!now) notified.delete(row.id + ":done");
					prevCompleted.set(row.id, now);
				}
				for (const id of [...prevCompleted.keys()]) if (!(id in state.byId)) {
					prevCompleted.delete(id);
					notified.delete(id + ":done");
				}
				const pendingMap = pendingStore?.getSnapshot();
				const current = new Set(pendingMap === void 0 ? [] : [...pendingMap.keys()]);
				if (pendingSeen) for (const id of current) {
					if (prevPending.has(id)) continue;
					const row = state.byId[id];
					if (row !== void 0 && row.origin === "subagent") continue;
					const label = row?.displayTitle ?? row?.title ?? id;
					queueNotification("pending", id, label, pendingTypeLabel(pendingMap?.get(id)?.kind));
				}
				for (const id of prevPending) if (!current.has(id)) notified.delete(id + ":pending");
				prevPending = current;
				pendingSeen = true;
			}
			const iconLink = () => document.head.querySelector("link[rel~=\"icon\"]");
			/**
			* 导航图标：官方 settings.section 的图标由 shell 按 section id 硬编码（未知 id
			* 回退默认齿轮），注册选项里没有 icon 字段；这里把「通知中心」导航项的 path
			* 数据换成官方 IconQueueOutline14 的矢量数据（语义一致：一叠待处理条目）。
			* 数据取自内核 UI 原语 @deepseek-ai/dsh-client-ui-primitives（viewBox 0 0 14 14，
			* 单 path，fill=currentColor）。只改属性、不增删 React 管理的节点。
			*/
			const NAV_ICON_PATH = "M7.00049 0.199829C3.24488 0.199829 0.199952 3.24408 0.199707 6.99963C0.199707 8.0414 0.434087 9.03061 0.854004 9.91467L1.11279 10.4576L2.19775 9.94202L1.94092 9.39905L1.81787 9.12268C1.5498 8.46885 1.40186 7.75171 1.40186 6.99963C1.4021 3.90808 3.90888 1.40198 7.00049 1.40198C10.0919 1.40219 12.5979 3.90821 12.5981 6.99963C12.5981 10.0913 10.0921 12.5981 7.00049 12.5983C6.36734 12.5983 5.90348 12.5535 5.49268 12.4401C5.08803 12.3283 4.7041 12.1414 4.24463 11.8209C3.57111 11.3511 2.60588 11.1855 1.81006 11.6881L1.79736 11.6959L1.78467 11.7047L1.25537 12.0778L1.65381 13.2672L2.46045 12.6989C2.75029 12.5214 3.18004 12.5442 3.55615 12.8063C4.10063 13.1861 4.60863 13.4423 5.17334 13.5983C5.73194 13.7525 6.31665 13.8004 7.00049 13.8004C10.7561 13.8002 13.8003 10.7553 13.8003 6.99963C13.8 3.24421 10.7559 0.200041 7.00049 0.199829ZM3.81201 7.47327V8.67542H7.11572V7.47327H3.81201ZM3.81201 6.34924H10.2173V5.14709H3.81201V6.34924Z";
			let navIconScheduled = false;
			/** 把「通知中心」导航项的图标替换为官方 IconQueueOutline14（幂等）。 */
			function applyNavIcon() {
				const nav = document.querySelector("[role=\"dialog\"] nav");
				if (nav === null) return;
				const label = ctx.locale.bind(SETTINGS_NAMESPACE)("nav");
				for (const cell of nav.querySelectorAll("button")) {
					if (cell.textContent === null || !cell.textContent.includes(label)) continue;
					const svg = cell.querySelector("svg");
					if (svg === null) continue;
					const paths = svg.querySelectorAll("path");
					if (paths.length === 0) continue;
					if (paths[0].getAttribute("d") === NAV_ICON_PATH) continue;
					svg.setAttribute("viewBox", "0 0 14 14");
					svg.setAttribute("width", "16");
					svg.setAttribute("height", "16");
					paths.forEach((path, index) => {
						if (index === 0) {
							path.setAttribute("d", NAV_ICON_PATH);
							path.setAttribute("fill", "currentColor");
							path.removeAttribute("fill-rule");
						} else path.setAttribute("d", "");
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
			const setHref = (href) => {
				const link = iconLink();
				if (link) link.href = href;
			};
			/** 应用瞬间的原始 href —— 还原目标（比硬编码路径更稳，前端改路径也能正确还原）。 */
			const originalHref = iconLink()?.href ?? DEFAULT_HREF;
			/** 我们最后一次设置的 href；null = 官方原样。 */
			let applied = null;
			/** 自跟踪：每会话最后观察到的 running 位（镜像官方 prevRunning 语义）。 */
			const prevRunning = /* @__PURE__ */ new Map();
			/** 完成时恰好被选中、且当时标签页不在台前的主会话（官方不报的空缺）。 */
			const finishedWhileHidden = /* @__PURE__ */ new Set();
			const restore = () => {
				if (applied !== null) {
					setHref(originalHref);
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
			/** running true→false 边沿跟踪：完成时恰好被选中且标签页不在台前 →
			*  记入 finishedWhileHidden。官方 syncCompletedNotifications 只报"未选中时
			*  完成"（`sessionId !== selected` 才 arm），选中的空缺在这里补齐。
			*  台前完成不记（V0-02）；重新运行、会话移除均清除；只跟踪主会话。 */
			function trackEdges(state) {
				for (const row of Object.values(state.byId)) {
					if (row.origin === "subagent") continue;
					const prev = prevRunning.get(row.id);
					if (prev === void 0) {
						prevRunning.set(row.id, row.running);
						continue;
					}
					if (prev && !row.running) {
						if (row.id === state.current && !isForeground()) {
							finishedWhileHidden.add(row.id);
							queueNotification("done", row.id, row.displayTitle ?? row.title ?? row.id);
						}
					} else if (row.running) finishedWhileHidden.delete(row.id);
					prevRunning.set(row.id, row.running);
				}
				for (const id of [...prevRunning.keys()]) if (!(id in state.byId)) {
					prevRunning.delete(id);
					finishedWhileHidden.delete(id);
				}
			}
			/** 回到前台（标签页可见且窗口有焦点）→ 选中会话的绿灯熄灭（V0-02）。 */
			const onForeground = () => {
				if (!isForeground()) return;
				if (finishedWhileHidden.size > 0) {
					finishedWhileHidden.clear();
					sync();
				}
			};
			document.addEventListener("visibilitychange", onForeground);
			window.addEventListener("focus", onForeground);
			/** 绿/琥珀判定：主会话 only；绿优先。返回目标 href；null = 官方原版。 */
			function targetOf(state) {
				if ((scope.getSnapshot().value ?? {}).colorsEnabled === false) return null;
				const c = colors();
				const pendingMap = pendingStore?.getSnapshot();
				let amber = false;
				for (const row of Object.values(state.byId)) {
					if (row.origin === "subagent") continue;
					if (row.completed === true || finishedWhileHidden.has(row.id)) return uri(c.green);
					if (pendingMap?.has(row.id) || row.pendingInteraction !== void 0) amber = true;
				}
				if (amber) return uri(c.amber);
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
			* 可选通道：uiSession 服务存在时（0.1.2-rc.1 起）订阅其待处理交互 store。
			* ctx.inject 声明的是必需服务，服务缺席时该子 fiber 不加载 —— 这正是需要
			* 的效果：旧版本保持旧行字段语义，新版本拿到官方 pending 信号。
			*/
			ctx.inject(["uiSession"], (uiCtx) => {
				pendingStore = uiCtx.uiSession.pendingInteractions;
				const unsubscribe = pendingStore.subscribe(sync);
				sync();
				return () => {
					unsubscribe();
					pendingStore = void 0;
					sync();
				};
			});
			ctx.effect(() => ctx.locale.register(SETTINGS_NAMESPACE, {
				zh: {
					nav: "通知中心",
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
					notifyAutoHideHint: "关闭后通知常驻，需手动关闭",
					notifyVolume: "音量",
					notifyDoneSound: "完成提示音",
					notifyPendingSound: "待处理提示音",
					soundPick: "选择音效",
					soundPackBuiltin: "内置",
					soundBuiltinUp: "Chime Up",
					soundBuiltinDown: "Chime Down",
					permissionDenied: "已被浏览器拒绝，请在站点设置中恢复通知权限",
					permissionUnsupported: "当前浏览器不支持系统通知",
					notifyDoneTitle: "会话已完成",
					notifyPendingTitle: "有交互等待处理",
					pendingKindApproval: "待审批",
					pendingKindQuestion: "向你提问",
					pendingKindPlanReview: "计划待审核",
				},
				en: {
					nav: "Notification center",
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
					notifyAutoHideHint: "Off keeps it on screen until you close it",
					notifyVolume: "Volume",
					notifyDoneSound: "Done sound",
					notifyPendingSound: "Pending sound",
					soundPick: "Choose a sound",
					soundPackBuiltin: "Built-in",
					soundBuiltinUp: "Chime Up",
					soundBuiltinDown: "Chime Down",
					permissionDenied: "Blocked by the browser - re-enable notifications in the site settings",
					permissionUnsupported: "This browser does not support notifications",
					notifyDoneTitle: "Session finished",
					notifyPendingTitle: "Something awaits you",
					pendingKindApproval: "Approval needed",
					pendingKindQuestion: "Question",
					pendingKindPlanReview: "Plan review",
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
				restore();
			});
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
