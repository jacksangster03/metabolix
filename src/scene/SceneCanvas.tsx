import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Lighting } from "./Lighting";
import { CameraRig } from "./CameraRig";
import { LiverModel } from "./LiverModel";
import { LobuleModel } from "./LobuleModel";
import { HepatocyteModel } from "./HepatocyteModel";
import { Particles } from "./Particles";
import { useAppStore } from "../store/appStore";

export function SceneCanvas() {
  const sceneMode = useAppStore((s) => s.sceneMode);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.4, 6.2], fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#05080d"]} />
      <fog attach="fog" args={["#05080d", 8, 22]} />

      <Lighting />
      <Particles count={350} />

      <LiverModel visible={sceneMode === "organ"} />
      <LobuleModel visible={sceneMode === "lobule"} />
      <HepatocyteModel
        visible={sceneMode === "hepatocyte" || sceneMode === "pathway"}
      />

      <CameraRig />

      <OrbitControls
        enablePan={false}
        enableZoom={sceneMode !== "pathway"}
        minDistance={1.5}
        maxDistance={10}
        rotateSpeed={0.4}
        autoRotate={sceneMode === "organ"}
        autoRotateSpeed={0.4}
      />
    </Canvas>
  );
}
