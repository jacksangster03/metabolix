import { SceneCanvas } from "./scene/SceneCanvas";
import { TopBar } from "./components/ui/TopBar";
import { SidePanel } from "./components/ui/SidePanel";
import { Landing } from "./components/ui/Landing";
import { PathwayOverlay } from "./components/ui/PathwayOverlay";
import { useAppStore } from "./store/appStore";
import { computePathwayStatus } from "./sim/rulesEngine";

function App() {
  const metabolicState = useAppStore((s) => s.metabolicState);
  const { explanation } = computePathwayStatus(metabolicState);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0">
        <SceneCanvas />
      </div>

      <TopBar />
      <Landing />

      <div className="absolute top-24 right-4 z-20">
        <SidePanel explanation={explanation} />
      </div>

      <PathwayOverlay />
    </div>
  );
}

export default App;
