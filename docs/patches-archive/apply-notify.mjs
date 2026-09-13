/**
 * 把「颜色组 + 系统通知 + 通知中心导航」功能插入 dsh-done-whale 的构建产物。
 *
 * 片段文件由文件写入工具直接落盘，本脚本只做「唯一命中校验 + 定位改写」，
 * 因此不涉及字符串转义问题。
 *
 * 锚点：find（字面，按目标文件行尾归一化）或 findRegex（多行正则，必须恰好 1 行）。
 * 模式：
 *   append        锚点后插入
 *   before        锚点前插入
 *   replace       用 replaceText（内联）或片段替换锚点
 *   framed        用 prefix + 片段 + tail 替换锚点
 *   replace-range 用片段替换 [findStart, findEnd] 区间（含两端）
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repo = process.argv[2];
if (repo === undefined) {
	console.error("用法: node apply-notify.mjs <仓库路径>");
	process.exit(2);
}

const edits = [
	{ name: "A0 引入官方 UI 原语", file: "lib/client.cjs", mode: "append", find: '\t\tlet react_jsx_runtime = require("react/jsx-runtime");', frag: "a0-require.txt" },
	{ name: "A 模块级常量与权限工具", file: "lib/client.cjs", mode: "append", find: "const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;", frag: "a-module.js" },
	{ name: "P 设置页主体重构（颜色组 + 通知组）", file: "lib/client.cjs", mode: "replace-range", findStart: "\t\t\tconst [rows, setRows] = (0, react.useState)({});", findEnd: "\t\t\t\t}, key))\n\t\t\t});", frag: "b-colors.js" },
	{ name: "D apply 内通知状态机", file: "lib/client.cjs", mode: "append", find: "\t\t\tlet pendingStore;", frag: "d-apply.js" },
	{ name: "L 导航图标（IconQueueOutline14）", file: "lib/client.cjs", mode: "append", findRegex: "^\\t+const iconLink = \\(\\) =>.*$", frag: "l-nav-icon.js" },
	{ name: "M 导航名改「通知中心」(zh)", file: "lib/client.cjs", mode: "replace", find: 'nav: "鲸鱼状态灯"', replaceText: 'nav: "通知中心"' },
	{ name: "N 导航名改「Notification center」(en)", file: "lib/client.cjs", mode: "replace", find: 'nav: "Whale status"', replaceText: 'nav: "Notification center"' },
	{ name: "O 完成标签(zh)", file: "lib/client.cjs", mode: "replace", find: 'greenLabel: "完成色"', replaceText: 'greenLabel: "完成"' },
	{ name: "O2 待处理标签(zh)", file: "lib/client.cjs", mode: "replace", find: 'amberLabel: "待处理色"', replaceText: 'amberLabel: "待处理"' },
	{ name: "O3 完成标签(en)", file: "lib/client.cjs", mode: "replace", find: 'greenLabel: "Done color"', replaceText: 'greenLabel: "Done"' },
	{ name: "O4 待处理标签(en)", file: "lib/client.cjs", mode: "replace", find: 'amberLabel: "Pending color"', replaceText: 'amberLabel: "Pending"' },
	{ name: "Q 颜色总开关生效", file: "lib/client.cjs", mode: "append", find: "\t\t\tfunction targetOf(state) {", frag: "q-targetof.txt" },
	{ name: "E trackEdges 完成通知", file: "lib/client.cjs", mode: "replace", find: 'if (row.id === state.current && document.visibilityState === "hidden") finishedWhileHidden.add(row.id);', frag: "e-trackedges.txt" },
	{ name: "F sync 调用跃迁检测", file: "lib/client.cjs", mode: "replace", find: "\t\t\t\ttrackEdges(state);", frag: "f-sync.txt" },
	{ name: "G 卸载时清理定时器", file: "lib/client.cjs", mode: "replace", find: "\t\t\t\tunsubscribeList();", frag: "g-cleanup.txt" },
	{ name: "I zh 文案", file: "lib/client.cjs", mode: "replace", find: 'invalidHex: "颜色格式应为 #RRGGBB"', frag: "h-locale-zh.txt" },
	{ name: "J en 文案", file: "lib/client.cjs", mode: "replace", find: 'invalidHex: "Color must be #RRGGBB"', frag: "i-locale-en.txt" },
	{ name: "K 宿主 schema（颜色开关 + 通知开关）", file: "lib/index.mjs", mode: "replace", find: "black: z.string().pattern(HEX)", frag: "j-schema.txt" }
];

/** 按目标文件的行尾风格归一化多行文本。 */
function withEol(value, eol) {
	return value.replace(/\r\n/g, "\n").split("\n").join(eol);
}

let failed = 0;
for (const edit of edits) {
	const path = join(repo, edit.file);
	let text = readFileSync(path, "utf8");
	const eol = text.includes("\r\n") ? "\r\n" : "\n";
	const readFrag = () => withEol(readFileSync(join(here, edit.frag), "utf8").replace(/\n+$/, ""), eol);
	let startIndex;
	let find;
	if (edit.mode === "replace-range") {
		const start = withEol(edit.findStart, eol);
		const end = withEol(edit.findEnd, eol);
		const starts = text.split(start).length - 1;
		const ends = text.split(end).length - 1;
		if (starts !== 1 || ends !== 1) {
			console.error(`[FAIL] ${edit.name}: 区间锚点命中 start=${starts} end=${ends}（都应为 1），跳过`);
			failed += 1;
			continue;
		}
		startIndex = text.indexOf(start);
		const endIndex = text.indexOf(end, startIndex);
		if (endIndex < 0) {
			console.error(`[FAIL] ${edit.name}: 区间起点之后找不到终点锚点，跳过`);
			failed += 1;
			continue;
		}
		text = text.slice(0, startIndex) + readFrag() + text.slice(endIndex + end.length);
		writeFileSync(path, text, "utf8");
		console.log(`[OK] ${edit.name}`);
		continue;
	}
	if (typeof edit.findRegex === "string") {
		const matches = text.match(new RegExp(edit.findRegex, "gm")) ?? [];
		if (matches.length !== 1) {
			console.error(`[FAIL] ${edit.name}: 正则锚点命中 ${matches.length} 行（应为 1），跳过`);
			failed += 1;
			continue;
		}
		find = matches[0];
	} else {
		find = withEol(edit.find, eol);
		const count = text.split(find).length - 1;
		if (count !== 1) {
			console.error(`[FAIL] ${edit.name}: 锚点命中 ${count} 次（应为 1），跳过`);
			failed += 1;
			continue;
		}
	}
	startIndex = text.indexOf(find);
	let replacement;
	if (edit.mode === "append") replacement = find + eol + readFrag();
	else if (edit.mode === "before") replacement = readFrag() + eol + find;
	else if (edit.mode === "replace") replacement = edit.replaceText === undefined ? readFrag() : withEol(edit.replaceText, eol);
	else if (edit.mode === "framed") replacement = withEol(edit.prefix, eol) + readFrag() + withEol(edit.tail, eol);
	else throw new Error("未知模式: " + String(edit.mode));
	writeFileSync(path, text.slice(0, startIndex) + replacement + text.slice(startIndex + find.length), "utf8");
	console.log(`[OK] ${edit.name}`);
}
console.log(failed === 0 ? "全部插入成功" : `有 ${failed} 项失败`);
process.exit(failed === 0 ? 0 : 1);
