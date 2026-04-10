# Hatchling Creative — Website Redesign

## Overview

Full redesign of hatchlingcreative.com from a single-page hero card (vanilla HTML/CSS/JS) into a bold, editorial, multi-section scrolling landing page built with Next.js. The site should feel like an Awwwards winner — the site itself is a portfolio piece. Dark theme, dramatic serif typography, confident whitespace, and full-send animations including WebGL, custom cursor, kinetic typography, and scroll-triggered reveals.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14 (App Router) | Component architecture, SSR/SSG, scalable for future pages |
| Animations | Framer Motion | Scroll-triggered reveals, layout animations, orchestrated entrances |
| 3D/WebGL | React Three Fiber (R3F) + drei | Reactive 3D hero element — morphing abstract shape |
| Smooth Scroll | Lenis | Momentum-based scrolling, industry standard for award-winning sites |
| Styling | Tailwind CSS | Rapid development, consistent spacing/color system |
| Fonts | Playfair Display + Space Grotesk | Serif/sans pairing — analog editorial meets digital precision |
| Icons | Font Awesome 6 (CDN) or Lucide React | Minimal icon usage, mostly decorative |
| Deployment | Static export (same hosting as current) | No server required, drop-in replacement |

## Visual System

### Typography

- **Playfair Display** (700 bold, 400 italic): All headlines, statement text, pull quotes, stats numbers. Used at dramatic scale (8-12vw hero, 48-56px section headers, 24-36px subheads).
- **Space Grotesk** (400, 500, 600, 700): Body copy, labels, navigation, UI elements, tags, buttons. Small uppercase with wide letter-spacing for labels (11-13px, tracking 3-5px).
- **Scale contrast** is a core design principle: massive serif headlines paired with tiny sans-serif labels create editorial tension.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Void | `#08080f` | Primary background |
| White | `#ffffff` | Headlines, primary text |
| White/85 | `rgba(255,255,255,0.85)` | Italic/statement text |
| White/45 | `rgba(255,255,255,0.45)` | Body copy |
| White/25 | `rgba(255,255,255,0.25)` | Labels, tertiary text |
| Fog | `rgba(255,255,255,0.02-0.08)` | Card surfaces, dividers, subtle backgrounds |
| Divider | `rgba(255,255,255,0.06)` | Hairline borders |
| Accent Gradient | `#818cf8 → #c084fc` | Indigo to violet. Used sparingly: gradient text on key italic phrases, hover states, phase labels, CTA button fill. The restraint makes accent moments hit harder. |
| Accent/Dim | `rgba(129,140,248,0.5)` | Phase numbers, tag backgrounds |

### Design Principles

1. **Dramatic scale contrast** — Massive headlines next to small uppercase labels. The tension is the energy.
2. **Confident whitespace** — Sections breathe. Nothing feels crammed. Emptiness is intentional.
3. **Motion as personality** — Every animation has intent. Nothing moves just because it can.
4. **Monochrome + one accent** — Almost entirely black/white/gray. The indigo-violet gradient appears only at key moments.

## Page Sections

### 1. Navigation

Fixed top bar, transparent over hero, subtle background on scroll.

- **Left:** "HATCHLING" — Space Grotesk, 13px, weight 600, letter-spacing 3px, uppercase
- **Right:** Services / Work / About / Contact — Space Grotesk, 13px, rgba white/45. "Contact" is white with a subtle underline.
- **Scroll behavior:** Background fades in (`rgba(8,8,15,0.9)` + backdrop blur) after scrolling past the hero viewport.
- **Mobile:** Hamburger menu with full-screen overlay.

### 2. Hero (Full Viewport)

The first thing anyone sees. Must create an immediate "whoa" reaction.

**Layout:**
- Full viewport height (`100vh`)
- Small uppercase label: "Digital Studio" — Space Grotesk, 11px, tracking 5px, white/30
- Main headline: "We craft digital experiences that *feel alive.*" — Playfair Display, ~8-10vw fluid, bold 700. The italic "feel alive." is weight 400 italic with the accent gradient applied via `background-clip: text`.
- Subtitle: "App development, AI integration, and design for companies that refuse to blend in." — Space Grotesk, 16px, white/45, max-width ~420px
- Bottom bar anchored to viewport bottom: service keywords (Apps / AI / Cloud / Design) left, "Scroll to explore ↓" right. Separated by a hairline border-top. All Space Grotesk 11px uppercase white/25.

**3D Element (React Three Fiber):**
- Abstract morphing sphere/blob positioned behind the headline text (center-right of viewport)
- Soft, semi-transparent with the accent gradient color at low opacity
- Reacts to cursor position with subtle distortion/displacement
- Slow idle animation (morphing shape) when cursor is not moving
- Large blur/glow around it so it feels atmospheric, not hard-edged
- Should feel organic — like creative energy visualized

**Load Animation (Framer Motion):**
- Staggered entrance: label fades in first (0ms), then headline lines slide up one at a time (200ms, 400ms, 600ms), subtitle fades in (800ms), bottom bar slides up (1000ms)
- 3D element fades in over the first 1.5s
- Custom cursor appears after initial animation completes

### 3. Services

Editorial numbered list. Each service gets a full-width row.

**Layout:**
- Section header: "What We Do" label + "Four disciplines, *one vision.*" headline (Playfair 48px)
- Four rows separated by hairline dividers (`rgba(255,255,255,0.06)`)
- Each row: number (01-04) + service title on the left, description paragraph on the right
- Numbers: Space Grotesk 12px, white/20, tracking 1px
- Titles: Playfair Display 36px bold
- Descriptions: Space Grotesk 14px, white/40, max-width 320px, line-height 1.7
- Alternating rows get a subtle `rgba(255,255,255,0.02)` background

**Services:**
1. **App Development** — Native iOS, Android & cross-platform solutions. From concept to App Store.
2. **AI Integration** — LLMs, computer vision & predictive analytics. Intelligent, not gimmicky.
3. **Digital Efficiency** — Scalable infrastructure, automation & DevOps. Your product stays fast at any scale.
4. **UI/UX Design** — Human-centered interfaces & design systems. Complex things made simple.

**Interactions:**
- **Scroll reveal:** Each row slides in from left, staggered. Number/title and description animate separately for a layered entrance.
- **Hover:** Row expands slightly, title shifts, subtle accent gradient glow appears behind the title, description text brightens to white/60. Cursor morphs to show "Explore" or an arrow.
- **Magnetic text:** The service title subtly follows cursor position within its row (magnetic pull effect). Creates a living, responsive feeling.

### 4. About / Philosophy

Split layout — emotional statement meets factual credibility.

**Layout:**
- Section label: "About" — standard uppercase label
- Two-column layout with generous gap (~80px)
- **Left column (flex 1.2):** Large italic pull-quote — Playfair Display 42px, weight 400, italic, white/85. "We started Hatchling because we were tired of seeing brilliant ideas die in mediocre execution."
- **Right column (flex 1):** Two paragraphs of body copy — Space Grotesk 15px, white/45, line-height 1.8. Below that, three stats in a row:
  - "12+" / Projects Shipped
  - "3" / Years Running
  - "100%" / Give a Damn
  - Numbers: Playfair Display 36px bold white. Labels: Space Grotesk 11px uppercase white/25.

All content is placeholder — user will replace with real copy and stats.

**Interactions:**
- **Split reveal:** Quote slides in from left, body text from right.
- **Parallax:** Quote moves slightly slower than body text on scroll, creating depth.
- **Stats count-up:** Numbers animate from 0 to final value when section enters viewport.

### 5. Work / Portfolio

Stacked case study rows. Placeholder content for now.

**Layout:**
- Section header: "Selected Work" label + "Recent *projects.*" headline + "3 Projects" count on the right
- Three project rows, each containing:
  - Thumbnail (280x180px, 12px border-radius, gradient placeholder backgrounds)
  - Tags (tiny pills: Space Grotesk 10px uppercase, accent-tinted or white-tinted backgrounds)
  - Project name: Playfair Display 28px bold
  - Description: Space Grotesk 14px, white/40, max-width 400px
  - "View →" link on the right: Space Grotesk 12px uppercase white/20
- Rows separated by hairline dividers

**Placeholder Projects:**
1. **Project Aurelia** — Tags: iOS App, AI Integration. "An AI-powered wellness platform that adapts to user behavior in real-time."
2. **Vertex Dashboard** — Tags: Web Platform, Design System. "A real-time analytics dashboard for a fintech startup. Complex data made beautiful."
3. **NightOwl** — Tags: Cross-Platform, Cloud. "A social platform for independent musicians to collaborate across time zones."

**Interactions:**
- **Scroll entrance:** Thumbnail slides from left, text from right, tags fade in. Each project staggers 150ms.
- **Hover:** Thumbnail scales up slightly, row lifts, "View →" arrow animates right, cursor morphs to a preview circle.

### 6. Process

Four horizontal phase cards showing how Hatchling works with clients.

**Layout:**
- Section header: "How We Work" label + "From spark *to launch.*" headline
- Four equal-width cards in a horizontal row, minimal gap (2px)
- Each card: subtle surface background (`rgba(255,255,255,0.02)`), 12px border-radius, 36px 28px padding
  - Phase label: "PHASE 01" — Space Grotesk 11px, tracking 3px, accent/dim color
  - Title: Playfair Display 24px bold white
  - Description: Space Grotesk 13px, white/35, line-height 1.7
  - Gradient accent line at bottom: `linear-gradient(90deg, rgba(129,140,248,0.3), transparent)`

**Phases:**
1. **Discovery** — Listen, understand the problem, research competitors, define success.
2. **Design** — Wireframes, prototypes, visual design. Iterate fast, validate with users.
3. **Build** — Clean architecture, modern stack, obsessive detail. Weekly demos. No surprises.
4. **Launch** — Deploy, monitor, optimize. Stick around to ensure real-world performance.

**Interactions:**
- **Sequential reveal:** Cards appear one at a time left-to-right on scroll with a rising fade.
- **Gradient line animation:** The accent line animates width from 0 to full as each card enters.
- **Hover:** Card lifts slightly, phase number brightens to full accent color.

### 7. Contact / CTA

Centered full-viewport closing statement with emotional pull.

**Layout:**
- Centered content, max-width 700px
- Ambient glow: Large radial gradient circle (accent color at ~6% opacity, 60px blur) behind the content, softly pulsing
- Label: "Let's Talk" — standard uppercase label
- Headline: "Have an idea? *Let's make it real.*" — Playfair Display 56px. Italic portion gets the accent gradient.
- Subtitle: "We're always interested in hearing about new projects. Drop us a line — no pitch decks required." — Space Grotesk 16px, white/40
- CTA Button: Pill-shaped (`border-radius: 100px`), 1px border white/15, Space Grotesk 14px weight 500, white text. Contains email address: rhett@hatchlingcreative.com

**Interactions:**
- **Entrance:** Headline scales up from 80% with fade on scroll.
- **Ambient glow:** Soft pulse animation on the background gradient.
- **Button shimmer:** Subtle looping shimmer effect on the border.
- **Button hover:** Fills with accent gradient, text stays white or inverts. Cursor morphs to "Say Hello."

### 8. Footer

Minimal single-line footer below the CTA.

- Hairline border-top
- Three-column layout: copyright left, social links center, location right
- "© 2026 Hatchling Creative, LLC" — Space Grotesk 12px, white/20
- Social links: GitHub / LinkedIn / Twitter — Space Grotesk 12px, white/20
- Location: "Portland, OR" — Space Grotesk 12px, white/20

## Global Interactions

### Custom Cursor

Replaces default cursor site-wide. Small filled dot (~8px) with a larger trailing circle (~40px) that follows with slight delay (lerp). States:
- **Default:** Dot + circle, white at low opacity
- **Hover (links/buttons):** Circle expands, blend mode changes, may show text label ("Explore", "Say Hello", "View")
- **Hover (text):** Reverts to standard text cursor for readability
- Implemented as a React component with `pointer-events: none`, positioned via `requestAnimationFrame`

### Smooth Scroll (Lenis)

Momentum-based smooth scrolling across the entire page. Gives premium, weighted feel to all scroll interactions. Integrates with Framer Motion's scroll progress for triggering animations.

### Scroll-Triggered Animations

All section entrances use Framer Motion's `useInView` or `useScroll` + `useTransform`. Common patterns:
- **Fade up:** Element translates Y from 40px to 0 with opacity 0→1
- **Slide in:** Element translates X from ±60px to 0
- **Stagger:** Children animate sequentially with 100-200ms delays
- **Parallax:** Different scroll speeds for layered elements

### Page Load

Initial load has a brief orchestrated entrance (hero section animation described above). No loading screen — content animates in directly.

## File Structure

```
HatchlingSite/                    # Keep existing directory
├── index.html                    # Will be replaced by Next.js output
├── NewLogo.svg                   # Keep — used in nav
├── NewSymbol.svg                 # Keep — favicon
├── next-site/                    # New Next.js project
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── public/
│   │   ├── NewLogo.svg
│   │   ├── NewSymbol.svg
│   │   └── fonts/               # Self-hosted fonts (optional, can use Google Fonts CDN)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        # Root layout: fonts, metadata, cursor, Lenis provider
│   │   │   ├── page.tsx          # Home page: assembles all sections
│   │   │   └── globals.css       # Tailwind directives + custom utilities
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── sections/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── Services.tsx
│   │   │   │   ├── About.tsx
│   │   │   │   ├── Work.tsx
│   │   │   │   ├── Process.tsx
│   │   │   │   └── Contact.tsx
│   │   │   ├── three/
│   │   │   │   ├── HeroScene.tsx  # R3F Canvas + scene setup
│   │   │   │   └── MorphBlob.tsx  # The reactive 3D shape
│   │   │   ├── ui/
│   │   │   │   ├── CustomCursor.tsx
│   │   │   │   ├── MagneticText.tsx
│   │   │   │   ├── AnimatedCounter.tsx
│   │   │   │   └── ShimmerButton.tsx
│   │   │   └── providers/
│   │   │       └── SmoothScroll.tsx  # Lenis provider
│   │   └── lib/
│   │       └── animations.ts     # Shared Framer Motion variants
│   │   │   ├── movebreak/        # Preserve existing legal pages
│   │   │   │   ├── privacy/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── terms/
│   │   │   │       └── page.tsx
│   └── ...
├── sitemap.xml                   # Update after build
├── robots.txt                    # Keep
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-04-10-website-redesign-design.md
```

## Responsive Behavior

- **Desktop (1200px+):** Full layout as designed. All interactions active.
- **Tablet (768-1199px):** Services rows stack title above description. Work thumbnails shrink. Process cards go 2x2 grid. Hero headline scales down via fluid clamp.
- **Mobile (< 768px):** Single column throughout. Hamburger nav. Hero headline ~10vw min. Process cards stack vertically. Custom cursor disabled (touch devices). 3D element simplified or hidden for performance.

## SEO & Metadata

Carry forward all existing meta tags, Open Graph, Twitter cards. Update:
- Title: "Hatchling Creative | App Development, AI Integration & Design"
- Description: Current meta description is good, keep it
- Theme color: `#08080f`
- Sitemap: Regenerate after build to reflect new URL structure
- Preserve `/movebreak/privacy/` and `/movebreak/terms/` routes

## Performance Considerations

- **R3F/Three.js:** Lazy-load the 3D canvas. Use `Suspense` with a fallback gradient. On mobile, consider replacing with a CSS-only animated gradient to save ~150KB.
- **Fonts:** Use `next/font` for optimized font loading with `display: swap`.
- **Images:** Use `next/image` for any future project thumbnails. Placeholder gradients need no optimization.
- **Animation:** All Framer Motion animations use GPU-accelerated transforms (translate, scale, opacity). No layout-triggering properties.
- **Lenis:** Disable on mobile if performance is an issue (native scroll is fine on touch).
- **Bundle:** Code-split the Three.js scene so it doesn't block initial render.

## Deployment

The site currently deploys as static files. Next.js can output a static export (`next export` / `output: 'export'` in next.config.js) to maintain the same deployment model. The built output replaces the current `index.html` and serves from the same hosting.

## Content Note

All copy, stats, project descriptions, and testimonials are placeholder. The user will replace them with real content. The design and structure should make swapping content straightforward — each section's data can be extracted into a simple data file or constants object for easy editing.
