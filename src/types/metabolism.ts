export type FeedingState = "fed" | "fasted";
export type Level = "low" | "normal" | "high";
export type OxygenLevel = "low" | "normal";

export interface MetabolicState {
  feedingState: FeedingState;
  insulin: Level;
  glucagon: Level;
  atp: Level;
  amp: Level;
  citrate: Level;
  oxygen: OxygenLevel;
}

export type ActivityStatus =
  | "suppressed"
  | "inhibited"
  | "inactive"
  | "limited"
  | "low"
  | "baseline"
  | "elevated"
  | "high"
  | "active";

export interface PathwayStatus {
  // Fatty acid synthesis (v0.1)
  glycolysis: ActivityStatus;
  pdh: ActivityStatus;
  tca: ActivityStatus;
  citrateExport: ActivityStatus;
  acc: ActivityStatus;
  fattyAcidSynthesis: ActivityStatus;
  cpt1: ActivityStatus;
  betaOxidation: ActivityStatus;
  // Gluconeogenesis (v0.2)
  gluconeogenesis: ActivityStatus;
  pyruvateCarboxylase: ActivityStatus;
  pepck: ActivityStatus;
  fructose16Bisphosphatase: ActivityStatus;
  glucose6Phosphatase: ActivityStatus;
  // Glycogenolysis (v0.2)
  glycogenolysis: ActivityStatus;
  glycogenPhosphorylase: ActivityStatus;
  // Ketogenesis (v0.2)
  ketogenesis: ActivityStatus;
  hmgCoaSynthase: ActivityStatus;
}

export type PathwayId =
  | "fatty-acid-synthesis"
  | "gluconeogenesis"
  | "glycogenolysis"
  | "beta-oxidation"
  | "ketogenesis";

export interface Compartment {
  id: string;
  name: string;
  parent?: string;
}

export interface Metabolite {
  id: string;
  name: string;
  formula?: string;
  compartment: string;
}

export interface Enzyme {
  id: string;
  name: string;
  shortName?: string;
  ec?: string;
  compartment: string;
}

export interface Reaction {
  id: string;
  name: string;
  enzyme: string;
  substrates: string[];
  products: string[];
  compartment: string;
  reversible?: boolean;
  notes?: string;
}

export interface RegulationRule {
  id: string;
  trigger: string;
  effect: string;
  target: string;
  mechanism: string;
}

export interface PathwayDefinition {
  id: string;
  title: string;
  organ: string;
  tissue: string;
  cellType: string;
  compartments: Compartment[];
  metabolites: Metabolite[];
  enzymes: Enzyme[];
  reactions: Reaction[];
  regulationRules: RegulationRule[];
  teachingSequence: string[];
  clinicalLinks: string[];
  sourceNotes: string[];
}

export interface ExplanationStep {
  cause: string;
  effect: string;
}
