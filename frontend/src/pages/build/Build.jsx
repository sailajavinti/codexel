import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import BuildHeader from "./BuildHeader";
import Canvas from "./Canvas";
import ComponentsPanel from "./ComponentsPanel";
import PropertiesPanel from "./PropertiesPanel";
import CodePreview from "./CodePreview";
import api from "../../api/axios";
import { FaExclamationTriangle, FaPlus, FaTimes } from "react-icons/fa";

const DEFAULT_PAGE = {
  id: "page-home",
  name: "Home",
  canvasData: [],
};

function Build() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentProject, setCurrentProject] = useState(null);
  const [pages, setPages] = useState([DEFAULT_PAGE]);
  // Holds only persisted/committed data
  const [savedPages, setSavedPages] = useState([]);
  const [activePageId, setActivePageId] = useState("page-home");
  const [editingPageId, setEditingPageId] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);

  const activePage =
    pages.find((p) => p.id === activePageId) || pages[0] || DEFAULT_PAGE;
  const components = activePage.canvasData || [];

  // Saved version of the active page for CodePreview
  const activeSavedPage =
    savedPages.find((p) => p.id === activePageId) ||
    savedPages[0] || { id: "empty", name: activePage.name, canvasData: [] };

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
      width: item.width || (item.type === "button" ? "auto" : "100%"),
      minHeight: item.minHeight || "",
      borderRadius: item.borderRadius ?? (item.type === "button" ? 6 : 0),
      id:
        item.id ||
        item._id ||
        `${item.type || "comp"}-${Date.now()}-${index}`,
    }));
  };

  const parseProjectPages = (project) => {
    if (Array.isArray(project.pages) && project.pages.length > 0) {
      return project.pages.map((p, idx) => ({
        id: p.id || `page-${idx}`,
        name: p.name || `Page ${idx + 1}`,
        canvasData: normalizeComponents(p.canvasData || []),
      }));
    }

    return [
      {
        id: "page-home",
        name: "Home",
        canvasData: normalizeComponents(project.canvasData || []),
      },
    ];
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
    const parsedPages = parseProjectPages(project);
    setPages(parsedPages);
    // Sync saved snapshot with loaded project
    setSavedPages(parsedPages);
    setActivePageId(parsedPages[0]?.id || "page-home");
    setEditingPageId(null);
    setSelectedComponent(null);
    setIsDirty(false);

    if (searchParams.get("id") !== project._id) {
      setSearchParams({ id: project._id }, { replace: true });
    }
  };

  const handleNewProject = () => {
    setCurrentProject(null);
    setPages([DEFAULT_PAGE]);
    setSavedPages([]);
    setActivePageId("page-home");
    setEditingPageId(null);
    setSelectedComponent(null);
    setIsDirty(false);
    setSearchParams({}, { replace: true });
  };

  const handleAddPage = () => {
    const pageNum = pages.length + 1;
    const newPage = {
      id: `page-${Date.now()}`,
      name: `Page ${pageNum}`,
      canvasData: [],
    };
    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
    setEditingPageId(null);
    setSelectedComponent(null);
    setIsDirty(true);
  };

  const handleDeletePage = (e, pageIdToDelete) => {
    e.stopPropagation();
    if (pages.length <= 1) {
      alert("Projects must contain at least one page.");
      return;
    }

    const filtered = pages.filter((p) => p.id !== pageIdToDelete);
    setPages(filtered);

    if (activePageId === pageIdToDelete) {
      setActivePageId(filtered[0]?.id || "page-home");
      setSelectedComponent(null);
    }
    setEditingPageId(null);
    setIsDirty(true);
  };

  const handleRenamePage = (pageId, newName) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, name: newName } : p))
    );
    setIsDirty(true);
  };

  const setComponentsForActivePage = (updater) => {
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id === activePageId) {
          const updatedCanvas =
            typeof updater === "function" ? updater(page.canvasData || []) : updater;
          return { ...page, canvasData: updatedCanvas };
        }
        return page;
      })
    );
    setIsDirty(true);
  };

  const addComponent = (component) => {
    const componentType = component.type || component.id;

    const newComponent = {
      id: `${componentType}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: componentType,
      name: component.name || componentType,

      width: componentType === "button" ? "auto" : "100%",
      minHeight: "",
      borderRadius: componentType === "button" ? 6 : 0,
      margin: 0,

      brand: "CodeXel",
      brandColor: "#0f172a",
      navLinkColor: "#475569",
      home: "Home",
      about: "About",
      contact: "Contact",

      heading: "Build Modern Web Experiences",
      description: "Design and export responsive interfaces visually in minutes.",
      buttonText: "Get Started",
      heroButtonBg: "#ffffff",
      heroButtonTextColor: "#2563eb",
      heroButtonLink: "#",

      content: "This is a customizable content section.",

      featureTitle1: "Fast & Lightweight",
      featureDesc1: "Optimized for speed and minimal build sizes.",
      featureTitle2: "Component-Driven",
      featureDesc2: "Flexible layout primitives built for reusable design.",
      featureTitle3: "Export Ready",
      featureDesc3: "Download clean React and Tailwind CSS output.",

      pricingPlan: "Pro Plan",
      pricingPrice: "$29",
      pricingPeriod: "/ month",
      pricingFeatures: "Unlimited Projects\nCode Export\nPriority Support",
      pricingButtonText: "Choose Plan",
      pricingButtonBg: "#2563eb",
      pricingButtonTextColor: "#ffffff",

      copyright: "© 2026 CodeXel Inc. All rights reserved.",
      footerLink1: "Privacy Policy",
      footerLink2: "Terms of Service",

      title: "Clean Headings & Copy",
      subtitle: "Add engaging subtitles or body content to support your sections.",

      text: "Click Me",
      link: "#",
      btnBgColor: "#2563eb",
      btnTextColor: "#ffffff",
      btnAlign: "left",
      btnPaddingX: 20,
      btnPaddingY: 10,

      src: "",
      alt: "",
      imageName: "",
      imageWidth: "",
      imageHeight: "",
      objectFit: "cover",
      imageAlign: "left",

      cardTitle: "Feature Card",
      cardContent: "Cards are ideal for grouping summaries, specs, or quick highlights.",

      dividerColor: "#e2e8f0",
      dividerThickness: "1",

      formTitle: "Contact Us",
      namePlaceholder: "Enter your name",
      emailPlaceholder: "Enter your email",
    };

    setComponentsForActivePage((prev) => [...prev, newComponent]);
    setSelectedComponent(newComponent.id);
  };

  const updateComponent = (id, updates) => {
    setComponentsForActivePage((prev) =>
      prev.map((comp) =>
        (comp.id || comp._id) === id ? { ...comp, ...updates } : comp
      )
    );
  };

  const deleteComponent = (id) => {
    setComponentsForActivePage((prev) =>
      prev.filter((comp) => (comp.id || comp._id) !== id)
    );
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
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

  const performBackNavigation = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleBackRequest = () => {
    const isAuthenticated = Boolean(localStorage.getItem("token"));
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

  const handleOpenExport = () => {
    if (savedPages.length === 0) {
      alert("Please save your project first before exporting code.");
      return;
    }
    setShowCodePreview(true);
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-100 flex flex-col">
      <BuildHeader
        currentProject={currentProject}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
        pages={pages}
        components={components}
        onBackClick={handleBackRequest}
        onMarkDirty={() => setIsDirty(true)}
        onExportClick={handleOpenExport}
        onProjectSaved={(savedDoc) => {
          setCurrentProject(savedDoc);
          const parsed = parseProjectPages(savedDoc);
          setPages(parsed);
          // Update committed state on successful save
          setSavedPages(parsed);
          setIsDirty(false);
          if (searchParams.get("id") !== savedDoc._id) {
            setSearchParams({ id: savedDoc._id }, { replace: true });
          }
        }}
      />

      {/* Page Tabs Bar */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
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
                className={`group flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-semibold cursor-pointer transition select-none ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-xs"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {isActive && isEditing ? (
                  <input
                    type="text"
                    autoFocus
                    value={page.name}
                    onChange={(e) => handleRenamePage(page.id, e.target.value)}
                    onBlur={() => {
                      if (!page.name.trim()) {
                        handleRenamePage(page.id, "Untitled Page");
                      }
                      setEditingPageId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === "Escape") {
                        if (!page.name.trim()) {
                          handleRenamePage(page.id, "Untitled Page");
                        }
                        setEditingPageId(null);
                      }
                    }}
                    className="bg-white border border-blue-300 rounded px-1.5 py-0.5 outline-none w-24 text-blue-700"
                  />
                ) : (
                  <span
                    onDoubleClick={() => {
                      if (isActive) {
                        setEditingPageId(page.id);
                      }
                    }}
                    title={isActive ? "Double-click to rename" : "Click to view page"}
                    className="truncate max-w-[120px]"
                  >
                    {page.name}
                  </span>
                )}

                {pages.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => handleDeletePage(e, page.id)}
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
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
            title="Add new page"
          >
            <FaPlus className="text-[9px]" /> New Page
          </button>
        </div>

        <span className="text-[11px] font-medium text-gray-400">
          Page: <strong className="text-gray-700">{activePage.name}</strong>
        </span>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 min-h-0">
        <ComponentsPanel onAddComponent={addComponent} />

        <Canvas
          components={components}
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
          onDropComponent={addComponent}
          onDeleteComponent={deleteComponent}
          onReorderComponents={reorderComponents}
          onUpdateComponent={updateComponent}
        />

        <PropertiesPanel
          components={components}
          selectedComponent={selectedComponent}
          onUpdateComponent={updateComponent}
          onDeleteComponent={deleteComponent}
        />
      </div>

      {/* Pass only committed/saved data to CodePreview */}
      <CodePreview
        isOpen={showCodePreview}
        onClose={() => setShowCodePreview(false)}
        activePage={activeSavedPage}
        pages={savedPages}
      />

      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <FaExclamationTriangle className="text-xl" />
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-lg font-bold text-gray-900">Unsaved Changes</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
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