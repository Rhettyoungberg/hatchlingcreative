"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { slideInLeft, slideInRight, staggerContainer } from "@/lib/animations";

const stats = [
  { value: 4, suffix: "", label: "Disciplines" },
  { value: 3, suffix: "", label: "Years Running" },
  { value: 100, suffix: "%", label: "Craft Obsessed" },
];

export default function About() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const quoteY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="about" ref={ref} className="py-28 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={slideInLeft}
          className="font-sans text-[11px] font-medium tracking-[5px] uppercase text-white/45"
        >
          About
        </motion.p>

        <div className="mt-8 flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left: Pull quote with parallax */}
          <motion.div
            style={{ y: reduce ? 0 : quoteY }}
            className="lg:flex-[1.2]"
          >
            <motion.blockquote
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={slideInLeft}
              className="font-serif text-3xl md:text-[42px] font-normal italic text-white/85 leading-snug tracking-tight"
            >
              &ldquo;We started Hatchling because we were tired of seeing
              brilliant ideas die in mediocre execution.&rdquo;
            </motion.blockquote>
          </motion.div>

          {/* Right: Body + stats */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="lg:flex-1"
          >
            <motion.p
              variants={slideInRight}
              className="font-sans text-[15px] text-white/45 leading-[1.8]"
            >
              We&rsquo;re a small team of engineers and designers who believe
              technology should feel as good as it works. Every product we build
              is a bet that craft still matters. That users can tell the
              difference between something built with care and something shipped
              to meet a deadline.
            </motion.p>
            <motion.p
              variants={slideInRight}
              className="mt-6 font-sans text-[15px] text-white/45 leading-[1.8]"
            >
              We partner with companies who think the same way. If you&rsquo;re
              building something that matters, we want to help you build it
              right.
            </motion.p>

            <motion.div
              variants={slideInRight}
              className="mt-10 flex gap-12"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-4xl font-bold text-white">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="mt-1 font-sans text-[11px] tracking-[3px] uppercase text-white/45">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
