import type { MetabolicState } from "../types/metabolism";

export const presets: Record<string, MetabolicState> = {
  fed: {
    feedingState: "fed",
    insulin: "high",
    glucagon: "low",
    atp: "high",
    amp: "low",
    citrate: "high",
    oxygen: "normal",
  },
  fasted: {
    feedingState: "fasted",
    insulin: "low",
    glucagon: "high",
    atp: "normal",
    amp: "high",
    citrate: "low",
    oxygen: "normal",
  },
  exercise: {
    feedingState: "fasted",
    insulin: "low",
    glucagon: "normal",
    atp: "low",
    amp: "high",
    citrate: "low",
    oxygen: "normal",
  },
  hypoxia: {
    feedingState: "fed",
    insulin: "high",
    glucagon: "low",
    atp: "low",
    amp: "high",
    citrate: "low",
    oxygen: "low",
  },
  baseline: {
    feedingState: "fed",
    insulin: "normal",
    glucagon: "normal",
    atp: "normal",
    amp: "normal",
    citrate: "normal",
    oxygen: "normal",
  },
  // Prolonged starvation (>24 h): glycogen is exhausted, ATP is low, AMP is high.
  // Gluconeogenesis and ketogenesis are both maximally active.
  // Distinguishes from simple 'fasted' (atp normal) by ATP depletion.
  starvation: {
    feedingState: "fasted",
    insulin: "low",
    glucagon: "high",
    atp: "low",
    amp: "high",
    citrate: "low",
    oxygen: "normal",
  },
};
