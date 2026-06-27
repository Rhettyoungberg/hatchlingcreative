"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { scaleUp } from "@/lib/animations";
import BinaryFireworks from "@/components/ui/BinaryFireworks";

// The Hatchling API (same Worker that backs the dashboard). Override at build
// with NEXT_PUBLIC_API_BASE; defaults to production.
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://api.hatchlingcreative.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";
type Errors = { name?: string; email?: string; message?: string };

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [celebrate, setCelebrate] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const company = String(fd.get("company") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const website = String(fd.get("website") || ""); // honeypot

    const errs: Errors = {};
    if (!name) errs.name = "Please enter your name.";
    if (!email) errs.email = "Please enter your email.";
    else if (!EMAIL_RE.test(email)) errs.email = "Please enter a valid email.";
    if (!message) errs.message = "Tell us a little about your project.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          message,
          website,
          source: "hatchlingcreative.com",
        }),
      });
      if (!res.ok) throw new Error("request_failed");
      form.reset();
      setStatus("success");
      setCelebrate(true);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-32 md:py-40 px-6 md:px-12 overflow-hidden"
    >
      {celebrate && <BinaryFireworks onDone={() => setCelebrate(false)} />}

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-accent-indigo/[0.06] blur-[100px] opacity-60" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="font-sans text-[11px] font-medium tracking-[5px] uppercase text-white/45"
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
            className="mt-6 font-sans text-base text-white/55 leading-relaxed"
          >
            Tell us what you&rsquo;re building. We read every message and reply
            within a business day.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-left"
        >
          {status === "success" ? (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] px-6 py-10 text-center">
              <p className="font-serif text-2xl text-white">Message sent.</p>
              <p className="mt-2 font-sans text-sm text-white/55">
                Thanks for reaching out. We&rsquo;ll be in touch soon. Keep an eye
                on your inbox for a confirmation.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              {/* Honeypot: hidden from people, tempting to bots. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" name="name" error={errors.name} />
                <Field label="Email" name="email" type="email" error={errors.email} />
              </div>
              <Field label="Company" name="company" optional />
              <Field
                label="What are you building?"
                name="message"
                textarea
                error={errors.message}
              />

              {status === "error" && (
                <p className="font-sans text-sm text-[#f1a3a3]">
                  Something went wrong sending your message. Please try again in a
                  moment.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                data-cursor="Send"
                className="inline-flex items-center justify-center rounded-full bg-accent-indigo px-7 py-3.5 font-sans text-sm font-semibold text-[#0b0b14] transition-colors duration-200 hover:bg-[#9aa6ff] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea = false,
  optional = false,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  optional?: boolean;
  error?: string;
}) {
  const id = `contact-${name}`;
  const base =
    "w-full rounded-xl bg-white/[0.04] px-4 py-3 font-sans text-sm text-white placeholder-white/30 outline-none transition-colors focus:ring-2 focus:ring-accent-indigo/40 border " +
    (error
      ? "border-[#f1a3a3]/60"
      : "border-white/15 focus:border-accent-indigo/60");

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-sans text-xs font-medium tracking-wide text-white/70"
      >
        {label}
        {optional && <span className="text-white/35"> (optional)</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${base} resize-y`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={base}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 font-sans text-xs text-[#f1a3a3]">
          {error}
        </p>
      )}
    </div>
  );
}
