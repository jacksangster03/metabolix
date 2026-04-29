# Metabolix

This is a spatial biochemistry simulator and learning app.

## Product goal

Build a premium 3D interactive educational app where users zoom from organ
anatomy into cellular and biochemical metabolism. The first vertical slice is
liver fed-state metabolism, focusing on fatty acid synthesis, citrate export,
acetyl-CoA carboxylase regulation, malonyl-CoA and CPT-I inhibition.

## Technical stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Three.js
- @react-three/fiber
- @react-three/drei
- Zustand
- Framer Motion

## Architecture principles

1. Keep 3D scene code separate from simulation logic.
2. Keep scientific content in structured JSON.
3. Do not hardcode pathway facts inside React components.
4. Use TypeScript types for all biochemical entities.
5. Prioritise smooth performance over visual excess.
6. Use placeholder geometry before adding heavy GLB assets.
7. Build one excellent vertical slice before expanding pathways.

## Main folders

- `src/scene` 3D scene components, cameras, lighting, models
- `src/sim` metabolic state, rules engine, presets
- `src/content` pathway JSON, glossary and source notes
- `src/components/ui` interface panels and controls
- `src/store` Zustand global app store
- `src/types` shared TypeScript types

## Scientific rule quality

All pathway behaviour must be explainable. When a state changes, the app should
be able to explain why.

Example: if insulin is high and citrate is high, acetyl-CoA carboxylase activity
increases, malonyl-CoA rises and CPT-I is inhibited. This suppresses
beta-oxidation while favouring fatty acid synthesis.

## Visual style

Premium biotech interface. Dark background. Subtle cyan and green accents.
Clean typography. Minimal clutter. No cartoonish visuals. No fantasy magic
effects.

## Development approach

Build in small vertical slices:

1. 3D liver scene
2. hepatocyte transition
3. pathway overlay
4. metabolic state controls
5. rule-based pathway response
6. scientific JSON model
7. improved visual polish

## Do not

- Do not build a huge general metabolism atlas before the first vertical slice works.
- Do not mix all pathway logic into UI components.
- Do not use unverified AI-generated biochemical facts as final scientific truth.
- Do not add heavy assets before checking performance.
