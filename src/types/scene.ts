export type SceneMode = "organ" | "lobule" | "hepatocyte" | "pathway";

export interface CameraWaypoint {
  position: [number, number, number];
  target: [number, number, number];
}
