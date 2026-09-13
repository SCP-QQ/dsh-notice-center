		/**
		* 临时图标预览（本地开发工具，不进上游 PR）：把内核 UI 原语里可用的图标
		* 全部铺成一张网格（图标 + 名称），便于为插件挑图标。
		*/
		function IconGallerySection({ t }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(108px, 1fr))",
					gap: 10,
					padding: "16px 0"
				},
				children: ICON_NAMES.map((name) => {
					const Icon = primitives[name];
					return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: 6,
							padding: "10px 6px",
							border: "0.5px solid var(--dsw-alias-border-l2)",
							borderRadius: 8,
							color: "var(--dsw-alias-label-primary)"
						},
						children: [
							Icon === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "?" }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { size: 20 }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								style: {
									fontSize: 10,
									lineHeight: "14px",
									color: "var(--dsw-alias-label-tertiary)",
									textAlign: "center",
									wordBreak: "break-all"
								},
								children: name
							})
						]
					}, name);
				})
			});
		}
