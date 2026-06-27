"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0">
      <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[620px] aspect-square rounded-full bg-accent-indigo/[0.10] blur-[130px]" />
    </div>
  ),
});

const headlineWords = ["We craft digital", "experiences that"];

export default function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Drive a fade + zoom as the hero scrolls out, so it dissolves into the next
  // section instead of cutting off at a hard edge.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const fadeStyle = reduce ? undefined : { opacity };

  return (
    <section ref={ref} className="relative min-h-[100dvh] overflow-hidden">
      <motion.div
        style={fadeStyle}
        className="absolute inset-0 flex flex-col justify-center will-change-[opacity]"
      >
        <HeroScene />

        {/* Left-side readability gradient: darkest at the left edge where the
            headline + body copy live, fading to transparent toward the right so
            the bird and binary stream stay visible on the right half. */}
        <div
          aria-hidden
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(8,8,15,0.92) 0%, rgba(8,8,15,0.78) 18%, rgba(8,8,15,0.45) 38%, rgba(8,8,15,0.12) 58%, transparent 75%)",
          }}
        />

        {/* Scrim: keeps the lower-left readable over the particle field */}
        <div
          aria-hidden
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 100% at 0% 100%, rgba(8,8,15,0.85) 0%, rgba(8,8,15,0.45) 35%, transparent 65%)",
          }}
        />

        {/* Bottom fade: dissolves the particle field into the page background */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-[1] h-40 pointer-events-none bg-gradient-to-b from-transparent to-[#08080f]"
        />

      {/* Hero content */}
      <div className="relative z-10 px-6 md:px-12 max-w-5xl mt-16">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="font-sans text-[11px] font-medium tracking-[5px] uppercase text-accent-indigo/80"
        >
          Hatchling Creative
        </motion.p>

        <h1 aria-label="We craft digital experiences that feel alive." className="mt-5">
          {headlineWords.map((line, i) => (
            <span
              key={line}
              style={{ display: "block", clipPath: "inset(-10% -10% -15% -10%)" }}
            >
              <motion.span
                style={{ display: "block" }}
                initial={reduce ? { y: 0 } : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.1 + i * 0.12,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="font-serif text-[clamp(2.75rem,8.5vw,6.5rem)] font-bold leading-[1.0] tracking-tight text-white"
              >
                {line}
              </motion.span>
            </span>
          ))}
          <span style={{ display: "block", clipPath: "inset(-10% -10% -20% -10%)" }}>
            <motion.span
              style={{ display: "block" }}
              initial={reduce ? { y: 0 } : { y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.34,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="font-serif text-[clamp(2.75rem,8.5vw,6.5rem)] font-normal italic leading-[1.0] tracking-tight text-gradient"
            >
              feel alive.
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-8 max-w-md font-sans text-base text-white/55 leading-relaxed"
        >
          We design and build beautiful, privacy-first software for ambitious
          companies. Apps, web platforms, and AI, made with the kind of care we
          put into our own products.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.62 }}
          className="mt-10"
        >
          <MagneticCTA reduce={!!reduce} />
        </motion.div>
      </div>
      </motion.div>
    </section>
  );
}

function MagneticCTA({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 16, mass: 0.3 });
  const y = useSpring(my, { stiffness: 220, damping: 16, mass: 0.3 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.4);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href="#work"
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y }}
      data-cursor="View"
      className="group inline-flex items-center gap-3 rounded-full bg-accent-indigo px-7 py-3.5 font-sans text-sm font-semibold text-[#0b0b14] shadow-[0_0_40px_rgba(129,140,248,0.25)] transition-colors duration-200 hover:bg-[#9aa6ff]"
    >
      See our work
      <span
        aria-hidden
        className="transition-transform duration-200 group-hover:translate-x-1"
      >
        →
      </span>
    </motion.a>
  );
}
