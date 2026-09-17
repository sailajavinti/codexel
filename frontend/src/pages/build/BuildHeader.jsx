import { useState, useEffect, useRef } from "react";
import {
  FaArrowLeft,
  FaCheck,
  FaSpinner,
  FaFolderOpen,
  FaChevronDown,
  FaClock,
  FaPlus,
  FaDesktop,
  FaTabletAlt,
  FaMobileAlt,
  FaEye,
  FaEdit,
  FaSave,
  FaCode,
} from "react-icons/fa";
import api from "../../api/axios";

function ViewportControls({
  viewportMode,
  onChangeViewport,
}) {
  return (
    <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
      <button
        type="button"
        onClick={() =>
          onChangeViewport &&
          onChangeViewport("desktop")
        }
        title="Desktop View (100%)"
        className={`flex h-7 w-7 items-center justify-center rounded transition ${viewportMode === "desktop"
          ? "bg-white text-blue-600 shadow-xs"
          : "text-gray-500 hover:text-gray-800"
          }`}
      >
        <FaDesktop className="text-xs" />
      </button>

      <button
        type="button"
        onClick={() =>
          onChangeViewport &&
          onChangeViewport("tablet")
        }
        title="Tablet View (768px)"
        className={`flex h-7 w-7 items-center justify-center rounded transition ${viewportMode === "tablet"
          ? "bg-white text-blue-600 shadow-xs"
          : "text-gray-500 hover:text-gray-800"
          }`}
      >
        <FaTabletAlt className="text-xs" />
      </button>

      <button
        type="button"
        onClick={() =>
          onChangeViewport &&
          onChangeViewport("mobile")
        }
        title="Mobile View (375px)"
        className={`flex h-7 w-7 items-center justify-center rounded transition ${viewportMode === "mobile"
          ? "bg-white text-blue-600 shadow-xs"
          : "text-gray-500 hover:text-gray-800"
          }`}
      >
        <FaMobileAlt className="text-xs" />
      </button>
    </div>
  );
}

function BuildHeader({
  currentProject,
  onSelectProject,
  onNewProject,
  pages = [],
  components = [],
  onProjectSaved,
  onBackClick,
  onMarkDirty,
  onExportClick,
  viewportMode = "desktop",
  onChangeViewport,
  isPreviewMode = false,
  onTogglePreviewMode,
}) {
  const [projectName, setProjectName] =
    useState("Untitled Project");

  const [status, setStatus] =
    useState("idle");

  const [statusMessage, setStatusMessage] =
    useState("");

  const [isOpenMenuVisible, setIsOpenMenuVisible] =
    useState(false);

  const [projectsList, setProjectsList] =
    useState([]);

  const [loadingProjects, setLoadingProjects] =
    useState(false);

  const headerRef = useRef(null);
  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  // ------------------------------------------------------------
  // Sync project name
  // ------------------------------------------------------------

  useEffect(() => {
    setProjectName(
      currentProject?.title ||
      "Untitled Project"
    );
  }, [currentProject]);

  // ------------------------------------------------------------
  // Close project menu outside header
  // ------------------------------------------------------------

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(
          e.target
        )
      ) {
        setIsOpenMenuVisible(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
  }, []);

  // ------------------------------------------------------------
  // Project menu
  // ------------------------------------------------------------

  const handleToggleProjects =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        setStatus("error");

        setStatusMessage(
          "Please login to view projects"
        );

        setTimeout(
          () => setStatus("idle"),
          3000
        );

        return;
      }

      if (!isOpenMenuVisible) {
        try {
          setLoadingProjects(true);

          const res =
            await api.get(
              "/projects/history"
            );

          setProjectsList(
            res.data
          );
        } catch (err) {
          console.error(
            "Failed to load projects:",
            err
          );
        } finally {
          setLoadingProjects(false);
        }
      }

      setIsOpenMenuVisible(
        (prev) => !prev
      );
    };

  // ------------------------------------------------------------
  // Project name
  // ------------------------------------------------------------

  const handleFocus = () => {
    if (
      projectName ===
      "Untitled Project"
    ) {
      setProjectName("");
    }
  };

  const handleChangeName = (e) => {
    setProjectName(
      e.target.value
    );

    if (onMarkDirty) {
      onMarkDirty();
    }
  };

  const handleBlur = () => {
    const trimmed =
      projectName.trim();

    if (
      !trimmed ||
      trimmed ===
      "Untitled Project"
    ) {
      setProjectName(
        currentProject?.title ||
        "Untitled Project"
      );

      if (!currentProject?._id) {
        return;
      }
    }

    if (
      currentProject?._id &&
      trimmed ===
      currentProject.title
    ) {
      return;
    }

    handleSave(
      trimmed ||
      currentProject?.title
    );
  };

  // ------------------------------------------------------------
  // Save with Unnamed Check
  // ------------------------------------------------------------

  const handleSaveClick = () => {
    const trimmed = projectName.trim();
    if (!trimmed || trimmed === "Untitled Project") {
      // Focus the header title input field naturally
      if (desktopInputRef.current) {
        desktopInputRef.current.focus();
        desktopInputRef.current.select();
      } else if (mobileInputRef.current) {
        mobileInputRef.current.focus();
        mobileInputRef.current.select();
      }
      return;
    }

    handleSave();
  };

  // ------------------------------------------------------------
  // Save Action
  // ------------------------------------------------------------

  const handleSave = async (
    customTitle
  ) => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      setStatus("error");

      setStatusMessage(
        "Please login to save file"
      );

      setTimeout(
        () => setStatus("idle"),
        3000
      );

      return;
    }

    const rawTitle =
      customTitle ?? projectName;

    const finalTitle =
      rawTitle.trim();

    if (
      !currentProject?._id &&
      (!finalTitle ||
        finalTitle ===
        "Untitled Project")
    ) {
      setProjectName(
        "Untitled Project"
      );

      return;
    }

    const titleToPersist =
      finalTitle ||
      currentProject?.title ||
      "Untitled Project";

    try {
      setStatus("saving");

      const res =
        await api.post(
          "/projects/save",
          {
            id:
              currentProject?._id ||
              null,

            title:
              titleToPersist,

            canvasData:
              components,

            pages:
              pages,
          }
        );

      if (onProjectSaved) {
        onProjectSaved(
          res.data
        );
      }

      setStatus("saved");

      setTimeout(
        () => setStatus("idle"),
        2500
      );
    } catch (err) {
      console.error(
        "Save error:",
        err
      );

      setStatus("error");

      if (
        err.response?.status ===
        401
      ) {
        setStatusMessage(
          "Please login to save file"
        );
      } else {
        setStatusMessage(
          "Failed to save"
        );
      }

      setTimeout(
        () => setStatus("idle"),
        3000
      );
    }
  };

  // ------------------------------------------------------------
  // Project dropdown
  // ------------------------------------------------------------

  const ProjectDropdown = () => {
    if (!isOpenMenuVisible) {
      return null;
    }

    return (
      <div className="absolute left-0 top-full z-[70] mt-2 w-72 max-w-[calc(100vw-1rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
        <div className="mb-1 flex items-center justify-between border-b border-gray-100 px-2 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Projects
          </span>

          <button
            type="button"
            onClick={() => {
              onNewProject();
              setIsOpenMenuVisible(
                false
              );
            }}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <FaPlus className="text-[10px]" />
            New
          </button>
        </div>

        {loadingProjects ? (
          <div className="flex items-center justify-center py-6 text-gray-400">
            <FaSpinner className="animate-spin text-sm" />
          </div>
        ) : projectsList.length ===
          0 ? (
          <div className="py-4 text-center text-xs text-gray-500">
            No previous projects
            found.
          </div>
        ) : (
          <div className="max-h-60 divide-y divide-gray-50 overflow-y-auto">
            {projectsList.map(
              (project) => (
                <button
                  key={
                    project._id
                  }
                  type="button"
                  onClick={() => {
                    onSelectProject(
                      project
                    );

                    setIsOpenMenuVisible(
                      false
                    );
                  }}
                  className={`flex w-full flex-col gap-0.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-blue-50 ${project._id ===
                    currentProject?._id
                    ? "bg-blue-50/70"
                    : ""
                    }`}
                >
                  <span className="truncate text-xs font-semibold text-gray-800">
                    {
                      project.title
                    }
                  </span>

                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <FaClock className="text-[9px]" />

                    {new Date(
                      project.updatedAt
                    ).toLocaleDateString()}
                  </span>
                </button>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <header
      ref={headerRef}
      className="relative shrink-0 border-b border-gray-200 bg-white"
    >
      {/* ======================================================
          DESKTOP + TABLET HEADER
          ====================================================== */}

      <div className="hidden h-16 items-center justify-between px-3 md:flex lg:px-6">
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-2 lg:gap-3">
          <button
            type="button"
            onClick={onBackClick}
            title="Back"
            className="flex shrink-0 items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600 focus:outline-none"
          >
            <FaArrowLeft className="text-xs" />

            <span className="hidden lg:inline">
              Back
            </span>
          </button>

          <div className="h-5 w-px shrink-0 bg-gray-200" />

          {/* OPEN PROJECT */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={
                handleToggleProjects
              }
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none lg:px-3"
              title="Open Project"
            >
              <FaFolderOpen className="text-blue-600" />

              <span className="hidden lg:inline">
                Open Project
              </span>

              <FaChevronDown className="text-[9px] text-gray-400" />
            </button>

            <ProjectDropdown />
          </div>
        </div>

        {/* MIDDLE */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3 lg:gap-4">
          <div className="hidden lg:block">
            <ViewportControls
              viewportMode={viewportMode}
              onChangeViewport={onChangeViewport}
            />
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <input
              ref={desktopInputRef}
              type="text"
              value={
                projectName
              }
              onFocus={
                handleFocus
              }
              onChange={
                handleChangeName
              }
              onBlur={
                handleBlur
              }
              onKeyDown={(e) =>
                e.key ===
                "Enter" &&
                e.target.blur()
              }
              placeholder="Untitled Project"
              className="max-w-[110px] rounded px-1.5 py-1 text-center text-xs font-semibold text-slate-800 transition hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-[150px] sm:text-sm lg:max-w-[200px]"
            />

            {/* Status */}
            {status ===
              "saving" && (
              <span className="hidden items-center gap-1 text-xs text-gray-400 lg:flex">
                <FaSpinner className="animate-spin text-[10px]" />
                Saving...
              </span>
            )}

            {status ===
              "saved" && (
              <span className="hidden items-center gap-1 text-xs font-medium text-emerald-600 lg:flex">
                <FaCheck className="text-[10px]" />
                Saved
              </span>
            )}

            {status ===
              "error" && (
              <span
                className="hidden max-w-[130px] truncate text-xs font-medium text-red-500 lg:inline"
                title={
                  statusMessage
                }
              >
                {
                  statusMessage
                }
              </span>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-1.5 lg:gap-3">
          {/* PREVIEW */}
          <button
            type="button"
            onClick={
              onTogglePreviewMode
            }
            className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-sm font-semibold transition lg:px-3 ${isPreviewMode
              ? "border-blue-600 bg-blue-50 text-blue-600"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            title={
              isPreviewMode
                ? "Return to Editor"
                : "Preview Canvas"
            }
          >
            {isPreviewMode ? (
              <>
                <FaEdit className="text-xs" />

                <span className="hidden lg:inline">
                  Edit Mode
                </span>
              </>
            ) : (
              <>
                <FaEye className="text-xs" />

                <span className="hidden lg:inline">
                  Live Preview
                </span>
              </>
            )}
          </button>

          {/* SAVE */}
          <button
            type="button"
            onClick={handleSaveClick}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 lg:px-4"
            title="Save Project"
          >
            <span className="hidden lg:inline">
              Save
            </span>

            <FaSave className="lg:hidden" />
          </button>

          {/* EXPORT */}
          <button
            type="button"
            onClick={
              onExportClick
            }
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 lg:px-4"
            title="Export Code"
          >
            <FaCode className="lg:hidden" />

            <span className="hidden lg:inline">
              Export Code
            </span>

            <span className="lg:hidden">
              Export
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================
          MOBILE HEADER
          ====================================================== */}

      <div className="flex flex-col md:hidden">
        {/* TOP MOBILE ROW */}

        <div className="flex h-14 items-center gap-1.5 px-2">
          {/* BACK */}

          <button
            type="button"
            onClick={onBackClick}
            title="Back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
          >
            <FaArrowLeft className="text-sm" />
          </button>

          {/* PROJECT NAME */}

          <input
            ref={mobileInputRef}
            type="text"
            value={
              projectName
            }
            onFocus={
              handleFocus
            }
            onChange={
              handleChangeName
            }
            onBlur={
              handleBlur
            }
            onKeyDown={(e) =>
              e.key ===
              "Enter" &&
              e.target.blur()
            }
            placeholder="Project"
            className="min-w-0 flex-1 rounded-lg px-2 py-2 text-center text-xs font-semibold text-slate-800 outline-none transition hover:bg-gray-100 focus:bg-white focus:ring-1 focus:ring-blue-500"
          />

          {/* PREVIEW */}

          <button
            type="button"
            onClick={
              onTogglePreviewMode
            }
            title={
              isPreviewMode
                ? "Edit Mode"
                : "Live Preview"
            }
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition ${isPreviewMode
              ? "border-blue-600 bg-blue-50 text-blue-600"
              : "border-gray-200 bg-white text-gray-600"
              }`}
          >
            {isPreviewMode ? (
              <FaEdit className="text-xs" />
            ) : (
              <FaEye className="text-xs" />
            )}
          </button>

          {/* SAVE */}

          <button
            type="button"
            onClick={handleSaveClick}
            title="Save"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
          >
            <FaSave className="text-xs" />
          </button>

          {/* EXPORT */}

          <button
            type="button"
            onClick={
              onExportClick
            }
            title="Export Code"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition hover:bg-blue-700"
          >
            <FaCode className="text-xs" />
          </button>
        </div>

        {/* BOTTOM MOBILE ROW */}

        <div className="flex h-11 items-center justify-between border-t border-gray-100 px-2">
          {/* OPEN PROJECT */}

          <div className="relative">
            <button
              type="button"
              onClick={
                handleToggleProjects
              }
              title="Open Project"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
            >
              <FaFolderOpen className="text-blue-600" />

              <span>
                Projects
              </span>

              <FaChevronDown className="text-[8px] text-gray-400" />
            </button>

            <ProjectDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}

export default BuildHeader;