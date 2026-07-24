import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SignIn, useAuth } from "@clerk/tanstack-react-start";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — C-Enterprises WorkMonitor" },
      { name: "description", content: "Sign in to the C-Enterprises WorkMonitor team portal." },
      { property: "og:title", content: "Sign in — C-Enterprises WorkMonitor" },
      { property: "og:description", content: "Team portal sign-in." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const SERIF = { fontFamily: '"DM Serif Display", ui-serif, Georgia, serif' } as const;
const SANS = { fontFamily: '"Fira Sans", ui-sans-serif, system-ui, sans-serif' } as const;

type Pt = { x: number; y: number };

function useMousePosition() {
  const [pos, setPos] = useState<Pt>({ x: 0, y: 0 });
  useEffect(() => {
    setPos({ x: window.innerWidth * 0.35, y: window.innerHeight * 0.5 });
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return pos;
}

/** An eye that tracks the cursor. `max` is max pupil offset in px. */
function TrackingEye({
  cx,
  cy,
  r = 10,
  pupilR = 4.5,
  max = 3,
  mouse,
  closed = false,
  fill = "#fff",
  pupil = "#111",
  oval = false,
}: {
  cx: number;
  cy: number;
  r?: number;
  pupilR?: number;
  max?: number;
  mouse: Pt;
  closed?: boolean;
  fill?: string;
  pupil?: string;
  oval?: boolean;
}) {
  const ref = useRef<SVGGElement>(null);
  const [offset, setOffset] = useState<Pt>({ x: 0, y: 0 });

  useEffect(() => {
    if (closed) {
      setOffset({ x: 0, y: 0 });
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
    setOffset({ x: Number(((dx / dist) * m).toFixed(2)), y: Number(((dy / dist) * m).toFixed(2)) });
  }, [mouse, closed, max, cx, cy]);

  const rx = oval ? r * 0.86 : r;
  const ry = oval ? r * 1.1 : r;

  return (
    <g ref={ref} className="login-eye">
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} />
      {closed ? (
        <path
          d={`M ${cx - r + 2} ${cy} Q ${cx} ${cy + 3} ${cx + r - 2} ${cy}`}
          stroke={pupil}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <>
          <circle cx={cx + offset.x} cy={cy + offset.y} r={pupilR} fill={pupil} />
          {fill !== "#151515" && (
            <circle
              cx={cx + offset.x - pupilR * 0.36}
              cy={cy + offset.y - pupilR * 0.36}
              r={pupilR * 0.28}
              fill="#fff"
              opacity={0.88}
            />
          )}
        </>
      )}
    </g>
  );
}

function BlobScene({ passwordFocused }: { passwordFocused: boolean }) {
  const realMouse = useMousePosition();
  const viewportWidth = typeof window === "undefined" ? 1280 : window.innerWidth;
  const viewportHeight = typeof window === "undefined" ? 720 : window.innerHeight;

  const prevFocused = useRef(false);
  const [lookAway, setLookAway] = useState(false);
  useEffect(() => {
    if (prevFocused.current && !passwordFocused) {
      setLookAway(true);
      const t = setTimeout(() => setLookAway(false), 900);
      return () => clearTimeout(t);
    }
    prevFocused.current = passwordFocused;
  }, [passwordFocused]);

  const focusTarget: Pt = {
    x: viewportWidth * (viewportWidth >= 768 ? 0.82 : 0.5),
    y: viewportHeight * (viewportWidth >= 768 ? 0.5 : 0.75),
  };
  const awayTarget: Pt = {
    x: -viewportWidth * 0.2,
    y: viewportHeight * 0.3,
  };
  const mouse = passwordFocused ? focusTarget : lookAway ? awayTarget : realMouse;

  const focusLean = passwordFocused ? 1 : lookAway ? -0.6 : 0;
  const driftX = passwordFocused
    ? 1
    : lookAway
      ? -1
      : Math.max(-1, Math.min(1, (realMouse.x - viewportWidth * 0.28) / 280));
  const driftY = passwordFocused
    ? 0.2
    : lookAway
      ? -0.3
      : Math.max(-1, Math.min(1, (realMouse.y - viewportHeight * 0.52) / 220));

  return (
    <svg viewBox="0 0 520 420" className="w-full max-w-[470px] overflow-visible" aria-hidden>
      <ellipse cx={235} cy={347} rx={212} ry={16} fill="#0f172a" opacity={0.08} />

      <g className={`login-whistle-note ${passwordFocused ? "is-hidden" : ""}`}>
        <g transform="translate(205 205)">
          <circle cx={0} cy={6} r={3.2} fill="#0f172a" />
          <path
            d="M3 6 L3 -10 L11 -13 L11 3"
            stroke="#0f172a"
            strokeWidth={1.8}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </g>

      <g
        className="login-purple-character login-character-pop"
        style={{
          transform: `translate(${driftX * -10 + focusLean * 14}px, ${driftY * -7}px) rotate(${driftX * 4 + focusLean * 6}deg)`,
          transformOrigin: "247px 323px",
        }}
      >
        <path fill="#6d28f5" d="M219 323 L214 99 Q218 74 247 69 Q277 72 284 102 L284 323 Z" />
        <path
          d={passwordFocused ? "M242 108 L256 104" : "M242 111 L256 111"}
          stroke="#1a0f2b"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          style={{ transition: "d 260ms ease" }}
        />
        <path
          d={passwordFocused ? "M266 104 L280 108" : "M266 111 L280 111"}
          stroke="#1a0f2b"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          style={{ transition: "d 260ms ease" }}
        />
        <TrackingEye
          cx={250}
          cy={124}
          r={5}
          pupilR={2.2}
          max={1.8}
          mouse={mouse}
          fill="#ffffff"
          pupil="#1a0f2b"
          oval
        />
        <TrackingEye
          cx={272}
          cy={124}
          r={5}
          pupilR={2.2}
          max={1.8}
          mouse={mouse}
          fill="#ffffff"
          pupil="#1a0f2b"
          oval
        />
        <ellipse
          cx={244}
          cy={144}
          rx={3.5}
          ry={2}
          fill="#ff8ab8"
          opacity={passwordFocused ? 0.55 : 0}
          style={{ transition: "opacity 260ms ease" }}
        />
        <ellipse
          cx={280}
          cy={144}
          rx={3.5}
          ry={2}
          fill="#ff8ab8"
          opacity={passwordFocused ? 0.55 : 0}
          style={{ transition: "opacity 260ms ease" }}
        />
        {passwordFocused ? (
          <ellipse cx={262} cy={148} rx={3} ry={4} fill="#1a0f2b" />
        ) : (
          <path
            d="M256 148 Q262 154 268 148"
            stroke="#1a0f2b"
            strokeWidth={2.2}
            fill="none"
            strokeLinecap="round"
          />
        )}
      </g>

      <g
        className="login-black-character login-character-pop"
        style={{
          transform: `translate(${driftX * -4 + focusLean * 10}px, ${driftY * -5}px) rotate(${driftX * -3 + focusLean * 8}deg)`,
          transformOrigin: "322px 323px",
        }}
      >
        <path d="M296 323 L296 153 Q296 132 313 126 Q339 130 349 153 L349 323 Z" fill="#151515" />
        <path
          d={passwordFocused ? "M311 142 L322 139" : "M311 145 L322 145"}
          stroke="#ffffff"
          strokeWidth={1.8}
          strokeLinecap="round"
          fill="none"
          style={{ transition: "d 260ms ease" }}
        />
        <path
          d={passwordFocused ? "M328 139 L340 142" : "M328 145 L340 145"}
          stroke="#ffffff"
          strokeWidth={1.8}
          strokeLinecap="round"
          fill="none"
          style={{ transition: "d 260ms ease" }}
        />
        <TrackingEye cx={316} cy={158} r={5.8} pupilR={2.5} max={2.2} mouse={mouse} oval />
        <TrackingEye cx={334} cy={158} r={5.8} pupilR={2.5} max={2.2} mouse={mouse} oval />
        <ellipse
          cx={309}
          cy={176}
          rx={3}
          ry={1.8}
          fill="#ff8ab8"
          opacity={passwordFocused ? 0.55 : 0}
          style={{ transition: "opacity 260ms ease" }}
        />
        <ellipse
          cx={342}
          cy={176}
          rx={3}
          ry={1.8}
          fill="#ff8ab8"
          opacity={passwordFocused ? 0.55 : 0}
          style={{ transition: "opacity 260ms ease" }}
        />
        {passwordFocused ? (
          <ellipse cx={325} cy={180} rx={3.2} ry={4.2} fill="#ffffff" />
        ) : (
          <path
            d="M319 180 Q325 184 331 180"
            stroke="#ffffff"
            strokeWidth={2.2}
            fill="none"
            strokeLinecap="round"
          />
        )}
      </g>

      <g
        className="login-orange-character login-character-pop"
        style={{
          transform: `translate(${driftX * 5 + focusLean * 12}px, ${driftY * 4 - focusLean * 4}px) rotate(${driftX * -2 + focusLean * 8}deg)`,
          transformOrigin: "172px 323px",
        }}
      >
        <path d="M86 323 A86 86 0 0 1 258 323 Z" fill="#ff7736" />
        <path
          d={passwordFocused ? "M145 270 L158 266" : "M145 273 L158 273"}
          stroke="#221814"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          style={{ transition: "d 260ms ease" }}
        />
        <path
          d={passwordFocused ? "M178 266 L191 270" : "M178 273 L191 273"}
          stroke="#221814"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          style={{ transition: "d 260ms ease" }}
        />
        <TrackingEye cx={151} cy={283} r={5.4} pupilR={2.2} max={2} mouse={mouse} oval />
        <TrackingEye cx={184} cy={283} r={5.4} pupilR={2.2} max={2} mouse={mouse} oval />
        <ellipse
          cx={140}
          cy={298}
          rx={4}
          ry={2.2}
          fill="#ff3d68"
          opacity={passwordFocused ? 0.55 : 0}
          style={{ transition: "opacity 260ms ease" }}
        />
        <ellipse
          cx={196}
          cy={298}
          rx={4}
          ry={2.2}
          fill="#ff3d68"
          opacity={passwordFocused ? 0.55 : 0}
          style={{ transition: "opacity 260ms ease" }}
        />
        {passwordFocused ? (
          <ellipse cx={168} cy={306} rx={3.6} ry={4.6} fill="#221814" />
        ) : (
          <path
            d="M158 305 Q168 311 178 305"
            stroke="#221814"
            strokeWidth={2.6}
            fill="none"
            strokeLinecap="round"
            className="login-whistle-mouth"
          />
        )}
      </g>

      <g
        className="login-yellow-character login-character-pop"
        style={{
          transform: `translate(${driftX * 8 + focusLean * 10}px, ${driftY * 3 - focusLean * 3}px) rotate(${driftX * 2.5 + focusLean * 10}deg)`,
          transformOrigin: "367px 323px",
        }}
      >
        <path d="M330 323 L330 255 Q330 219 365 211 Q402 218 405 256 L405 323 Z" fill="#f4d21f" />
        <path
          d={passwordFocused ? "M352 240 L365 236" : "M352 243 L365 243"}
          stroke="#151515"
          strokeWidth={1.8}
          strokeLinecap="round"
          fill="none"
          style={{ transition: "d 260ms ease" }}
        />
        <path
          d={passwordFocused ? "M380 236 L392 240" : "M380 243 L392 243"}
          stroke="#151515"
          strokeWidth={1.8}
          strokeLinecap="round"
          fill="none"
          style={{ transition: "d 260ms ease" }}
        />
        <TrackingEye cx={358} cy={252} r={5.5} pupilR={2.2} max={2} mouse={mouse} oval />
        <TrackingEye cx={386} cy={252} r={5.5} pupilR={2.2} max={2} mouse={mouse} oval />
        <ellipse
          cx={348}
          cy={270}
          rx={3.5}
          ry={2}
          fill="#ff6b8a"
          opacity={passwordFocused ? 0.5 : 0}
          style={{ transition: "opacity 260ms ease" }}
        />
        <ellipse
          cx={396}
          cy={270}
          rx={3.5}
          ry={2}
          fill="#ff6b8a"
          opacity={passwordFocused ? 0.5 : 0}
          style={{ transition: "opacity 260ms ease" }}
        />
        {passwordFocused ? (
          <ellipse cx={374} cy={277} rx={3} ry={4} fill="#151515" />
        ) : (
          <path
            d="M365 276 Q374 281 383 276"
            stroke="#151515"
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
            className="login-whistle-mouth"
          />
        )}
      </g>
    </svg>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && userId) {
      navigate({ to: "/app" });
    }
  }, [isLoaded, userId, navigate]);

  return (
    <div className="min-h-screen w-full bg-[#fafbfc] animate-fade-in" style={SANS}>
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[56%_44%]">
        {/* Left: illustration (desktop/tablet only) */}
        <div className="relative hidden md:flex min-h-screen items-end justify-center overflow-hidden bg-[#e9e9ee] px-8 pt-12 pb-[15vh]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.28),transparent_45%)]" />
          <div className="relative w-full flex items-end justify-start pl-[7vw]">
            <BlobScene passwordFocused={false} />
          </div>
          <div className="absolute bottom-6 left-8 right-8 flex items-center gap-3 text-[#64748b]">
            <div className="w-10 h-10 rounded-full bg-white ring-1 ring-[#e8ecf1] overflow-hidden flex items-center justify-center">
              <img src="/clogo.png" alt="" className="w-[80%] h-[80%] object-contain" />
            </div>
            <div className="text-[11px] tracking-[0.25em] uppercase font-semibold">
              C-Enterprises · WorkMonitor
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-[420px] flex flex-col items-center">
            <div className="lg:hidden flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-full bg-white ring-1 ring-[#e8ecf1] shadow flex items-center justify-center overflow-hidden mb-3">
                <img
                  src="/clogo.png"
                  alt="C-Enterprises logo"
                  className="w-[80%] h-[80%] object-contain"
                />
              </div>
              <div className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#94a3b8]">
                C-Enterprises WorkMonitor
              </div>
            </div>

            <SignIn routing="virtual" />
          </div>
        </div>
      </div>
    </div>
  );
}
