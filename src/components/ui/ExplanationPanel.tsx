import { motion, AnimatePresence } from "framer-motion";
import type { ExplanationStep } from "../../types/metabolism";

export function ExplanationPanel({ steps }: { steps: ExplanationStep[] }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
        Why did this change?
      </div>
      {steps.length === 0 ? (
        <div className="text-sm text-white/50 italic">
          All pathway nodes are at baseline. Pick a preset or shift a hormone to
          drive flux through lipogenesis.
        </div>
      ) : (
        <ol className="space-y-2">
          <AnimatePresence initial={false}>
            {steps.map((s, i) => (
              <motion.li
                key={`${s.cause}-${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, delay: i * 0.04 }}
                className="text-sm text-white/80 leading-relaxed"
              >
                <span className="text-accent-cyan font-medium">{s.cause}</span>
                <span className="text-white/40"> → </span>
                <span>{s.effect}.</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      )}
    </div>
  );
}
