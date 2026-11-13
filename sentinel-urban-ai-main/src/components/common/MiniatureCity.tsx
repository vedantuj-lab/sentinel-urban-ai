import { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, MeshDistortMaterial, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Loader2, Layers, Image as ImageIcon, Box } from "lucide-react";
import { useIsClient } from "@/hooks/use-is-client";

function Building({
  position,
  scale,
  color,
  delay,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  delay: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime() + delay;
    mesh.current.position.y = position[1] + Math.sin(t * 0.5) * 0.08;
  });

  return (
    <mesh position={position} ref={mesh}>
      <boxGeometry args={scale} />
      <meshStandardMaterial color={color} roughness={0.15} metalness={0.85} />
    </mesh>
  );
}

interface BuildingData {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  delay: number;
}

function City() {
  const buildings = useMemo(() => {
    const temp: BuildingData[] = [];
    const colors = ["#7C3AED", "#DB2777", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];
    for (let i = 0; i < 45; i++) {
      const x = (Math.random() - 0.5) * 11;
      const z = (Math.random() - 0.5) * 11;
      const h = 1.2 + Math.random() * 4.5;
      const w = 0.5 + Math.random() * 0.6;
      const color = colors[Math.floor(Math.random() * colors.length)];
      temp.push({
        position: [x, h / 2, z] as [number, number, number],
        scale: [w, h, w] as [number, number, number],
        color,
        delay: Math.random() * 10,
      });
    }
    return temp;
  }, []);

  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.getElapsedTime() * 0.08;
  });

  return (
    <group ref={group}>
      {buildings.map((b, i) => (
        <Building key={i} {...b} />
      ))}

      <Float speed={2.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[0, 6.5, 0]}>
          <sphereGeometry args={[0.9, 32, 32]} />
          <MeshDistortMaterial
            color="#DB2777"
            emissive="#7C3AED"
            emissiveIntensity={0.5}
            speed={3}
            distort={0.4}
            radius={1}
          />
        </mesh>
      </Float>

      <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={20} blur={2} far={5} />
      <OrbitControls makeDefault enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </group>
  );
}

export function MiniatureCity() {
  const isClient = useIsClient();
  const [viewMode, setViewMode] = useState<"aerial" | "3d">("aerial");

  return (
    <div className="w-full h-full min-h-[420px] relative rounded-[3rem] overflow-hidden group border border-white/20 shadow-2xl bg-slate-950">
      {/* View Mode Toggle Button */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-white/20 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setViewMode("aerial")}
          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
            viewMode === "aerial"
              ? "bg-[#7C3AED] text-white shadow-lg"
              : "text-white/60 hover:text-white"
          }`}
        >
          <ImageIcon className="h-3 w-3" /> Realistic
        </button>
        <button
          type="button"
          onClick={() => setViewMode("3d")}
          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
            viewMode === "3d"
              ? "bg-[#7C3AED] text-white shadow-lg"
              : "text-white/60 hover:text-white"
          }`}
        >
          <Box className="h-3 w-3" /> 3D City
        </button>
      </div>

      {viewMode === "aerial" ? (
        <>
          {/* High-Resolution Realistic Aerial Smart City Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=2000')",
            }}
          />

          {/* Atmospheric Dark Translucent Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(219,39,119,0.25),transparent_60%)]" />
          <div className="absolute inset-0 grid-overlay opacity-15 pointer-events-none" />

          {/* Live Radar Hotspot Scanning Animation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="h-56 w-56 rounded-full border border-rose-500/40 animate-ping opacity-30" />
            <div className="h-36 w-32 rounded-full border border-[#7C3AED]/50 animate-pulse opacity-40 absolute top-10 left-12" />
            <div className="h-4 w-4 rounded-full bg-rose-500 shadow-[0_0_20px_#f43f5e] absolute top-24 left-24 animate-pulse" />
          </div>

          {/* Scanning Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent animate-sweep opacity-70 pointer-events-none" />
        </>
      ) : (
        /* 3D City Fiber Canvas */
        <div className="w-full h-full min-h-[420px] relative">
          {!isClient ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-950">
              <Loader2 className="h-8 w-8 text-[#7C3AED] animate-spin" />
            </div>
          ) : (
            <Canvas camera={{ position: [11, 11, 11], fov: 36 }}>
              <Suspense
                fallback={
                  <Html center>
                    <Loader2 className="h-8 w-8 text-[#7C3AED] animate-spin" />
                  </Html>
                }
              >
                <ambientLight intensity={0.8} />
                <directionalLight position={[12, 15, 10]} intensity={1.8} castShadow />
                <pointLight position={[-10, 15, -10]} intensity={1.2} color="#7C3AED" />
                <pointLight position={[10, -5, 10]} intensity={1} color="#DB2777" />
                <City />
              </Suspense>
            </Canvas>
          )}
        </div>
      )}
    </div>
  );
}
