"use client";

import { ReactNode } from "react";

interface ShimmerButtonProps {
  children: ReactNode;
  href?: string;
  className?: string;
  cursorLabel?: string;
}

export default function ShimmerButton({
  children,
  href,
  className = "",
  cursorLabel,
}: ShimmerButtonProps) {
  const Tag = href ? "a" : "button";

  return (
    <Tag
      href={href}
      data-cursor={cursorLabel}
      className={`group relative inline-flex items-center justify-center px-10 py-4 font-sans text-sm font-medium tracking-[1px] text-white rounded-full border border-white/15 overflow-hidden transition-all duration-500 hover:border-accent-indigo/50 hover:shadow-[0_0_30px_rgba(129,140,248,0.15)] ${className}`}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      {/* Gradient fill on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-accent-indigo/20 to-accent-violet/20" />
      <span className="relative z-10">{children}</span>
    </Tag>
  );
}
