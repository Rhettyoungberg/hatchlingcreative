"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export default function CustomCursor() {
  const reduce = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [label, setLabel] = useState("");
  const [active, setActive] = useState(false);

  // Position driven by motion values, not React state, so mousemove never re-renders.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 700, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 700, damping: 40, mass: 0.4 });

  useEffect(() => {
    // Mouse-only: skip touch/coarse pointers (globals keeps the native cursor there).
    if (reduce || window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      x.set(e.clientX);
      y.set(e.clientY);

      const target = e.target as Element | null;
      const hit = target?.closest?.("[data-cursor]") as HTMLElement | null;
      if (hit) {
        setActive(true);
        setLabel(hit.getAttribute("data-cursor") || "");
      } else {
        setActive(false);
        setLabel("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [reduce, x, y]);

  if (!isVisible) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{ x: springX, y: springY }}
    >
      {/* Ring: grows on hover over interactive elements */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ borderColor: "rgba(255,255,255,0.45)" }}
        animate={{ width: active ? 52 : 30, height: active ? 52 : 30 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Solid center dot */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white" />
      {/* Hover label */}
      {active && label && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-sans text-[10px] font-medium tracking-[1px] uppercase text-white whitespace-nowrap">
          {label}
        </span>
      )}
    </motion.div>
  );
}
