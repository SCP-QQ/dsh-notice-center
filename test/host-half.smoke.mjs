/**
 * 宿主半冒烟测试 —— 防止「改名漏改实参」这类只在运行期暴露的故障。
 *
 * 背景：插件改名时，`register()` 的第二个实参
 * 漏改成新符号名（定义改了、导出改了、调用点没改）。`node --check` 只查语法、
 * 解析/配置检查也看不到 → 宿主半 apply 一执行就抛 ReferenceError，命名空间
 * 注册失败，表现为「设置页读默认值（通知关、音量 0.6）且开关点不动」。
 *
 * 用法：node test/host-half.smoke.mjs
 * 退出码 0 = 全部通过；1 = 有失败项。
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const EXPECTED_ID = "dsh-notice-center";
const EXPECTED_NS = "notice-center";
let failed = 0;
const check = (name, ok, detail = "") => {
	console.log(`${ok ? "[OK]  " : "[FAIL]"} ${name}${detail === "" ? "" : ` — ${detail}`}`);
	if (!ok) failed += 1;
};

const mod = await import(new URL("../lib/index.mjs", import.meta.url).href);
const plugin = mod.default;

check("宿主半可加载", plugin !== undefined && typeof plugin.apply === "function");
check(`插件 name = ${EXPECTED_ID}`, plugin.name === EXPECTED_ID, plugin.name);
check(`SETTINGS_NAMESPACE = ${EXPECTED_NS}`, mod.SETTINGS_NAMESPACE === EXPECTED_NS, mod.SETTINGS_NAMESPACE);

/* 执行 apply：这一步才能真正抓住 apply 内部的未定义标识符。 */
let registered;
const logs = [];
const logger = { info: (...args) => logs.push(args) };
try {
	plugin.apply({
		logger,
		inject: (deps, callback) => {
			check("apply 注入 settings", Array.isArray(deps) && deps.includes("settings"), String(deps));
			callback({
				logger,
				settings: {
					register: (ns, schema) => {
						registered = { ns, schema };
					}
				}
			});
		}
	});
	check("apply 执行无异常", true);
} catch (error) {
	check("apply 执行无异常", false, String(error));
}
check("register 被调用", registered !== undefined);
if (registered !== undefined) {
	check(`注册命名空间 = ${EXPECTED_NS}`, registered.ns === EXPECTED_NS, String(registered.ns));
	check("注册了 schema", registered.schema !== undefined);
}
check("注册成功留了一行日志（重启后可在控制台自证）", logs.length === 1, logs[0]?.join(" "));

/* 存量配置能否通过 schema（改名后命名空间变了，这条能发现「配置对不上」）。 */
const home = process.env.DSH_HOME ?? join(process.env.USERPROFILE ?? "", ".dsh");
const settingsPath = join(home, "settings.yaml");
try {
	const text = readFileSync(settingsPath, "utf8");
	const block = new RegExp(`^${EXPECTED_NS}:\\r?\\n((?:[ \\t]+.*\\r?\\n)+)`, "m").exec(text);
	check(`settings.yaml 含 ${EXPECTED_NS} 段`, block !== null, settingsPath);
	if (block !== null) {
		const raw = {};
		for (const line of block[1].split(/\r?\n/)) {
			const matched = /^\s+([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
			if (matched === null) continue;
			const value = matched[2];
			raw[matched[1]] = value === "true" ? true : value === "false" ? false : Number.isNaN(Number(value)) ? value : Number(value);
		}
		const resolved = mod.NoticeSettingsSchema(raw);
		check("存量配置通过 schema 校验", true, JSON.stringify(resolved));
		/* 断言结构性不变量，而不是具体用户取值（音量会被用户在设置页改）。
		   真正要守住的是：文件里写过的每一项都被 schema 原样保留，不被静默丢弃/改写。 */
		const drift = Object.entries(raw).filter(([key, value]) => resolved[key] !== value).map(([key, value]) => `${key}: 文件=${String(value)} 解析=${String(resolved[key])}`);
		check("文件中的每一项都被 schema 原样保留", drift.length === 0, drift.join("; "));
		check("notifyEnabled 为布尔值", typeof resolved.notifyEnabled === "boolean", String(resolved.notifyEnabled));
		check("notifyVolume 落在 [0,1]", typeof resolved.notifyVolume === "number" && resolved.notifyVolume >= 0 && resolved.notifyVolume <= 1, String(resolved.notifyVolume));
		check("green/amber 为合法 hex（schema 默认值生效）", /^#[0-9a-fA-F]{6}$/.test(resolved.green) && /^#[0-9a-fA-F]{6}$/.test(resolved.amber), `${resolved.green} / ${resolved.amber}`);
	}
} catch (error) {
	check("读取 settings.yaml 并校验存量配置", false, String(error));
}

console.log(failed === 0 ? "\n全部通过" : `\n有 ${failed} 项失败`);
process.exit(failed === 0 ? 0 : 1);
