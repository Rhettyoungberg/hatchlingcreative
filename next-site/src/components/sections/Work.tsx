"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type TargetAndTransition,
} from "framer-motion";

const HIGHLIGHTS = [
  "Automatic background drive detection",
  "Swipe to classify, business or personal",
  "Live IRS deduction at 72.5¢/mi (2026)",
  "IRS Pub 463 PDF and CSV export",
  "Stays in your iCloud, no account",
  "SwiftUI, CarPlay auto-start, multi-vehicle",
];

const TAGS = ["iOS App", "Privacy-First", "Tax & Finance"];

export default function Work() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();

  // Staggered entrance reveal.
  const rise = (delay: number): TargetAndTransition =>
    reduce
      ? { opacity: isInView ? 1 : 0 }
      : {
          opacity: isInView ? 1 : 0,
          y: isInView ? 0 : 24,
          transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
        };

  // Gentle perpetual float on the phone (the card's hero asset).
  const float: TargetAndTransition | undefined = reduce
    ? undefined
    : { y: [0, -12, 0], transition: { duration: 7, repeat: Infinity, ease: "easeInOut" } };

  return (
    <section id="work" ref={ref} className="py-28 md:py-36 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.p
          animate={rise(0)}
          className="font-sans text-[11px] font-medium tracking-[5px] uppercase text-white/45"
        >
          Featured work
        </motion.p>

        {/* The whole product lives in one card */}
        <div className="group relative mt-8">
          {/* Ambient halo behind the card (brightens on hover) */}
          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-[3rem] opacity-50 blur-3xl transition-opacity duration-700 group-hover:opacity-90"
            style={{
              background:
                "radial-gradient(50% 60% at 22% 28%, rgba(26,127,240,0.30), transparent 70%), radial-gradient(45% 55% at 92% 92%, rgba(8,217,180,0.16), transparent 70%)",
            }}
          />

          <motion.div
            animate={rise(0.08)}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] p-7 sm:p-10 md:p-12 backdrop-blur-sm transition-colors duration-500 group-hover:border-[#1a7ff0]/40"
          >
            {/* Azure corner wash + top hairline tie the card to the MileMarker brand */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(80% 60% at 100% 0%, rgba(26,127,240,0.10), transparent 60%)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1a7ff0]/50 to-transparent"
            />

            <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-14">
              {/* Phone screenshot, floating */}
              <motion.div
                animate={rise(0.15)}
                className="relative flex justify-center"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 opacity-70 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(55% 45% at 50% 38%, rgba(26,127,240,0.40), transparent 70%), radial-gradient(40% 35% at 70% 80%, rgba(8,217,180,0.20), transparent 70%)",
                  }}
                />
                <motion.figure animate={float} className="relative w-full max-w-[290px]">
                  <div className="rounded-[2.4rem] border border-white/10 bg-white/[0.03] p-2 shadow-[0_30px_80px_rgba(8,20,50,0.6)] ring-1 ring-inset ring-white/5">
                    <Image
                      src="/milemarker-drives.webp"
                      alt="MileMarker on iPhone: a mapped drive with this month's mileage deduction and classified drives"
                      width={720}
                      height={1564}
                      sizes="(max-width: 1024px) 290px, 340px"
                      className="h-auto w-full rounded-[2rem]"
                    />
                  </div>
                  <figcaption className="mt-4 text-center font-sans text-sm text-white/40">
                    Every drive auto-logs. The deduction adds up as you classify.
                  </figcaption>
                </motion.figure>
              </motion.div>

              {/* Detail */}
              <div>
                <motion.div animate={rise(0.2)} className="flex items-center gap-4">
                  <Image
                    src="/milemarker-icon.webp"
                    alt="MileMarker app icon"
                    width={160}
                    height={160}
                    className="h-14 w-14 flex-shrink-0 rounded-[16px] border border-white/10 shadow-[0_10px_30px_rgba(10,92,224,0.5)] sm:h-16 sm:w-16"
                  />
                  <div>
                    <h2 className="font-serif text-4xl font-bold leading-none text-white md:text-5xl">
                      MileMarker
                    </h2>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {TAGS.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-[#1a7ff0]/10 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[2px] text-[#9cc4ff]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.p
                  animate={rise(0.28)}
                  className="mt-6 max-w-xl font-sans text-[15px] leading-relaxed text-white/55"
                >
                  MileMarker turns your phone into an automatic mileage log. It
                  detects drives in the background, you flick each one business or
                  personal, and it values every business mile at the current IRS
                  rate so your deduction is always live. At tax time it exports an
                  IRS Pub 463 PDF your accountant will recognize. No account, no
                  ad trackers, and routes sync through your own iCloud.
                </motion.p>

                <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {HIGHLIGHTS.map((h, i) => (
                    <motion.div
                      key={h}
                      animate={rise(0.34 + i * 0.06)}
                      className="flex items-center gap-2.5 font-sans text-sm text-white/55"
                    >
                      <span className="h-1 w-1 flex-shrink-0 rounded-full bg-[#5aa6ff]" />
                      {h}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  animate={rise(0.34 + HIGHLIGHTS.length * 0.06)}
                  className="mt-9 flex flex-wrap gap-3"
                >
                  <a
                    href="https://getmm.app"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group/cta inline-flex items-center gap-2 rounded-full bg-[#1a7ff0] px-6 py-3 font-sans text-sm font-medium text-white shadow-[0_10px_30px_rgba(26,127,240,0.35)] transition-colors duration-200 hover:bg-[#2e97ff]"
                    data-cursor="Join"
                  >
                    Join the Beta
                    <span
                      aria-hidden
                      className="transition-transform duration-200 group-hover/cta:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* MileMarker is a featured example of our work, not our only output. */}
        <motion.p
          animate={rise(0.5)}
          className="mt-12 max-w-2xl font-sans text-base leading-relaxed text-white/45"
        >
          MileMarker is one of the products we&rsquo;ve built end to end. We bring
          the same craft to client apps, web platforms, and AI features. Tell us
          what you&rsquo;re building and we&rsquo;ll treat it like our own.
        </motion.p>
      </div>
    </section>
  );
}
