			/** 通知权限的本地态（用于未授权提示与开启时的自动请求）。 */
			const [permission, setPermission] = (0, react.useState)(notificationSupport());
			/** 两个开关的当前值（未配置回默认）。 */
			const notifyEnabled = value.notifyEnabled ?? NOTIFY_DEFAULTS.notifyEnabled;
			const notifyOnlyWhenHidden = value.notifyOnlyWhenHidden ?? NOTIFY_DEFAULTS.notifyOnlyWhenHidden;
			/** 官方设置行规格（对齐「通用设置 → 权限」字段的 row/title/desc 样式）。 */
			const rowStyle = {
				display: "flex",
				alignItems: "center",
				gap: 8,
				padding: "16px 0",
				borderBottom: "0.5px solid var(--dsw-alias-border-l2)"
			};
			const rowTextStyle = {
				display: "flex",
				flexDirection: "column",
				flex: 1,
				gap: 4,
				minWidth: 0,
				paddingRight: 48
			};
			const titleStyle = {
				color: "var(--dsw-alias-label-primary)",
				fontSize: 14,
				fontWeight: 400,
				lineHeight: "22px"
			};
			const descStyle = {
				color: "var(--dsw-alias-label-tertiary)",
				fontSize: 12,
				fontWeight: 400,
				lineHeight: "18px"
			};
			/** 一行设置项：左侧标题（可带描述），右侧官方 Switch 原语。 */
			const switchRow = (key, label, hint, checked, onChange) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: rowStyle,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: rowTextStyle,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: titleStyle,
								children: label
							}),
							hint === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: descStyle,
								children: hint
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(primitives.Switch, {
						checked,
						label,
						onChange: (next) => onChange(typeof next === "boolean" ? next : !checked)
					})
				]
			}, key);
			/** 打开总开关时若尚未授权，立即请求通知权限（点击手势内，满足浏览器要求）。 */
			const setNotifyEnabled = (next) => {
				scope.set("notifyEnabled", next);
				if (!next) return;
				if (notificationSupport() !== "default") return;
				try {
					const answer = Notification.requestPermission();
					if (answer !== void 0 && typeof answer.then === "function") answer.then((result) => setPermission(result), () => setPermission(notificationSupport()));
				} catch {
					setPermission(notificationSupport());
				}
			};
