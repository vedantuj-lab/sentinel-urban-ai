import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import { Loader2 } from "lucide-react";
import { useIsClient } from "@/hooks/use-is-client";

function Orb({ color, score }: { color: string; score: number }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.5;
  });

  const distort = 0.2 + (score / 100) * 0.4;
  const speed = 2 + (score / 100) * 4;

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          speed={speed}
          distort={distort}
          radius={1}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

export function RiskOrb({ score, level }: { score: number; level: string }) {
  const isClient = useIsClient();
  const color = level === "low" ? "#10b981" : level === "medium" ? "#f59e0b" : "#f43f5e";

  if (!isClient) {
    return (
      <div className="w-full h-full min-h-[120px] flex items-center justify-center">
        <Loader2 className="h-4 w-4 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[120px] relative">
      <Canvas camera={{ position: [0, 0, 4], fov: 40 }}>
        <Suspense
          fallback={
            <Html center>
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            </Html>
          }
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <Orb color={color} score={score} />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2.5} far={4.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
