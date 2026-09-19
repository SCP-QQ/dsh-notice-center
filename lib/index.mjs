import z from "@deepseek-ai/schemastery";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
//#region src/index.ts
/**
* dsh-notice-center — Host half.
*
* 宿主半的唯一职责：向官方 settings 服务（@deepseek-ai/dsh-settings，由
* dsh-settings-file 持久化到 settings.yaml）注册 `notice-center` 命名空间的
* schema。浏览器半（src/client.ts）通过 settingsScope 绑定同一命名空间，
* 读配置、写配置；favicon 状态机消费配置色。
*
* 【不 import dsh-settings】自 0.1.2-rc.1 起 dsh-settings 不再导出
* `settingsNamespace()`，register 内部自己按 kebab-case 校验字符串，因此这里直接传
* 纯字符串。这样宿主半的运行时依赖只剩 @deepseek-ai/schemastery（npm 上有对应版本），
* 插件从 registry 安装时不必解析任何 @deepseek-ai peer —— 而 profile 默认
* `autoInstallPeers: false`，真去解析反而会因 npm 上的版本不匹配而加载失败。
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
* 解析注册用的命名空间：直接传 kebab-case 字符串（0.1.2-rc.1+ 的 register 自己校验）。
* @returns settings.register 接受的命名空间。
*/
function resolveNamespace() {
	return SETTINGS_NAMESPACE;
}
/** 命名空间 schema；也是浏览器侧 wire 校验依据。 */
const NoticeSettingsSchema = z.object({
	green: z.string().pattern(HEX).default(DEFAULT_GREEN),
	amber: z.string().pattern(HEX).default(DEFAULT_AMBER),
	/** 无默认：用户不配置时 black === undefined → 官方原版 favicon。 */
	black: z.string().pattern(HEX),
	/** 颜色状态灯总开关（关闭时保持官方原版图标）。 */
	colorsEnabled: z.boolean().default(true),
	/** 系统通知总开关（默认关闭；开启时若未授权由设置页发起授权请求）。 */
	notifyEnabled: z.boolean().default(false),
	/** 通知是否自动隐藏（默认 true＝系统自行收起；false＝常驻，需用户手动关闭）。 */
	notifyAutoHide: z.boolean().default(true),
	/** 通知提示音：完成与待处理为两种不同的预置音。 */
	notifySound: z.boolean().default(true),
	/** 提示音音量（0–1）。 */
	notifyVolume: z.number().min(0).max(1).default(0.6),
	/** 完成提示音 id（见浏览器半音效库；builtin-up = 内置合成音 Chime Up）。 */
	notifyDoneSound: z.string().default("builtin-up"),
	/** 待处理提示音 id（builtin-down = 内置合成音 Chime Down）。 */
	notifyPendingSound: z.string().default("builtin-down")
});
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
	apply(ctx) {
		/** 路由注销器（apply 卸载时统一回收）。 */
		const disposers = [];
		ctx.inject(["settings"], (settingsCtx) => {
			settingsCtx.settings.register(resolveNamespace(), NoticeSettingsSchema);
			/* 启动自证：注册成功会在 Harness 控制台留一行，便于排查命名空间未接上的问题。 */
			settingsCtx.logger.info("dsh-notice-center: settings namespace \"%s\" registered", SETTINGS_NAMESPACE);
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
export { DEFAULT_AMBER, DEFAULT_GREEN, SETTINGS_NAMESPACE, SOUND_ROUTE, NoticeSettingsSchema, buildSoundRoutes, src_default as default };
