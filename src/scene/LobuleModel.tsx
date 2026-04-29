import { useMemo } from "react";
import * as THREE from "three";

/**
 * Stylised hepatic lobule: hexagonal prism with central vein and
 * portal-triad markers at six corners. Sinusoid lines radiate inward.
 */
export function LobuleModel({ visible = true }: { visible?: boolean }) {
  const corners = useMemo(() => {
    const r = 1.4;
    return new Array(6).fill(0).map((_, i) => {
      const a = (i / 6) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
    });
  }, []);

  if (!visible) return null;

  return (
    <group>
      {/* Hexagonal plate */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.06, 6]} />
        <meshStandardMaterial
          color="#1a2330"
          roughness={0.6}
          metalness={0.3}
          emissive="#0c2a35"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Central vein */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.12, 32]} />
        <meshStandardMaterial color="#5fe3ff" emissive="#5fe3ff" emissiveIntensity={0.6} />
      </mesh>
      {/* Portal triads at corners */}
      {corners.map((c, i) => (
        <group key={i} position={c}>
          <mesh>
            <sphereGeometry args={[0.07, 24, 24]} />
            <meshStandardMaterial
              color="#fb7185"
              emissive="#fb7185"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      ))}
      {/* Sinusoid lines */}
      {corners.map((c, i) => {
        const points = [c.clone(), new THREE.Vector3(0, 0, 0)];
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={`l-${i}`}>
            <primitive attach="geometry" object={geom} />
            <lineBasicMaterial color="#5fe3ff" transparent opacity={0.35} />
          </line>
        );
      })}
    </group>
  );
}
