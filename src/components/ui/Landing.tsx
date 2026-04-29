import { motion } from "framer-motion";
import { useAppStore } from "../../store/appStore";

export function Landing() {
  const sceneMode = useAppStore((s) => s.sceneMode);
  const setSceneMode = useAppStore((s) => s.setSceneMode);

  if (sceneMode !== "organ") return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 z-10 pointer-events-none flex items-end justify-center pb-16"
    >
      <div className="text-center max-w-xl pointer-events-auto">
        <div className="text-[11px] uppercase tracking-[0.4em] text-accent-cyan/80 mb-3">
          Spatial biochemistry simulator
        </div>
        <h1 className="text-4xl font-semibold leading-tight mb-3">
          Zoom from organ to <span className="text-accent-cyan">pathway</span>.
        </h1>
        <p className="text-white/60 text-sm leading-relaxed mb-6">
          A live, causal model of hepatic metabolism. Adjust hormones and energy
          state, see the lipogenesis-vs-oxidation switch flip in real time.
        </p>
        <button
          onClick={() => setSceneMode("lobule")}
          className="px-6 py-2.5 rounded-lg bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/40 hover:bg-accent-cyan/25 hover:shadow-glow transition-all text-sm font-medium"
        >
          Enter the liver →
        </button>
      </div>
    </motion.div>
  );
}
