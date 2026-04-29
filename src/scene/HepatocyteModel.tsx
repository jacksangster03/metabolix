import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useAppStore } from "../store/appStore";

/**
 * Stylised hepatocyte: translucent cell with mitochondria capsules,
 * a cytosol marker and a clickable nucleus. Mitochondria gently bob.
 */
export function HepatocyteModel({ visible = true }: { visible?: boolean }) {
  const mitos = useRef<THREE.Group>(null);
  const setSceneMode = useAppStore((s) => s.setSceneMode);

  useFrame((state) => {
    if (!mitos.current) return;
    const t = state.clock.getElapsedTime();
    mitos.current.children.forEach((c, i) => {
      c.position.y = Math.sin(t * 0.8 + i) * 0.05 + (c.userData.baseY ?? 0);
    });
  });

  if (!visible) return null;

  return (
    <group>
      {/* Cell membrane */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="#0e2030"
          transparent
          opacity={0.18}
          roughness={0.2}
          metalness={0.4}
          emissive="#0e2030"
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Cytosol haze */}
      <mesh>
        <sphereGeometry args={[1.45, 32, 32]} />
        <meshBasicMaterial color="#5fe3ff" transparent opacity={0.04} />
      </mesh>
      {/* Nucleus */}
      <mesh position={[0.3, 0.1, 0.2]}>
        <sphereGeometry args={[0.42, 48, 48]} />
        <meshStandardMaterial
          color="#1c3550"
          emissive="#5fe3ff"
          emissiveIntensity={0.25}
          roughness={0.4}
        />
      </mesh>
      {/* Mitochondria */}
      <group ref={mitos}>
        {[
          [-0.6, -0.2, 0.4],
          [0.4, -0.4, -0.5],
          [-0.2, 0.5, -0.4],
          [0.7, 0.3, 0.3],
          [-0.7, 0.0, -0.2],
        ].map(([x, y, z], i) => (
          <group
            key={i}
            position={[x, y, z]}
            userData={{ baseY: y }}
            onClick={(e) => {
              e.stopPropagation();
              setSceneMode("pathway");
            }}
          >
            <mesh rotation={[0.2 * i, 0.5 * i, 0]}>
              <capsuleGeometry args={[0.08, 0.18, 8, 16]} />
              <meshStandardMaterial
                color="#4ade80"
                emissive="#4ade80"
                emissiveIntensity={0.4}
                roughness={0.5}
              />
            </mesh>
          </group>
        ))}
      </group>
      {/* Floating label */}
      <Html position={[0, 1.7, 0]} center>
        <div className="text-[10px] uppercase tracking-[0.2em] text-accent-cyan/70 font-medium pointer-events-none">
          Hepatocyte · click a mitochondrion
        </div>
      </Html>
    </group>
  );
}
