"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { slideInLeft } from "@/lib/animations";

const phases = [
  {
    num: "01",
    title: "Discovery",
    description:
      "We listen. Understand the problem, the audience, the constraints. Research competitors. Define what success looks like.",
  },
  {
    num: "02",
    title: "Design",
    description:
      "Wireframes, prototypes, visual design. Iterate fast, validate with real users. Nothing gets built until it feels right.",
  },
  {
    num: "03",
    title: "Build",
    description:
      "Clean architecture, modern stack, obsessive attention to detail. Weekly demos. No surprises at delivery.",
  },
  {
    num: "04",
    title: "Launch",
    description:
      "Deploy, monitor, optimize. We stick around after launch to make sure everything performs in the real world.",
  },
];

export default function Process() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.p
            variants={slideInLeft}
            className="font-sans text-[11px] font-medium tracking-[5px] uppercase text-white/25"
          >
            How We Work
          </motion.p>
          <motion.h2
            variants={slideInLeft}
            className="mt-4 font-serif text-5xl md:text-6xl font-bold text-white"
          >
            From spark{" "}
            <em className="font-normal italic text-white/50">to launch.</em>
          </motion.h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.num}
              initial={{ opacity: 0, y: 30 }}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                        delay: 0.3 + i * 0.15,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    }
                  : {}
              }
              className="group bg-white/[0.02] rounded-xl p-8 md:p-9 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04]"
            >
              <p className="font-sans text-[11px] tracking-[3px] uppercase text-accent-dim transition-colors duration-300 group-hover:text-accent-indigo">
                Phase {phase.num}
              </p>
              <h3 className="mt-4 font-serif text-2xl font-bold text-white">
                {phase.title}
              </h3>
              <p className="mt-3 font-sans text-[13px] text-white/35 leading-relaxed">
                {phase.description}
              </p>
              <motion.div
                initial={{ width: 0 }}
                animate={
                  isInView
                    ? {
                        width: "100%",
                        transition: {
                          duration: 0.8,
                          delay: 0.6 + i * 0.15,
                          ease: "easeOut",
                        },
                      }
                    : {}
                }
                className="mt-5 h-px bg-gradient-to-r from-accent-indigo/30 to-transparent"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
