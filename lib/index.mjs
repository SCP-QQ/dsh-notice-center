import z from "@deepseek-ai/schemastery";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
//#region src/index.ts
/**
* dsh-notice-center — Host half.
*
* 宿主半的唯一职责：**声明本插件的 Config schema**。0.1.7 起设置表单由插件自己的
* Config 派生（dsh-settings 的 `describe()` 读入口 fiber 的 `runtime.Config`，表单
* 按 Loader 条目 id 记账 —— 也就是这个命名空间），插件不再注册命名空间。浏览器半
* （src/client.ts）用 `ctx.configForms.get("notice-center")` 绑定同一条目，读配置、
* 写配置；favicon 状态机消费配置色。
*
* 两个必须守住的点：
*   1. 每个字段都要 `.volatile()` —— dsh-settings 的 `volatileForm()` 只投影「最近的
*      可变祖先」下的字段，漏标一个就等于那个设置项在设置页里整条消失。
*      `.volatile()` 需要 schemastery ≥ 3.18.4（3.18.2 上没有这个方法）。
*   2. 命名空间必须与 cordis.patch.yml 里的 Loader 条目 id 一致。旧 settings.yaml 的
*      迁移由 dsh-settings 自己完成（`importLegacyDocument()` 把 `<DSH_HOME>/settings.yaml`
*      的每个 section 按名字写进同 id 的条目），默认 patch 插入的正是
*      `id: notice-center`，与 SETTINGS_NAMESPACE 相同，所以老用户设置能原样搬过来。
*
* 【不 import dsh-settings】宿主半不 import 任何 @deepseek-ai/dsh-* 运行时包
* （运行时依赖只剩 @deepseek-ai/schemastery），从 registry 安装时不必解析 dsh peer ——
* 而 profile 默认 `autoInstallPeers: false`，真去解析反而会因版本不匹配而加载失败。
*
* schema 语义（与主人确认的灰区决策一致）：
*   green/amber 有默认值（官方侧边栏色），用户未覆盖时回默认；
*   black 无默认值 —— 未配置 = 官方原版 /favicon.svg，配置了才替换。
* 非法 hex 由 schema pattern 在写入时拒绝（拒绝写入并提示）。
*/
/** 本插件拥有的设置命名空间（kebab-case）。 */
const SETTINGS_NAMESPACE = "notice-center";
/** 官方侧边栏状态点颜色（静态色板，明暗主题同值）。 */
const DEFAULT_GREEN = "#22C55E";
const DEFAULT_AMBER = "#F59E0B";
/** hex 色值校验：6 位 #RRGGBB（ColorPicker 输出与手输均为此格式）。 */
const HEX = /^#[0-9a-fA-F]{6}$/;
/**
* 命名空间 schema。0.1.7 起它同时是：入口 Config 的校验器、设置表单的投影源
* （只有标了 `.volatile()` 的字段会出现在表单里）、以及浏览器侧读到的那份值。
*/
const NoticeSettingsSchema = z.object({
	green: z.string().pattern(HEX).default(DEFAULT_GREEN).volatile(),
	amber: z.string().pattern(HEX).default(DEFAULT_AMBER).volatile(),
	/** 无默认：用户不配置时 black === undefined → 官方原版 favicon。 */
	black: z.string().pattern(HEX).volatile(),
	/** 颜色状态灯总开关（关闭时保持官方原版图标）。 */
	colorsEnabled: z.boolean().default(true).volatile(),
	/** 系统通知总开关（**默认开启**：装完即默认订阅；浏览器授权由客户端在首次交互时自动请求，
	*  未授权时设置页给状态 chip，用户可一键补授权或关掉）。 */
	notifyEnabled: z.boolean().default(true).volatile(),
	/** 通知是否自动隐藏（默认 true＝系统自行收起；false＝常驻，需用户手动关闭）。 */
	notifyAutoHide: z.boolean().default(true).volatile(),
	/** 前台也提醒（默认 false＝沿用原固定策略，页面在前台时保持安静；true＝正在看也弹）。 */
	notifyForeground: z.boolean().default(false).volatile(),
	/** 通知提示音：完成与待处理为两种不同的预置音。 */
	notifySound: z.boolean().default(true).volatile(),
	/** 提示音音量（0–1）。 */
	notifyVolume: z.number().min(0).max(1).default(0.6).volatile(),
	/** 完成提示音 id（见浏览器半音效库；builtin-up = 内置合成音 Chime Up）。 */
	notifyDoneSound: z.string().default("builtin-up").volatile(),
	/** 待处理提示音 id（builtin-down = 内置合成音 Chime Down）。 */
	notifyPendingSound: z.string().default("builtin-down").volatile()
});
/** 具名导出：不同加载路径可能把模块命名空间或 default 当插件对象，两条都提供 Config。 */
const Config = NoticeSettingsSchema;
/** 音效静态路由前缀：浏览器半按 `<前缀>/<id>.mp3` 取音频。 */
const SOUND_ROUTE = "/notice-center-sounds";
/** 随包分发的音效目录（音源：anomalyco/opencode packages/ui/src/assets/audio，MIT）。 */
const SOUND_DIR = fileURLToPath(new URL("../assets/audio/", import.meta.url));
/** 只放行音效库的文件名形态，杜绝路径穿越。 */
const SOUND_FILE = /^[a-z0-9-]+\.mp3$/;
/**
* 构建音效静态路由（不依赖 cordis，可直接挂到 node:http 做测试）。
* 命中 `[a-z0-9-]+\.mp3` 才读盘，其余一律 404；音频是随包常量，故长缓存。
* @returns 路由数组（ctx.webServer.register 接受的形态）。
*/
function buildSoundRoutes() {
	return [{
		kind: "prefix",
		path: SOUND_ROUTE,
		handler: async (req, res) => {
			const name = decodeURIComponent(String(req.url ?? "").slice(SOUND_ROUTE.length)).replace(/^\/+/, "");
			const headers = {
				"content-type": "text/plain; charset=utf-8",
				"cache-control": "no-store"
			};
			if (!SOUND_FILE.test(name)) {
				res.writeHead(404, headers);
				res.end("Not Found");
				return;
			}
			try {
				const data = await readFile(join(SOUND_DIR, name));
				res.writeHead(200, {
					"content-type": "audio/mpeg",
					"content-length": String(data.length),
					"cache-control": "public, max-age=31536000, immutable"
				});
				res.end(data);
			} catch {
				res.writeHead(404, headers);
				res.end("Not Found");
			}
		}
	}];
}
var src_default = {
	name: "dsh-notice-center",
	/** 入口 Config：0.1.7 的设置表单、旧 settings.yaml 迁移与写入校验都由它派生。 */
	Config: NoticeSettingsSchema,
	apply(ctx) {
		/** 路由注销器（apply 卸载时统一回收）。 */
		const disposers = [];
		ctx.inject(["settings"], (settingsCtx) => {
			/* 本插件自带设置页，声明「不要为我自动生成配置页」。
			   owner 必须是插件自身的 fiber：describe() 按 entry.fiber 查这份策略，而
			   inject 子 fiber 是另一个 fiber（实测 childCtx.fiber !== ctx.fiber），
			   传子 fiber 等于没声明。注册失败只降级成一条日志，不拖垮插件。 */
			settingsCtx.effect(() => {
				try {
					return settingsCtx.settings.configure({ auto: false }, ctx.fiber);
				} catch (error) {
					settingsCtx.logger.warn("dsh-notice-center: settings.configure failed: %s", error);
					return () => {};
				}
			}, "dsh-notice-center: settings presentation");
			/* 启动自证：设置条目能被服务读到会在 Harness 控制台留一行。 */
			settingsCtx.logger.info("dsh-notice-center: settings entry \"%s\" served from the Config schema", SETTINGS_NAMESPACE);
		});
		/* 可选通道：webServer 缺席时音频路由不挂载，浏览器半自动回退到合成音。 */
		ctx.inject(["webServer"], (webCtx) => {
			for (const route of buildSoundRoutes()) disposers.push(webCtx.webServer.register(route));
			webCtx.logger?.info?.("dsh-notice-center: sound route \"%s\" registered", SOUND_ROUTE);
		});
		return () => {
			for (const dispose of disposers) {
				try {
					dispose();
				} catch {}
			}
		};
	}
};
//#endregion
export { Config, DEFAULT_AMBER, DEFAULT_GREEN, SETTINGS_NAMESPACE, SOUND_ROUTE, NoticeSettingsSchema, buildSoundRoutes, src_default as default };
