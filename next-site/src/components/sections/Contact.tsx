"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ShimmerButton from "@/components/ui/ShimmerButton";
import { scaleUp } from "@/lib/animations";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-40 px-6 md:px-12 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-indigo/[0.06] blur-[100px] animate-pulse" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="font-sans text-[11px] font-medium tracking-[5px] uppercase text-white/25"
        >
          Let&rsquo;s Talk
        </motion.p>

        <motion.h2
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={scaleUp}
          className="mt-5 font-serif text-5xl md:text-6xl font-bold text-white leading-tight"
        >
          Have an idea?
          <br />
          <em className="font-normal italic text-gradient">
            Let&rsquo;s make it real.
          </em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 font-sans text-base text-white/40 leading-relaxed"
        >
          We&rsquo;re always interested in hearing about new projects.
          <br />
          Drop us a line. No pitch decks required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10"
        >
          <ShimmerButton
            href="mailto:rhett@hatchlingcreative.com"
            cursorLabel="Say Hello"
          >
            rhett@hatchlingcreative.com
          </ShimmerButton>
        </motion.div>
      </div>
    </section>
  );
}
