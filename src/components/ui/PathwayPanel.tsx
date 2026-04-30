import { motion } from "framer-motion";
import type {
  ActivityStatus,
  PathwayId,
  PathwayStatus,
} from "../../types/metabolism";

interface NodeDef {
  id: keyof PathwayStatus | "input" | "output";
  label: string;
  sub?: string;
  status?: ActivityStatus;
  col: number;
  row: number;
}

interface Edge {
  from: string;
  to: string;
  inhibition?: boolean;
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

function buildLayout(
  status: PathwayStatus,
  id: PathwayId
): { nodes: NodeDef[]; edges: Edge[] } {
  switch (id) {
    case "fatty-acid-synthesis":
      return {
        nodes: [
          { id: "input", label: "Glucose", sub: "Cytosol", col: 0, row: 0 },
          {
            id: "glycolysis",
            label: "Glycolysis",
            sub: "Glucose → Pyruvate",
            status: status.glycolysis,
            col: 1,
            row: 0,
          },
          {
            id: "pdh",
            label: "PDH",
            sub: "Pyruvate → Acetyl-CoA",
            status: status.pdh,
            col: 2,
            row: 0,
          },
          {
            id: "tca",
            label: "TCA → Citrate",
            sub: "Citrate synthase",
            status: status.tca,
            col: 3,
            row: 0,
          },
          {
            id: "citrateExport",
            label: "Citrate export",
            sub: "Mito → Cytosol",
            status: status.citrateExport,
            col: 4,
            row: 0,
          },
          {
            id: "acc",
            label: "ACC",
            sub: "Acetyl-CoA → Malonyl-CoA",
            status: status.acc,
            col: 5,
            row: 0,
          },
          {
            id: "fattyAcidSynthesis",
            label: "FAS",
            sub: "Malonyl-CoA → Palmitate",
            status: status.fattyAcidSynthesis,
            col: 6,
            row: 0,
          },
          {
            id: "output",
            label: "Palmitate",
            sub: "Stored / VLDL",
            col: 7,
            row: 0,
          },
          {
            id: "cpt1",
            label: "CPT-I",
            sub: "Inhibited by Malonyl-CoA",
            status: status.cpt1,
            col: 5,
            row: 1,
          },
          {
            id: "betaOxidation",
            label: "β-Oxidation",
            sub: "Mitochondrial matrix",
            status: status.betaOxidation,
            col: 6,
            row: 1,
          },
        ],
        edges: [
          { from: "input", to: "glycolysis" },
          { from: "glycolysis", to: "pdh" },
          { from: "pdh", to: "tca" },
          { from: "tca", to: "citrateExport" },
          { from: "citrateExport", to: "acc" },
          { from: "acc", to: "fattyAcidSynthesis" },
          { from: "fattyAcidSynthesis", to: "output" },
          { from: "acc", to: "cpt1", inhibition: true },
          { from: "cpt1", to: "betaOxidation" },
        ],
      };

    case "gluconeogenesis":
      return {
        nodes: [
          {
            id: "input",
            label: "Pyruvate / Lactate",
            sub: "Gluconeogenic substrates",
            col: 0,
            row: 0,
          },
          {
            id: "pyruvateCarboxylase",
            label: "Pyruvate Carboxylase",
            sub: "Pyruvate → OAA (matrix)",
            status: status.pyruvateCarboxylase,
            col: 1,
            row: 0,
          },
          {
            id: "pepck",
            label: "PEPCK",
            sub: "OAA → PEP (cytosol)",
            status: status.pepck,
            col: 2,
            row: 0,
          },
          {
            id: "fructose16Bisphosphatase",
            label: "FBPase-1",
            sub: "F-1,6-BP → F-6-P",
            status: status.fructose16Bisphosphatase,
            col: 3,
            row: 0,
          },
          {
            id: "glucose6Phosphatase",
            label: "G6Pase",
            sub: "G-6-P → Glucose (ER)",
            status: status.glucose6Phosphatase,
            col: 4,
            row: 0,
          },
          {
            id: "output",
            label: "Glucose",
            sub: "Portal vein export",
            col: 5,
            row: 0,
          },
        ],
        edges: [
          { from: "input", to: "pyruvateCarboxylase" },
          { from: "pyruvateCarboxylase", to: "pepck" },
          { from: "pepck", to: "fructose16Bisphosphatase" },
          { from: "fructose16Bisphosphatase", to: "glucose6Phosphatase" },
          { from: "glucose6Phosphatase", to: "output" },
        ],
      };

    case "glycogenolysis":
      return {
        nodes: [
          {
            id: "input",
            label: "Glycogen",
            sub: "Hepatic stores",
            col: 0,
            row: 0,
          },
          {
            id: "glycogenPhosphorylase",
            label: "Glycogen Phosphorylase",
            sub: "Glucagon → PKA → GPa",
            status: status.glycogenPhosphorylase,
            col: 1,
            row: 0,
          },
          {
            id: "glycogenolysis",
            label: "Debranching + PGM",
            sub: "G-1-P → G-6-P",
            status: status.glycogenolysis,
            col: 2,
            row: 0,
          },
          {
            id: "glucose6Phosphatase",
            label: "G6Pase",
            sub: "G-6-P → Glucose (ER)",
            status: status.glucose6Phosphatase,
            col: 3,
            row: 0,
          },
          {
            id: "output",
            label: "Glucose",
            sub: "Portal vein export",
            col: 4,
            row: 0,
          },
        ],
        edges: [
          { from: "input", to: "glycogenPhosphorylase" },
          { from: "glycogenPhosphorylase", to: "glycogenolysis" },
          { from: "glycogenolysis", to: "glucose6Phosphatase" },
          { from: "glucose6Phosphatase", to: "output" },
        ],
      };

    case "beta-oxidation":
      return {
        nodes: [
          {
            id: "input",
            label: "Long-chain FA",
            sub: "Plasma NEFA",
            col: 0,
            row: 0,
          },
          {
            id: "cpt1",
            label: "CPT-I",
            sub: "Outer mito membrane",
            status: status.cpt1,
            col: 1,
            row: 0,
          },
          {
            id: "betaOxidation",
            label: "β-Oxidation Spiral",
            sub: "4-enzyme cycle × n turns",
            status: status.betaOxidation,
            col: 2,
            row: 0,
          },
          {
            id: "output",
            label: "Acetyl-CoA",
            sub: "+ FADH2 + NADH per turn",
            col: 3,
            row: 0,
          },
        ],
        edges: [
          { from: "input", to: "cpt1" },
          { from: "cpt1", to: "betaOxidation" },
          { from: "betaOxidation", to: "output" },
        ],
      };

    case "ketogenesis":
      return {
        nodes: [
          {
            id: "input",
            label: "Acetyl-CoA",
            sub: "From β-oxidation",
            col: 0,
            row: 0,
          },
          {
            id: "hmgCoaSynthase",
            label: "HMGCS2",
            sub: "Rate-limiting step",
            status: status.hmgCoaSynthase,
            col: 1,
            row: 0,
          },
          {
            id: "ketogenesis",
            label: "HMG-CoA Lyase / BHBD",
            sub: "Acetoacetate → β-OHB",
            status: status.ketogenesis,
            col: 2,
            row: 0,
          },
          {
            id: "output",
            label: "Ketone Bodies",
            sub: "β-OHB + Acetoacetate",
            col: 3,
            row: 0,
          },
        ],
        edges: [
          { from: "input", to: "hmgCoaSynthase" },
          { from: "hmgCoaSynthase", to: "ketogenesis" },
          { from: "ketogenesis", to: "output" },
        ],
      };
  }
}

export function PathwayPanel({
  status,
  currentPathway,
}: {
  status: PathwayStatus;
  currentPathway: PathwayId;
}) {
  const { nodes, edges } = buildLayout(status, currentPathway);

  const colW = 150;
  const rowH = 110;
  const maxCol = Math.max(...nodes.map((n) => n.col));
  const maxRow = Math.max(...nodes.map((n) => n.row));
  const width = (maxCol + 1) * colW;
  const height = (maxRow + 1) * rowH + 60;
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
                strokeWidth={1.5}
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
