import { useAppStore } from "../../store/appStore";
import type { SceneMode } from "../../types/scene";

const modes: { id: SceneMode; label: string; sub: string }[] = [
  { id: "organ", label: "Organ", sub: "Liver" },
  { id: "lobule", label: "Lobule", sub: "Hepatic lobule" },
  { id: "hepatocyte", label: "Cell", sub: "Hepatocyte" },
  { id: "pathway", label: "Pathway", sub: "Lipogenesis" },
];

export function SceneLadder() {
  const sceneMode = useAppStore((s) => s.sceneMode);
  const setSceneMode = useAppStore((s) => s.setSceneMode);

  return (
    <div className="glass rounded-xl px-3 py-2 flex items-center gap-1">
      {modes.map((m, i) => {
        const active = sceneMode === m.id;
        return (
          <div key={m.id} className="flex items-center">
            <button
              onClick={() => setSceneMode(m.id)}
              className={`px-3 py-1.5 rounded-lg text-left transition-all ${
                active
                  ? "bg-accent-cyan/15 text-accent-cyan shadow-glow"
                  : "text-white/55 hover:text-white/85"
              }`}
            >
              <div className="text-[10px] uppercase tracking-[0.18em] opacity-70">
                0{i + 1}
              </div>
              <div className="text-sm font-medium leading-tight">{m.label}</div>
              <div className="text-[10px] opacity-60">{m.sub}</div>
            </button>
            {i < modes.length - 1 && (
              <div className="mx-1 h-px w-3 bg-white/10" />
            )}
          </div>
        );
      })}
    </div>
  );
}
