import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/appStore";
import { computePathwayStatus } from "../../sim/rulesEngine";
import { PathwayPanel } from "./PathwayPanel";
import pathway from "../../content/pathways/fatty-acid-synthesis.json";

export function PathwayOverlay() {
  const sceneMode = useAppStore((s) => s.sceneMode);
  const metabolicState = useAppStore((s) => s.metabolicState);
  const { status } = computePathwayStatus(metabolicState);

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
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-accent-cyan/80">
                  Module 01 · {pathway.organ} · {pathway.cellType}
                </div>
                <h2 className="text-lg font-semibold mt-0.5">
                  {pathway.title}
                </h2>
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
            <PathwayPanel status={status} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
