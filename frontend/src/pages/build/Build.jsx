import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import BuildHeader from "./BuildHeader";
import Canvas from "./Canvas";
import ComponentsPanel from "./ComponentsPanel";
import PropertiesPanel from "./PropertiesPanel";
import CodePreview from "./CodePreview";
import api from "../../api/axios";
import { createDefaultComponent } from "./components/constants";
import {
  FaExclamationTriangle,
  FaPlus,
  FaTimes,
  FaThLarge,
  FaSlidersH,
  FaTrash,
} from "react-icons/fa";

const DEFAULT_PAGE = {
  id: "page-home",
  name: "Home",
  canvasData: [],
};

const MAX_HISTORY_STEPS = 30;

function Build() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentProject, setCurrentProject] = useState(null);
  const [pages, setPages] = useState([DEFAULT_PAGE]);
  const [savedPages, setSavedPages] = useState([]);
  const [activePageId, setActivePageId] = useState("page-home");
  const [editingPageId, setEditingPageId] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);

  const [viewportMode, setViewportMode] = useState("desktop");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  const activePage = pages.find((p) => p.id === activePageId) || pages[0] || DEFAULT_PAGE;
  const components = activePage.canvasData || [];
  const activeSavedPage = savedPages.find((p) => p.id === activePageId) || savedPages[0] || {
    id: "empty",
    name: activePage.name,
    canvasData: [],
  };

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
        return;
      }
      if (
        (cmdOrCtrl && e.key.toLowerCase() === "y") ||
        (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        redo();
        return;
      }
      if (cmdOrCtrl && e.key.toLowerCase() === "d" && selectedComponent) {
        e.preventDefault();
        duplicateComponent(selectedComponent);
        return;
      }
      if (selectedComponent && (e.key === "Delete" || e.key === "Backspace")) {
        e.preventDefault();
        deleteComponent(selectedComponent);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedComponent, historyIndex, history]);

  useEffect(() => {
    const projectId = searchParams.get("id");
    if (projectId) loadProjectById(projectId);
  }, [searchParams]);

  const commitToHistory = (newPages) => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }
    setHistory((prevHistory) => {
      const truncated = prevHistory.slice(0, historyIndex + 1);
      const updated = [...truncated, JSON.parse(JSON.stringify(newPages))];
      if (updated.length > MAX_HISTORY_STEPS) updated.shift();
      return updated;
    });
    setHistoryIndex((prevIndex) => Math.min(prevIndex + 1, MAX_HISTORY_STEPS - 1));
  };

  const undo = () => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const targetState = history[historyIndex - 1];
      setPages(JSON.parse(JSON.stringify(targetState)));
      setHistoryIndex(historyIndex - 1);
      setIsDirty(true);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const targetState = history[historyIndex + 1];
      setPages(JSON.parse(JSON.stringify(targetState)));
      setHistoryIndex(historyIndex + 1);
      setIsDirty(true);
    }
  };

  const parseProjectPages = (project) => {
    if (Array.isArray(project.pages) && project.pages.length > 0) {
      return project.pages.map((p, idx) => ({
        id: p.id || `page-${idx}`,
        name: p.name || `Page ${idx + 1}`,
        canvasData: p.canvasData || [],
      }));
    }
    return [
      {
        id: "page-home",
        name: "Home",
        canvasData: project.canvasData || [],
      },
    ];
  };

  const loadProjectById = async (id) => {
    try {
      const res = await api.get("/projects/history");
      const found = res.data.find((p) => p._id === id);
      if (found) handleSelectProject(found);
    } catch (err) {
      console.error("Failed to load project:", err);
    }
  };

  const handleSelectProject = (project) => {
    setCurrentProject(project);
    const parsedPages = parseProjectPages(project);
    setPages(parsedPages);
    setSavedPages(parsedPages);
    setHistory([JSON.parse(JSON.stringify(parsedPages))]);
    setHistoryIndex(0);

    setActivePageId(parsedPages[0]?.id || "page-home");
    setEditingPageId(null);
    setSelectedComponent(null);
    setIsDirty(false);
    setOpenPanel(null);

    if (searchParams.get("id") !== project._id) {
      setSearchParams({ id: project._id }, { replace: true });
    }
  };

  const handleNewProject = () => {
    setCurrentProject(null);
    setPages([DEFAULT_PAGE]);
    setSavedPages([]);
    setHistory([JSON.parse(JSON.stringify([DEFAULT_PAGE]))]);
    setHistoryIndex(0);

    setActivePageId("page-home");
    setEditingPageId(null);
    setSelectedComponent(null);
    setIsDirty(false);
    setOpenPanel(null);
    setSearchParams({}, { replace: true });
  };

  const handleAddPage = () => {
    const pageNum = pages.length + 1;
    const newPage = {
      id: `page-${Date.now()}`,
      name: `Page ${pageNum}`,
      canvasData: [],
    };
    const nextPages = [...pages, newPage];
    setPages(nextPages);
    commitToHistory(nextPages);

    setActivePageId(newPage.id);
    setEditingPageId(null);
    setSelectedComponent(null);
    setIsDirty(true);
  };

  const confirmDeletePage = () => {
    if (!pageToDelete) return;
    if (pages.length <= 1) {
      alert("Projects must contain at least one page.");
      setPageToDelete(null);
      return;
    }

    const filtered = pages.filter((p) => p.id !== pageToDelete.id);
    setPages(filtered);
    commitToHistory(filtered);

    if (activePageId === pageToDelete.id) {
      setActivePageId(filtered[0]?.id || "page-home");
      setSelectedComponent(null);
    }
    setPageToDelete(null);
    setIsDirty(true);
  };

  const handleRenamePage = (pageId, newName) => {
    const nextPages = pages.map((p) => (p.id === pageId ? { ...p, name: newName } : p));
    setPages(nextPages);
    commitToHistory(nextPages);
    setIsDirty(true);
  };

  const setComponentsForActivePage = (updater) => {
    setPages((prevPages) => {
      const nextPages = prevPages.map((page) => {
        if (page.id === activePageId) {
          const updatedCanvas =
            typeof updater === "function" ? updater(page.canvasData || []) : updater;
          return { ...page, canvasData: updatedCanvas };
        }
        return page;
      });
      commitToHistory(nextPages);
      return nextPages;
    });
    setIsDirty(true);
  };

  const addComponent = (compInfo) => {
    const type = compInfo.type || compInfo.id;
    const newComponent = createDefaultComponent(type);

    setComponentsForActivePage((prev) => [...prev, newComponent]);
    setSelectedComponent(newComponent.id);
  };

  const updateComponent = (id, updates) => {
    setComponentsForActivePage((prev) =>
      prev.map((comp) => ((comp.id || comp._id) === id ? { ...comp, ...updates } : comp))
    );
  };

  const deleteComponent = (id) => {
    if (!id) return;
    setComponentsForActivePage((prev) => prev.filter((comp) => (comp.id || comp._id) !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
      setOpenPanel(null);
    }
  };

  const duplicateComponent = (id) => {
    if (!id) return;
    setComponentsForActivePage((prev) => {
      const targetIndex = prev.findIndex((c) => (c.id || c._id) === id);
      if (targetIndex === -1) return prev;
      const targetComp = prev[targetIndex];
      const clonedComp = {
        ...JSON.parse(JSON.stringify(targetComp)),
        id: `${targetComp.type || "comp"}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        _id: undefined,
      };
      const updated = [...prev];
      updated.splice(targetIndex + 1, 0, clonedComp);
      setSelectedComponent(clonedComp.id);
      return updated;
    });
  };

  const reorderComponents = (startIndex, endIndex) => {
    if (startIndex === endIndex) return;
    setComponentsForActivePage((prev) => {
      const updated = [...prev];
      const [movedItem] = updated.splice(startIndex, 1);
      updated.splice(endIndex, 0, movedItem);
      return updated;
    });
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      <BuildHeader
        currentProject={currentProject}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
        pages={pages}
        components={components}
        onBackClick={() => {
          if (isDirty && Boolean(localStorage.getItem("token"))) setShowExitModal(true);
          else navigate("/", { replace: true });
        }}
        onMarkDirty={() => setIsDirty(true)}
        onExportClick={() => {
          if (savedPages.length === 0) {
            alert("Please save your project first before exporting code.");
            return;
          }
          setShowCodePreview(true);
        }}
        viewportMode={viewportMode}
        onChangeViewport={setViewportMode}
        isPreviewMode={isPreviewMode}
        onTogglePreviewMode={() => {
          setOpenPanel(null);
          setIsPreviewMode((prev) => !prev);
        }}
        onProjectSaved={(savedDoc) => {
          setCurrentProject(savedDoc);
          const parsed = parseProjectPages(savedDoc);
          setPages(parsed);
          setSavedPages(parsed);
          setIsDirty(false);
          setHistory([JSON.parse(JSON.stringify(parsed))]);
          setHistoryIndex(0);
          if (searchParams.get("id") !== savedDoc._id) {
            setSearchParams({ id: savedDoc._id }, { replace: true });
          }
        }}
      />

      {/* Pages Tabs */}
      {!isPreviewMode && (
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-1 overflow-x-auto py-1 no-scrollbar">
            {pages.map((page) => {
              const isActive = page.id === activePageId;
              const isEditing = editingPageId === page.id;

              return (
                <div
                  key={page.id}
                  onClick={() => {
                    if (!isActive) {
                      setActivePageId(page.id);
                      setEditingPageId(null);
                      setSelectedComponent(null);
                    }
                  }}
                  className={`group flex shrink-0 cursor-pointer select-none items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    isActive ? "bg-blue-50 text-blue-600 shadow-xs" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {isActive && isEditing ? (
                    <input
                      type="text"
                      autoFocus
                      value={page.name}
                      onChange={(e) => handleRenamePage(page.id, e.target.value)}
                      onBlur={() => {
                        if (!page.name.trim()) handleRenamePage(page.id, "Untitled Page");
                        setEditingPageId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "Escape") {
                          if (!page.name.trim()) handleRenamePage(page.id, "Untitled Page");
                          setEditingPageId(null);
                        }
                      }}
                      className="w-24 rounded border border-blue-300 bg-white px-1 py-0.5 text-blue-700 outline-none"
                    />
                  ) : (
                    <span
                      onDoubleClick={() => isActive && setEditingPageId(page.id)}
                      title={isActive ? "Double-click to rename" : "Click to view page"}
                      className="max-w-[120px] truncate"
                    >
                      {page.name}
                    </span>
                  )}

                  {pages.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPageToDelete(page);
                      }}
                      className="text-gray-400 hover:text-red-500 transition"
                      title="Delete page"
                    >
                      <FaTimes className="text-[10px]" />
                    </button>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleAddPage}
              className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
            >
              <FaPlus className="text-[9px]" /> New Page
            </button>
          </div>

          <span className="text-[11px] font-medium text-gray-400">
            Active: <strong className="text-gray-700">{activePage.name}</strong>
          </span>
        </div>
      )}

      {/* Main Workspace */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {!isPreviewMode && (
          <div className="hidden shrink-0 lg:block h-full min-h-0">
            <ComponentsPanel onAddComponent={addComponent} />
          </div>
        )}

        <Canvas
          components={components}
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
          onDropComponent={addComponent}
          onDeleteComponent={deleteComponent}
          onDuplicateComponent={duplicateComponent}
          onReorderComponents={reorderComponents}
          onUpdateComponent={updateComponent}
          onNavigatePage={(targetId) => {
            setActivePageId(targetId);
            setSelectedComponent(null);
          }}
          viewportMode={viewportMode}
          isPreviewMode={isPreviewMode}
        />

        {!isPreviewMode && (
          <div className="hidden shrink-0 lg:block h-full min-h-0">
            <PropertiesPanel
              components={components}
              selectedComponent={selectedComponent}
              onUpdateComponent={updateComponent}
              onDeleteComponent={deleteComponent}
              onDuplicateComponent={duplicateComponent}
              pages={pages}
            />
          </div>
        )}

        {/* Responsive Drawers */}
        {!isPreviewMode && openPanel === "components" && (
          <div className="absolute inset-y-0 left-0 z-50 w-72 h-full min-h-0 border-r border-gray-200 bg-white shadow-2xl md:block lg:hidden">
            <ComponentsPanel
              onAddComponent={(c) => {
                addComponent(c);
                setOpenPanel(null);
              }}
            />
          </div>
        )}

        {!isPreviewMode && openPanel === "properties" && (
          <div className="absolute inset-y-0 right-0 z-50 w-80 h-full min-h-0 border-l border-gray-200 bg-white shadow-2xl md:block lg:hidden">
            <PropertiesPanel
              components={components}
              selectedComponent={selectedComponent}
              onUpdateComponent={updateComponent}
              onDeleteComponent={deleteComponent}
              onDuplicateComponent={duplicateComponent}
              pages={pages}
            />
          </div>
        )}
      </div>

      {/* Mobile/Tablet Bar */}
      {!isPreviewMode && (
        <div className="flex h-12 shrink-0 items-center justify-around border-t border-gray-200 bg-white px-2 lg:hidden">
          <button
            type="button"
            onClick={() => setOpenPanel((p) => (p === "components" ? null : "components"))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              openPanel === "components" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            <FaThLarge /> Components
          </button>
          <button
            type="button"
            onClick={() => setOpenPanel((p) => (p === "properties" ? null : "properties"))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              openPanel === "properties" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            <FaSlidersH /> Properties
          </button>
        </div>
      )}

      {/* Code Export Modal */}
      <CodePreview
        isOpen={showCodePreview}
        onClose={() => setShowCodePreview(false)}
        activePage={activeSavedPage}
        pages={savedPages}
      />

      {/* Page Deletion Confirmation Modal */}
      {pageToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <FaTrash className="text-lg" />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-bold text-gray-900">Delete Page?</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Are you sure you want to delete <strong>{pageToDelete.name}</strong>? All elements on this page will be removed.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPageToDelete(null)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletePage}
                className="w-full rounded-lg bg-red-600 py-2.5 text-xs font-semibold text-white hover:bg-red-700 shadow-sm transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <FaExclamationTriangle className="text-xl" />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-bold text-gray-900">Unsaved Changes</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                You have unsaved changes in your project. Discard and leave?
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="w-full rounded-lg border border-gray-300 py-2 text-xs font-semibold"
              >
                Stay
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDirty(false);
                  setShowExitModal(false);
                  navigate("/", { replace: true });
                }}
                className="w-full rounded-lg bg-red-600 py-2 text-xs font-semibold text-white"
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