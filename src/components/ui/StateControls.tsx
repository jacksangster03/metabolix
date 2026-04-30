import { useAppStore } from "../../store/appStore";
import type { Level, MetabolicState, OxygenLevel } from "../../types/metabolism";

const presetButtons: {
  id: "fed" | "fasted" | "exercise" | "hypoxia" | "starvation";
  label: string;
}[] = [
  { id: "fed", label: "Fed" },
  { id: "fasted", label: "Fasted" },
  { id: "exercise", label: "Exercise" },
  { id: "hypoxia", label: "Hypoxia" },
  { id: "starvation", label: "Starvation" },
];

const levelKeys: { key: keyof MetabolicState; label: string; opts: (Level | OxygenLevel)[] }[] = [
  { key: "insulin", label: "Insulin", opts: ["low", "normal", "high"] },
  { key: "glucagon", label: "Glucagon", opts: ["low", "normal", "high"] },
  { key: "atp", label: "ATP", opts: ["low", "normal", "high"] },
  { key: "amp", label: "AMP", opts: ["low", "normal", "high"] },
  { key: "citrate", label: "Citrate", opts: ["low", "normal", "high"] },
  { key: "oxygen", label: "Oxygen", opts: ["low", "normal"] },
];

export function StateControls() {
  const state = useAppStore((s) => s.metabolicState);
  const patch = useAppStore((s) => s.patchMetabolicState);
  const applyPreset = useAppStore((s) => s.applyPreset);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
          Metabolic preset
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {presetButtons.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className="px-3 py-2 rounded-lg text-sm text-white/80 bg-white/5 hover:bg-accent-cyan/15 hover:text-accent-cyan border border-white/5 transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
          Hormones &amp; signals
        </div>
        <div className="space-y-2">
          {levelKeys.map(({ key, label, opts }) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-20 text-xs text-white/60">{label}</div>
              <div className="flex-1 grid grid-cols-3 gap-1">
                {opts.map((o) => {
                  const active = state[key] === o;
                  return (
                    <button
                      key={o}
                      onClick={() =>
                        patch({ [key]: o } as Partial<MetabolicState>)
                      }
                      className={`text-[11px] py-1 rounded-md uppercase tracking-wider transition-all ${
                        active
                          ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40"
                          : "bg-white/5 text-white/50 border border-white/5 hover:text-white/80"
                      }`}
                    >
                      {o}
                    </button>
                  );
                })}
                {opts.length === 2 && <div />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
