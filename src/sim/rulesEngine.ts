import type {
  ExplanationStep,
  MetabolicState,
  PathwayStatus,
} from "../types/metabolism";

/**
 * Pure rules engine: maps a MetabolicState to PathwayStatus and a causal explanation.
 * No React, no DOM. Add rules here as more pathways are introduced.
 */
export function computePathwayStatus(state: MetabolicState): {
  status: PathwayStatus;
  explanation: ExplanationStep[];
} {
  const explanation: ExplanationStep[] = [];

  const status: PathwayStatus = {
    // Fatty acid synthesis
    glycolysis: "baseline",
    pdh: "baseline",
    tca: "baseline",
    citrateExport: "baseline",
    acc: "baseline",
    fattyAcidSynthesis: "baseline",
    cpt1: "baseline",
    betaOxidation: "baseline",
    // Gluconeogenesis
    gluconeogenesis: "baseline",
    pyruvateCarboxylase: "baseline",
    pepck: "baseline",
    fructose16Bisphosphatase: "baseline",
    glucose6Phosphatase: "baseline",
    // Glycogenolysis
    glycogenolysis: "baseline",
    glycogenPhosphorylase: "baseline",
    // Ketogenesis
    ketogenesis: "baseline",
    hmgCoaSynthase: "baseline",
  };

  // --- Fed-state / insulin: activate lipogenesis, suppress fasting pathways ---
  if (state.insulin === "high" || state.feedingState === "fed") {
    status.glycolysis = "active";
    status.pdh = "active";
    // Suppress fasting pathways
    status.gluconeogenesis = "suppressed";
    status.pepck = "inactive";
    status.fructose16Bisphosphatase = "suppressed";
    status.glucose6Phosphatase = "low";
    status.glycogenolysis = "suppressed";
    status.glycogenPhosphorylase = "inactive";
    status.ketogenesis = "suppressed";
    status.hmgCoaSynthase = "inactive";
    explanation.push({
      cause: "Insulin is high in the fed state",
      effect:
        "Glycolysis and PDH are activated. Akt phosphorylates FOXO1, excluding it from the nucleus and repressing PEPCK and G6Pase gene expression. Fructose-2,6-bisphosphate rises, blocking FBPase-1. PP1 activation dephosphorylates and inactivates glycogen phosphorylase. Gluconeogenesis, glycogenolysis, and ketogenesis are suppressed.",
    });
  }

  // --- Fasted state / glucagon: suppress lipogenesis, activate glucose-producing and oxidative pathways ---
  if (state.glucagon === "high" || state.feedingState === "fasted") {
    status.glycolysis = "suppressed";
    status.fattyAcidSynthesis = "suppressed";
    status.acc = "inactive";
    // Activate gluconeogenesis
    status.gluconeogenesis = "active";
    status.pyruvateCarboxylase = "active";
    status.pepck = "active";
    status.fructose16Bisphosphatase = "active";
    status.glucose6Phosphatase = "active";
    // Activate glycogenolysis
    status.glycogenolysis = "active";
    status.glycogenPhosphorylase = "active";
    explanation.push({
      cause: "Glucagon is high in the fasted state",
      effect:
        "cAMP rises via adenylyl cyclase. PKA induces PEPCK gene expression (via CREB) and lowers fructose-2,6-bisphosphate (via FBPase-2 domain activation), relieving FBPase-1 inhibition and activating gluconeogenesis. PKA also activates phosphorylase kinase, which phosphorylates glycogen phosphorylase b to the active a form, driving glycogenolysis. ACC is phosphorylated and inactivated, blocking fatty acid synthesis.",
    });
  }

  // --- High ATP: citrate accumulation, slows TCA ---
  if (state.atp === "high") {
    status.citrateExport = "high";
    status.tca = "limited";
    explanation.push({
      cause: "ATP is high",
      effect:
        "Isocitrate dehydrogenase is inhibited, slowing the TCA and allowing citrate to accumulate and exit the mitochondrion",
    });
  }

  // --- High citrate: activates ACC (only if not in fasted/glucagon state) ---
  if (state.citrate === "high" && state.glucagon !== "high") {
    status.acc = "active";
    status.fattyAcidSynthesis = "active";
    explanation.push({
      cause: "Cytosolic citrate is elevated",
      effect:
        "Acetyl-CoA carboxylase (ACC) is allosterically activated, raising malonyl-CoA and driving fatty acid synthesis",
    });
  }

  // --- Active FA synthesis: malonyl-CoA blocks CPT-I ---
  if (status.fattyAcidSynthesis === "active") {
    status.cpt1 = "inhibited";
    status.betaOxidation = "suppressed";
    explanation.push({
      cause: "Malonyl-CoA produced by active ACC",
      effect:
        "CPT-I is inhibited, blocking long-chain fatty acyl-CoA entry into mitochondria and suppressing beta-oxidation",
    });
  }

  // --- High AMP (low energy charge): AMPK activates beta-oxidation ---
  if (state.amp === "high") {
    status.acc = "inactive";
    status.fattyAcidSynthesis = "suppressed";
    status.betaOxidation = "active";
    status.cpt1 = "active";
    explanation.push({
      cause: "AMP is high (low energy charge)",
      effect:
        "AMPK is activated: ACC is phosphorylated on Ser79/Ser221 and inactivated. Malonyl-CoA falls, CPT-I is de-repressed, and beta-oxidation is favoured. AMPK also promotes glucose uptake and inhibits anabolic pathways.",
    });
  }

  // --- Low oxygen: limits oxidative metabolism ---
  if (state.oxygen === "low") {
    status.tca = "limited";
    status.betaOxidation = "suppressed";
    status.pdh = "suppressed";
    explanation.push({
      cause: "Oxygen is low",
      effect:
        "Electron transport chain is limited; pyruvate is shunted to lactate, TCA and beta-oxidation slow down",
    });
  }

  // --- Ketogenesis: requires active beta-oxidation and a fasting or energy-depleted state.
  //     Mechanistic basis: active beta-oxidation raises acetyl-CoA; concurrent gluconeogenesis
  //     depletes OAA, preventing acetyl-CoA from entering the TCA via citrate synthase.
  //     HMGCS2 is relieved of succinyl-CoA inhibition as TCA flux falls. ---
  if (
    status.betaOxidation === "active" &&
    (state.feedingState === "fasted" || state.atp === "low")
  ) {
    status.ketogenesis = "active";
    status.hmgCoaSynthase = "active";
    explanation.push({
      cause:
        "Beta-oxidation is active and OAA is depleted by concurrent gluconeogenesis",
      effect:
        "Acetyl-CoA accumulates because citrate synthase cannot run without OAA. HMGCS2 (rate-limiting, mitochondrial) is relieved of succinyl-CoA inhibition as TCA flux falls. HMG-CoA lyase releases acetoacetate; beta-hydroxybutyrate dehydrogenase reduces it to beta-hydroxybutyrate (driven by high NADH from beta-oxidation). Ketone bodies are exported as fuel for brain, heart, and renal cortex.",
    });
  }

  return { status, explanation };
}

export function summariseExplanation(steps: ExplanationStep[]): string {
  if (steps.length === 0) {
    return "All pathway nodes are at baseline. Adjust the metabolic state to drive flux.";
  }
  return steps.map((s) => `${s.cause} → ${s.effect}.`).join(" ");
}
