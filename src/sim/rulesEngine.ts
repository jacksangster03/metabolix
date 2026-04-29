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

  // Defaults
  const status: PathwayStatus = {
    glycolysis: "baseline",
    pdh: "baseline",
    tca: "baseline",
    citrateExport: "baseline",
    acc: "baseline",
    fattyAcidSynthesis: "baseline",
    cpt1: "baseline",
    betaOxidation: "baseline",
  };

  // Insulin / fed state activates glycolysis and lipogenesis
  if (state.insulin === "high" || state.feedingState === "fed") {
    status.glycolysis = "active";
    status.pdh = "active";
    explanation.push({
      cause: "Insulin is high in the fed state",
      effect:
        "Glycolysis and pyruvate dehydrogenase are activated, increasing flux toward acetyl-CoA",
    });
  }

  // Glucagon / fasted state suppresses lipogenesis
  if (state.glucagon === "high" || state.feedingState === "fasted") {
    status.glycolysis = "suppressed";
    status.fattyAcidSynthesis = "suppressed";
    status.acc = "inactive";
    explanation.push({
      cause: "Glucagon is high in the fasted state",
      effect:
        "Glycolysis and acetyl-CoA carboxylase are suppressed, blocking fatty acid synthesis",
    });
  }

  // High ATP supports citrate accumulation, slows TCA
  if (state.atp === "high") {
    status.citrateExport = "high";
    status.tca = "limited";
    explanation.push({
      cause: "ATP is high",
      effect:
        "Isocitrate dehydrogenase is inhibited, slowing the TCA and allowing citrate to accumulate and exit the mitochondrion",
    });
  }

  // High citrate activates ACC
  if (state.citrate === "high" && state.glucagon !== "high") {
    status.acc = "active";
    status.fattyAcidSynthesis = "active";
    explanation.push({
      cause: "Cytosolic citrate is elevated",
      effect:
        "Acetyl-CoA carboxylase (ACC) is allosterically activated, raising malonyl-CoA and driving fatty acid synthesis",
    });
  }

  // Malonyl-CoA inhibits CPT-I (when FA synthesis is active)
  if (status.fattyAcidSynthesis === "active") {
    status.cpt1 = "inhibited";
    status.betaOxidation = "suppressed";
    explanation.push({
      cause: "Malonyl-CoA produced by active ACC",
      effect:
        "CPT-I is inhibited, blocking long-chain fatty acyl-CoA entry into mitochondria and suppressing beta-oxidation",
    });
  }

  // High AMP suppresses anabolic synthesis (AMPK-style)
  if (state.amp === "high") {
    status.acc = "inactive";
    status.fattyAcidSynthesis = "suppressed";
    status.betaOxidation = "active";
    status.cpt1 = "active";
    explanation.push({
      cause: "AMP is high (low energy charge)",
      effect:
        "AMPK is active: ACC is phosphorylated and inactivated, malonyl-CoA falls, CPT-I is relieved, beta-oxidation is favoured",
    });
  }

  // Low oxygen limits oxidative metabolism
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

  return { status, explanation };
}

export function summariseExplanation(steps: ExplanationStep[]): string {
  if (steps.length === 0) {
    return "All pathway nodes are at baseline. Adjust the metabolic state to drive flux.";
  }
  return steps.map((s) => `${s.cause} → ${s.effect}.`).join(" ");
}
