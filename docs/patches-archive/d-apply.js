			/** 已完成/待处理通知的去重键（sessionId 加冒号加 kind）。 */
			const notified = new Set();
			/** 聚合队列与窗口：同一批状态跃迁合并成一条通知，避免刷屏。 */
			const notifyQueue = new Map();
			let notifyTimer;
			/** 已通知过的会话完成态，用于识别 false → true 跃迁。 */
			const prevCompleted = new Map();
			/** 上一轮待处理会话集合与首帧标记（首帧不通知，避免刷新页面时轰炸）。 */
			let prevPending = new Set();
			let pendingSeen = false;
			/** 读取通知配置（未配置回默认值）。 */
			function notifyConfig() {
				const snapshot = scope.getSnapshot().value ?? {};
				return {
					enabled: snapshot.notifyEnabled ?? NOTIFY_DEFAULTS.notifyEnabled,
					sound: snapshot.notifySound ?? NOTIFY_DEFAULTS.notifySound,
					volume: normalizeVolume(snapshot.notifyVolume ?? NOTIFY_DEFAULTS.notifyVolume)
				};
			}
			/** 记录一条待发通知（总开关关闭时跳过 + 去重 + 300ms 聚合）。 */
			function queueNotification(kind, sessionId, label) {
				if (!notifyConfig().enabled) return;
				const key = sessionId + ":" + kind;
				if (notified.has(key)) return;
				notified.add(key);
				notifyQueue.set(key, {
					kind,
					sessionId,
					label
				});
				if (notifyTimer === void 0) notifyTimer = setTimeout(flushNotifications, 300);
			}
			/** 发送聚合后的系统通知（仅在已授权、且按配置允许时真正弹出）。 */
			function flushNotifications() {
				notifyTimer = void 0;
				const entries = [...notifyQueue.values()];
				notifyQueue.clear();
				if (entries.length === 0) return;
				if (notificationSupport() !== "granted") return;
				const config = notifyConfig();
				/* 固定策略：只在页面不在前台时打扰（原先的可配置项已移除）。 */
				if (document.visibilityState === "visible") return;
				const t = ctx.locale.bind(SETTINGS_NAMESPACE);
				const grouped = new Map();
				for (const entry of entries) {
					const list = grouped.get(entry.kind) ?? [];
					list.push(entry);
					grouped.set(entry.kind, list);
				}
				for (const [kind, list] of grouped) {
					const head = list[0];
					const extra = list.length - 1;
					let body = head.label ?? head.sessionId;
					if (extra > 0) body = body + " +" + String(extra);
					try {
						const notification = new Notification(t(kind === "done" ? "notifyDoneTitle" : "notifyPendingTitle"), {
							body,
							tag: kind + ":" + head.sessionId,
							icon: uri(kind === "done" ? colors().green : colors().amber),
							silent: config.sound
						});
						if (config.sound) playChime(kind, config.volume);
						notification.onclick = () => {
							try {
								window.focus();
							} catch {}
							try {
								ctx.sessions.open(head.sessionId);
							} catch {}
							notification.close();
						};
					} catch {}
				}
			}
			/** 状态跃迁检测：官方 completed 由 false 变 true、以及 pending store 新增会话。 */
			function detectTransitions(state) {
				for (const row of Object.values(state.byId)) {
					if (row.origin === "subagent") continue;
					const before = prevCompleted.get(row.id);
					const now = row.completed === true;
					if (before === false && now) queueNotification("done", row.id, row.displayTitle ?? row.title ?? row.id);
					if (!now) notified.delete(row.id + ":done");
					prevCompleted.set(row.id, now);
				}
				for (const id of [...prevCompleted.keys()]) if (!(id in state.byId)) {
					prevCompleted.delete(id);
					notified.delete(id + ":done");
				}
				const pendingMap = pendingStore?.getSnapshot();
				const current = new Set(pendingMap === void 0 ? [] : [...pendingMap.keys()]);
				if (pendingSeen) for (const id of current) {
					if (prevPending.has(id)) continue;
					const row = state.byId[id];
					if (row !== void 0 && row.origin === "subagent") continue;
					queueNotification("pending", id, row?.displayTitle ?? row?.title ?? id);
				}
				for (const id of prevPending) if (!current.has(id)) notified.delete(id + ":pending");
				prevPending = current;
				pendingSeen = true;
			}
