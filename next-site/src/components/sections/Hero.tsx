"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-indigo/[0.08] blur-[100px]" />
      <div className="absolute top-[40%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-accent-violet/[0.06] blur-[80px]" />
    </div>
  ),
});

const headlineWords = ["We craft digital", "experiences that"];

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col justify-between overflow-hidden">
      <HeroScene />

      {/* Spacer for nav */}
      <div className="h-20" />

      {/* Hero content */}
      <div className="relative z-10 px-6 md:px-12 max-w-5xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="font-sans text-[11px] font-medium tracking-[5px] uppercase text-white/30"
        >
          Digital Studio
        </motion.p>

        <div className="mt-5">
          {headlineWords.map((line, i) => (
            <div key={line} style={{ clipPath: "inset(-10% -10% -15% -10%)" }}>
              <motion.h1
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.1 + i * 0.12,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="font-serif text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[1.0] tracking-tight text-white"
              >
                {line}
              </motion.h1>
            </div>
          ))}
          <div style={{ clipPath: "inset(-10% -10% -20% -10%)" }}>
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.34,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="font-serif text-[clamp(2.5rem,8vw,6rem)] font-normal italic leading-[1.0] tracking-tight text-gradient"
            >
              feel alive.
            </motion.h1>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-8 max-w-md font-sans text-base text-white/45 leading-relaxed"
        >
          App development, AI integration, and design for companies that refuse
          to blend in.
        </motion.p>
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 border-t border-white/[0.06]"
      >
        <div className="flex gap-6 font-sans text-[11px] tracking-[2px] uppercase text-white/25">
          <span>Apps</span>
          <span>AI</span>
          <span>Efficiency</span>
          <span>Design</span>
        </div>
        <div className="font-sans text-[11px] tracking-[2px] uppercase text-white/25">
          Scroll to explore ↓
        </div>
      </motion.div>
    </section>
  );
}
