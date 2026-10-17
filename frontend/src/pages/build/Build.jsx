import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import BuildHeader from "./BuildHeader";
import Canvas from "./Canvas";
import ComponentsPanel from "./ComponentsPanel";
import PropertiesPanel from "./PropertiesPanel";
import ImportCodeModal from "./ImportCodeModal";
import CodePreview from "./CodePreview";
import api from "../../api/axios";
import { createDefaultComponent, DEFAULT_THEME } from "./components/constants";
import ThemeModal from "./ThemeModal";
import {
  FaExclamationTriangle,
  FaPlus,
  FaTimes,
  FaThLarge,
  FaSlidersH,
  FaTrash,
  FaCopy,
} from "react-icons/fa";

const DEFAULT_PAGE = {
  id: "page-home",
  name: "Home",
  canvasData: [],
};

const MAX_HISTORY_STEPS = 30;

const GLOBAL_LAYOUT_TYPES = ["navbar", "footer"];
const isGlobalLayoutType = (type) => GLOBAL_LAYOUT_TYPES.includes(type);

function createUniqueId(prefix = "page") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

const findComponentById = (components, id) => {
  for (const component of components || []) {
    if (String(component.id || component._id) === String(id)) {
      return component;
    }

    const found = findComponentById(component.children, id);
    if (found) return found;
  }

  return null;
};

function Build() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentProject, setCurrentProject] = useState(null);
  const [pages, setPages] = useState([DEFAULT_PAGE]);
  const [activePageId, setActivePageId] = useState("page-home");
  const [editingPageId, setEditingPageId] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [showImportCode, setShowImportCode] = useState(false);
  const [importCodeText, setImportCodeText] = useState("");
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [pageToDelete, setPageToDelete] = useState(null);

  const [viewportMode, setViewportMode] = useState("desktop");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  const activePage = pages.find((p) => p.id === activePageId) || pages[0] || DEFAULT_PAGE;
  const components = activePage.canvasData || [];

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

  const handleSelectProject = (project) => {
    setCurrentProject(project);
    const parsedPages = parseProjectPages(project);
    setPages(parsedPages);
    setHistory([JSON.parse(JSON.stringify(parsedPages))]);
    setHistoryIndex(0);
    setImportCodeText("");

    if (project.theme && Object.keys(project.theme).length > 0) {
      setTheme(project.theme);
    } else {
      setTheme(DEFAULT_THEME);
    }

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
    setHistory([JSON.parse(JSON.stringify([DEFAULT_PAGE]))]);
    setHistoryIndex(0);
    setTheme(DEFAULT_THEME);
    setImportCodeText("");

    setActivePageId("page-home");
    setEditingPageId(null);
    setSelectedComponent(null);
    setIsDirty(false);
    setOpenPanel(null);
    setSearchParams({}, { replace: true });
  };

  const handleAddPage = () => {
    const pageNum = pages.length + 1;
    // Automatically inherit active global layout components (navbar, footer)
    const existingNavbar = pages.flatMap((p) => p.canvasData || []).find((c) => c.type === "navbar" && c.isShared !== false);
    const existingFooter = pages.flatMap((p) => p.canvasData || []).find((c) => c.type === "footer" && c.isShared !== false);

    const initialCanvas = [];
    if (existingNavbar) initialCanvas.push(JSON.parse(JSON.stringify(existingNavbar)));
    if (existingFooter) initialCanvas.push(JSON.parse(JSON.stringify(existingFooter)));

    const newPage = {
      id: createUniqueId("page"),
      name: `Page ${pageNum}`,
      canvasData: initialCanvas,
    };
    const nextPages = [...pages, newPage];
    setPages(nextPages);
    commitToHistory(nextPages);

    setActivePageId(newPage.id);
    setEditingPageId(null);
    setSelectedComponent(null);
    setIsDirty(true);
  };

  const handleDuplicatePage = (pageToDuplicate) => {
    if (!pageToDuplicate) return;
    const clonedCanvas = JSON.parse(JSON.stringify(pageToDuplicate.canvasData || []));

    const assignNewIds = (item) => {
      if (item.isShared === false || !isGlobalLayoutType(item.type)) {
        item.id = createUniqueId(item.type || "comp");
        item._id = undefined;
      }
      if (Array.isArray(item.children)) {
        item.children.forEach(assignNewIds);
      }
    };
    clonedCanvas.forEach(assignNewIds);

    const newPage = {
      id: createUniqueId("page"),
      name: `${pageToDuplicate.name} (Copy)`,
      canvasData: clonedCanvas,
    };
    const nextPages = [...pages, newPage];
    setPages(nextPages);
    commitToHistory(nextPages);

    setActivePageId(newPage.id);
    setEditingPageId(null);
    setSelectedComponent(null);
    setIsDirty(true);
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
    const projectId = searchParams.get("id");
    if (!projectId) return;

    let isMounted = true;
    api
      .get("/projects/history")
      .then((res) => {
        if (!isMounted) return;
        const found = res.data.find((p) => p._id === projectId);
        if (found) {
          handleSelectProject(found);
        }
      })
      .catch((err) => {
        console.error("Failed to load project:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

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

  const handleImportCode = (importedComponents) => {
    if (!importedComponents || importedComponents.length === 0) {
      return;
    }

    setComponentsForActivePage(importedComponents);
    setSelectedComponent(null);
    setOpenPanel(null);
  };

  const addComponent = (compInfo) => {
    const type = compInfo.type || compInfo.id;
    const newComponent = createDefaultComponent(type);

    if (isGlobalLayoutType(type)) {
      setPages((prevPages) => {
        const nextPages = prevPages.map((page) => {
          const currentCanvas = page.canvasData || [];
          const filtered = currentCanvas.filter((c) => c.type !== type);
          let updatedCanvas;
          if (type === "navbar") {
            // Navbar is placed at the top (index 0) across all pages
            updatedCanvas = [JSON.parse(JSON.stringify(newComponent)), ...filtered];
          } else {
            // Footer is placed at the bottom across all pages
            updatedCanvas = [...filtered, JSON.parse(JSON.stringify(newComponent))];
          }
          return { ...page, canvasData: updatedCanvas };
        });
        commitToHistory(nextPages);
        return nextPages;
      });
      setIsDirty(true);
      setSelectedComponent(newComponent.id);
      return;
    }

    setComponentsForActivePage((prev) => [...prev, newComponent]);
    setSelectedComponent(newComponent.id);
  };


  const updateNestedComponent = (components, id, updates) => {
    return components.map((component) => {
      if (String(component.id || component._id) === String(id)) {
        return { ...component, ...updates };
      }

      if (Array.isArray(component.children)) {
        return {
          ...component,
          children: updateNestedComponent(component.children, id, updates),
        };
      }

      return component;
    });
  };

  const updateComponent = (id, updates) => {
    const activeCanvas = activePage.canvasData || [];
    const targetComp = findComponentById(activeCanvas, id);
    const targetType = targetComp?.type || updates?.type;

    // Preserve existing global Navbar and Footer behavior.
    if (isGlobalLayoutType(targetType)) {
      setPages((prevPages) => {
        const nextPages = prevPages.map((page) => {
          const currentCanvas = page.canvasData || [];
          const hasGlobal = currentCanvas.some(
            (component) => component.type === targetType
          );

          let updatedCanvas;

          if (hasGlobal) {
            updatedCanvas = currentCanvas.map((component) =>
              component.type === targetType
                ? { ...component, ...updates }
                : component
            );
          } else {
            const baseComponent = targetComp
              ? { ...JSON.parse(JSON.stringify(targetComp)), ...updates }
              : { ...createDefaultComponent(targetType), ...updates };

            updatedCanvas =
              targetType === "navbar"
                ? [baseComponent, ...currentCanvas]
                : [...currentCanvas, baseComponent];
          }

          return { ...page, canvasData: updatedCanvas };
        });

        commitToHistory(nextPages);
        return nextPages;
      });

      setIsDirty(true);
      return;
    }

    setComponentsForActivePage((previous) =>
      updateNestedComponent(previous, id, updates)
    );
  };


  const deleteNestedComponent = (components, id) => {
    return components
      .filter(
        (component) =>
          String(component.id || component._id) !== String(id)
      )
      .map((component) => {
        if (Array.isArray(component.children)) {
          return {
            ...component,
            children: deleteNestedComponent(component.children, id),
          };
        }

        return component;
      });
  };

  const deleteComponent = (id) => {
    if (!id) return;

    const activeCanvas = activePage.canvasData || [];

    // Find the component, including nested children.
    const targetComp = findComponentById(activeCanvas, id);
    if (!targetComp) return;

    const targetType = targetComp.type;

    // Preserve existing global Navbar/Footer deletion behavior.
    if (isGlobalLayoutType(targetType)) {
      setPages((prevPages) => {
        const nextPages = prevPages.map((page) => ({
          ...page,
          canvasData: (page.canvasData || []).filter(
            (component) =>
              component.type !== targetType &&
              String(component.id || component._id) !== String(id)
          ),
        }));

        commitToHistory(nextPages);
        return nextPages;
      });

      setIsDirty(true);

      if (String(selectedComponent) === String(id)) {
        setSelectedComponent(null);
        setOpenPanel(null);
      }

      return;
    }

    // Delete the component wherever it appears in the component tree.
    setComponentsForActivePage((prev) =>
      deleteNestedComponent(prev, id)
    );

    if (String(selectedComponent) === String(id)) {
      setSelectedComponent(null);
      setOpenPanel(null);
    }
  };



  const duplicateNestedComponent = (components, id) => {
    const result = [];
    let duplicatedId = null;

    for (const component of components || []) {
      if (String(component.id || component._id) === String(id)) {
        const clone = JSON.parse(JSON.stringify(component));

        const createNewIds = (item) => {
          item.id = `${item.type || "comp"}-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}`;
          item._id = undefined;

          if (Array.isArray(item.children)) {
            item.children.forEach(createNewIds);
          }
        };

        createNewIds(clone);
        duplicatedId = clone.id;

        result.push(component, clone);
      } else {
        let updatedComponent = component;

        if (Array.isArray(component.children)) {
          const nestedResult = duplicateNestedComponent(
            component.children,
            id
          );

          if (nestedResult.duplicatedId) {
            updatedComponent = {
              ...component,
              children: nestedResult.components,
            };
            duplicatedId = nestedResult.duplicatedId;
          }
        }

        result.push(updatedComponent);
      }
    }

    return { components: result, duplicatedId };
  };

  const duplicateComponent = (id) => {
    if (!id) return;

    const activeCanvas = activePage.canvasData || [];
    const targetComp = findComponentById(activeCanvas, id);

    if (!targetComp || isGlobalLayoutType(targetComp.type)) {
      return;
    }

    setComponentsForActivePage((prev) => {
      const result = duplicateNestedComponent(prev, id);

      if (result.duplicatedId) {
        setSelectedComponent(result.duplicatedId);
      }

      return result.components;
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

  const canExport = Boolean(currentProject?._id) && !isDirty;

  const handleExportClick = () => {
    if (!canExport) {
      if (!currentProject?._id) {
        alert("Please save your project before exporting code.");
      } else if (isDirty) {
        alert("Please save your changes before exporting code.");
      }
      return;
    }
    setShowCodePreview(true);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      <BuildHeader
        currentProject={currentProject}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
        onImportCode={() => setShowImportCode(true)}
        pages={pages}
        components={components}
        onBackClick={() => {
          if (isDirty && Boolean(localStorage.getItem("token"))) setShowExitModal(true);
          else navigate("/", { replace: true });
        }}
        onMarkDirty={() => setIsDirty(true)}
        onExportClick={handleExportClick}
        canExport={canExport}
        isDirty={isDirty}
        viewportMode={viewportMode}
        onChangeViewport={setViewportMode}
        isPreviewMode={isPreviewMode}
        onTogglePreviewMode={() => {
          setOpenPanel(null);
          setIsPreviewMode((prev) => !prev);
        }}
        theme={theme}
        onProjectSaved={(savedDoc) => {
          setCurrentProject(savedDoc);
          const parsed = parseProjectPages(savedDoc);
          setPages(parsed);
          setIsDirty(false);
          setImportCodeText("");
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
                  className={`group flex shrink-0 cursor-pointer select-none items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${isActive ? "bg-blue-50 text-blue-600 shadow-xs" : "text-gray-600 hover:bg-gray-100"
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

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicatePage(page);
                    }}
                    className="text-gray-400 hover:text-blue-600 transition"
                    title="Duplicate page"
                  >
                    <FaCopy className="text-[10px]" />
                  </button>

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
          theme={theme}
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
              theme={theme}
              viewportMode={viewportMode}
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
              theme={theme}
              viewportMode={viewportMode}
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${openPanel === "components" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
          >
            <FaThLarge /> Components
          </button>
          <button
            type="button"
            onClick={() => setOpenPanel((p) => (p === "properties" ? null : "properties"))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${openPanel === "properties" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
          >
            <FaSlidersH /> Properties
          </button>
        </div>
      )}

      {/* Code Export Modal - Updated to use live pages */}
      <CodePreview
        isOpen={showCodePreview}
        onClose={() => setShowCodePreview(false)}
        activePage={activePage}
        pages={pages}
        theme={theme}
      />

      <ThemeModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        theme={theme}
        onUpdateTheme={(newTheme) => {
          setTheme(newTheme);
          setIsDirty(true);
        }}
      />

      <ImportCodeModal
        isOpen={showImportCode}
        onClose={() => setShowImportCode(false)}
        onImport={handleImportCode}
        code={importCodeText}
        setCode={setImportCodeText}
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