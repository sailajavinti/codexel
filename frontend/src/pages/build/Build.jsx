import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BuildHeader from "./BuildHeader";
import Canvas from "./Canvas";
import ComponentsPanel from "./ComponentsPanel";
import PropertiesPanel from "./PropertiesPanel";
import api from "../../api/axios";

function Build() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentProject, setCurrentProject] = useState(null);
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Fetch and load project when URL has ?id=...
  useEffect(() => {
    const projectId = searchParams.get("id");
    if (projectId) {
      loadProjectById(projectId);
    }
  }, [searchParams]);

  const loadProjectById = async (id) => {
    try {
      const res = await api.get("/projects/history");
      const found = res.data.find((p) => p._id === id);
      if (found) {
        handleSelectProject(found);
      }
    } catch (err) {
      console.error("Failed to load project:", err);
    }
  };

  const handleSelectProject = (project) => {
    setCurrentProject(project);
    setComponents(project.canvasData || []);
    setSelectedComponent(null);
    setSearchParams({ id: project._id });
  };

  const handleNewProject = () => {
    setCurrentProject(null);
    setComponents([]);
    setSelectedComponent(null);
    setSearchParams({});
  };

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
      <BuildHeader
        currentProject={currentProject}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
        components={components}
        onProjectSaved={(savedDoc) => {
          setCurrentProject(savedDoc);
          setSearchParams({ id: savedDoc._id });
        }}
      />

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