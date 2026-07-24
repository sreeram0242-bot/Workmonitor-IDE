import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@clerk/react+[...].mjs";
import { a as dist_exports, n as SignIn$1 } from "./dist-CU7AhyVe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-C_xsr3Mn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var SANS = { fontFamily: "\"Fira Sans\", ui-sans-serif, system-ui, sans-serif" };
function useMousePosition() {
	const [pos, setPos] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	(0, import_react.useEffect)(() => {
		setPos({
			x: window.innerWidth * .35,
			y: window.innerHeight * .5
		});
		const onMove = (e) => setPos({
			x: e.clientX,
			y: e.clientY
		});
		window.addEventListener("mousemove", onMove);
		return () => window.removeEventListener("mousemove", onMove);
	}, []);
	return pos;
}
/** An eye that tracks the cursor. `max` is max pupil offset in px. */
function TrackingEye({ cx, cy, r = 10, pupilR = 4.5, max = 3, mouse, closed = false, fill = "#fff", pupil = "#111", oval = false }) {
	const ref = (0, import_react.useRef)(null);
	const [offset, setOffset] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	(0, import_react.useEffect)(() => {
		if (closed) {
			setOffset({
				x: 0,
				y: 0
			});
			return;
		}
		const el = ref.current;
		if (!el) return;
		const svg = el.ownerSVGElement;
		if (!svg) return;
		const pt = svg.createSVGPoint();
		pt.x = mouse.x;
		pt.y = mouse.y;
		const svgMouse = pt.matrixTransform(svg.getScreenCTM()?.inverse());
		const dx = svgMouse.x - cx;
		const dy = svgMouse.y - cy;
		const dist = Math.hypot(dx, dy) || 1;
		const m = Math.min(max, dist / 32);
		setOffset({
			x: Number((dx / dist * m).toFixed(2)),
			y: Number((dy / dist * m).toFixed(2))
		});
	}, [
		mouse,
		closed,
		max,
		cx,
		cy
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		ref,
		className: "login-eye",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
			cx,
			cy,
			rx: oval ? r * .86 : r,
			ry: oval ? r * 1.1 : r,
			fill
		}), closed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: `M ${cx - r + 2} ${cy} Q ${cx} ${cy + 3} ${cx + r - 2} ${cy}`,
			stroke: pupil,
			strokeWidth: 2,
			fill: "none",
			strokeLinecap: "round"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: cx + offset.x,
			cy: cy + offset.y,
			r: pupilR,
			fill: pupil
		}), fill !== "#151515" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: cx + offset.x - pupilR * .36,
			cy: cy + offset.y - pupilR * .36,
			r: pupilR * .28,
			fill: "#fff",
			opacity: .88
		})] })]
	});
}
function BlobScene({ passwordFocused }) {
	const realMouse = useMousePosition();
	const viewportWidth = typeof window === "undefined" ? 1280 : window.innerWidth;
	const viewportHeight = typeof window === "undefined" ? 720 : window.innerHeight;
	const prevFocused = (0, import_react.useRef)(false);
	const [lookAway, setLookAway] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (prevFocused.current && !passwordFocused) {
			setLookAway(true);
			const t = setTimeout(() => setLookAway(false), 900);
			return () => clearTimeout(t);
		}
		prevFocused.current = passwordFocused;
	}, [passwordFocused]);
	const focusTarget = {
		x: viewportWidth * (viewportWidth >= 768 ? .82 : .5),
		y: viewportHeight * (viewportWidth >= 768 ? .5 : .75)
	};
	const awayTarget = {
		x: -viewportWidth * .2,
		y: viewportHeight * .3
	};
	const mouse = passwordFocused ? focusTarget : lookAway ? awayTarget : realMouse;
	const focusLean = passwordFocused ? 1 : lookAway ? -.6 : 0;
	const driftX = passwordFocused ? 1 : lookAway ? -1 : Math.max(-1, Math.min(1, (realMouse.x - viewportWidth * .28) / 280));
	const driftY = passwordFocused ? .2 : lookAway ? -.3 : Math.max(-1, Math.min(1, (realMouse.y - viewportHeight * .52) / 220));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 520 420",
		className: "w-full max-w-[470px] overflow-visible",
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: 235,
				cy: 347,
				rx: 212,
				ry: 16,
				fill: "#0f172a",
				opacity: .08
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
				className: `login-whistle-note ${passwordFocused ? "is-hidden" : ""}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					transform: "translate(205 205)",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: 0,
						cy: 6,
						r: 3.2,
						fill: "#0f172a"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M3 6 L3 -10 L11 -13 L11 3",
						stroke: "#0f172a",
						strokeWidth: 1.8,
						fill: "none",
						strokeLinecap: "round"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				className: "login-purple-character login-character-pop",
				style: {
					transform: `translate(${driftX * -10 + focusLean * 14}px, ${driftY * -7}px) rotate(${driftX * 4 + focusLean * 6}deg)`,
					transformOrigin: "247px 323px"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						fill: "#6d28f5",
						d: "M219 323 L214 99 Q218 74 247 69 Q277 72 284 102 L284 323 Z"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: passwordFocused ? "M242 108 L256 104" : "M242 111 L256 111",
						stroke: "#1a0f2b",
						strokeWidth: 2,
						strokeLinecap: "round",
						fill: "none",
						style: { transition: "d 260ms ease" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: passwordFocused ? "M266 104 L280 108" : "M266 111 L280 111",
						stroke: "#1a0f2b",
						strokeWidth: 2,
						strokeLinecap: "round",
						fill: "none",
						style: { transition: "d 260ms ease" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackingEye, {
						cx: 250,
						cy: 124,
						r: 5,
						pupilR: 2.2,
						max: 1.8,
						mouse,
						fill: "#ffffff",
						pupil: "#1a0f2b",
						oval: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackingEye, {
						cx: 272,
						cy: 124,
						r: 5,
						pupilR: 2.2,
						max: 1.8,
						mouse,
						fill: "#ffffff",
						pupil: "#1a0f2b",
						oval: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: 244,
						cy: 144,
						rx: 3.5,
						ry: 2,
						fill: "#ff8ab8",
						opacity: passwordFocused ? .55 : 0,
						style: { transition: "opacity 260ms ease" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: 280,
						cy: 144,
						rx: 3.5,
						ry: 2,
						fill: "#ff8ab8",
						opacity: passwordFocused ? .55 : 0,
						style: { transition: "opacity 260ms ease" }
					}),
					passwordFocused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: 262,
						cy: 148,
						rx: 3,
						ry: 4,
						fill: "#1a0f2b"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M256 148 Q262 154 268 148",
						stroke: "#1a0f2b",
						strokeWidth: 2.2,
						fill: "none",
						strokeLinecap: "round"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				className: "login-black-character login-character-pop",
				style: {
					transform: `translate(${driftX * -4 + focusLean * 10}px, ${driftY * -5}px) rotate(${driftX * -3 + focusLean * 8}deg)`,
					transformOrigin: "322px 323px"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M296 323 L296 153 Q296 132 313 126 Q339 130 349 153 L349 323 Z",
						fill: "#151515"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: passwordFocused ? "M311 142 L322 139" : "M311 145 L322 145",
						stroke: "#ffffff",
						strokeWidth: 1.8,
						strokeLinecap: "round",
						fill: "none",
						style: { transition: "d 260ms ease" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: passwordFocused ? "M328 139 L340 142" : "M328 145 L340 145",
						stroke: "#ffffff",
						strokeWidth: 1.8,
						strokeLinecap: "round",
						fill: "none",
						style: { transition: "d 260ms ease" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackingEye, {
						cx: 316,
						cy: 158,
						r: 5.8,
						pupilR: 2.5,
						max: 2.2,
						mouse,
						oval: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackingEye, {
						cx: 334,
						cy: 158,
						r: 5.8,
						pupilR: 2.5,
						max: 2.2,
						mouse,
						oval: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: 309,
						cy: 176,
						rx: 3,
						ry: 1.8,
						fill: "#ff8ab8",
						opacity: passwordFocused ? .55 : 0,
						style: { transition: "opacity 260ms ease" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: 342,
						cy: 176,
						rx: 3,
						ry: 1.8,
						fill: "#ff8ab8",
						opacity: passwordFocused ? .55 : 0,
						style: { transition: "opacity 260ms ease" }
					}),
					passwordFocused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: 325,
						cy: 180,
						rx: 3.2,
						ry: 4.2,
						fill: "#ffffff"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M319 180 Q325 184 331 180",
						stroke: "#ffffff",
						strokeWidth: 2.2,
						fill: "none",
						strokeLinecap: "round"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				className: "login-orange-character login-character-pop",
				style: {
					transform: `translate(${driftX * 5 + focusLean * 12}px, ${driftY * 4 - focusLean * 4}px) rotate(${driftX * -2 + focusLean * 8}deg)`,
					transformOrigin: "172px 323px"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M86 323 A86 86 0 0 1 258 323 Z",
						fill: "#ff7736"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: passwordFocused ? "M145 270 L158 266" : "M145 273 L158 273",
						stroke: "#221814",
						strokeWidth: 2,
						strokeLinecap: "round",
						fill: "none",
						style: { transition: "d 260ms ease" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: passwordFocused ? "M178 266 L191 270" : "M178 273 L191 273",
						stroke: "#221814",
						strokeWidth: 2,
						strokeLinecap: "round",
						fill: "none",
						style: { transition: "d 260ms ease" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackingEye, {
						cx: 151,
						cy: 283,
						r: 5.4,
						pupilR: 2.2,
						max: 2,
						mouse,
						oval: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackingEye, {
						cx: 184,
						cy: 283,
						r: 5.4,
						pupilR: 2.2,
						max: 2,
						mouse,
						oval: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: 140,
						cy: 298,
						rx: 4,
						ry: 2.2,
						fill: "#ff3d68",
						opacity: passwordFocused ? .55 : 0,
						style: { transition: "opacity 260ms ease" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: 196,
						cy: 298,
						rx: 4,
						ry: 2.2,
						fill: "#ff3d68",
						opacity: passwordFocused ? .55 : 0,
						style: { transition: "opacity 260ms ease" }
					}),
					passwordFocused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: 168,
						cy: 306,
						rx: 3.6,
						ry: 4.6,
						fill: "#221814"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M158 305 Q168 311 178 305",
						stroke: "#221814",
						strokeWidth: 2.6,
						fill: "none",
						strokeLinecap: "round",
						className: "login-whistle-mouth"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				className: "login-yellow-character login-character-pop",
				style: {
					transform: `translate(${driftX * 8 + focusLean * 10}px, ${driftY * 3 - focusLean * 3}px) rotate(${driftX * 2.5 + focusLean * 10}deg)`,
					transformOrigin: "367px 323px"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M330 323 L330 255 Q330 219 365 211 Q402 218 405 256 L405 323 Z",
						fill: "#f4d21f"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: passwordFocused ? "M352 240 L365 236" : "M352 243 L365 243",
						stroke: "#151515",
						strokeWidth: 1.8,
						strokeLinecap: "round",
						fill: "none",
						style: { transition: "d 260ms ease" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: passwordFocused ? "M380 236 L392 240" : "M380 243 L392 243",
						stroke: "#151515",
						strokeWidth: 1.8,
						strokeLinecap: "round",
						fill: "none",
						style: { transition: "d 260ms ease" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackingEye, {
						cx: 358,
						cy: 252,
						r: 5.5,
						pupilR: 2.2,
						max: 2,
						mouse,
						oval: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackingEye, {
						cx: 386,
						cy: 252,
						r: 5.5,
						pupilR: 2.2,
						max: 2,
						mouse,
						oval: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: 348,
						cy: 270,
						rx: 3.5,
						ry: 2,
						fill: "#ff6b8a",
						opacity: passwordFocused ? .5 : 0,
						style: { transition: "opacity 260ms ease" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: 396,
						cy: 270,
						rx: 3.5,
						ry: 2,
						fill: "#ff6b8a",
						opacity: passwordFocused ? .5 : 0,
						style: { transition: "opacity 260ms ease" }
					}),
					passwordFocused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: 374,
						cy: 277,
						rx: 3,
						ry: 4,
						fill: "#151515"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M365 276 Q374 281 383 276",
						stroke: "#151515",
						strokeWidth: 2.4,
						fill: "none",
						strokeLinecap: "round",
						className: "login-whistle-mouth"
					})
				]
			})
		]
	});
}
function AuthPage() {
	const navigate = useNavigate();
	const { isLoaded, userId } = (0, dist_exports.useAuth)();
	(0, import_react.useEffect)(() => {
		if (isLoaded && userId) navigate({ to: "/app" });
	}, [
		isLoaded,
		userId,
		navigate
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen w-full bg-[#fafbfc] animate-fade-in",
		style: SANS,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid min-h-screen grid-cols-1 md:grid-cols-[56%_44%]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative hidden md:flex min-h-screen items-end justify-center overflow-hidden bg-[#e9e9ee] px-8 pt-12 pb-[15vh]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.28),transparent_45%)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative w-full flex items-end justify-start pl-[7vw]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlobScene, { passwordFocused: false })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-6 left-8 right-8 flex items-center gap-3 text-[#64748b]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-full bg-white ring-1 ring-[#e8ecf1] overflow-hidden flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/clogo.png",
								alt: "",
								className: "w-[80%] h-[80%] object-contain"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] tracking-[0.25em] uppercase font-semibold",
							children: "C-Enterprises · WorkMonitor"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center p-6 md:p-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-[420px] flex flex-col items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:hidden flex flex-col items-center mb-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-14 h-14 rounded-full bg-white ring-1 ring-[#e8ecf1] shadow flex items-center justify-center overflow-hidden mb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/clogo.png",
									alt: "C-Enterprises logo",
									className: "w-[80%] h-[80%] object-contain"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] tracking-[0.25em] uppercase font-semibold text-[#94a3b8]",
								children: "C-Enterprises WorkMonitor"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignIn$1, {
							routing: "virtual",
							appearance: { elements: {
								footerAction: { display: "none" },
								footerActionLink: { display: "none" },
								footer: { display: "none" }
							} }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-center text-xs text-[#94a3b8]",
							children: [
								"Don't have an account?",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-[#64748b]",
									children: "Contact your workspace admin."
								})
							]
						})
					]
				})
			})]
		})
	});
}
//#endregion
export { AuthPage as component };
