import { motion } from "framer-motion";
import type { ActivityStatus, PathwayStatus } from "../../types/metabolism";

interface NodeDef {
  id: keyof PathwayStatus | "input" | "output";
  label: string;
  sub?: string;
  status?: ActivityStatus;
  col: number;
  row: number;
}

const statusColor = (s: ActivityStatus | undefined): string => {
  switch (s) {
    case "active":
    case "high":
    case "elevated":
      return "from-accent-green/30 to-accent-green/10 border-accent-green/50 text-accent-green";
    case "suppressed":
    case "inhibited":
    case "inactive":
    case "limited":
    case "low":
      return "from-accent-rose/25 to-accent-rose/5 border-accent-rose/40 text-accent-rose";
    default:
      return "from-white/10 to-white/[0.02] border-white/15 text-white/70";
  }
};

const statusLabel = (s: ActivityStatus | undefined): string => {
  if (!s) return "BASELINE";
  return s.toUpperCase();
};

interface Edge {
  from: string;
  to: string;
  inhibition?: boolean;
}

export function PathwayPanel({ status }: { status: PathwayStatus }) {
  const nodes: NodeDef[] = [
    { id: "input", label: "Glucose", sub: "Cytosol", col: 0, row: 0 },
    { id: "glycolysis", label: "Glycolysis", sub: "Glucose → Pyruvate", status: status.glycolysis, col: 1, row: 0 },
    { id: "pdh", label: "PDH", sub: "Pyruvate → Acetyl-CoA", status: status.pdh, col: 2, row: 0 },
    { id: "tca", label: "TCA → Citrate", sub: "Citrate synthase", status: status.tca, col: 3, row: 0 },
    { id: "citrateExport", label: "Citrate export", sub: "Mito → Cytosol", status: status.citrateExport, col: 4, row: 0 },
    { id: "acc", label: "ACC", sub: "Acetyl-CoA → Malonyl-CoA", status: status.acc, col: 5, row: 0 },
    { id: "fattyAcidSynthesis", label: "FAS", sub: "Malonyl-CoA → Palmitate", status: status.fattyAcidSynthesis, col: 6, row: 0 },
    { id: "output", label: "Palmitate", sub: "Stored / VLDL", col: 7, row: 0 },
    { id: "cpt1", label: "CPT-I", sub: "Inhibited by Malonyl-CoA", status: status.cpt1, col: 5, row: 1 },
    { id: "betaOxidation", label: "β-oxidation", sub: "Mitochondrial matrix", status: status.betaOxidation, col: 6, row: 1 },
  ];

  const edges: Edge[] = [
    { from: "input", to: "glycolysis" },
    { from: "glycolysis", to: "pdh" },
    { from: "pdh", to: "tca" },
    { from: "tca", to: "citrateExport" },
    { from: "citrateExport", to: "acc" },
    { from: "acc", to: "fattyAcidSynthesis" },
    { from: "fattyAcidSynthesis", to: "output" },
    { from: "acc", to: "cpt1", inhibition: true },
    { from: "cpt1", to: "betaOxidation" },
  ];

  const colW = 150;
  const rowH = 110;
  const width = 8 * colW;
  const height = 2 * rowH + 60;
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const cx = (n: NodeDef) => n.col * colW + 60;
  const cy = (n: NodeDef) => n.row * rowH + 60;

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        width={width}
        height={height}
        className="block min-w-full"
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.5)" />
          </marker>
          <marker
            id="inhibit"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <line
              x1="8"
              y1="0"
              x2="8"
              y2="10"
              stroke="#fb7185"
              strokeWidth="2"
            />
          </marker>
        </defs>

        {edges.map((e, i) => {
          const a = nodeMap[e.from];
          const b = nodeMap[e.to];
          if (!a || !b) return null;
          const x1 = cx(a) + 56;
          const y1 = cy(a);
          const x2 = cx(b) - 56;
          const y2 = cy(b);
          const isInhibit = e.inhibition;
          return (
            <g key={i}>
              <path
                d={`M ${x1} ${y1} C ${x1 + 30} ${y1}, ${x2 - 30} ${y2}, ${x2} ${y2}`}
                stroke={isInhibit ? "#fb7185" : "rgba(95,227,255,0.45)"}
                strokeWidth={isInhibit ? 1.5 : 1.5}
                strokeDasharray={isInhibit ? "4 4" : "0"}
                fill="none"
                markerEnd={isInhibit ? "url(#inhibit)" : "url(#arrow)"}
              />
            </g>
          );
        })}

        {nodes.map((n) => (
          <foreignObject
            key={n.id}
            x={cx(n) - 64}
            y={cy(n) - 32}
            width={128}
            height={64}
          >
            <motion.div
              layout
              initial={false}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className={`w-full h-full rounded-lg border bg-gradient-to-br ${statusColor(
                n.status
              )} px-2 py-1.5 flex flex-col justify-center`}
            >
              <div className="text-[11px] font-semibold leading-tight">
                {n.label}
              </div>
              <div className="text-[9px] opacity-70 leading-tight">{n.sub}</div>
              {n.status && (
                <div className="mt-0.5 text-[8px] uppercase tracking-widest opacity-80">
                  {statusLabel(n.status)}
                </div>
              )}
            </motion.div>
          </foreignObject>
        ))}
      </svg>
    </div>
  );
}
