import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { SceneMode } from "../types/scene";
import { useAppStore } from "../store/appStore";

const waypoints: Record<SceneMode, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
  organ: {
    pos: new THREE.Vector3(0, 1.4, 6.2),
    target: new THREE.Vector3(0, 0, 0),
  },
  lobule: {
    pos: new THREE.Vector3(0, 1.0, 4.2),
    target: new THREE.Vector3(0, 0, 0),
  },
  hepatocyte: {
    pos: new THREE.Vector3(0, 0.6, 2.6),
    target: new THREE.Vector3(0, 0, 0),
  },
  pathway: {
    pos: new THREE.Vector3(0.8, 0.4, 2.0),
    target: new THREE.Vector3(0, 0, 0),
  },
};

export function CameraRig() {
  const { camera } = useThree();
  const sceneMode = useAppStore((s) => s.sceneMode);
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, dt) => {
    const wp = waypoints[sceneMode];
    const lerpK = 1 - Math.pow(0.001, dt);
    camera.position.lerp(wp.pos, lerpK);
    lookTarget.current.lerp(wp.target, lerpK);
    camera.lookAt(lookTarget.current);
  });

  return null;
}
