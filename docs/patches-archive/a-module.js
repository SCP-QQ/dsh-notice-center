/** 系统通知默认值（与宿主 schema 保持一致；客户端仅用于设置页回显）。 */
const NOTIFY_DEFAULTS = {
	notifyEnabled: false,
	notifySound: true,
	notifyVolume: 0.6
};
/** 颜色状态灯的默认值（green/amber 为官方侧边栏色；black 未配置表示沿用官方图标）。 */
const COLOR_DEFAULTS = {
	green: "#22C55E",
	amber: "#F59E0B",
	black: "#000000"
};
/** 颜色状态灯总开关的默认值（与宿主 schema 一致）。 */
const COLORS_ENABLED_DEFAULT = true;
/** 鲸鱼轮廓的 path 数据（从 whaleSvg 提取，供设置页图标预览与自定义渲染使用）。 */
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
* 播放提示音：完成 = 上行双音（660 → 990Hz），待处理 = 下行双音（880 → 587Hz）。
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
