# Metabolix

> Liver Metabolism Explorer · a spatial biochemistry simulator that lets you zoom from organ to pathway and watch the lipogenesis-vs-oxidation switch flip in real time.

Metabolix is a 3D, interactive learning app for hepatic metabolism. The first vertical slice models the **fed-state liver**: glycolysis, PDH, TCA citrate accumulation, citrate export, ACC, malonyl-CoA, fatty acid synthesis, and the malonyl-CoA inhibition of CPT-I that suppresses beta-oxidation.

## Highlights

- **Scene ladder**: organ → lobule → hepatocyte → pathway, with smoothly interpolated camera transitions.
- **Rule-based metabolic engine**: change insulin, glucagon, ATP, AMP, citrate, oxygen, or pick a preset (Fed, Fasted, Exercise, Hypoxia) and the pathway responds.
- **Causal explanation panel**: every change produces a chain of "cause → effect" statements explaining why pathway nodes lit up or shut down.
- **Structured scientific content**: the lipogenesis pathway is defined in `src/content/pathways/fatty-acid-synthesis.json`, not hardcoded into UI.

## Stack

- Vite · React · TypeScript · Tailwind CSS
- Three.js · `@react-three/fiber` · `@react-three/drei`
- Zustand for global state
- Framer Motion for UI transitions

## Run it

```bash
npm install
npm run dev
```

Open the URL printed by Vite (default `http://localhost:5173`).

```bash
npm run build   # type-check and bundle
npm run preview # serve the production build
```

## Project layout

```
metabolix/
├── public/
├── src/
│   ├── scene/                   # 3D Three.js scene
│   │   ├── SceneCanvas.tsx
│   │   ├── CameraRig.tsx
│   │   ├── Lighting.tsx
│   │   ├── Particles.tsx
│   │   ├── LiverModel.tsx
│   │   ├── LobuleModel.tsx
│   │   └── HepatocyteModel.tsx
│   ├── sim/                     # Pure simulation logic
│   │   ├── presets.ts
│   │   └── rulesEngine.ts
│   ├── store/
│   │   └── appStore.ts          # Zustand store
│   ├── content/
│   │   └── pathways/
│   │       └── fatty-acid-synthesis.json
│   ├── components/ui/
│   │   ├── TopBar.tsx
│   │   ├── SceneLadder.tsx
│   │   ├── SidePanel.tsx
│   │   ├── StateControls.tsx
│   │   ├── PathwayPanel.tsx
│   │   ├── PathwayOverlay.tsx
│   │   ├── ExplanationPanel.tsx
│   │   └── Landing.tsx
│   ├── types/
│   │   ├── metabolism.ts
│   │   └── scene.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── CLAUDE.md
└── README.md
```

## Architecture

Metabolix separates three layers cleanly:

1. **3D scene** (`src/scene`): pure rendering. No biology lives here.
2. **Simulation** (`src/sim`): pure functions that map a `MetabolicState` to a `PathwayStatus` and a list of `ExplanationStep`s. Easily unit-testable.
3. **Content** (`src/content`): pathway facts as JSON, including metabolites, enzymes, reactions, regulation rules, teaching sequence, clinical links, and source notes.

The Zustand store in `src/store/appStore.ts` glues scene mode and metabolic state to the UI. Adding a pathway means adding a JSON file and extending `rulesEngine.ts`, not editing components.

## The first scientific story

> **Fed liver, high insulin, high citrate.** Glycolysis is active. Pyruvate enters the mitochondrion and PDH generates acetyl-CoA. Acetyl-CoA + OAA → citrate. High ATP slows the TCA, citrate accumulates and exits to the cytosol. ATP citrate lyase regenerates cytosolic acetyl-CoA. ACC, allosterically activated by citrate and dephosphorylated by insulin, makes malonyl-CoA. Fatty acid synthase iteratively builds palmitate. Malonyl-CoA blocks CPT-I, so long-chain fatty acyl-CoA cannot enter the mitochondrion: beta-oxidation is suppressed. The hepatocyte is locked into anabolic lipid storage.

Toggle to **Fasted** or **Exercise** and watch ACC inactivate, malonyl-CoA fall, CPT-I open, and beta-oxidation light up.

## Roadmap

**v0.1 (this slice)** Liver fed-state fatty acid synthesis.

**v0.2** Fasting mode: gluconeogenesis, glycogenolysis, beta-oxidation, ketogenesis.

**v0.3** Exercise mode: muscle glucose uptake, AMP rise, glycogen breakdown, fatty acid oxidation.

**v0.4** Tissue comparison: liver, skeletal muscle, adipose, RBC, brain.

**v0.5** Clinical states: T1DM, T2DM, starvation, alcohol metabolism, hypoxia, G6PD deficiency, carnitine and MCAD deficiencies, statins.

## Scientific sources

- Lehninger, *Principles of Biochemistry* (8th ed.)
- Berg, Tymoczko, Stryer, *Biochemistry* (9th ed.)
- *Harper's Illustrated Biochemistry*
- Marks, *Basic Medical Biochemistry*

All scientific facts in `src/content` are manually curated against these references. AI-generated content is treated as a draft until verified.

## Status

Early prototype. Built as a vertical slice to prove the spatial-zoom + rules-engine + structured-content product concept end to end. See `CLAUDE.md` for design intent.

## License

MIT
