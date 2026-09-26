/**
 * 兼容性声明矩阵测试 —— 守住「1.4.x 只发给 0.1.7-rc.2 及以后的宿主」这一条声明。
 *
 * 为什么需要它：
 * 插件市场（dshmarket）的「检查更新」会读**已发布 manifest** 的 `engines.dsh`
 * 与 `@deepseek-ai/dsh*` peer 声明，跟宿主版本比对；判定不兼容就不会把新版推给
 * 旧宿主。DSH 核心（dsh-app-boot）在导入前用 peer 声明再判一次，不兼容就把该
 * 插件行禁用，并打印「Update the plugin …」。
 *
 * 声明一旦被无意放宽（例如有人顺手改回 `^0.1.2-rc.1`），旧宿主就会收到更新、
 * 装上之后才在运行期炸 —— 0.1.7 删掉了 `settings.register`，而版本闸门**查不出
 * 这种 API 删除**（旧声明在 0.1.7 上是 PASS 的）。这个文件就是那道闸：声明必须
 * 对新宿主放行、对旧宿主拒绝，且两层判定不能互相矛盾。
 *
 * 用法：node test/compat-range.smoke.mjs
 * 退出码 0 = 全部通过；1 = 有失败项。
 *
 * 判定规则来源（两份独立实现，本文件只覆盖它们一致的那部分）：
 *   - DSH 核心 `evaluatePluginCompatibility`：只看 `@deepseek-ai/dsh` 与
 *     `@deepseek-ai/dsh-*` 的 peer，用 semver.satisfies(runtime, range,
 *     { includePrerelease: true }) 比对**运行时版本**（`dsh --version`）。
 *   - 市场 `deriveHostCompatibility`：读 `engines.dsh` 加上 hostPackages 命中的
 *     dsh-* peer，同样按 includePrerelease 比对；全部声明都成立才 compatible，
 *     有一条不成立即 incompatible，无法判定是 unknown（unknown 会被放行）。
 * 实测（dsh 0.1.7-rc.2 + dshmarket 1.66.1）：显式比较符写法下两层逐行一致；
 * 而 `^` / `~` 这类隐式上界在预发布上的放宽程度不同（例如 `^0.1.7-rc.2` 对
 * 0.2.0-rc.1：核心拒绝、市场放行）。因此本测试只接受显式比较符写法，遇到别的
 * 语法直接判失败，而不是替你做选择。
 */
import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

let failed = 0;
const check = (name, ok, detail = "") => {
	console.log(`${ok ? "[OK]  " : "[FAIL]"} ${name}${detail === "" ? "" : ` — ${detail}`}`);
	if (!ok) failed += 1;
};

/* ------------------------------- 最小 semver ------------------------------- */

const VERSION_RE = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;
const COMPARATOR_RE = /^(>=|<=|>|<|=)?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/;

function parseVersion(text) {
	const matched = VERSION_RE.exec(text);
	if (matched === null) return null;
	return {
		numbers: [Number(matched[1]), Number(matched[2]), Number(matched[3])],
		pre: matched[4] === undefined ? [] : matched[4].split("."),
	};
}

/** 预发布标识符比较：有预发布 < 无预发布；数字标识符 < 字母标识符；前缀相同则短的更小。 */
function comparePrerelease(left, right) {
	if (left.length === 0 && right.length === 0) return 0;
	if (left.length === 0) return 1;
	if (right.length === 0) return -1;
	const length = Math.max(left.length, right.length);
	for (let index = 0; index < length; index += 1) {
		const a = left[index];
		const b = right[index];
		if (a === undefined) return -1;
		if (b === undefined) return 1;
		if (a === b) continue;
		const aNumeric = /^\d+$/.test(a);
		const bNumeric = /^\d+$/.test(b);
		if (aNumeric && bNumeric) return Number(a) < Number(b) ? -1 : 1;
		if (aNumeric !== bNumeric) return aNumeric ? -1 : 1;
		return a < b ? -1 : 1;
	}
	return 0;
}

function compareVersions(left, right) {
	for (let index = 0; index < 3; index += 1) {
		if (left.numbers[index] !== right.numbers[index]) return left.numbers[index] < right.numbers[index] ? -1 : 1;
	}
	return comparePrerelease(left.pre, right.pre);
}

/** 解析成 OR 组；不认识的语法返回 null，由调用方判失败（不猜）。 */
function parseRange(text) {
	const trimmed = text.trim();
	if (trimmed === "" || trimmed === "*") return [[]];
	const groups = [];
	for (const part of trimmed.split("||")) {
		const comparators = [];
		for (const token of part.trim().split(/\s+/).filter((item) => item !== "")) {
			const matched = COMPARATOR_RE.exec(token);
			if (matched === null) return null;
			const version = parseVersion(matched[2]);
			if (version === null) return null;
			comparators.push({ op: matched[1] ?? "=", version });
		}
		if (comparators.length === 0) return null;
		groups.push(comparators);
	}
	return groups.length === 0 ? null : groups;
}

/**
 * includePrerelease: true —— 预发布参与匹配，与 DSH 核心和市场一致。
 * （这也是旧声明 `^0.1.2-rc.1` 曾经在 0.1.7-rc.2 上 PASS 的原因。）
 * 返回 true / false / null（null = 语法不认识或版本号非法）。
 */
function satisfies(runtime, range) {
	const groups = parseRange(range);
	const target = parseVersion(runtime);
	if (groups === null || target === null) return null;
	return groups.some((comparators) => comparators.every((comparator) => {
		const order = compareVersions(target, comparator.version);
		if (comparator.op === ">=") return order >= 0;
		if (comparator.op === ">") return order > 0;
		if (comparator.op === "<=") return order <= 0;
		if (comparator.op === "<") return order < 0;
		return order === 0;
	}));
}

/* ------------------------------ 两层的判定逻辑 ------------------------------ */

/** 声明里所有被 DSH 核心检查的范围（不声明 dsh peer ⇒ 不施加约束 ⇒ 恒真）。 */
function coreRanges(value) {
	return Object.entries(value.peerDependencies ?? {})
		.filter(([name]) => name === "@deepseek-ai/dsh" || name.startsWith("@deepseek-ai/dsh-"))
		.map(([, range]) => range);
}

function dshCoreAccepts(value, runtime) {
	const ranges = coreRanges(value);
	return ranges.length === 0 ? true : ranges.every((range) => satisfies(runtime, range) === true);
}

/**
 * 市场的判定：engines.dsh + dsh-* peer 全部成立 → compatible；
 * 任一条明确不成立 → incompatible；其余（含无法判定）→ unknown。
 * 注意 unknown 会被放行，所以测试对旧宿主断言的是 incompatible，而不是「非 compatible」。
 */
function marketVerdict(value, runtime) {
	const declarations = coreRanges(value);
	if (typeof value.engines?.dsh === "string") declarations.push(value.engines.dsh);
	if (declarations.length === 0) return "unknown";
	const results = declarations.map((range) => satisfies(runtime, range));
	if (results.includes(false)) return "incompatible";
	return results.every((result) => result === true) ? "compatible" : "unknown";
}

/* -------------------------------- 结构性断言 -------------------------------- */

console.log(`声明：version=${manifest.version}  engines.dsh=${JSON.stringify(manifest.engines?.dsh)}`);
for (const [name, range] of Object.entries(manifest.peerDependencies ?? {})) {
	if (name === "@deepseek-ai/dsh" || name.startsWith("@deepseek-ai/dsh-")) console.log(`        ${name}@${range}`);
}

const declaredRanges = coreRanges(manifest);
if (typeof manifest.engines?.dsh === "string") declaredRanges.push(manifest.engines.dsh);

check("engines.dsh 已声明（否则市场判 unknown 并放行给所有宿主）", typeof manifest.engines?.dsh === "string" && manifest.engines.dsh.trim() !== "", JSON.stringify(manifest.engines?.dsh));

const unknownSyntax = declaredRanges.filter((range) => parseRange(range) === null);
check("所有 DSH 兼容声明的语法都在本测试覆盖范围内", unknownSyntax.length === 0,
	unknownSyntax.length === 0 ? "" : `${unknownSyntax.join(" / ")} —— 请改用显式比较符（>=x <y）；^ / ~ 在两层实现间对预发布的行为不一致`);

const usesWorkspace = declaredRanges.filter((range) => range.includes("workspace:"));
check("声明里没有 workspace: 协议（发布包里没有意义）", usesWorkspace.length === 0, usesWorkspace.join(" / "));

const uniqueRanges = [...new Set(declaredRanges)];
check("engines.dsh 与各 dsh-* peer 的范围完全一致（两层判定不能各说各话）", uniqueRanges.length === 1, uniqueRanges.join(" ∩ "));

for (const required of ["@deepseek-ai/dsh-client-locale", "@deepseek-ai/dsh-client-ui-settings", "@deepseek-ai/dsh-client-ui-session", "@deepseek-ai/dsh-settings"]) {
	check(`peer 仍在：${required}`, typeof manifest.peerDependencies?.[required] === "string");
}

/* --------------------------------- 版本矩阵 --------------------------------- */

const MATRIX = [
	["0.1.2-rc.1", false, "1.3.x 时代的下限宿主"],
	["0.1.4", false, "旧宿主"],
	["0.1.5-rc.1", false, "最近一次实测过的旧宿主"],
	["0.1.6", false, "0.1.7 之前的最后一个补丁线"],
	["0.1.7-rc.1", false, "声明下限之前（未验证，故意排除）"],
	["0.1.7-rc.2", true, "本机开发宿主"],
	["0.1.7", true, "0.1.7 正式版"],
	["0.1.8-rc.1", true, "0.1.x 后续预发布不该被拒"],
	["0.1.9", true, "0.1.x 后续补丁不该被拒"],
	["0.2.0-rc.1", false, "跨出 0.1 线：必须重新验证后手动放行"],
	["0.2.0", false, "同上"],
];

console.log("\n宿主版本      期望     DSH核心    市场判定");
for (const [runtime, expected, note] of MATRIX) {
	const core = dshCoreAccepts(manifest, runtime);
	const market = marketVerdict(manifest, runtime);
	const want = expected ? "放行" : "拒绝";
	console.log(`${runtime.padEnd(13)} ${want}     ${(core ? "PASS" : "REFUSED").padEnd(10)} ${market}`);
	check(`${runtime}（${note}）DSH 核心${want}`, core === expected, core ? "PASS" : "REFUSED");
	check(`${runtime}（${note}）市场判定为 ${expected ? "compatible" : "incompatible"}`,
		market === (expected ? "compatible" : "incompatible"), market);
}

console.log(failed === 0 ? "\n全部通过" : `\n有 ${failed} 项失败`);
process.exitCode = failed === 0 ? 0 : 1;
