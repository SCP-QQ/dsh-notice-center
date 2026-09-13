				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						flexDirection: "column"
					},
					children: [
						switchRow("notifyEnabled", t("notifyEnabled"), t("notifyEnabledHint"), notifyEnabled, setNotifyEnabled),
						notifyEnabled ? switchRow("notifyOnlyWhenHidden", t("notifyOnlyWhenHidden"), void 0, notifyOnlyWhenHidden, (next) => scope.set("notifyOnlyWhenHidden", next)) : null,
						notifyEnabled && permission === "denied" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: descStyle,
							role: "alert",
							children: t("permissionDenied")
						}) : null,
						notifyEnabled && permission === "unsupported" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: descStyle,
							children: t("permissionUnsupported")
						}) : null
					]
				})