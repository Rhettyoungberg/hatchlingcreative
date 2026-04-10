# Hatchling Creative Website Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild hatchlingcreative.com as a bold editorial multi-section landing page with dramatic animations, 3D WebGL hero, custom cursor, and smooth scrolling.

**Architecture:** Next.js 14 App Router with static export. Framer Motion for scroll-triggered animations. React Three Fiber for the 3D hero element. Lenis for smooth scrolling. Tailwind CSS for styling. All content is placeholder, structured for easy swapping later.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, React Three Fiber + drei, Lenis, Playfair Display + Space Grotesk fonts

---

## File Structure

```
HatchlingSite/next-site/
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── public/
│   ├── NewLogo.svg          (copied from HatchlingSite/)
│   └── NewSymbol.svg        (copied from HatchlingSite/)
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout: fonts, metadata, cursor, Lenis provider
│   │   ├── page.tsx          # Home page: assembles all sections
│   │   ├── globals.css       # Tailwind directives + custom utilities
│   │   └── movebreak/
│   │       ├── privacy/
│   │       │   └── page.tsx  # MoveBreak privacy policy (ported from HTML)
│   │       └── terms/
│   │           └── page.tsx  # MoveBreak terms (ported from HTML)
│   ├── components/
│   │   ├── providers/
│   │   │   └── SmoothScroll.tsx   # Lenis smooth scroll provider
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Fixed nav with scroll-aware background
│   │   │   └── Footer.tsx         # Minimal footer
│   │   ├── sections/
│   │   │   ├── Hero.tsx           # Hero section with R3F scene
│   │   │   ├── Services.tsx       # Editorial numbered service rows
│   │   │   ├── About.tsx          # Split layout about/philosophy
│   │   │   ├── Work.tsx           # Stacked portfolio case studies
│   │   │   ├── Process.tsx        # Four-phase horizontal cards
│   │   │   └── Contact.tsx        # CTA with ambient glow
│   │   ├── three/
│   │   │   └── HeroScene.tsx      # R3F Canvas, MorphBlob, scene setup
│   │   └── ui/
│   │       ├── CustomCursor.tsx    # Dot + trailing circle cursor
│   │       ├── MagneticText.tsx    # Text that follows cursor within bounds
│   │       ├── AnimatedCounter.tsx # Count-up numbers on scroll
│   │       └── ShimmerButton.tsx   # Pill button with shimmer border
│   └── lib/
│       └── animations.ts          # Shared Framer Motion variants
```

---

## Task 1: Scaffold Next.js Project

**Files:**
- Create: `HatchlingSite/next-site/package.json` (via create-next-app)
- Create: `HatchlingSite/next-site/tailwind.config.ts`
- Create: `HatchlingSite/next-site/src/app/globals.css`
- Create: `HatchlingSite/next-site/src/app/layout.tsx`
- Create: `HatchlingSite/next-site/src/app/page.tsx`
- Copy: `HatchlingSite/NewLogo.svg` → `HatchlingSite/next-site/public/NewLogo.svg`
- Copy: `HatchlingSite/NewSymbol.svg` → `HatchlingSite/next-site/public/NewSymbol.svg`

- [ ] **Step 1: Create Next.js app with Tailwind**

Run from `HatchlingSite/`:
```bash
npx create-next-app@latest next-site --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```
Expected: Project scaffolded at `HatchlingSite/next-site/`

- [ ] **Step 2: Install dependencies**

```bash
cd HatchlingSite/next-site
npm install framer-motion @react-three/fiber @react-three/drei three lenis
npm install -D @types/three
```

- [ ] **Step 3: Copy SVG assets to public/**

```bash
cp ../NewLogo.svg public/NewLogo.svg
cp ../NewSymbol.svg public/NewSymbol.svg
```

- [ ] **Step 4: Configure Tailwind with custom theme**

Replace `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#08080f",
        accent: {
          indigo: "#818cf8",
          violet: "#c084fc",
          dim: "rgba(129,140,248,0.5)",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-space-grotesk)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 5: Set up globals.css**

Replace `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-void text-white antialiased;
    cursor: none;
  }

  ::selection {
    @apply bg-accent-indigo/30;
  }
}

@layer utilities {
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-accent-indigo to-accent-violet;
  }
}
```

- [ ] **Step 6: Set up root layout with fonts and metadata**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hatchling Creative | App Development, AI Integration & Design",
  description:
    "We craft beautiful applications and partner with companies to turn technology into their competitive advantage. App development, AI integration, cloud systems, and UI/UX design.",
  keywords:
    "app development, AI integration, cloud systems, UI/UX design, mobile apps, software development, Hatchling Creative",
  authors: [{ name: "Hatchling Creative" }],
  metadataBase: new URL("https://hatchlingcreative.com"),
  openGraph: {
    type: "website",
    url: "https://hatchlingcreative.com/",
    title: "Hatchling Creative | App Development, AI Integration & Design",
    description:
      "We craft beautiful applications and partner with companies to turn technology into their competitive advantage.",
    siteName: "Hatchling Creative",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hatchling Creative | App Development, AI Integration & Design",
    description:
      "We craft beautiful applications and partner with companies to turn technology into their competitive advantage.",
  },
  other: {
    "theme-color": "#08080f",
  },
  icons: {
    icon: "/NewSymbol.svg",
    apple: "/NewSymbol.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Create placeholder home page**

Replace `src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main>
      <div className="flex items-center justify-center h-screen">
        <h1 className="font-serif text-6xl font-bold">Hatchling Creative</h1>
      </div>
    </main>
  );
}
```

- [ ] **Step 8: Configure static export**

Replace `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 9: Verify dev server starts**

```bash
cd HatchlingSite/next-site
npm run dev
```

Open `http://localhost:3000`. Expected: Dark background, "Hatchling Creative" in Playfair Display serif font, centered.

- [ ] **Step 10: Verify build works**

```bash
npm run build
```

Expected: Static export succeeds, outputs to `out/` directory.

- [ ] **Step 11: Commit**

```bash
git add next-site/
git commit -m "feat: scaffold Next.js project with Tailwind, fonts, and static export"
```

---

## Task 2: Shared Animation Variants & Smooth Scroll Provider

**Files:**
- Create: `next-site/src/lib/animations.ts`
- Create: `next-site/src/components/providers/SmoothScroll.tsx`
- Modify: `next-site/src/app/layout.tsx`

- [ ] **Step 1: Create shared Framer Motion variants**

Create `src/lib/animations.ts`:

```ts
import { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};
```

- [ ] **Step 2: Create Lenis smooth scroll provider**

Create `src/components/providers/SmoothScroll.tsx`:

```tsx
"use client";

import { ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 3: Add SmoothScroll to layout**

Update `src/app/layout.tsx` — wrap the `{children}` inside body:

```tsx
import SmoothScroll from "@/components/providers/SmoothScroll";

// ... existing code ...

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify smooth scroll works**

```bash
npm run dev
```

Open `http://localhost:3000`. Add enough content to scroll (temporarily make page.tsx have multiple large divs). Confirm scrolling feels smooth and momentum-based. Remove test content after verifying.

- [ ] **Step 5: Commit**

```bash
git add src/lib/animations.ts src/components/providers/SmoothScroll.tsx src/app/layout.tsx
git commit -m "feat: add Framer Motion animation variants and Lenis smooth scroll"
```

---

## Task 3: Custom Cursor

**Files:**
- Create: `next-site/src/components/ui/CustomCursor.tsx`
- Modify: `next-site/src/app/layout.tsx`

- [ ] **Step 1: Create CustomCursor component**

Create `src/components/ui/CustomCursor.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const circlePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Hide custom cursor on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [data-cursor]");
      if (interactive) {
        setIsHovering(true);
        const label = interactive.getAttribute("data-cursor") || "";
        setCursorLabel(label);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [data-cursor]");
      if (interactive) {
        setIsHovering(false);
        setCursorLabel("");
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    let animId: number;
    const animate = () => {
      circlePos.current.x += (mouse.current.x - circlePos.current.x) * 0.12;
      circlePos.current.y += (mouse.current.y - circlePos.current.y) * 0.12;
      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${circlePos.current.x - 20}px, ${circlePos.current.y - 20}px)`;
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
      >
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>
      <div
        ref={circleRef}
        className={`fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-difference transition-[width,height,opacity] duration-300 flex items-center justify-center ${
          isHovering ? "w-20 h-20 -ml-4 -mt-4" : "w-10 h-10"
        }`}
      >
        <div
          className={`rounded-full border transition-all duration-300 flex items-center justify-center ${
            isHovering
              ? "w-20 h-20 border-white/60"
              : "w-10 h-10 border-white/30"
          }`}
        >
          {cursorLabel && (
            <span className="text-[10px] font-sans font-medium tracking-widest uppercase text-white">
              {cursorLabel}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Add CustomCursor to layout**

Update `src/app/layout.tsx` — add inside body, before SmoothScroll:

```tsx
import CustomCursor from "@/components/ui/CustomCursor";

// Inside the return, body element:
<body className="font-sans">
  <CustomCursor />
  <SmoothScroll>{children}</SmoothScroll>
</body>
```

- [ ] **Step 3: Verify cursor works**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: Default system cursor hidden. Small white dot follows cursor exactly, larger circle trails behind with slight delay. Both use mix-blend-difference.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/CustomCursor.tsx src/app/layout.tsx
git commit -m "feat: add custom cursor with dot + trailing circle and hover states"
```

---

## Task 4: Navbar

**Files:**
- Create: `next-site/src/components/layout/Navbar.tsx`
- Modify: `next-site/src/app/page.tsx`

- [ ] **Step 1: Create Navbar component**

Create `src/components/layout/Navbar.tsx`:

```tsx
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
      transition={{ duration: 0.6, delay: 1.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-void/90 backdrop-blur-lg border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-5">
        <a href="#" className="flex items-center gap-3" data-cursor="Home">
          <span className="font-sans text-[13px] font-semibold tracking-[3px] uppercase text-white/90">
            Hatchling
          </span>
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
```

- [ ] **Step 2: Add Navbar to page**

Update `src/app/page.tsx`:

```tsx
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <h1 className="font-serif text-6xl font-bold">Hatchling Creative</h1>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verify navbar**

```bash
npm run dev
```

Expected: Fixed nav at top with "HATCHLING" left, links right. Transparent background. Scroll down (add temp content) and background becomes blurred/opaque.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.tsx src/app/page.tsx
git commit -m "feat: add fixed navbar with scroll-aware background"
```

---

## Task 5: Hero Section (without 3D — layout + animations)

**Files:**
- Create: `next-site/src/components/sections/Hero.tsx`
- Modify: `next-site/src/app/page.tsx`

- [ ] **Step 1: Create Hero component**

Create `src/components/sections/Hero.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

const headlineWords = ["We craft digital", "experiences that"];

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col justify-between overflow-hidden">
      {/* Ambient gradient fallback (replaced by R3F in Task 7) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-indigo/[0.08] blur-[100px]" />
        <div className="absolute top-[40%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-accent-violet/[0.06] blur-[80px]" />
      </div>

      {/* Spacer for nav */}
      <div className="h-20" />

      {/* Hero content */}
      <div className="relative z-10 px-6 md:px-12 max-w-5xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-sans text-[11px] font-medium tracking-[5px] uppercase text-white/30"
        >
          Digital Studio
        </motion.p>

        <div className="mt-5">
          {headlineWords.map((line, i) => (
            <div key={line} className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + i * 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="font-serif text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[1.0] tracking-tight text-white"
              >
                {line}
              </motion.h1>
            </div>
          ))}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="font-serif text-[clamp(2.5rem,8vw,6rem)] font-normal italic leading-[1.0] tracking-tight text-gradient"
            >
              feel alive.
            </motion.h1>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 max-w-md font-sans text-base text-white/45 leading-relaxed"
        >
          App development, AI integration, and design for companies that refuse
          to blend in.
        </motion.p>
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 border-t border-white/[0.06]"
      >
        <div className="flex gap-6 font-sans text-[11px] tracking-[2px] uppercase text-white/25">
          <span>Apps</span>
          <span>AI</span>
          <span>Efficiency</span>
          <span>Design</span>
        </div>
        <div className="font-sans text-[11px] tracking-[2px] uppercase text-white/25">
          Scroll to explore ↓
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Wire Hero into page**

Update `src/app/page.tsx`:

```tsx
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      {/* Temp spacer to test scroll */}
      <div className="h-screen" />
    </main>
  );
}
```

- [ ] **Step 3: Verify hero**

```bash
npm run dev
```

Expected: Full-viewport hero with staggered text animation. "Digital Studio" label appears first, then each headline line slides up sequentially, "feel alive." in gradient italic arrives last. Subtitle fades in. Bottom bar with keywords slides up.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.tsx src/app/page.tsx
git commit -m "feat: add hero section with staggered text animations"
```

---

## Task 6: UI Components (MagneticText, AnimatedCounter, ShimmerButton)

**Files:**
- Create: `next-site/src/components/ui/MagneticText.tsx`
- Create: `next-site/src/components/ui/AnimatedCounter.tsx`
- Create: `next-site/src/components/ui/ShimmerButton.tsx`

- [ ] **Step 1: Create MagneticText component**

Create `src/components/ui/MagneticText.tsx`:

```tsx
"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticTextProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticText({
  children,
  className = "",
  strength = 0.3,
}: MagneticTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create AnimatedCounter component**

Create `src/components/ui/AnimatedCounter.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
  className = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {count}
      {suffix}
    </span>
  );
}
```

- [ ] **Step 3: Create ShimmerButton component**

Create `src/components/ui/ShimmerButton.tsx`:

```tsx
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
```

- [ ] **Step 4: Verify components render without errors**

```bash
npm run dev
```

Temporarily import and render each in page.tsx to verify they don't crash. Remove test usage after verifying.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/MagneticText.tsx src/components/ui/AnimatedCounter.tsx src/components/ui/ShimmerButton.tsx
git commit -m "feat: add MagneticText, AnimatedCounter, and ShimmerButton UI components"
```

---

## Task 7: 3D Hero Scene (React Three Fiber)

**Files:**
- Create: `next-site/src/components/three/HeroScene.tsx`
- Modify: `next-site/src/components/sections/Hero.tsx`

- [ ] **Step 1: Create HeroScene with morphing blob**

Create `src/components/three/HeroScene.tsx`:

```tsx
"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

function MorphBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const handlePointerMove = (e: { clientX: number; clientY: number }) => {
    mouse.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    };
  };

  useMemo(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handlePointerMove as any);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handlePointerMove as any);
      }
    };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    // Idle floating animation
    meshRef.current.position.x =
      Math.sin(time * 0.3) * 0.3 + mouse.current.x * viewport.width * 0.05;
    meshRef.current.position.y =
      Math.cos(time * 0.2) * 0.2 + mouse.current.y * viewport.height * 0.05;
    meshRef.current.rotation.x = time * 0.1;
    meshRef.current.rotation.z = time * 0.05;
  });

  return (
    <Sphere ref={meshRef} args={[1.8, 64, 64]} position={[1.5, 0, 0]}>
      <MeshDistortMaterial
        color="#818cf8"
        roughness={0.2}
        metalness={0.8}
        distort={0.4}
        speed={2}
        transparent
        opacity={0.15}
      />
    </Sphere>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Suspense
        fallback={
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-indigo/[0.08] blur-[100px]" />
        }
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ pointerEvents: "none" }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight
            position={[-3, -3, 2]}
            intensity={0.5}
            color="#c084fc"
          />
          <MorphBlob />
        </Canvas>
      </Suspense>
      {/* Additional glow layer */}
      <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-indigo/[0.04] blur-[120px] pointer-events-none" />
    </div>
  );
}
```

- [ ] **Step 2: Integrate HeroScene into Hero section**

Update `src/components/sections/Hero.tsx` — replace the ambient gradient fallback div with a dynamic import of HeroScene:

```tsx
"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-indigo/[0.08] blur-[100px]" />
      <div className="absolute top-[40%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-accent-violet/[0.06] blur-[80px]" />
    </div>
  ),
});

const headlineWords = ["We craft digital", "experiences that"];

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col justify-between overflow-hidden">
      <HeroScene />

      {/* Spacer for nav */}
      <div className="h-20" />

      {/* Hero content */}
      <div className="relative z-10 px-6 md:px-12 max-w-5xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-sans text-[11px] font-medium tracking-[5px] uppercase text-white/30"
        >
          Digital Studio
        </motion.p>

        <div className="mt-5">
          {headlineWords.map((line, i) => (
            <div key={line} className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + i * 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="font-serif text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[1.0] tracking-tight text-white"
              >
                {line}
              </motion.h1>
            </div>
          ))}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="font-serif text-[clamp(2.5rem,8vw,6rem)] font-normal italic leading-[1.0] tracking-tight text-gradient"
            >
              feel alive.
            </motion.h1>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 max-w-md font-sans text-base text-white/45 leading-relaxed"
        >
          App development, AI integration, and design for companies that refuse
          to blend in.
        </motion.p>
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 border-t border-white/[0.06]"
      >
        <div className="flex gap-6 font-sans text-[11px] tracking-[2px] uppercase text-white/25">
          <span>Apps</span>
          <span>AI</span>
          <span>Efficiency</span>
          <span>Design</span>
        </div>
        <div className="font-sans text-[11px] tracking-[2px] uppercase text-white/25">
          Scroll to explore ↓
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 3: Verify 3D scene**

```bash
npm run dev
```

Expected: Behind the hero text, a soft indigo morphing sphere floats and responds subtly to cursor movement. It should feel atmospheric with the glow/blur. Falls back to CSS gradient while loading.

- [ ] **Step 4: Commit**

```bash
git add src/components/three/HeroScene.tsx src/components/sections/Hero.tsx
git commit -m "feat: add React Three Fiber morphing blob to hero section"
```

---

## Task 8: Services Section

**Files:**
- Create: `next-site/src/components/sections/Services.tsx`
- Modify: `next-site/src/app/page.tsx`

- [ ] **Step 1: Create Services component**

Create `src/components/sections/Services.tsx`:

```tsx
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
```

- [ ] **Step 2: Add Services to page**

Update `src/app/page.tsx`:

```tsx
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      {/* Temp spacer */}
      <div className="h-screen" />
    </main>
  );
}
```

- [ ] **Step 3: Verify services section**

```bash
npm run dev
```

Expected: Scroll past hero. Services section appears with staggered row entrances. Each row has number + title left, description right. Hover causes subtle background change, description text brightens, and title has magnetic text effect following cursor.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Services.tsx src/app/page.tsx
git commit -m "feat: add editorial services section with magnetic text and staggered reveals"
```

---

## Task 9: About Section

**Files:**
- Create: `next-site/src/components/sections/About.tsx`
- Modify: `next-site/src/app/page.tsx`

- [ ] **Step 1: Create About component**

Create `src/components/sections/About.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { slideInLeft, slideInRight, staggerContainer } from "@/lib/animations";

const stats = [
  { value: 12, suffix: "+", label: "Projects Shipped" },
  { value: 3, suffix: "", label: "Years Running" },
  { value: 100, suffix: "%", label: "Give a Damn" },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const quoteY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="about" ref={ref} className="py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={slideInLeft}
          className="font-sans text-[11px] font-medium tracking-[5px] uppercase text-white/25"
        >
          About
        </motion.p>

        <div className="mt-8 flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left: Pull quote with parallax */}
          <motion.div
            style={{ y: quoteY }}
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
              is a bet that craft still matters — that users can tell the
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
                  <div className="mt-1 font-sans text-[11px] tracking-[3px] uppercase text-white/25">
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
```

- [ ] **Step 2: Add About to page**

Update `src/app/page.tsx`:

```tsx
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <About />
      {/* Temp spacer */}
      <div className="h-screen" />
    </main>
  );
}
```

- [ ] **Step 3: Verify about section**

```bash
npm run dev
```

Expected: Split layout — italic pull quote on left with parallax movement, body text on right sliding in from opposite side. Stats at bottom count up from 0 when section scrolls into view.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/About.tsx src/app/page.tsx
git commit -m "feat: add about section with parallax quote and animated counters"
```

---

## Task 10: Work / Portfolio Section

**Files:**
- Create: `next-site/src/components/sections/Work.tsx`
- Modify: `next-site/src/app/page.tsx`

- [ ] **Step 1: Create Work component**

Create `src/components/sections/Work.tsx`:

```tsx
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
              initial={{ opacity: 0, y: 30 }}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.6,
                        delay: 0.3 + i * 0.15,
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
```

- [ ] **Step 2: Add Work to page**

Update `src/app/page.tsx`:

```tsx
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Work />
      {/* Temp spacer */}
      <div className="h-screen" />
    </main>
  );
}
```

- [ ] **Step 3: Verify work section**

```bash
npm run dev
```

Expected: Three project rows with gradient thumbnails, tags, titles, descriptions. Staggered scroll entrance. On hover, thumbnail scales up, "View →" shifts right, cursor shows "View" label.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Work.tsx src/app/page.tsx
git commit -m "feat: add portfolio section with stacked case studies and hover effects"
```

---

## Task 11: Process Section

**Files:**
- Create: `next-site/src/components/sections/Process.tsx`
- Modify: `next-site/src/app/page.tsx`

- [ ] **Step 1: Create Process component**

Create `src/components/sections/Process.tsx`:

```tsx
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
```

- [ ] **Step 2: Add Process to page**

Update `src/app/page.tsx`:

```tsx
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Process from "@/components/sections/Process";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Work />
      <Process />
      {/* Temp spacer */}
      <div className="h-screen" />
    </main>
  );
}
```

- [ ] **Step 3: Verify process section**

```bash
npm run dev
```

Expected: Four horizontal cards appear one-at-a-time left-to-right on scroll. Each has phase number in accent color, bold title, description, and a gradient line that animates its width. Cards lift on hover, phase number brightens.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Process.tsx src/app/page.tsx
git commit -m "feat: add process section with sequential card reveals"
```

---

## Task 12: Contact Section & Footer

**Files:**
- Create: `next-site/src/components/sections/Contact.tsx`
- Create: `next-site/src/components/layout/Footer.tsx`
- Modify: `next-site/src/app/page.tsx`

- [ ] **Step 1: Create Contact component**

Create `src/components/sections/Contact.tsx`:

```tsx
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
          Drop us a line — no pitch decks required.
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
```

- [ ] **Step 2: Create Footer component**

Create `src/components/layout/Footer.tsx`:

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 md:px-12 py-7">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-sans text-xs text-white/20">
          © 2026 Hatchling Creative, LLC
        </p>
        <div className="flex gap-6 font-sans text-xs text-white/20">
          <a
            href="#"
            className="hover:text-white/50 transition-colors"
            data-cursor=""
          >
            GitHub
          </a>
          <a
            href="#"
            className="hover:text-white/50 transition-colors"
            data-cursor=""
          >
            LinkedIn
          </a>
          <a
            href="#"
            className="hover:text-white/50 transition-colors"
            data-cursor=""
          >
            Twitter
          </a>
        </div>
        <p className="font-sans text-xs text-white/20">Portland, OR</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Assemble final page**

Update `src/app/page.tsx` (final version):

```tsx
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Process from "@/components/sections/Process";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Work />
      <Process />
      <Contact />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 4: Verify contact and footer**

```bash
npm run dev
```

Expected: Full page scrolls through all sections. Contact section has centered headline scaling up on scroll, ambient glow pulsing behind, shimmer button with hover effect. Footer shows copyright, social links, location in a clean single row.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Contact.tsx src/components/layout/Footer.tsx src/app/page.tsx
git commit -m "feat: add contact CTA section and footer, complete page assembly"
```

---

## Task 13: Port MoveBreak Legal Pages

**Files:**
- Create: `next-site/src/app/movebreak/privacy/page.tsx`
- Create: `next-site/src/app/movebreak/terms/page.tsx`

- [ ] **Step 1: Create privacy policy page**

Create `src/app/movebreak/privacy/page.tsx`:

Read the full content of `HatchlingSite/movebreak/privacy/index.html` and port the body content into a Next.js page component. Keep the same text content but use Tailwind classes matching the new design system. The page should have:
- The same gradient orb background (simplified with Tailwind)
- Space Grotesk font (inherited from root layout)
- Same section structure and all legal text preserved exactly
- A "← Back to Hatchling Creative" link at the top

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MoveBreak by Hatchling Creative",
  description:
    "Privacy Policy for MoveBreak. We're privacy-first: all data stored on-device, no accounts required, no third-party analytics, no advertising or tracking.",
};

export default function MoveBreakPrivacy() {
  return (
    <div className="min-h-screen bg-void">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[60vmax] h-[60vmax] rounded-full bg-cyan-500/[0.06] blur-[80px]" />
        <div className="absolute top-1/2 -right-1/4 w-[50vmax] h-[50vmax] rounded-full bg-blue-500/[0.05] blur-[80px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <a
          href="/"
          className="inline-block font-sans text-xs tracking-[2px] uppercase text-white/30 hover:text-white/60 transition-colors mb-12"
        >
          ← Back to Hatchling Creative
        </a>

        <h1 className="font-serif text-4xl font-bold text-white mb-2">
          Privacy Policy
        </h1>
        <p className="font-sans text-sm text-white/40 mb-12">
          MoveBreak by Hatchling Creative
        </p>

        {/* Port the full privacy policy content from the existing HTML page here.
            Preserve all legal text exactly. Use these Tailwind patterns:
            - Section headings: font-serif text-xl font-bold text-white mt-10 mb-4
            - Body text: font-sans text-[15px] text-white/70 leading-relaxed mb-4
            - Lists: list-disc pl-6 space-y-2 text-white/70 text-[15px]
            The actual legal content must be copied verbatim from
            HatchlingSite/movebreak/privacy/index.html */}

        <p className="font-sans text-[15px] text-white/70 leading-relaxed">
          [Port full privacy policy content from existing HTML page — preserve all legal text exactly]
        </p>
      </div>
    </div>
  );
}
```

Note to implementer: Read the full content of `HatchlingSite/movebreak/privacy/index.html` and port all the section content (the `<div class="container">` content) into this component with the Tailwind classes shown above. Every word of legal text must be preserved exactly.

- [ ] **Step 2: Create terms page**

Create `src/app/movebreak/terms/page.tsx`:

Same pattern as privacy page. Read `HatchlingSite/movebreak/terms/index.html` and port the content.

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | MoveBreak by Hatchling Creative",
  description: "Terms of Use for MoveBreak by Hatchling Creative.",
};

export default function MoveBreakTerms() {
  return (
    <div className="min-h-screen bg-void">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[60vmax] h-[60vmax] rounded-full bg-cyan-500/[0.06] blur-[80px]" />
        <div className="absolute top-1/2 -right-1/4 w-[50vmax] h-[50vmax] rounded-full bg-blue-500/[0.05] blur-[80px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <a
          href="/"
          className="inline-block font-sans text-xs tracking-[2px] uppercase text-white/30 hover:text-white/60 transition-colors mb-12"
        >
          ← Back to Hatchling Creative
        </a>

        <h1 className="font-serif text-4xl font-bold text-white mb-2">
          Terms of Use
        </h1>
        <p className="font-sans text-sm text-white/40 mb-12">
          MoveBreak by Hatchling Creative
        </p>

        <p className="font-sans text-[15px] text-white/70 leading-relaxed">
          [Port full terms content from existing HTML page — preserve all legal text exactly]
        </p>
      </div>
    </div>
  );
}
```

Note to implementer: Read `HatchlingSite/movebreak/terms/index.html` and port all legal content verbatim.

- [ ] **Step 3: Verify legal pages**

```bash
npm run dev
```

Open `http://localhost:3000/movebreak/privacy` and `http://localhost:3000/movebreak/terms`. Expected: Clean dark pages with all legal text intact, styled in the new design system.

- [ ] **Step 4: Commit**

```bash
git add src/app/movebreak/
git commit -m "feat: port MoveBreak privacy and terms pages to Next.js"
```

---

## Task 14: Final Polish & Build Verification

**Files:**
- Modify: `next-site/src/app/globals.css` (if needed)
- Verify: Full build and static export

- [ ] **Step 1: Full visual review**

```bash
npm run dev
```

Scroll through the entire page in a desktop browser. Check:
- Hero text animation plays on load
- 3D blob renders and responds to cursor
- Custom cursor works on all sections
- Navbar becomes opaque on scroll
- Each section animates in on scroll
- Services rows have magnetic text effect
- About stats count up
- Portfolio thumbnails scale on hover
- Process cards reveal sequentially
- Contact button has shimmer effect
- Footer renders correctly
- Smooth scroll feels weighted throughout

- [ ] **Step 2: Mobile responsiveness check**

Open Chrome DevTools → toggle device toolbar. Check at 375px (iPhone) and 768px (iPad):
- Hero headline scales down via clamp
- Services rows stack vertically
- About section stacks single column
- Process cards go 2x2 on tablet, single column on mobile
- Work thumbnails go full width
- Hamburger menu shows on mobile
- Custom cursor is hidden (touch device detection)

- [ ] **Step 3: Build and verify static export**

```bash
npm run build
```

Expected: Build succeeds. Static files output to `out/` directory. No errors.

```bash
npx serve out
```

Open the served URL. Verify the static site works identically to dev mode.

- [ ] **Step 4: Add .superpowers to .gitignore**

Append to `HatchlingSite/.gitignore`:

```
.superpowers/
```

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete website redesign — all sections, animations, and static export"
```
