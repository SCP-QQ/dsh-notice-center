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
import { existsSync, readFileSync } from "node:fs";
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
let configured;
let configuredOwner;
const logs = [];
const registeredRoutes = [];
const logger = { info: (...args) => logs.push(args), warn: (...args) => logs.push(args) };
/** 插件自身的 fiber：configure 的 owner 必须是它（describe() 按 entry.fiber 查策略）。 */
const pluginFiber = { kind: "plugin-fiber" };
try {
	plugin.apply({
		logger,
		fiber: pluginFiber,
		inject: (deps, callback) => {
			if (!Array.isArray(deps)) {
				check("apply 的依赖声明是数组", false, String(deps));
				return;
			}
			if (deps.includes("settings")) {
				callback({
					logger,
					/* 0.1.7 的 inject 子 fiber 是另一个 fiber，故意给个不同的对象。 */
					fiber: { kind: "settings-child-fiber" },
					effect: (fn) => {
						fn();
					},
					settings: {
						configure: (presentation, owner) => {
							configured = presentation;
							configuredOwner = owner;
							return () => {};
						}
					}
				});
				return;
			}
			if (deps.includes("webServer")) {
				callback({
					logger,
					webServer: {
						register: (route) => {
							registeredRoutes.push(route);
							return () => {};
						}
					}
				});
				return;
			}
			check("apply 只注入预期服务", false, String(deps));
		}
	});
	check("apply 执行无异常", true);
} catch (error) {
	check("apply 执行无异常", false, String(error));
}
/* ==================== 0.1.7 设置契约（2026-09-26 适配） ==================== */
/* 0.1.7 起设置表单由插件自己的 Config 派生（dsh-settings 读入口 fiber 的
   runtime.Config，条目 id 就是命名空间），插件不再注册命名空间。每个字段都必须标
   .volatile()：volatileForm() 只投影「最近的可变祖先」下的字段，漏标一个就等于那个
   设置项在设置页里整条消失 —— 这是本次适配最容易静默踩坏的地方。 */
const unwrap = (value) => (value !== null && typeof value === "object" && typeof value.get === "function" ? value.get() : value);
check("插件对象带 Config（设置表单与写入校验的投影源）", plugin.Config === mod.NoticeSettingsSchema);
check("具名导出 Config 与 schema 是同一份", mod.Config === mod.NoticeSettingsSchema);
const dict = mod.NoticeSettingsSchema.dict ?? {};
const fields = Object.keys(dict);
check("schema 字段数 = 11", fields.length === 11, `${fields.length}: ${fields.join(",")}`);
const notVolatile = fields.filter((key) => dict[key].meta?.volatile !== true);
check("每个字段都标了 .volatile()（漏标＝设置项消失）", notVolatile.length === 0, notVolatile.join(","));
check("声明了「本插件自带设置页」：configure({ auto: false })", configured?.auto === false, JSON.stringify(configured));
check("configure 的 owner 是插件自身 fiber（传 inject 子 fiber 等于没声明）", configuredOwner === pluginFiber, String(configuredOwner?.kind));
check("设置条目与路由挂载各留一行日志（重启后可在控制台自证）", logs.length === 2, JSON.stringify(logs.map((entry) => entry.join(" "))));
check("日志里能确认设置条目已接上", logs.some((entry) => entry.join(" ").includes("settings entry") && entry.join(" ").includes(EXPECTED_NS)), JSON.stringify(logs.map((entry) => entry.join(" "))));

/* ==================== 页脚常量与清单一致（2026-09-20 新增） ==================== */
/* 浏览器半是预构建产物，页脚里的版本号只能写字面量；这条守住它不跟 package.json 漂移。
   仓库地址同理：package.json 的 repository.url 是唯一事实源。 */
const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const clientSource = readFileSync(new URL("../lib/client.cjs", import.meta.url), "utf8");
const literalOf = (name) => new RegExp(`const ${name} = "([^"]+)"`).exec(clientSource)?.[1];
const repoFromManifest = String(manifest.repository?.url ?? "").replace(/^git\+/, "").replace(/\.git$/, "");
check("client 的 PLUGIN_VERSION 与 package.json 版本一致", literalOf("PLUGIN_VERSION") === manifest.version, `${literalOf("PLUGIN_VERSION")} vs ${manifest.version}`);
check("client 的 PLUGIN_NAME 与 package.json 包名一致", literalOf("PLUGIN_NAME") === manifest.name, `${literalOf("PLUGIN_NAME")} vs ${manifest.name}`);
check("client 的 PLUGIN_REPO 与 package.json 仓库一致", literalOf("PLUGIN_REPO") === repoFromManifest, `${literalOf("PLUGIN_REPO")} vs ${repoFromManifest}`);

/* ==================== 音效路由（2026-09-19 新增） ==================== */
check("注册了音效静态路由", registeredRoutes.length === 1 && registeredRoutes[0].path === mod.SOUND_ROUTE, JSON.stringify(registeredRoutes.map((route) => route.path)));
check("音效路由为 prefix 形态", registeredRoutes[0]?.kind === "prefix", String(registeredRoutes[0]?.kind));

/* 新音效字段：默认值＝内置合成音，老配置无需迁移。
   （.volatile() 会把字段值包成 Volatile 引用，断言前要 .get() 解包。） */
const soundDefaults = mod.NoticeSettingsSchema({});
check("schema 完成音效默认 builtin-up", unwrap(soundDefaults.notifyDoneSound) === "builtin-up", String(unwrap(soundDefaults.notifyDoneSound)));
check("schema 待处理音效默认 builtin-down", unwrap(soundDefaults.notifyPendingSound) === "builtin-down", String(unwrap(soundDefaults.notifyPendingSound)));
/* 新字段：默认关闭＝保持原固定策略，老配置无需迁移。 */
check("schema 前台也提醒默认关闭", unwrap(soundDefaults.notifyForeground) === false, String(unwrap(soundDefaults.notifyForeground)));

if (registeredRoutes[0] !== undefined) {
	const { createServer } = await import("node:http");
	const { readdirSync } = await import("node:fs");
	const route = registeredRoutes[0];
	const server = createServer((req, res) => {
		route.handler(req, res);
	});
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	const port = server.address().port;
	const get = async (path) => {
		const res = await fetch(`http://127.0.0.1:${port}${path}`);
		return { status: res.status, type: res.headers.get("content-type"), bytes: (await res.arrayBuffer()).byteLength };
	};
	const hit = await get(`${mod.SOUND_ROUTE}/yup-01.mp3`);
	check("音效路由可取到 mp3", hit.status === 200 && hit.type === "audio/mpeg" && hit.bytes > 1000, JSON.stringify(hit));
	const missing = await get(`${mod.SOUND_ROUTE}/no-such-sound.mp3`);
	check("音效路由对不存在的音效 404", missing.status === 404, JSON.stringify(missing));
	const traversal = await get(`${mod.SOUND_ROUTE}/..%2Fsettings.yaml`);
	check("音效路由拒绝路径穿越", traversal.status === 404, JSON.stringify(traversal));
	const files = readdirSync(new URL("../assets/audio/", import.meta.url)).filter((name) => name.endsWith(".mp3"));
	check("随包音效齐全（45 个）", files.length === 45, `${files.length} 个`);
	/* fetch 默认 keep-alive，直接 close 会等连接超时；先断开再优雅关闭，
	   避免进程退出时和关闭中的句柄抢时序（Windows 上会触发 libuv 断言）。 */
	server.closeAllConnections?.();
	await new Promise((resolve) => server.close(resolve));
}

/* 存量配置能否通过 schema。0.1.7 起 dsh-settings 会把 settings.yaml 的每个 section
   搬进同 id 的 profile 条目，并把原文件改名为 settings.yaml.imported —— 两处都查，
   迁移前/迁移后都能守住「文件里写过的每一项都被 schema 原样保留」。
   (.volatile() 把字段值包成了 Volatile 引用，比较前先 .get() 解包。) */
const home = process.env.DSH_HOME ?? join(process.env.USERPROFILE ?? "", ".dsh");
const candidates = [join(home, "settings.yaml"), join(home, "settings.yaml.imported")];
const settingsPath = candidates.find((path) => existsSync(path));
if (settingsPath === undefined) {
	console.log("[SKIP] 本机没有 " + candidates.join(" / ") + "（CI 等干净环境），跳过存量配置校验");
} else {
	try {
		const text = readFileSync(settingsPath, "utf8");
		const block = new RegExp(`^${EXPECTED_NS}:\\r?\\n((?:[ \\t]+.*\\r?\\n)+)`, "m").exec(text);
		check(`存量文件含 ${EXPECTED_NS} 段`, block !== null, settingsPath);
		if (block !== null) {
			const raw = {};
			for (const line of block[1].split(/\r?\n/)) {
				const matched = /^\s+([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
				if (matched === null) continue;
				/* 剥掉 YAML 引号：dsh 写回的值带引号，朴素解析不剥会误判成非法值。 */
				const value = matched[2].replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
				raw[matched[1]] = value === "true" ? true : value === "false" ? false : Number.isNaN(Number(value)) ? value : Number(value);
			}
			const plain = Object.fromEntries(Object.entries(mod.NoticeSettingsSchema(raw)).map(([key, value]) => [key, unwrap(value)]));
			check("存量配置通过 schema 校验", true, JSON.stringify(plain));
			/* 断言结构性不变量，而不是具体用户取值（音量会被用户在设置页改）。
			   真正要守住的是：文件里写过的每一项都被 schema 原样保留，不被静默丢弃/改写。 */
			const drift = Object.entries(raw).filter(([key, value]) => plain[key] !== value).map(([key, value]) => `${key}: 文件=${String(value)} 解析=${String(plain[key])}`);
			check("文件中的每一项都被 schema 原样保留", drift.length === 0, drift.join("; "));
			check("notifyEnabled 为布尔值", typeof plain.notifyEnabled === "boolean", String(plain.notifyEnabled));
			check("notifyVolume 落在 [0,1]", typeof plain.notifyVolume === "number" && plain.notifyVolume >= 0 && plain.notifyVolume <= 1, String(plain.notifyVolume));
			check("green/amber 为合法 hex（schema 默认值生效）", /^#[0-9a-fA-F]{6}$/.test(plain.green) && /^#[0-9a-fA-F]{6}$/.test(plain.amber), `${plain.green} / ${plain.amber}`);
		}
	} catch (error) {
		check("读取存量设置文件并校验", false, String(error));
	}
}

console.log(failed === 0 ? "\n全部通过" : `\n有 ${failed} 项失败`);
/* 用 exitCode 而不是 process.exit：本文件用了 fetch（音效路由用例），
   Windows 上在异步句柄收尾前强退会触发 libuv 断言（handle->flags & UV_HANDLE_CLOSING）。 */
process.exitCode = failed === 0 ? 0 : 1;
