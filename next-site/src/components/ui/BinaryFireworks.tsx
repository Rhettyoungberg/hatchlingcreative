"use client";

import { useEffect, useRef } from "react";

/**
 * A full-screen fireworks show made of the hero's 0s and 1s, played once when a
 * message is sent. Each shell does the whole sequence: a trailing line of digits
 * rises and arcs, bursts into a radial spray of 0/1 sparks, which then fall under
 * gravity and fade out. Runs for ~7s, then calls onDone. Transparent overlay, so
 * the page (and the success message) stay visible behind the sparks.
 *
 * Plain 2D canvas (not the r3f hero scene) so it can overlay the whole viewport
 * wherever the visitor is when they hit send, with no cross-component plumbing.
 */
export default function BinaryFireworks({ onDone }: { onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion: no animated fireworks, just resolve quickly.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => onDoneRef.current?.(), 400);
      return () => clearTimeout(t);
    }

    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = ["#aab4ff", "#5a6bf0", "#cdd4ff", "#ffe6ad", "#ffffff"];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const glyph = () => (Math.random() < 0.5 ? "0" : "1");
    const G = 0.0007; // gravity (px / ms^2)

    type Shell = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      fuse: number;
      age: number;
      color: string;
      trailAcc: number;
    };
    type Spark = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      char: string;
      color: string;
      size: number;
      twinkle: number;
    };

    const shells: Shell[] = [];
    const sparks: Spark[] = [];

    function launch() {
      const x = rnd(W * 0.15, W * 0.85);
      const apexFrac = rnd(0.14, 0.42); // how high it climbs (fraction of H)
      // vy so it roughly reaches apexFrac*H before turning over: v = sqrt(2*g*d)
      const climb = (1 - apexFrac) * H;
      const vy = -Math.sqrt(2 * G * climb) * rnd(0.92, 1.04);
      shells.push({
        x,
        y: H + 12,
        vx: rnd(-0.04, 0.04),
        vy,
        fuse: rnd(1400, 2200),
        age: 0,
        color: COLORS[Math.floor(rnd(0, COLORS.length))],
        trailAcc: 0,
      });
    }

    function burst(s: Shell) {
      const n = Math.floor(rnd(46, 80));
      const baseSpeed = rnd(0.16, 0.3) * (H / 900);
      const white = Math.random() < 0.35;
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = baseSpeed * rnd(0.25, 1);
        sparks.push({
          x: s.x,
          y: s.y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 0,
          maxLife: rnd(1300, 2300),
          char: glyph(),
          color: Math.random() < 0.78 ? s.color : white ? "#ffffff" : "#ffe6ad",
          size: rnd(12, 19),
          twinkle: rnd(0, Math.PI * 2),
        });
      }
    }

    const TOTAL = 7000;
    const SPAWN_UNTIL = 4600;
    let elapsed = 0;
    let nextLaunch = 150;
    let last = performance.now();
    let raf = 0;
    let done = false;

    function frame(now: number) {
      const dt = Math.min(now - last, 40);
      last = now;
      elapsed += dt;

      ctx.clearRect(0, 0, W, H); // transparent each frame: page stays visible
      ctx.globalCompositeOperation = "lighter"; // additive glow
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (elapsed < SPAWN_UNTIL && elapsed >= nextLaunch) {
        launch();
        if (Math.random() < 0.4) launch();
        nextLaunch = elapsed + rnd(420, 820);
      }

      // Shells: rise, trail, then burst at apex or when the fuse runs out.
      for (let i = shells.length - 1; i >= 0; i--) {
        const s = shells[i];
        s.age += dt;
        s.vy += G * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        // Trailing line of digits.
        s.trailAcc += dt;
        while (s.trailAcc > 28) {
          s.trailAcc -= 28;
          sparks.push({
            x: s.x + rnd(-2, 2),
            y: s.y + rnd(-2, 2),
            vx: rnd(-0.01, 0.01),
            vy: rnd(0.0, 0.03),
            life: 0,
            maxLife: rnd(280, 520),
            char: glyph(),
            color: s.color,
            size: rnd(11, 14),
            twinkle: 0,
          });
        }

        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.fillText(glyph(), s.x, s.y);

        if (s.vy >= 0 || s.age >= s.fuse) {
          burst(s);
          shells.splice(i, 1);
        }
      }

      // Sparks: fall under gravity with drag, twinkle, and fade out.
      const drag = Math.pow(0.9985, dt);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          sparks.splice(i, 1);
          continue;
        }
        p.vy += G * dt;
        p.vx *= drag;
        p.vy *= drag;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const t = p.life / p.maxLife;
        const fade = (1 - t) * (1 - t);
        const tw = p.twinkle ? 0.65 + 0.35 * Math.sin(p.life * 0.02 + p.twinkle) : 1;
        ctx.globalAlpha = Math.max(0, fade * tw);
        ctx.fillStyle = p.color;
        ctx.font = `bold ${p.size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.fillText(p.char, p.x, p.y);
      }

      ctx.globalAlpha = 1;

      const finished = elapsed >= TOTAL && shells.length === 0 && sparks.length === 0;
      if (finished) {
        if (!done) {
          done = true;
          onDoneRef.current?.();
        }
        return;
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[120]"
    />
  );
}
