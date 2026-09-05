import { useState } from "react";

import BuildHeader from "./BuildHeader";
import Canvas from "./Canvas";
import ComponentsPanel from "./ComponentsPanel";
import PropertiesPanel from "./PropertiesPanel";

function Build() {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const addComponent = (component) => {
    const newComponent = {
      id: `${component.id}-${Date.now()}`,
      type: component.id,
      name: component.name,
    };

    setComponents((prev) => [...prev, newComponent]);

    setSelectedComponent(newComponent.id);
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-100">
      <BuildHeader />

      <div className="flex h-[calc(100vh-4rem)] min-h-0">
        <ComponentsPanel onAddComponent={addComponent} />

        <Canvas
          components={components}
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
        />

        <PropertiesPanel
          components={components}
          selectedComponent={selectedComponent}
        />
      </div>
    </div>
  );
}

export default Build;