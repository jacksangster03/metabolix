import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Stylised liver placeholder. Two lobes built from scaled spheres
 * with subtle fresnel-like emissive material. Replace with a GLB later.
 */
export function LiverModel({ visible = true }: { visible?: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (group.current && visible) {
      group.current.rotation.y += dt * 0.05;
    }
  });

  if (!visible) return null;

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Right lobe (larger) */}
      <mesh position={[-0.3, 0, 0]} scale={[1.6, 0.95, 1.0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#7a1f24"
          roughness={0.55}
          metalness={0.1}
          emissive="#3a0a10"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Left lobe */}
      <mesh position={[0.95, 0.05, 0.1]} scale={[0.85, 0.7, 0.8]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          color="#8a242a"
          roughness={0.55}
          metalness={0.1}
          emissive="#3a0a10"
          emissiveIntensity={0.35}
        />
      </mesh>
      {/* Falciform ligament hint */}
      <mesh position={[0.4, 0.5, 0.2]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.03, 0.6, 0.6]} />
        <meshStandardMaterial color="#dcd0b0" opacity={0.5} transparent />
      </mesh>
      {/* Soft glow */}
      <mesh scale={[2.6, 1.7, 1.7]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#5fe3ff" transparent opacity={0.04} />
      </mesh>
    </group>
  );
}
