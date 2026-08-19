import BuildHeader from "./BuildHeader";
import Canvas from "./Canvas";
import ComponentsPanel from "./ComponentsPanel";
import PropertiesPanel from "./PropertiesPanel";

function Build() {
  return (
    <div className="h-screen overflow-hidden bg-slate-100">

      <BuildHeader />

      <div className="flex h-[calc(100vh-4rem)] min-h-0">

        <ComponentsPanel />

        <Canvas />

        <PropertiesPanel />

      </div>

    </div>
  );
}

export default Build;