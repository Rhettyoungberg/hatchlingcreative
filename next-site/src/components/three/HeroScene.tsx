"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

function MorphBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useMemo(() => {
    if (typeof window !== "undefined") {
      const handler = (e: MouseEvent) => {
        mouse.current = {
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: -(e.clientY / window.innerHeight) * 2 + 1,
        };
      };
      window.addEventListener("mousemove", handler);
      return () => window.removeEventListener("mousemove", handler);
    }
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

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
      <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-indigo/[0.04] blur-[120px] pointer-events-none" />
    </div>
  );
}
