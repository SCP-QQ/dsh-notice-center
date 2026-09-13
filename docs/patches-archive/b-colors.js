			/** 通知权限的本地态（未授权提示 + 开启通知时自动请求）。 */
			const [permission, setPermission] = (0, react.useState)(notificationSupport());
			/** 两个分组的展开态（本地 UI 状态，均默认折叠）。 */
			const [colorsExpanded, setColorsExpanded] = (0, react.useState)(false);
			const [notifyExpanded, setNotifyExpanded] = (0, react.useState)(false);
			/** 当前值（未配置回默认）。 */
			const colorsEnabled = value.colorsEnabled ?? COLORS_ENABLED_DEFAULT;
			const notifyEnabled = value.notifyEnabled ?? NOTIFY_DEFAULTS.notifyEnabled;
			const notifySound = value.notifySound ?? NOTIFY_DEFAULTS.notifySound;
			const notifyVolume = normalizeVolume(value.notifyVolume ?? NOTIFY_DEFAULTS.notifyVolume);
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
			/** 小图标按钮（展开箭头 / 恢复默认 / 试听共用）。 */
			const iconButtonStyle = {
				flex: "0 0 auto",
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				width: 28,
				height: 28,
				padding: 0,
				border: "none",
				borderRadius: 6,
				background: "transparent",
				color: "var(--dsw-alias-label-secondary)",
				cursor: "pointer"
			};
			/** 分组条目：主标题 + 描述 + 官方 Switch + 折叠展开箭头（子项由展开态控制显示）。 */
			const sectionRow = (key, title, hint, checked, onChange, expanded, onToggle, expandLabel) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: rowStyle,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: rowTextStyle,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: titleStyle,
								children: title
							}),
							hint === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: descStyle,
								children: hint
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(primitives.Switch, {
						checked,
						label: title,
						onChange: (next) => onChange(typeof next === "boolean" ? next : !checked)
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-expanded": expanded,
						"aria-label": expandLabel,
						title: expandLabel,
						onClick: onToggle,
						style: iconButtonStyle,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: {
								display: "inline-flex",
								transform: expanded ? "rotate(180deg)" : "none",
								transition: "transform 0.2s"
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(primitives.IconChevronDownOutline14, { size: 14 })
						})
					})
				]
			}, key);
			/** 一行子项设置：左侧标题（可带描述），右侧官方 Switch 原语（缩进 16px）。 */
			const switchRow = (key, label, hint, checked, onChange) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					...rowStyle,
					paddingLeft: 16
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: rowTextStyle,
						children: [
							label === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
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
						label: label ?? hint,
						onChange: (next) => onChange(typeof next === "boolean" ? next : !checked)
					})
				]
			}, key);
			/** 音量行：左侧标签，右侧原生滑杆（accent-color 跟随主题）+ 百分比。 */
			const volumeRow = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					...rowStyle,
					paddingLeft: 16
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: rowTextStyle,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: titleStyle,
							children: t("notifyVolume")
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 100,
						step: 5,
						value: Math.round(notifyVolume * 100),
						"aria-label": t("notifyVolume"),
						onChange: (e) => scope.set("notifyVolume", Number(e.target.value) / 100),
						style: {
							flex: "0 0 auto",
							width: 140,
							accentColor: "var(--dsw-alias-brand-primary)",
							cursor: "pointer"
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						style: {
							flex: "0 0 auto",
							minWidth: 36,
							textAlign: "right",
							color: "var(--dsw-alias-label-tertiary)",
							fontSize: 12,
							lineHeight: "18px"
						},
						children: [Math.round(notifyVolume * 100), "%"]
					})
				]
			}, "volume");
			/** 提示音行：左侧标题，右侧试听按钮（点击即按当前音量播放）。 */
			const soundRow = (kind, label) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					...rowStyle,
					paddingLeft: 16
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: rowTextStyle,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: titleStyle,
							children: label
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						title: t("preview"),
						"aria-label": t("preview"),
						onClick: () => playChime(kind, notifyVolume),
						style: iconButtonStyle,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(primitives.IconPlayOutline16, { size: 16 })
					})
				]
			}, kind);
			/** 一行颜色子项：左侧标签，右侧鲸鱼图标（按配置色填充，点击调起取色器）+ ↺ 恢复默认。 */
			const colorRow = (key, label, onReset) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					...rowStyle,
					paddingLeft: 16
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: rowTextStyle,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: titleStyle,
							children: label
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						style: {
							flex: "0 0 auto",
							position: "relative",
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							width: 28,
							height: 28,
							cursor: "pointer"
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								style: {
									display: "inline-flex",
									color: value[key] ?? COLOR_DEFAULTS[key]
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
									viewBox: "0 0 50 50",
									width: 22,
									height: 22,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: WHALE_SHAPE_PATH,
										fill: "currentColor"
									})
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "color",
								value: value[key] ?? COLOR_DEFAULTS[key],
								onChange: (e) => scope.set(key, e.target.value),
								"aria-label": label,
								style: {
									position: "absolute",
									inset: 0,
									width: "100%",
									height: "100%",
									padding: 0,
									border: "none",
									opacity: 0,
									cursor: "pointer"
								}
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						title: t("restore"),
						"aria-label": t("restore"),
						onClick: onReset,
						style: iconButtonStyle,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(primitives.IconRefreshOutline14, { size: 14 })
					})
				]
			}, key);
			/** 打开通知总开关时：预热音频上下文（用户手势内）并在未授权时请求通知权限。 */
			const setNotifyEnabled = (next) => {
				scope.set("notifyEnabled", next);
				if (!next) return;
				primeChime();
				if (notificationSupport() !== "default") return;
				try {
					const answer = Notification.requestPermission();
					if (answer !== void 0 && typeof answer.then === "function") answer.then((result) => setPermission(result), () => setPermission(notificationSupport()));
				} catch {
					setPermission(notificationSupport());
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column"
				},
				children: [
					sectionRow("colorsEnabled", t("groupColors"), t("colorsHint"), colorsEnabled, (next) => scope.set("colorsEnabled", next), colorsExpanded, () => setColorsExpanded((current) => !current), t("colorsExpand")),
					colorsExpanded ? colorRow("green", t("greenLabel"), () => scope.unset("green")) : null,
					colorsExpanded ? colorRow("amber", t("amberLabel"), () => scope.unset("amber")) : null,
					colorsExpanded ? colorRow("black", t("blackLabel"), () => scope.unset("black")) : null,
					sectionRow("notifyEnabled", t("groupNotify"), t("notifyEnabledHint"), notifyEnabled, setNotifyEnabled, notifyExpanded, () => setNotifyExpanded((current) => !current), t("notifyExpand")),
					notifyExpanded ? switchRow("notifySound", t("notifySound"), void 0, notifySound, (next) => scope.set("notifySound", next)) : null,
					notifyExpanded ? volumeRow() : null,
					notifyExpanded ? soundRow("done", t("notifyDoneSound")) : null,
					notifyExpanded ? soundRow("pending", t("notifyPendingSound")) : null,
					notifyEnabled && permission === "denied" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							...descStyle,
							padding: "0 0 8px 16px"
						},
						role: "alert",
						children: t("permissionDenied")
					}) : null,
					notifyEnabled && permission === "unsupported" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							...descStyle,
							padding: "0 0 8px 16px"
						},
						children: t("permissionUnsupported")
					}) : null
				]
			});
