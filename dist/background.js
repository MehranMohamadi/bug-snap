//#region src/utils/storage.ts
var e = {
	captureConsole: !0,
	captureNetwork: !0,
	includeBrowserInfo: !0,
	maxConsoleEntries: 50,
	maxNetworkEntries: 50,
	defaultReportFormat: "markdown",
	theme: "dark"
};
function t() {
	return typeof chrome < "u" && !!chrome.storage?.local;
}
var n = /* @__PURE__ */ new Map();
async function r(e, r) {
	if (t()) try {
		let t = await chrome.storage.local.get(e);
		return t[e] === void 0 ? r : t[e];
	} catch (t) {
		return console.warn("[BugSnap Storage] Error reading key:", e, t), r;
	}
	return n.has(e) ? n.get(e) : r;
}
async function i(e, r) {
	if (t()) try {
		await chrome.storage.local.set({ [e]: r });
		return;
	} catch (t) {
		console.warn("[BugSnap Storage] Error writing key:", e, t);
	}
	n.set(e, r);
}
async function a(e) {
	if (t()) try {
		await chrome.storage.local.remove(e);
		return;
	} catch (t) {
		console.warn("[BugSnap Storage] Error removing key:", e, t);
	}
	n.delete(e);
}
async function o() {
	let t = await r("bugsnap_settings", {});
	return {
		...e,
		...t
	};
}
async function s(e, t, n = 50) {
	let a = `tab_${e}_console`, o = await r(a, []);
	o.push(t), await i(a, o.slice(-n));
}
async function c(e) {
	return r(`tab_${e}_console`, []);
}
async function l(e, t, n = 50) {
	let a = `tab_${e}_network`, o = await r(a, []);
	o.push(t), await i(a, o.slice(-n));
}
async function u(e) {
	return r(`tab_${e}_network`, []);
}
async function d(e) {
	await a(`tab_${e}_console`), await a(`tab_${e}_network`);
}
async function f(e) {
	await i("bugsnap_current_report", e);
}
//#endregion
//#region src/utils/sanitizer.ts
var p = /* @__PURE__ */ new Set([
	"token",
	"access_token",
	"refresh_token",
	"id_token",
	"api_key",
	"apikey",
	"key",
	"secret",
	"client_secret",
	"password",
	"pass",
	"pwd",
	"session",
	"session_id",
	"sessionid",
	"auth",
	"authorization",
	"code",
	"sig",
	"signature",
	"private_key",
	"credentials",
	"credential",
	"bearer"
]), m = /ey[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, h = /(["']?(?:password|passwd|secret|api_?key|access_?token)["']?\s*[:=]\s*["'])([^"'&\s]+)(["'])/gi;
function g(e) {
	if (!e || typeof e != "string") return "";
	try {
		let t = !e.startsWith("http://") && !e.startsWith("https://"), n = new URL(e, "https://bugsnap.internal"), r = new URLSearchParams(n.search), i = !1;
		for (let [e] of Array.from(r.entries())) {
			let t = e.toLowerCase();
			(p.has(t) || t.includes("token") || t.includes("secret") || t.includes("auth") || t.includes("key") || t.includes("password")) && (r.set(e, "[REDACTED]"), i = !0);
		}
		i && (n.search = r.toString() ? `?${r.toString()}` : ""), n.pathname = n.pathname.replace(m, "[REDACTED_JWT]");
		let a = t ? n.pathname + n.search + n.hash : n.toString();
		return a = a.replace(m, "[REDACTED_JWT]"), a;
	} catch {
		return e.replace(h, "$1[REDACTED]$3").replace(m, "[REDACTED_JWT]");
	}
}
//#endregion
//#region src/utils/environment.ts
function _(e) {
	if (/Edg\/([0-9]+)/i.test(e)) {
		let t = e.match(/Edg\/([0-9]+)/i);
		return `Edge ${t ? t[1] : ""}`.trim();
	}
	if (/Chrome\/([0-9]+)/i.test(e)) {
		let t = e.match(/Chrome\/([0-9]+)/i);
		return `Chrome ${t ? t[1] : ""}`.trim();
	}
	if (/Firefox\/([0-9]+)/i.test(e)) {
		let t = e.match(/Firefox\/([0-9]+)/i);
		return `Firefox ${t ? t[1] : ""}`.trim();
	}
	if (/Safari\/([0-9]+)/i.test(e) && !/Chrome/i.test(e)) {
		let t = e.match(/Version\/([0-9]+)/i);
		return `Safari ${t ? t[1] : ""}`.trim();
	}
	return "Chromium Browser";
}
function v(e) {
	if (/Windows NT 10.0/i.test(e)) return "Windows 11 / 10";
	if (/Windows NT 6.3/i.test(e)) return "Windows 8.1";
	if (/Windows NT 6.1/i.test(e)) return "Windows 7";
	if (/Mac OS X ([0-9_\.]+)/i.test(e)) {
		let t = e.match(/Mac OS X ([0-9_\.]+)/i);
		return `macOS ${t ? t[1].replace(/_/g, ".") : ""}`.trim();
	}
	if (/Android ([0-9\.]+)/i.test(e)) {
		let t = e.match(/Android ([0-9\.]+)/i);
		return `Android ${t ? t[1] : ""}`.trim();
	}
	return /iPhone|iPad|iPod/i.test(e) ? "iOS" : /Linux/i.test(e) ? "Linux" : "Unknown OS";
}
function y(e = /* @__PURE__ */ new Date()) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")} ${String(e.getHours()).padStart(2, "0")}:${String(e.getMinutes()).padStart(2, "0")}:${String(e.getSeconds()).padStart(2, "0")}`;
}
function b(e, t) {
	let n = typeof navigator < "u" ? navigator.userAgent : "", r = /* @__PURE__ */ new Date(), i = typeof window < "u" ? window.innerWidth : 0, a = typeof window < "u" ? window.innerHeight : 0, o = typeof screen < "u" ? screen.width : 0, s = typeof screen < "u" ? screen.height : 0, c = typeof window < "u" && window.devicePixelRatio || 1, l = typeof navigator < "u" && navigator.language || "en", u = "UTC";
	try {
		u = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
	} catch {}
	let d = e || (typeof window < "u" ? window.location.href : ""), f = t || (typeof document < "u" ? document.title : "");
	return {
		browser: _(n),
		os: v(n),
		viewport: `${i} × ${a}`,
		screen: `${o} × ${s}`,
		devicePixelRatio: c,
		url: g(d),
		pageTitle: f || "Untitled Page",
		timestamp: y(r),
		language: l,
		timezone: u,
		userAgent: n
	};
}
//#endregion
//#region src/background/index.ts
async function x(e) {
	try {
		let [t, n] = await Promise.all([c(e), u(e)]), r = t.filter((e) => e.type === "error" || e.type === "window.onerror").length + n.length;
		r > 0 ? (await chrome.action.setBadgeBackgroundColor({
			color: "#E11D48",
			tabId: e
		}), await chrome.action.setBadgeText({
			text: String(r),
			tabId: e
		})) : await chrome.action.setBadgeText({
			text: "",
			tabId: e
		});
	} catch {}
}
chrome.runtime.onMessage.addListener((e, t, n) => {
	let r = t.tab?.id;
	if (e.type === "LOG_CONSOLE" && r !== void 0) return (async () => {
		let t = await o();
		t.captureConsole && (await s(r, e.payload, t.maxConsoleEntries), await x(r));
	})(), !0;
	if (e.type === "LOG_NETWORK" && r !== void 0) return (async () => {
		let t = await o();
		t.captureNetwork && (await l(r, e.payload, t.maxNetworkEntries), await x(r));
	})(), !0;
	if (e.type === "GET_TAB_SUMMARY") return (async () => {
		let t = e.payload?.tabId;
		if (!t) {
			n({
				consoleErrorCount: 0,
				consoleWarnCount: 0,
				networkFailureCount: 0,
				url: "",
				title: ""
			});
			return;
		}
		let [r, i] = await Promise.all([c(t), u(t)]), a = r.filter((e) => e.type === "error" || e.type === "window.onerror" || e.type === "unhandledrejection").length, o = r.filter((e) => e.type === "warn").length;
		n({
			consoleErrorCount: a,
			consoleWarnCount: o,
			networkFailureCount: i.length,
			url: e.payload?.url || "",
			title: e.payload?.title || ""
		});
	})(), !0;
	if (e.type === "CLEAR_TAB_LOGS") return (async () => {
		let t = e.payload?.tabId;
		t && (await d(t), await chrome.action.setBadgeText({
			text: "",
			tabId: t
		})), n({ success: !0 });
	})(), !0;
	if (e.type === "CAPTURE_BUG") return (async () => {
		try {
			let [e] = await chrome.tabs.query({
				active: !0,
				currentWindow: !0
			});
			if (!e || !e.id) {
				n({
					success: !1,
					error: "No active tab found"
				});
				return;
			}
			let t = e.id, r = e.windowId, i = "";
			try {
				i = await chrome.tabs.captureVisibleTab(r, { format: "png" });
			} catch (e) {
				console.warn("[BugSnap] Screenshot capture skipped or failed:", e);
			}
			let a = {};
			try {
				a = await chrome.tabs.sendMessage(t, { type: "GET_PAGE_INFO" });
			} catch {}
			let o = b(e.url, e.title);
			a && (a.viewport && (o.viewport = a.viewport), a.screen && (o.screen = a.screen), a.dpr && (o.devicePixelRatio = a.dpr), a.language && (o.language = a.language), a.timezone && (o.timezone = a.timezone));
			let [s, l] = await Promise.all([c(t), u(t)]);
			await f({
				id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
				title: "",
				description: "",
				stepsToReproduce: "1. Open the page\n2. Perform action\n3. Observe the issue",
				expectedBehavior: "",
				actualBehavior: "",
				severity: "medium",
				environment: o,
				consoleErrors: s,
				networkFailures: l,
				screenshotBase64: i || void 0,
				enabledSections: {
					environment: !0,
					consoleErrors: !0,
					networkFailures: !0,
					screenshot: !0,
					pageInformation: !0,
					steps: !0
				},
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			let d = chrome.runtime.getURL("report.html");
			await chrome.tabs.create({ url: d }), n({ success: !0 });
		} catch (e) {
			console.error("[BugSnap] Error capturing bug:", e), n({
				success: !1,
				error: e.message || "Capture failed"
			});
		}
	})(), !0;
}), chrome.tabs.onRemoved.addListener((e) => {
	d(e).catch(() => {});
});
//#endregion
