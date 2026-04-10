"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact", accent: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-void/90 backdrop-blur-lg border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-5">
        <a href="#" className="flex items-center gap-3" data-cursor="Home">
          <Image
            src="/NewLogo.svg"
            alt="Hatchling Creative"
            width={160}
            height={32}
            className="h-6 w-auto brightness-0 invert"
            priority
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              data-cursor=""
              className={`font-sans text-[13px] tracking-[1px] transition-colors duration-300 ${
                link.accent
                  ? "text-white border-b border-white/30 pb-0.5"
                  : "text-white/45 hover:text-white/80"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          data-cursor=""
          aria-label="Menu"
        >
          <span className="block w-6 h-px bg-white/80" />
          <span className="block w-4 h-px bg-white/80" />
        </button>
      </div>
    </motion.nav>
  );
}
