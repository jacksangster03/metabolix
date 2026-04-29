import { SceneLadder } from "./SceneLadder";

export function TopBar() {
  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-4 pointer-events-none">
      <div className="glass rounded-xl px-4 py-2 flex items-center gap-3 pointer-events-auto">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-accent-cyan to-accent-green/60 flex items-center justify-center text-bg-0 font-bold">
          M
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">Metabolix</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/45">
            Liver Metabolism Explorer
          </div>
        </div>
      </div>

      <div className="pointer-events-auto">
        <SceneLadder />
      </div>

      <div className="glass rounded-xl px-3 py-2 pointer-events-auto">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/45">
          Module 01
        </div>
        <div className="text-sm font-medium">Fed-state lipogenesis</div>
      </div>
    </header>
  );
}
