import * as dshSettings from "@deepseek-ai/dsh-settings";
import z from "@deepseek-ai/schemastery";
//#region src/index.ts
/**
* dsh-notice-center — Host half.
*
* 宿主半的唯一职责：向官方 settings 服务（@deepseek-ai/dsh-settings，由
* dsh-settings-file 持久化到 settings.yaml）注册 `notice-center` 命名空间的
* schema。浏览器半（src/client.ts）通过 settingsScope 绑定同一命名空间，
* 读配置、写配置；favicon 状态机消费配置色。
*
* 【兼容 0.1.2-rc.1】dsh-settings 自 0.1.2-rc.1 起不再导出
* `settingsNamespace()`；register 内部改为 parseSettingsNamespace() 直接校验
* 小写连字符字符串。此处改用命名空间导入（缺少具名导出时不会整体报错），
* 有该助手则用（0.1.1-rc.2），没有则直接传命名空间字符串（0.1.2-rc.1）。
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
* 解析注册用的命名空间：旧版（≤0.1.1-rc.2）走 branded 助手，新版直接传字符串。
* @returns settings.register 接受的命名空间。
*/
function resolveNamespace() {
	return typeof dshSettings.settingsNamespace === "function" ? dshSettings.settingsNamespace(SETTINGS_NAMESPACE) : SETTINGS_NAMESPACE;
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
	notifyVolume: z.number().min(0).max(1).default(0.6)
});
var src_default = {
	name: "dsh-notice-center",
	apply(ctx) {
		ctx.inject(["settings"], (settingsCtx) => {
			settingsCtx.settings.register(resolveNamespace(), NoticeSettingsSchema);
			/* 启动自证：注册成功会在 Harness 控制台留一行，便于排查命名空间未接上的问题。 */
			settingsCtx.logger.info("dsh-notice-center: settings namespace \"%s\" registered", SETTINGS_NAMESPACE);
		});
	}
};
//#endregion
export { DEFAULT_AMBER, DEFAULT_GREEN, SETTINGS_NAMESPACE, NoticeSettingsSchema, src_default as default };
