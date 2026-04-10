"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import MagneticText from "@/components/ui/MagneticText";
import { staggerContainer, slideInLeft, slideInRight } from "@/lib/animations";

const services = [
  {
    num: "01",
    title: "App Development",
    description:
      "Native iOS, Android & cross-platform solutions. From concept to App Store.",
  },
  {
    num: "02",
    title: "AI Integration",
    description:
      "LLMs, computer vision & predictive analytics. Intelligent, not gimmicky.",
  },
  {
    num: "03",
    title: "Digital Efficiency",
    description:
      "Scalable infrastructure, automation & DevOps. Your product stays fast at any scale.",
  },
  {
    num: "04",
    title: "UI/UX Design",
    description:
      "Human-centered interfaces & design systems. Complex things made simple.",
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={ref} className="py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.p
            variants={slideInLeft}
            className="font-sans text-[11px] font-medium tracking-[5px] uppercase text-white/25"
          >
            What We Do
          </motion.p>
          <motion.h2
            variants={slideInLeft}
            className="mt-4 font-serif text-5xl md:text-6xl font-bold text-white"
          >
            Four disciplines,{" "}
            <em className="font-normal italic text-white/50">one vision.</em>
          </motion.h2>
        </motion.div>

        <div className="mt-16">
          {services.map((service, i) => (
            <motion.div
              key={service.num}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, x: -40 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.6,
                    delay: 0.3 + i * 0.15,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                },
              }}
              className={`group flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-10 border-t border-white/[0.06] py-8 md:py-10 transition-colors duration-300 hover:bg-white/[0.02] px-4 -mx-4 rounded ${
                i % 2 === 1 ? "bg-white/[0.01]" : ""
              }`}
              data-cursor="Explore"
            >
              <div className="flex items-baseline gap-5 flex-shrink-0">
                <span className="font-sans text-xs text-white/20 tracking-[1px]">
                  {service.num}
                </span>
                <MagneticText className="font-serif text-3xl md:text-4xl font-bold text-white transition-all duration-300 group-hover:text-white">
                  {service.title}
                </MagneticText>
              </div>
              <p className="max-w-xs font-sans text-sm text-white/40 leading-relaxed transition-colors duration-300 group-hover:text-white/60 md:pt-2">
                {service.description}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-white/[0.06]" />
        </div>
      </div>
    </section>
  );
}
