import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/appStore";
import { computePathwayStatus } from "../../sim/rulesEngine";
import { PathwayPanel } from "./PathwayPanel";
import type { PathwayId } from "../../types/metabolism";
import fasJson from "../../content/pathways/fatty-acid-synthesis.json";
import glucoJson from "../../content/pathways/gluconeogenesis.json";
import glycoJson from "../../content/pathways/glycogenolysis.json";
import betaJson from "../../content/pathways/beta-oxidation.json";
import ketoJson from "../../content/pathways/ketogenesis.json";

const PATHWAY_META: { id: PathwayId; label: string }[] = [
  { id: "fatty-acid-synthesis", label: "FA Synthesis" },
  { id: "gluconeogenesis", label: "Gluconeogenesis" },
  { id: "glycogenolysis", label: "Glycogenolysis" },
  { id: "beta-oxidation", label: "β-Oxidation" },
  { id: "ketogenesis", label: "Ketogenesis" },
];

const PATHWAY_DEFS: Record<PathwayId, { organ: string; cellType: string; title: string }> = {
  "fatty-acid-synthesis": fasJson,
  gluconeogenesis: glucoJson,
  glycogenolysis: glycoJson,
  "beta-oxidation": betaJson,
  ketogenesis: ketoJson,
};

export function PathwayOverlay() {
  const sceneMode = useAppStore((s) => s.sceneMode);
  const metabolicState = useAppStore((s) => s.metabolicState);
  const currentPathway = useAppStore((s) => s.currentPathway);
  const setCurrentPathway = useAppStore((s) => s.setCurrentPathway);
  const { status } = computePathwayStatus(metabolicState);
  const def = PATHWAY_DEFS[currentPathway];

  return (
    <AnimatePresence>
      {sceneMode === "pathway" && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3 }}
          className="absolute left-4 right-4 bottom-4 z-20"
        >
          <div className="glass rounded-2xl p-5">
            {/* Pathway switcher */}
            <div className="flex gap-1 mb-4 overflow-x-auto pb-0.5">
              {PATHWAY_META.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentPathway(p.id)}
                  className={`px-3 py-1.5 rounded-md text-[11px] whitespace-nowrap border transition-all ${
                    currentPathway === p.id
                      ? "bg-accent-cyan/20 text-accent-cyan border-accent-cyan/40"
                      : "bg-white/5 text-white/50 border-white/5 hover:text-white/70 hover:bg-white/8"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Pathway header */}
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-accent-cyan/80">
                  {def.organ} · {def.cellType}
                </div>
                <h2 className="text-lg font-semibold mt-0.5">{def.title}</h2>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-white/55">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-green" />
                  active
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-rose" />
                  suppressed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white/40" />
                  baseline
                </span>
              </div>
            </div>

            <PathwayPanel status={status} currentPathway={currentPathway} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
