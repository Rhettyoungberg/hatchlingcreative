"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
    >
      <div className="w-2 h-2 rounded-full bg-white" />
    </div>
  );
}
