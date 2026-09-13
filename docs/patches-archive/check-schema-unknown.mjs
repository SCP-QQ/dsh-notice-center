/**
 * 验证 schemastery 的 object schema 对「未声明字段」的处理（dsh-settings 用 schema(value) 解析）。
 * 若为忽略/剥离 → settings.yaml 里的旧字段（notifyDone/notifyPending）无害；
 * 若抛错 → 必须清理，否则设置页读取会失败。
 */
const entry = process.argv[2];
const mod = await import(entry);
const z = mod.default ?? mod;
const schema = z.object({
	notifyEnabled: z.boolean().default(false),
	notifyOnlyWhenHidden: z.boolean().default(true)
});
const parse = typeof schema === "function" ? schema : (schema.resolve ?? schema.parse);
if (typeof parse !== "function") {
	console.log("无法调用 schema，导出键:", Object.keys(mod).join(", "));
	process.exit(1);
}
try {
	const legacyOnly = parse({ notifyDone: true, notifyPending: true });
	console.log("仅旧字段:", JSON.stringify(legacyOnly));
	const mixed = parse({ notifyDone: true, notifyPending: true, notifyEnabled: true });
	console.log("旧+新字段:", JSON.stringify(mixed));
	const empty = parse({});
	console.log("空文档  :", JSON.stringify(empty));
	console.log("UNKNOWN-FIELDS: TOLERATED");
} catch (error) {
	console.log("UNKNOWN-FIELDS: REJECTED ->", String(error && error.message ? error.message : error));
}
