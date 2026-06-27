"use client";

import { Suspense, useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import * as THREE from "three";

const COUNT = 2600;

// The particle field streams left to right (a "jetstream"), wrapping around.
const FLOW_SPAN = 12; // band width off-screen to off-screen before wrapping
const FLOW_SPEED = 0.85; // units per second

// Live bird state: the bird writes its wingbeat intensity, wing position, and
// body center here; the flock reads it so the air reacts to the whole bird.
const wingState = {
  x: 2.1, y: 1.0, beat: 0, // wing (impulse source)
  bx: 1.5, by: 0.4, bz: 0, // body center (solid in the flow)
};

// --- Wing aerodynamics ---------------------------------------------------
// A wingbeat is a velocity impulse on the molecules inside WAKE_RADIUS. The
// bird faces left into the left-to-right stream, so its wake trails to the
// right (+x, downstream). Downwash (-y) is the dominant term: it is the air
// forced downward whose reaction, by Newton's third law, holds the bird up.
// Disturbed air keeps its displaced position and only the *extra velocity*
// dissipates — it never snaps back to a "home" spot.
const WAKE_RADIUS = 2.6;    // how far a wingbeat reaches (units)
const DOWNWASH = 25;        // downward acceleration from lift (units/s^2)
const THRUST = 7.5;         // downstream acceleration: air pushed rearward
const RADIAL = 5;           // outward acceleration: the wing displacing air
const VORTEX = 3;           // spanwise swirl: wingtip vortex roll-up
const UPWASH = 3;           // leading-edge upwash: air drawn up/forward ahead of wing
const PERTURB_DECAY = 0.78; // viscous dissipation rate of the wake (1/s)
const THERMAL_Y = 0.22;     // ambient vertical jitter velocity amplitude
const THERMAL_Z = 0.14;     // ambient depth jitter velocity amplitude

// --- Body in the flow (bluff-body aerodynamics) --------------------------
// The fuselage is a solid object the air must go around. It is longer fore-aft
// (x) than lateral, so we test against an ellipsoid. Air piles up and slows at
// the nose (stagnation / form drag), accelerates over the shoulders (Venturi,
// low pressure), and separates into a low-pressure wake behind, where vortices
// shed alternately top/bottom — a von Kármán vortex street. The body is always
// present, so the field keeps moving even while the bird glides.
const BODY_X = 1.25;    // fore-aft half-length of the body ellipsoid
const BODY_YZ = 0.62;   // lateral half-size of the body ellipsoid
const BODY_PUSH = 16;   // air parts radially around the body volume
const BODY_DRAG = 10;   // frontal stagnation: air decelerates approaching the nose
const BODY_VENTURI = 7; // shoulder acceleration: flow speeds up going around
const WAKE_LEN = 3.4;   // axial length of the body wake (downstream)
const WAKE_HALF_W = 0.85; // lateral half-width of the body wake
const BODY_WAKE = 5.5;  // base suction: air drawn into the low-pressure wake
const KARMAN_AMP = 5;   // von Kármán vortex street: transverse shed strength
const KARMAN_FREQ = 1.7; // vortex shedding frequency (Strouhal-like, Hz)

// --- Speed-glow (Bernoulli pressure visualization) -----------------------
// Disturbed air is moving faster, so by Bernoulli it sits at lower pressure. We
// glow those molecules brighter and shift them warm, so the wake, downwash and
// vortex street visibly "light up" wherever the bird has done work on the air.
const GLOW_SPEED = 2.6; // perturbation speed at which glow saturates
const GLOW_COLOR = new THREE.Color("#ffe6ad"); // warm "energized air" tint

// --- Binary glyph sprites (flying through code) --------------------------
// Each molecule renders as a glowing 0 or 1, sampled from a 2-cell atlas
// (cell 0 = "0" left, cell 1 = "1" right). A custom shader picks the cell per
// particle from its glyph index; glyphs flip occasionally so the stream
// shimmers like living data.
const GLYPH_COUNT = 2;         // "0" and "1"
const GLYPH_FLIP_RATE = 0.004; // fraction of glyphs re-randomized per second

// The Hatchling origami-bird logomark (same path as the navbar).
const BIRD_PATH =
  "m 60.7828,964.36215 27.1809,0.8834 -27.1809,25.9958 z m -1.9745,1.4513 0,26.7845 -25.2681,0 c 8.6166,-8.7334 16.8796,-17.8103 25.2681,-26.7845 z m 27.7053,3.628 3.4864,1.1989 -12.5877,7.4768 z m -68.1835,2.9656 5.5226,0 12.8654,14.0705 -5.9854,6.1204 -12.4026,0 c 9e-4,-6.7347 0,-13.4597 0,-20.1909 z m -1.9746,1.2304 0,5.8364 -6.3555,0 z m 3.363,20.9796 38.627,0 -10.7675,29.43465 z m 39.0898,4.54286 0,41.20229 -12.5878,-6.8775 c 4.1972,-11.443 8.3886,-22.879 12.5878,-34.32479 z";

type Facet = { geo: THREE.ExtrudeGeometry; side: "W" | "C" | "T" };

// Parse the logo into its individual origami facets, each placed in a shared,
// centered bird space, and tagged left wing / right wing / body by position so
// the wings can pivot independently.
function buildBirdFacets(): Facet[] {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${BIRD_PATH}"/></svg>`;
  const data = new SVGLoader().parse(svg);
  const shapes: THREE.Shape[] = [];
  data.paths.forEach((p) =>
    SVGLoader.createShapes(p).forEach((s) => shapes.push(s))
  );

  // One combined geometry to derive a shared center + scale for all facets.
  const combined = new THREE.ExtrudeGeometry(shapes, {
    depth: 7,
    bevelEnabled: false,
  });
  combined.computeBoundingBox();
  const bb = combined.boundingBox!;
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  bb.getCenter(center);
  bb.getSize(size);
  const s = 2.7 / Math.max(size.x, size.y);
  combined.dispose();

  // The logo is a PROFILE bird: head/beak on the left (facets 3,4), body (5),
  // tail (6). The single visible wing is the upper-right group plus its inner
  // section just left of it (facets 0,1,2). The wing flaps; the tail re-angles.
  const WING = new Set([0, 1, 2]);

  return shapes.map((shape, i) => {
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 7,
      bevelEnabled: false,
    });
    geo.translate(-center.x, -center.y, -center.z);
    geo.scale(s, -s, s); // flip Y (SVG is y-down) + normalize to bird space
    const side: Facet["side"] = WING.has(i) ? "W" : i === 6 ? "T" : "C";
    return { geo, side };
  });
}

type FlockData = {
  positions: Float32Array;
  baseY: Float32Array;
  baseZ: Float32Array;
  colors: Float32Array;
  phases: Float32Array;
  glyph: Float32Array;
};

// Built off the render path (uses Math.random), then handed in via state.
function buildFlock(): FlockData {
  const positions = new Float32Array(COUNT * 3);
  const baseY = new Float32Array(COUNT);
  const baseZ = new Float32Array(COUNT);
  const colors = new Float32Array(COUNT * 3);
  const phases = new Float32Array(COUNT);
  const glyph = new Float32Array(COUNT);
  const inner = new THREE.Color("#cdd4ff");
  const outer = new THREE.Color("#5a6bf0");
  for (let i = 0; i < COUNT; i++) {
    // A wide band that streams across; denser toward the middle of the band.
    const x = (Math.random() * 2 - 1) * (FLOW_SPAN / 2);
    const y = (Math.random() * 2 - 1) * Math.pow(Math.random(), 0.35) * 2.6;
    const z = (Math.random() * 2 - 1) * 1.6;
    // baseY/baseZ are the molecule's rest streamline — the undisturbed height
    // and depth it returns to only when fresh air re-enters upstream (on wrap).
    baseY[i] = y;
    baseZ[i] = z;
    positions.set([x, y, z], i * 3);
    const col = inner.clone().lerp(outer, Math.min(Math.abs(y) / 2.6, 1));
    colors.set([col.r, col.g, col.b], i * 3);
    phases[i] = Math.random() * Math.PI * 2;
    glyph[i] = Math.random() < 0.5 ? 0 : 1;
  }
  return { positions, baseY, baseZ, colors, phases, glyph };
}

/**
 * Glyph atlas: two side-by-side cells ("0" left, "1" right), each a glowing
 * monospace digit rendered to a canvas. This is the texture the point shader
 * samples per-particle to draw each molecule as a 0 or 1.
 */
function useGlyphAtlas() {
  return useMemo(() => {
    const cell = 64;
    const c = document.createElement("canvas");
    c.width = cell * GLYPH_COUNT;
    c.height = cell;
    const ctx = c.getContext("2d")!;
    ctx.font = `bold ${Math.round(cell * 0.72)}px ui-monospace, "SF Mono", Menlo, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const chars = ["0", "1"];
    for (let g = 0; g < GLYPH_COUNT; g++) {
      const cx = g * cell + cell / 2;
      const cy = cell / 2 + 1;
      // Outer glow
      ctx.shadowColor = "rgba(129,140,248,0.85)";
      ctx.shadowBlur = cell * 0.35;
      ctx.fillStyle = "rgba(180,190,255,0.45)";
      ctx.fillText(chars[g], cx, cy);
      // Bright core
      ctx.shadowBlur = cell * 0.12;
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fillText(chars[g], cx, cy);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

// Point sprite shader: samples the glyph atlas cell selected by each particle's
// aGlyph index, tinted by the vertex color (cool rest / warm speed-glow).
const GLYPH_VERT = /* glsl */ `
  attribute float aGlyph;
  varying vec3 vColor;
  varying float vGlyph;
  uniform float uSize;
  void main() {
    vColor = color;
    vGlyph = aGlyph;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;
const GLYPH_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vGlyph;
  uniform sampler2D uTexture;
  void main() {
        float cellSize = 1.0 / ${GLYPH_COUNT}.0;
    float u = vGlyph * cellSize + gl_PointCoord.x * cellSize;
    float v = 1.0 - gl_PointCoord.y;
    vec4 tex = texture2D(uTexture, vec2(u, v));
    if (tex.a < 0.02) discard;
    gl_FragColor = vec4(vColor, 1.0) * tex;
  }
`;

/**
 * Air molecules: a band of glowing particles advecting left to right on a steady
 * stream. Each molecule carries its own velocity. A wingbeat imparts an impulse
 * to nearby molecules — dominated by downwash (air forced down, the reaction that
 * lifts the bird), plus a downstream thrust component (air accelerated rearward),
 * a radial push (the wing's volume displacing air), and a spanwise swirl (wingtip
 * vortex roll-up). The perturbation velocity decays via viscous mixing, but the
 * molecule keeps its displaced position — it does not snap back. New, undisturbed
 * air enters from upstream whenever a molecule wraps off the right edge.
 */
function Flock() {
  const pointsRef = useRef<THREE.Points>(null);
  const atlas = useGlyphAtlas();
  const data = useMemo(() => buildFlock(), []);
  // Live glyph buffer (mutable copy so we can flip 0s and 1s each frame).
  const glyphData = useMemo(() => data.glyph.slice(), [data]);
  // Shader material: samples the glyph atlas per particle. Memoized so the
  // uniform texture reference stays stable across renders.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: GLYPH_VERT,
        fragmentShader: GLYPH_FRAG,
        uniforms: {
          uTexture: { value: atlas },
          uSize: { value: 140 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      }),
    [atlas]
  );
  // Per-molecule perturbation velocity (the wind-relative part the wing/body
  // adds). Total velocity = (FLOW_SPEED, 0, 0) + perturbation + thermal jitter.
  const velRef = useRef<Float32Array | null>(null);
  if (velRef.current === null) velRef.current = new Float32Array(COUNT * 3);
  // Live color buffer: a useMemo array (like data.positions) so it is safe to
  // hand to the buffer attribute in render, while still being mutated each
  // frame via the geometry's color attribute array. data.colors stays pristine
  // as the cool rest palette we lerp back toward (the speed-glow source).
  const colData = useMemo(() => data.colors.slice(), [data]);

  useFrame((state, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const { baseY, baseZ, phases, colors } = data;
    const vel = velRef.current!;
    const col = pts.geometry.attributes.color.array as Float32Array;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    const half = FLOW_SPAN / 2;
    const r2 = WAKE_RADIUS * WAKE_RADIUS;

    // Wing (impulse source).
    const wx = wingState.x;
    const wy = wingState.y;
    const wz = 0; // wing beats symmetric about the body's z-center
    const beat = wingState.beat;
    const beating = beat > 0.001;

    // Body (solid in the flow) — always present, even while gliding.
    const bdx = wingState.bx;
    const bdy = wingState.by;
    const bdz = wingState.bz;

    // Viscous mixing: the perturbation fades; the displaced position persists.
    const decay = Math.max(0, 1 - PERTURB_DECAY * dt);

    // Speed-glow target (warm "energized" tint), read once per frame.
    const gr = GLOW_COLOR.r, gg = GLOW_COLOR.g, gb = GLOW_COLOR.b;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const ph = phases[i];

      // Ambient thermal jitter (oscillating velocity -> bounded position wobble).
      const tvy = Math.sin(t * 0.8 + ph) * THERMAL_Y;
      const tvz = Math.cos(t * 0.6 + ph * 1.3) * THERMAL_Z;

      // Integrate: position += (base stream + perturbation + thermal) * dt.
      let x = arr[ix] + (FLOW_SPEED + vel[ix]) * dt;
      let y = arr[ix + 1] + (vel[ix + 1] + tvy) * dt;
      let z = arr[ix + 2] + (vel[ix + 2] + tvz) * dt;

      // --- Wingbeat impulse on molecules inside the influence radius. ---
      if (beating) {
        const dx = x - wx;
        const dy = y - wy;
        const dz = z - wz;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < r2) {
          const d = Math.sqrt(d2) + 1e-4;
          const prox = 1 - d / WAKE_RADIUS; // 1 at the wing -> 0 at the edge
          const w = beat * prox * prox * dt;
          const inv = 1 / d;
          // Downwash: air forced downward (stronger directly beneath the wing).
          const below = Math.min(Math.max((-dy) / WAKE_RADIUS, 0), 1);
          vel[ix + 1] += -DOWNWASH * w * (0.45 + 0.55 * below);
          // Thrust: air accelerated downstream (rearward relative to the bird).
          vel[ix] += THRUST * w;
          // Radial push: the wing's volume shoves surrounding air outward.
          vel[ix] += RADIAL * w * dx * inv;
          vel[ix + 1] += RADIAL * w * dy * inv;
          vel[ix + 2] += RADIAL * w * dz * inv;
          // Wingtip vortex: spanwise roll-up, swirling in the y-z plane.
          vel[ix + 1] += -VORTEX * w * dz * inv;
          vel[ix + 2] += VORTEX * w * dy * inv;
          // Leading-edge upwash: air ahead of the wing rises to meet it — the
          // start of the circulation whose completion (the downwash) is lift.
          if (dx < 0) {
            const ahead = (-dx) / WAKE_RADIUS; // 0 at wing -> 1 upstream edge
            const u = beat * ahead * ahead * UPWASH * dt;
            vel[ix + 1] += u * (0.6 - dy * 0.25);
            vel[ix] += u * 0.25;
          }
        }
      }

      // --- Body in the flow: a solid the air must go around (always present). ---
      const dxb = x - bdx;
      const dyb = y - bdy;
      const dzb = z - bdz;
      // Ellipsoidal influence (the body is longer fore-aft than lateral).
      const ex = dxb / BODY_X;
      const ey = dyb / BODY_YZ;
      const ez = dzb / BODY_YZ;
      const e2 = ex * ex + ey * ey + ez * ez;
      if (e2 < 1) {
        const surf = 1 - Math.sqrt(e2); // 1 at center -> 0 at the surface
        const s2 = surf * surf;
        const dbr = Math.sqrt(dxb * dxb + dyb * dyb + dzb * dzb) + 1e-4;
        const invb = 1 / dbr;
        // Solid displacement: air shoved radially away from the body volume.
        const push = BODY_PUSH * s2 * dt;
        vel[ix] += push * dxb * invb;
        vel[ix + 1] += push * dyb * invb;
        vel[ix + 2] += push * dzb * invb;
        // Form drag at the nose (upstream, -x): approaching air decelerates.
        const front = Math.max(0, (-dxb) / BODY_X);
        vel[ix] -= BODY_DRAG * s2 * front * dt;
        // Venturi over the shoulders: flow accelerates going around the body.
        const side = 1 - Math.min(1, Math.abs(dxb) / BODY_X);
        vel[ix] += BODY_VENTURI * s2 * side * dt;
      }

      // --- Body wake: low-pressure recirculation + von Kármán vortex street. ---
      if (dxb > 0.1 && dxb < WAKE_LEN) {
        const ax = 1 - dxb / WAKE_LEN; // 1 just behind the body -> 0 downstream
        const lateral = Math.sqrt(dyb * dyb + dzb * dzb);
        if (lateral < WAKE_HALF_W) {
          const lw = 1 - lateral / WAKE_HALF_W; // core of the wake
          const wake = ax * lw;
          // Base suction: air drawn back toward the body (rearward + inward).
          vel[ix] -= BODY_WAKE * wake * dt * 0.6;
          vel[ix + 1] += BODY_WAKE * wake * dt * (-dyb) * 0.4;
          vel[ix + 2] += BODY_WAKE * wake * dt * (-dzb) * 0.4;
          // Alternating vortex shedding; the phase advances downstream so the
          // vortices appear to peel off the body and convect rearward.
          const phase = t * Math.PI * 2 * KARMAN_FREQ - dxb * 1.9;
          vel[ix + 1] += KARMAN_AMP * wake * dt * Math.sin(phase);
          vel[ix + 2] += KARMAN_AMP * wake * dt * 0.5 * Math.cos(phase);
        }
      }

      // Dissipate the perturbation (viscosity); thermal + stream remain.
      vel[ix] *= decay;
      vel[ix + 1] *= decay;
      vel[ix + 2] *= decay;

      // Wrap: a molecule leaving downstream is replaced by fresh air upstream,
      // starting on its rest streamline with no perturbation.
      if (x > half) {
        x -= FLOW_SPAN;
        y = baseY[i];
        z = baseZ[i];
        vel[ix] = 0;
        vel[ix + 1] = 0;
        vel[ix + 2] = 0;
      }

      arr[ix] = x;
      arr[ix + 1] = y;
      arr[ix + 2] = z;

      // --- Speed-glow: energized air lights up (Bernoulli). ---
      // Color stride matches position stride (3), so the color index === ix.
      const sp = Math.sqrt(
        vel[ix] * vel[ix] + vel[ix + 1] * vel[ix + 1] + vel[ix + 2] * vel[ix + 2]
      );
      const g = Math.min(sp / GLOW_SPEED, 1);
      col[ix] = colors[ix] + (gr - colors[ix]) * g;
      col[ix + 1] = colors[ix + 1] + (gg - colors[ix + 1]) * g;
      col[ix + 2] = colors[ix + 2] + (gb - colors[ix + 2]) * g;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.geometry.attributes.color.needsUpdate = true;

    // Living data: flip a handful of 0s/1s per second so the stream shimmers.
    const gArr = pts.geometry.attributes.aGlyph.array as Float32Array;
    const flips = Math.floor(GLYPH_FLIP_RATE * COUNT * dt + Math.random());
    for (let f = 0; f < flips; f++) {
      const idx = Math.floor(Math.random() * COUNT);
      gArr[idx] = 1 - gArr[idx];
    }
    if (flips > 0) pts.geometry.attributes.aGlyph.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colData, 3]} />
        <bufferAttribute attach="attributes-aGlyph" args={[glyphData, 1]} />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
}

/** One origami facet: crisp glowing edges plus a faint translucent body. */
function FacetMesh({ geo }: { geo: THREE.ExtrudeGeometry }) {
  return (
    <group>
      <lineSegments>
        <edgesGeometry args={[geo, 12]} />
        <lineBasicMaterial
          color="#aab4ff"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      {/* Opaque fill so the bird reads as a solid object cutting through the
          binary stream, rather than a ghosted outline. NormalBlending so it
          actually occludes the glyphs behind it. */}
      <mesh geometry={geo}>
        <meshBasicMaterial
          color="#1a2240"
          transparent={false}
          opacity={1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// The wing hinges along the bird's back (in bird space). We rotate about the
// body's long axis (X), so for an X-rotation only the hinge's y/z matter: y sits
// on the back line, z at 0. The wing then swings forward (toward the viewer) and
// down, out to the side, the way a profile bird actually flaps.
const WING_HINGE: [number, number, number] = [0.2, 0.34, 0];

// Bird behavior: a natural flap -> glide -> soar cycle. Real birds burst a few
// fast power strokes, glide with wings held out, then soar nearly still on a
// thermal. The downstroke is quick and forceful; the upstroke is a slower,
// graceful recovery. All timing is accumulated from clamped frame deltas (NOT
// the global clock), so backgrounding the tab never makes the state machine
// jump or lose rhythm — the bird resumes exactly where it left off.
const FOLD_ANGLE = 0.15; // wings folded up (rest pose within a flap)
const FLAP_AMP = 1.5; // how far the wing swings down on a power stroke
const DOWN_FRAC = 0.38; // fraction of each beat spent on the (fast) downstroke
const GLIDE_ANGLE = 0.62; // wings held out while gliding
const SOAR_ANGLE = 0.7; // wings held a touch higher while soaring
// Vertical flight dynamics: the bird's altitude is integrated from forces the
// way a real object moves in air. Gravity is the dominant force — it makes the
// bird ACCELERATE downward (you see it speed up as it falls, the key "feel" of
// real weight). Flapping (downstroke velocity) generates lift that overcomes
// gravity and adds upward momentum that COASTS — the bird keeps rising after a
// burst, gradually decelerating, instead of snapping back. Damping is low
// (momentum carries); the spring is barely-perceptible (prevents long-term drift
// without any rubber-band feel). The hard clamp is a pure safety net.
const GRAVITY = -1.00;      // dominant downward acceleration (makes falling feel real)
const FLAP_LIFT_K = 0.40;  // lift from downstroke angular velocity (overcomes gravity)
const GLIDE_SINK = -0.30;  // gentle extra sink while gliding (drag > lift)
const THERMAL_LIFT = 0.48; // thermal updraft during soar (just below gravity -> slow gentle descent)
const BANK_SINK = 0.10;    // altitude lost in banked turns (lift diverted sideways)
const VY_DAMP = 0.35;      // LOW air resistance -> momentum carries, real coasting
const HOME_SPRING = 0.015; // near-zero drift correction (imperceptible vs gravity)
const PITCH_K = 0.00;      // visual pitch from vertical velocity (climb=nose up)
// Low-altitude recovery: as the bird approaches the bottom, it instinctively
// flaps harder (boosting lift) so it powers back up on its own instead of
// bouncing off a hard floor. Below the recovery threshold the lift multiplier
// ramps up smoothly, and the bird is forced out of glide/soar into a flap burst
// (it "decides" to climb) — the way a real bird near the ground does.
const RECOVER_Y = -0.85;   // altitude (yOffset) below which recovery kicks in
const RECOVER_BOOST = 3.0; // max lift multiplier when deep in the recovery zone
// Hard vertical clamp (world units). The camera sees roughly y = -2.5..+2.5 at
// the bird's depth; keep it well inside that so it can never leave the frame.
const Y_MIN = -1.2;        // lowest the bird may descend
const Y_MAX = 1.2;         // highest the bird may climb

// Asymmetric beat shape: fast easeOut downstroke, smooth easeInOut upstroke.
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

// Per-burst variety (coprime lengths, irregular values) so the rhythm never
// loops cleanly. Each phase indexes its own array by the shared sequence
// counter, so flap/glide/soar all vary independently.
const FLAP_BEATS = [3, 2, 4, 2, 5, 3, 2, 4]; // beats in each flap burst
const FLAP_TEMPO = [0.24, 0.21, 0.27, 0.22, 0.25, 0.23, 0.26, 0.22]; // beat duration (s) per burst
const GLIDE_DURS = [1.6, 2.5, 1.1, 2.1, 1.3, 2.9, 1.8]; // seconds of glide
const GLIDE_BANK = [0.18, -0.22, 0.14, -0.16, 0.25, -0.12, 0.2]; // roll (rad) per glide
const SOAR_DURS = [4.2, 6.0, 3.6, 5.2, 4.8, 3.9, 5.6]; // seconds of soar (the long rest)
const SOAR_BANK = [0.1, -0.14, 0.08, -0.12, 0.16, -0.09, 0.13]; // roll (rad) per soar

// The tail, pivoted at its root, swings back from straight-down to trailing.
const TAIL_HINGE: [number, number, number] = [0.1, 0.05, 0];
const TAIL_ANGLE = 1.15; // radians: tail trailing behind, flight attitude

/** A wing built from the wing facets, pivoting about the shoulder. */
function Wing({
  wingRef,
  facets,
}: {
  wingRef: React.RefObject<THREE.Group | null>;
  facets: Facet[];
}) {
  return (
    <group ref={wingRef} position={WING_HINGE}>
      {/* Inner group cancels the hinge offset so facets sit at their real spot. */}
      <group position={[-WING_HINGE[0], -WING_HINGE[1], -WING_HINGE[2]]}>
        {facets.map((f, i) => (
          <FacetMesh key={`w${i}`} geo={f.geo} />
        ))}
      </group>
    </group>
  );
}

/**
 * The Hatchling bird logo as a glowing 3D origami mark. The single drawn wing is
 * duplicated into a near + far wing that beat in opposite directions (one swings
 * forward toward the viewer, the other back), so it reads as a bird in flight.
 */
function BirdLogo({
  position = [1.5, 0.4, 0],
  scale = 1,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const root = useRef<THREE.Group>(null);
  const wingNear = useRef<THREE.Group>(null);
  const wingFar = useRef<THREE.Group>(null);
  const facets = useMemo(() => buildBirdFacets(), []);
  const wingFacets = facets.filter((f) => f.side === "W");
  const bodyFacets = facets.filter((f) => f.side === "C");
  const tailFacets = facets.filter((f) => f.side === "T");

  // flap -> glide -> soar state machine. Timing is accumulated from clamped
  // frame deltas, never the global clock, so the rhythm is stable across tab
  // backgrounding and long sessions (no jumps, no float-precision drift).
  const mode = useRef<"flap" | "glide" | "soar">("flap");
  const seq = useRef(0);
  const phaseTime = useRef(0); // time elapsed within the current phase
  const simTime = useRef(0); // global sim time for slow continuous motion
  const angle = useRef(GLIDE_ANGLE);
  const prevAngle = useRef(GLIDE_ANGLE);
  const bank = useRef(0); // current roll, eased toward a per-phase target
  const vy = useRef(0); // vertical velocity (integrated from forces)
  const yOffset = useRef(0); // accumulated vertical displacement from home

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.05);
    simTime.current += dt;
    phaseTime.current += dt;

    // --- Low-altitude recovery: if the bird sinks too low while gliding or
    // soaring, cut that phase short and start flapping so it powers back up.
    if (mode.current !== "flap" && yOffset.current < RECOVER_Y) {
      mode.current = "flap";
      phaseTime.current = 0;
      seq.current += 1;
    }

    // --- Phase transitions ---
    if (mode.current === "flap") {
      const bi = seq.current % FLAP_BEATS.length;
      const burstDur = FLAP_BEATS[bi] * FLAP_TEMPO[bi];
      if (phaseTime.current >= burstDur) {
        mode.current = "glide";
        phaseTime.current = 0;
        seq.current += 1;
      }
    } else if (mode.current === "glide") {
      if (phaseTime.current >= GLIDE_DURS[seq.current % GLIDE_DURS.length]) {
        mode.current = "soar";
        phaseTime.current = 0;
        seq.current += 1;
      }
    } else {
      if (phaseTime.current >= SOAR_DURS[seq.current % SOAR_DURS.length]) {
        mode.current = "flap";
        phaseTime.current = 0;
        seq.current += 1;
      }
    }

    // --- Wing angle target ---
    let targetAngle: number;
    if (mode.current === "flap") {
      const bi = seq.current % FLAP_BEATS.length;
      const beatDur = FLAP_TEMPO[bi];
      const beats = FLAP_BEATS[bi];
      const beatIdx = Math.floor(phaseTime.current / beatDur);
      const p = (phaseTime.current - beatIdx * beatDur) / beatDur; // 0..1 in beat
      // Fatigue: amplitude eases off slightly across the burst.
      const amp = FLAP_AMP * (1 - 0.18 * (beatIdx / Math.max(1, beats)));
      // Asymmetric stroke: fast easeOut downstroke, graceful easeInOut upstroke.
      const shape =
        p < DOWN_FRAC
          ? easeOutCubic(p / DOWN_FRAC)
          : 1 - easeInOutCubic((p - DOWN_FRAC) / (1 - DOWN_FRAC));
      targetAngle = FOLD_ANGLE + amp * shape;
    } else if (mode.current === "glide") {
      targetAngle = GLIDE_ANGLE;
    } else {
      // Soar: wings held, with a tiny living correction so they never freeze.
      targetAngle = SOAR_ANGLE + Math.sin(simTime.current * 0.9) * 0.03;
    }

    // Track the shaped flap path exactly (it is already smooth); ease gently
    // into/out of glide and soar so transitions stay graceful.
    if (mode.current === "flap") {
      angle.current = targetAngle;
    } else {
      angle.current += (targetAngle - angle.current) * Math.min(1, dt * 6);
    }

    // --- Wing angular velocity (shared by lift + wingbeat intensity) ---
    // prevAngle still holds last frame's value here; updated below.
    const wingVel = (angle.current - prevAngle.current) / Math.max(dt, 1e-3);
    const downstroke = Math.max(0, wingVel); // only the downstroke lifts

    // --- Banking + heading (bird arcs instead of holding a fixed pose) ---
    let bankTarget = 0;
    if (mode.current === "glide")
      bankTarget = GLIDE_BANK[seq.current % GLIDE_BANK.length];
    else if (mode.current === "soar")
      bankTarget = SOAR_BANK[seq.current % SOAR_BANK.length];
    bank.current += (bankTarget - bank.current) * Math.min(1, dt * 2.5);

    // --- Vertical flight dynamics (integrated from forces) ---
    // Gravity is the dominant force: the bird accelerates downward when not
    // flapping (you see it speed up — real weight). Flap lift (downstroke only)
    // overcomes gravity and adds upward momentum that coasts — the bird keeps
    // rising after a burst, gradually decelerating, instead of snapping back.
    // Damping is low so momentum carries; the spring is near-zero (drift only).
    // Recovery lift boost: the lower the bird, the harder it flaps. Ramps from
    // 1x (normal) up to RECOVER_BOOST as it nears the floor, so it climbs back
    // under its own power instead of bouncing off a hard limit.
    let liftMul = 1;
    if (yOffset.current < RECOVER_Y) {
      const depth = (RECOVER_Y - yOffset.current) / (RECOVER_Y - Y_MIN);
      liftMul += RECOVER_BOOST * Math.min(Math.max(depth, 0), 1);
    }
    let force = GRAVITY;
    force += downstroke * FLAP_LIFT_K * liftMul; // flap lift (downstroke only)
    if (mode.current === "glide") force += GLIDE_SINK;
    else if (mode.current === "soar") force += THERMAL_LIFT;
    force -= Math.abs(bank.current) * BANK_SINK; // banked turns sink
    force += (0 - yOffset.current) * HOME_SPRING; // near-zero drift correction
    force -= vy.current * VY_DAMP; // low air resistance -> momentum carries
    vy.current += force * dt;
    yOffset.current += vy.current * dt;
    // Top: hard ceiling (never shown past this). Bottom: pure safety net only —
    // the recovery logic above should bring the bird back well before here, but
    // if it ever does reach the floor, kill the downward velocity (no bounce).
    if (yOffset.current > Y_MAX) {
      yOffset.current = Y_MAX;
      vy.current = Math.min(vy.current, 0);
    } else if (yOffset.current <= Y_MIN) {
      yOffset.current = Y_MIN;
      vy.current = Math.max(vy.current, 0);
    }

    if (root.current) {
      root.current.position.y = position[1] + yOffset.current;
      // Pitch from vertical velocity: climbing -> nose up, diving -> nose down.
      const pitch = THREE.MathUtils.clamp(vy.current * PITCH_K, -0.18, 0.18);
      root.current.rotation.y =
        Math.sin(simTime.current * 0.35) * 0.18 + bank.current * 0.4;
      root.current.rotation.z = bank.current + pitch;
    }

    // Opposite directions: near wing forward (+z), far wing back (-z).
    if (wingNear.current) wingNear.current.rotation.x = angle.current;
    if (wingFar.current) wingFar.current.rotation.x = -angle.current;

    // Publish wingbeat intensity + wing/body position so the air molecules react.
    wingState.beat = Math.min(Math.abs(wingVel) / 6, 1.3);
    prevAngle.current = angle.current;
    if (root.current) {
      wingState.x = root.current.position.x + 0.62;
      wingState.y = root.current.position.y + 0.62;
      // Body center = the bird's origin in world space (the geometry is
      // centered on the root), so the flock can part air around the fuselage.
      wingState.bx = root.current.position.x;
      wingState.by = root.current.position.y;
      wingState.bz = root.current.position.z;
    }
  });

  return (
    // Faces left (the logo's natural profile), holding in the stream.
    <group ref={root} position={position} scale={scale}>
      <Wing wingRef={wingFar} facets={wingFacets} />
      <Wing wingRef={wingNear} facets={wingFacets} />
      {/* Tail re-angled to trail behind, pivoting at its root. */}
      <group position={TAIL_HINGE} rotation={[0, 0, TAIL_ANGLE]}>
        <group position={[-TAIL_HINGE[0], -TAIL_HINGE[1], -TAIL_HINGE[2]]}>
          {tailFacets.map((f, i) => (
            <FacetMesh key={`t${i}`} geo={f.geo} />
          ))}
        </group>
      </group>
      {bodyFacets.map((f, i) => (
        <FacetMesh key={`c${i}`} geo={f.geo} />
      ))}
    </group>
  );
}

export default function HeroScene() {
  // Default to NOT rendering the heavy canvas until we confirm it is safe
  // (no reduced-motion preference and a fine pointer). Guards for SSR.
  const [renderCanvas, setRenderCanvas] = useState(false);
  // Pause the render loop once the hero scrolls out of view (battery/GPU).
  const [inView, setInView] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    // Width gate catches mobile cases pointer:coarse misses (devtools emulation,
    // some Android browsers, hybrid devices) — the WebGL scene never mounts on
    // narrow screens, so it can't half-load. ponytail: 768px = Tailwind md.
    const mobileWidth = window.matchMedia("(max-width: 767px)");
    const update = () =>
      setRenderCanvas(
        !reduceMotion.matches && !coarsePointer.matches && !mobileWidth.matches
      );
    update();
    reduceMotion.addEventListener("change", update);
    coarsePointer.addEventListener("change", update);
    mobileWidth.addEventListener("change", update);
    return () => {
      reduceMotion.removeEventListener("change", update);
      coarsePointer.removeEventListener("change", update);
      mobileWidth.removeEventListener("change", update);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className="absolute inset-0 z-0">
      {/* Ambient glow that sits behind / under the canvas in every mode. */}
      <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[620px] aspect-square rounded-full bg-accent-indigo/[0.10] blur-[130px] pointer-events-none" />
      {renderCanvas && (
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 6], fov: 45 }}
            style={{ pointerEvents: "none" }}
            dpr={[1, 2]}
            frameloop={inView ? "always" : "never"}
            gl={{ antialias: true, alpha: true }}
          >
            <BirdLogo position={[1.5, 0.2, 0]} scale={0.95} />
            <Flock />
          </Canvas>
        </Suspense>
      )}
    </div>
  );
}
