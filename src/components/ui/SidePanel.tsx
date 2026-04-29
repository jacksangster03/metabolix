import { StateControls } from "./StateControls";
import { ExplanationPanel } from "./ExplanationPanel";
import type { ExplanationStep } from "../../types/metabolism";

export function SidePanel({ explanation }: { explanation: ExplanationStep[] }) {
  return (
    <aside className="glass rounded-2xl p-5 w-[340px] shrink-0 flex flex-col gap-5 max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-accent-cyan/80">
          Control deck
        </div>
        <h2 className="text-lg font-semibold mt-0.5">Metabolic state</h2>
      </div>
      <StateControls />
      <div className="h-px bg-white/5" />
      <ExplanationPanel steps={explanation} />
    </aside>
  );
}
