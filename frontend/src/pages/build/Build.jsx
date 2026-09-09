import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import BuildHeader from "./BuildHeader";
import Canvas from "./Canvas";
import ComponentsPanel from "./ComponentsPanel";
import PropertiesPanel from "./PropertiesPanel";
import api from "../../api/axios";
import { FaExclamationTriangle } from "react-icons/fa";

function Build() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentProject, setCurrentProject] = useState(null);
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Warn on tab close/refresh only if dirty AND the user is authenticated
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const isAuthenticated = Boolean(localStorage.getItem("token"));
      if (isDirty && isAuthenticated) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Keyboard shortcut to delete selected component
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedComponent) return;

      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteComponent(selectedComponent);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedComponent]);

  useEffect(() => {
    const projectId = searchParams.get("id");
    if (projectId) {
      loadProjectById(projectId);
    }
  }, [searchParams]);

  const normalizeComponents = (list = []) => {
    return list.map((item, index) => ({
      ...item,
      id: item.id || item._id || `${item.type || "comp"}-${Date.now()}-${index}`,
    }));
  };

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
    setComponents(normalizeComponents(project.canvasData || []));
    setSelectedComponent(null);
    setIsDirty(false);

    if (searchParams.get("id") !== project._id) {
      setSearchParams({ id: project._id }, { replace: true });
    }
  };

  const handleNewProject = () => {
    setCurrentProject(null);
    setComponents([]);
    setSelectedComponent(null);
    setIsDirty(false);
    setSearchParams({}, { replace: true });
  };

  const addComponent = (component) => {
    const newComponent = {
      id: `${component.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: component.id,
      name: component.name,
    };

    setComponents((prev) => [...prev, newComponent]);
    setSelectedComponent(newComponent.id);
    setIsDirty(true);
  };

  const deleteComponent = (targetId) => {
    setComponents((prev) =>
      prev.filter((item) => item.id !== targetId && item._id !== targetId)
    );

    setSelectedComponent((prev) => (prev === targetId ? null : prev));
    setIsDirty(true);
  };

const performBackNavigation = () => {
    // If the user has prior session history in this tab, go back; otherwise send them Home
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleBackRequest = () => {
    const isAuthenticated = Boolean(localStorage.getItem("token"));

    // Prompt for unsaved changes only if dirty AND the user is logged in
    if (isDirty && isAuthenticated) {
      setShowExitModal(true);
    } else {
      performBackNavigation();
    }
  };

  const confirmDiscardAndExit = () => {
    setIsDirty(false);
    setShowExitModal(false);
    performBackNavigation();
  };

  return (
    <div
      className="h-screen overflow-hidden bg-slate-100"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      <BuildHeader
        currentProject={currentProject}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
        components={components}
        onBackClick={handleBackRequest}
        onMarkDirty={() => setIsDirty(true)}
        onProjectSaved={(savedDoc) => {
          setCurrentProject(savedDoc);
          setComponents(normalizeComponents(savedDoc.canvasData || []));
          setIsDirty(false);
          if (searchParams.get("id") !== savedDoc._id) {
            setSearchParams({ id: savedDoc._id }, { replace: true });
          }
        }}
      />

      <div className="flex h-[calc(100vh-4rem)] min-h-0">
        <ComponentsPanel onAddComponent={addComponent} />

        <Canvas
          components={components}
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
          onDropComponent={addComponent}
          onDeleteComponent={deleteComponent}
        />

        <PropertiesPanel
          components={components}
          selectedComponent={selectedComponent}
          onDeleteComponent={deleteComponent}
        />
      </div>

      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <FaExclamationTriangle className="text-xl" />
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-lg font-bold text-gray-900">
                Unsaved Changes
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                You have unsaved changes in your project. If you leave now, all
                recent edits will be discarded.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Stay & Save
              </button>
              <button
                type="button"
                onClick={confirmDiscardAndExit}
                className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                Discard & Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Build;