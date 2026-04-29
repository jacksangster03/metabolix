import { create } from "zustand";
import type { MetabolicState } from "../types/metabolism";
import type { SceneMode } from "../types/scene";
import { presets } from "../sim/presets";

interface AppStore {
  sceneMode: SceneMode;
  setSceneMode: (mode: SceneMode) => void;

  metabolicState: MetabolicState;
  setMetabolicState: (state: MetabolicState) => void;
  patchMetabolicState: (patch: Partial<MetabolicState>) => void;
  applyPreset: (preset: keyof typeof presets) => void;

  hoveredNode: string | null;
  setHoveredNode: (id: string | null) => void;

  selectedNode: string | null;
  setSelectedNode: (id: string | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  sceneMode: "organ",
  setSceneMode: (sceneMode) => set({ sceneMode }),

  metabolicState: presets.fed,
  setMetabolicState: (metabolicState) => set({ metabolicState }),
  patchMetabolicState: (patch) =>
    set((s) => ({ metabolicState: { ...s.metabolicState, ...patch } })),
  applyPreset: (preset) => set({ metabolicState: presets[preset] }),

  hoveredNode: null,
  setHoveredNode: (hoveredNode) => set({ hoveredNode }),

  selectedNode: null,
  setSelectedNode: (selectedNode) => set({ selectedNode }),
}));
