"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { slideInLeft, slideInRight, staggerContainer } from "@/lib/animations";

const projects = [
  {
    num: "01",
    title: "Project Aurelia",
    description:
      "An AI-powered wellness platform that adapts to user behavior in real-time. Built with SwiftUI and on-device ML models.",
    tags: ["iOS App", "AI Integration"],
    gradient: "from-[#1a1a2e] to-[#16213e]",
  },
  {
    num: "02",
    title: "Vertex Dashboard",
    description:
      "A real-time analytics dashboard for a fintech startup. Complex data made beautiful and instantly understandable.",
    tags: ["Web Platform", "Design System"],
    gradient: "from-[#1a0a2e] to-[#2d1b4e]",
  },
  {
    num: "03",
    title: "NightOwl",
    description:
      "A social platform for independent musicians to collaborate across time zones. 50K+ users in the first quarter.",
    tags: ["Cross-Platform", "Cloud"],
    gradient: "from-[#0a1a2e] to-[#0e2a3e]",
  },
];

export default function Work() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="work" ref={ref} className="py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="flex items-end justify-between"
        >
          <div>
            <motion.p
              variants={slideInLeft}
              className="font-sans text-[11px] font-medium tracking-[5px] uppercase text-white/25"
            >
              Selected Work
            </motion.p>
            <motion.h2
              variants={slideInLeft}
              className="mt-4 font-serif text-5xl md:text-6xl font-bold text-white"
            >
              Recent{" "}
              <em className="font-normal italic text-white/50">projects.</em>
            </motion.h2>
          </div>
          <motion.p
            variants={slideInRight}
            className="hidden md:block font-sans text-xs tracking-[2px] uppercase text-white/30"
          >
            {projects.length} Projects
          </motion.p>
        </motion.div>

        <div className="mt-16">
          {projects.map((project, i) => (
            <motion.div
              key={project.num}
              initial={{ opacity: 0, y: 16 }}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.4,
                        delay: 0.1 + i * 0.08,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    }
                  : {}
              }
              className="group flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 border-t border-white/[0.06] py-10"
              data-cursor="View"
            >
              {/* Thumbnail */}
              <div
                className={`w-full md:w-[280px] h-[180px] rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center flex-shrink-0 overflow-hidden transition-transform duration-500 group-hover:scale-105`}
              >
                <span className="font-sans text-[40px] font-bold text-white/[0.06]">
                  {project.num}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`font-sans text-[10px] tracking-[2px] uppercase px-2.5 py-1 rounded ${
                        tag.includes("AI") || tag.includes("iOS") || tag.includes("Web") || tag.includes("Cross")
                          ? "text-accent-indigo/60 bg-accent-indigo/[0.08]"
                          : "text-white/30 bg-white/[0.04]"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-serif text-2xl md:text-[28px] font-bold text-white">
                  {project.title}
                </h3>
                <p className="mt-2 max-w-md font-sans text-sm text-white/40 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* View link */}
              <div className="hidden md:block font-sans text-xs tracking-[2px] uppercase text-white/20 flex-shrink-0 transition-all duration-300 group-hover:text-white/50 group-hover:translate-x-1">
                View →
              </div>
            </motion.div>
          ))}
          <div className="border-t border-white/[0.06]" />
        </div>
      </div>
    </section>
  );
}
