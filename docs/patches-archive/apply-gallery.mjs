/**
 * 往「本地适配包」的 lib/client.cjs 里追加一个临时的图标预览分区（本地开发工具）。
 * 只用于本地预览，不进入上游 PR。
 *
 * 用法: node apply-gallery.mjs <本地适配包 lib/client.cjs 路径>
 *
 * 两种模式：
 *   before       —— 在锚点之前插入片段（多片段以空行分隔）
 *   append-after —— 保留锚点，并在锚点之后插入片段
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const target = process.argv[2];
if (target === undefined) {
	console.error("用法: node apply-gallery.mjs <client.cjs 路径>");
	process.exit(2);
}

const withEol = (value, eol) => value.replace(/\r\n/g, "\n").split("\n").join(eol);
const readFrags = (names, eol) => names.map((name) => withEol(readFileSync(join(here, name), "utf8").replace(/\n+$/, ""), eol)).join(eol + eol);

const edits = [
	{ name: "图标清单 + 画廊组件", mode: "before", find: "//#endregion\n\t\t//#region src/client.ts", frags: ["icon-names.js", "gallery-section.js"] },
	{ name: "注册「图标预览」分区", mode: "append-after", find: "}, WhaleSettingsSection);\n\t\t\t});", frags: ["gallery-register.txt"] }
];

let text = readFileSync(target, "utf8");
const eol = text.includes("\r\n") ? "\r\n" : "\n";
let failed = 0;
for (const edit of edits) {
	const find = withEol(edit.find, eol);
	const count = text.split(find).length - 1;
	if (count !== 1) {
		console.error(`[FAIL] ${edit.name}: 锚点命中 ${count} 次（应为 1）`);
		failed += 1;
		continue;
	}
	const frag = readFrags(edit.frags, eol);
	const index = text.indexOf(find);
	const replacement = edit.mode === "before" ? frag + eol + find : find + eol + frag;
	text = text.slice(0, index) + replacement + text.slice(index + find.length);
	console.log(`[OK] ${edit.name}`);
}
if (failed === 0) writeFileSync(target, text, "utf8");
console.log(failed === 0 ? "已写入本地适配包" : `有 ${failed} 项失败，未写盘`);
process.exit(failed === 0 ? 0 : 1);
