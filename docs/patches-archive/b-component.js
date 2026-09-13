		/**
		* 系统通知设置 —— 注册进官方设置面板的 `settings.section` 槽（独立分区）。
		*
		* 四个开关直接写 settings（live 生效）；权限按钮必须在用户手势中调用
		* Notification.requestPermission()，因此单独放在这里而不是自动请求。
		*/
		function WhaleNotifySection({ scope, t }) {
			if (scope === void 0 || t === void 0) return null;
			const value = (0, react.useSyncExternalStore)((listener) => scope.subscribe(listener), () => scope.getSnapshot(), () => scope.getSnapshot()).value ?? {};
			const [permission, setPermission] = (0, react.useState)(notificationSupport());
			const row = (key, label) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 8,
					fontSize: 13,
					color: "var(--dsw-alias-label-primary)",
					cursor: "pointer"
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: value[key] ?? NOTIFY_DEFAULTS[key],
						onChange: (e) => scope.set(key, e.target.checked)
					}),
					label
				]
			}, key);
			const permissionText = () => t(permission === "granted" ? "permissionGranted" : permission === "denied" ? "permissionDenied" : permission === "unsupported" ? "permissionUnsupported" : "permissionDefault");
			const request = () => {
				try {
					const answer = Notification.requestPermission();
					if (answer !== void 0 && typeof answer.then === "function") answer.then((result) => setPermission(result), () => setPermission(notificationSupport()));
					else setPermission(notificationSupport());
				} catch {
					setPermission(notificationSupport());
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: 10,
					padding: "16px 0"
				},
				children: [
					row("notifyDone", t("notifyDone")),
					row("notifyPending", t("notifyPending")),
					row("notifyOnlyWhenHidden", t("notifyOnlyWhenHidden")),
					row("notifyShowTitle", t("notifyShowTitle")),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 8
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: request,
								style: {
									font: "inherit",
									padding: "6px 12px",
									borderRadius: 6,
									border: "1px solid var(--dsw-alias-border-l2)",
									background: "transparent",
									color: "var(--dsw-alias-label-primary)",
									cursor: "pointer"
								},
								children: t("enableNotifications")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								style: {
									fontSize: 12,
									color: "var(--dsw-alias-label-secondary)"
								},
								children: permissionText()
							})
						]
					})
				]
			});
		}
