"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { staggerContainer, slideInLeft } from "@/lib/animations";

const services = [
  {
    num: "01",
    title: "App Development",
    description:
      "Native iOS, Android & cross-platform solutions. From concept to App Store.",
    expanded: {
      detail:
        "We build apps that people actually want to use. Whether it's a consumer product or an internal tool, we obsess over performance, usability, and the small details that make an app feel native and polished.",
      capabilities: [
        "Native iOS (SwiftUI)",
        "Native Android (Kotlin)",
        "Cross-platform (React Native)",
        "App Store optimization",
        "Push notifications & deep linking",
        "Offline-first architecture",
      ],
      gradient: "from-[#1a1a2e] to-[#16213e]",
    },
  },
  {
    num: "02",
    title: "AI Integration",
    description:
      "LLMs, computer vision & predictive analytics. Intelligent, not gimmicky.",
    expanded: {
      detail:
        "We integrate AI where it actually adds value, not as a buzzword checkbox. From on-device ML models to cloud-based LLM pipelines, we build intelligent features that feel natural and solve real problems.",
      capabilities: [
        "LLM integration & fine-tuning",
        "Computer vision & image recognition",
        "Predictive analytics & recommendations",
        "On-device ML (Core ML, TensorFlow Lite)",
        "RAG pipelines & embeddings",
        "Voice & natural language interfaces",
      ],
      gradient: "from-[#1a0a2e] to-[#2d1b4e]",
    },
  },
  {
    num: "03",
    title: "Digital Efficiency",
    description:
      "Scalable infrastructure, automation & DevOps. Your product stays fast at any scale.",
    expanded: {
      detail:
        "We architect systems that don't fall over at 2 AM. From CI/CD pipelines to auto-scaling infrastructure, we make sure your product is fast, reliable, and cheap to operate so you can focus on building, not firefighting.",
      capabilities: [
        "Cloud architecture (AWS, GCP, Azure)",
        "CI/CD pipeline design",
        "Infrastructure as Code (Terraform)",
        "Container orchestration (Docker, K8s)",
        "Performance monitoring & alerting",
        "Cost optimization & autoscaling",
      ],
      gradient: "from-[#0a1a2e] to-[#0e2a3e]",
    },
  },
  {
    num: "04",
    title: "UI/UX Design",
    description:
      "Human-centered interfaces & design systems. Complex things made simple.",
    expanded: {
      detail:
        "Great design isn't decoration. It's how things work. We create interfaces that feel intuitive from the first tap, backed by design systems that keep your product consistent as it grows.",
      capabilities: [
        "User research & journey mapping",
        "Wireframing & prototyping",
        "Visual design & motion design",
        "Design systems & component libraries",
        "Accessibility (WCAG 2.1)",
        "Usability testing & iteration",
      ],
      gradient: "from-[#2e1a1a] to-[#3e2016]",
    },
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

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
          {services.map((service, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={service.num}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.4,
                      delay: 0.15 + i * 0.08,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    },
                  },
                }}
                className="border-t border-white/[0.06]"
              >
                {/* Clickable row */}
                <button
                  onClick={() => toggle(i)}
                  className={`w-full flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-10 py-8 md:py-10 px-4 -mx-4 rounded transition-colors duration-300 text-left ${
                    isOpen ? "bg-white/[0.02]" : "hover:bg-white/[0.02]"
                  }`}
                  data-cursor=""
                >
                  <div className="flex items-baseline gap-5 flex-shrink-0">
                    <span className="font-sans text-xs text-white/20 tracking-[1px]">
                      {service.num}
                    </span>
                    <span className="font-serif text-3xl md:text-4xl font-bold text-white">
                      {service.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className="max-w-xs font-sans text-sm text-white/40 leading-relaxed">
                      {service.description}
                    </p>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="hidden md:block text-white/30 text-2xl font-light flex-shrink-0"
                    >
                      +
                    </motion.span>
                  </div>
                </button>

                {/* Expandable content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 -mx-4 pb-10">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                          {/* Image placeholder */}
                          <div
                            className={`w-full lg:w-[380px] h-[220px] rounded-xl bg-gradient-to-br ${service.expanded.gradient} flex items-center justify-center flex-shrink-0 overflow-hidden`}
                          >
                            <span className="font-sans text-[64px] font-bold text-white/[0.04]">
                              {service.num}
                            </span>
                          </div>

                          {/* Detail content */}
                          <div className="flex-1">
                            <p className="font-sans text-[15px] text-white/55 leading-relaxed">
                              {service.expanded.detail}
                            </p>

                            <div className="mt-6">
                              <p className="font-sans text-[11px] font-medium tracking-[3px] uppercase text-white/25 mb-3">
                                Capabilities
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                                {service.expanded.capabilities.map((cap) => (
                                  <div
                                    key={cap}
                                    className="flex items-center gap-2 font-sans text-sm text-white/40"
                                  >
                                    <span className="w-1 h-1 rounded-full bg-accent-indigo/50 flex-shrink-0" />
                                    {cap}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          <div className="border-t border-white/[0.06]" />
        </div>
      </div>
    </section>
  );
}
