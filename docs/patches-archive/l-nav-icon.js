			/**
			* 导航图标：官方 settings.section 的图标由 shell 按 section id 硬编码（未知 id
			* 回退默认齿轮），注册选项里没有 icon 字段；这里把「通知中心」导航项的 path
			* 数据换成官方 IconQueueOutline14 的矢量数据（语义一致：一叠待处理条目）。
			* 数据取自内核 UI 原语 @deepseek-ai/dsh-client-ui-primitives（viewBox 0 0 14 14，
			* 单 path，fill=currentColor）。只改属性、不增删 React 管理的节点。
			*/
			const NAV_ICON_PATH = "M7.00049 0.199829C3.24488 0.199829 0.199952 3.24408 0.199707 6.99963C0.199707 8.0414 0.434087 9.03061 0.854004 9.91467L1.11279 10.4576L2.19775 9.94202L1.94092 9.39905L1.81787 9.12268C1.5498 8.46885 1.40186 7.75171 1.40186 6.99963C1.4021 3.90808 3.90888 1.40198 7.00049 1.40198C10.0919 1.40219 12.5979 3.90821 12.5981 6.99963C12.5981 10.0913 10.0921 12.5981 7.00049 12.5983C6.36734 12.5983 5.90348 12.5535 5.49268 12.4401C5.08803 12.3283 4.7041 12.1414 4.24463 11.8209C3.57111 11.3511 2.60588 11.1855 1.81006 11.6881L1.79736 11.6959L1.78467 11.7047L1.25537 12.0778L1.65381 13.2672L2.46045 12.6989C2.75029 12.5214 3.18004 12.5442 3.55615 12.8063C4.10063 13.1861 4.60863 13.4423 5.17334 13.5983C5.73194 13.7525 6.31665 13.8004 7.00049 13.8004C10.7561 13.8002 13.8003 10.7553 13.8003 6.99963C13.8 3.24421 10.7559 0.200041 7.00049 0.199829ZM3.81201 7.47327V8.67542H7.11572V7.47327H3.81201ZM3.81201 6.34924H10.2173V5.14709H3.81201V6.34924Z";
			let navIconScheduled = false;
			/** 把「通知中心」导航项的图标替换为官方 IconQueueOutline14（幂等）。 */
			function applyNavIcon() {
				const nav = document.querySelector("[role=\"dialog\"] nav");
				if (nav === null) return;
				const label = ctx.locale.bind(SETTINGS_NAMESPACE)("nav");
				for (const cell of nav.querySelectorAll("button")) {
					if (cell.textContent === null || !cell.textContent.includes(label)) continue;
					const svg = cell.querySelector("svg");
					if (svg === null) continue;
					const paths = svg.querySelectorAll("path");
					if (paths.length === 0) continue;
					if (paths[0].getAttribute("d") === NAV_ICON_PATH) continue;
					svg.setAttribute("viewBox", "0 0 14 14");
					svg.setAttribute("width", "16");
					svg.setAttribute("height", "16");
					paths.forEach((path, index) => {
						if (index === 0) {
							path.setAttribute("d", NAV_ICON_PATH);
							path.setAttribute("fill", "currentColor");
							path.removeAttribute("fill-rule");
						} else path.setAttribute("d", "");
					});
				}
			}
			/** rAF 合并：DOM 变动频繁时每个渲染帧最多检查一次。 */
			function scheduleNavIcon() {
				if (navIconScheduled) return;
				navIconScheduled = true;
				requestAnimationFrame(() => {
					navIconScheduled = false;
					applyNavIcon();
				});
			}
			const navIconObserver = new MutationObserver(scheduleNavIcon);
			navIconObserver.observe(document.documentElement, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ["d"]
			});
			scheduleNavIcon();
