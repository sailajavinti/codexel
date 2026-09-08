import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaSpinner,
  FaFolderOpen,
  FaChevronDown,
  FaClock,
  FaPlus,
} from "react-icons/fa";
import api from "../../api/axios";

function BuildHeader({
  currentProject,
  onSelectProject,
  onNewProject,
  components,
  onProjectSaved,
}) {
  const [projectName, setProjectName] = useState("Untitled Project");
  const [status, setStatus] = useState("idle");

  const [isOpenMenuVisible, setIsOpenMenuVisible] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const dropdownRef = useRef(null);

  // Sync state whenever active project changes
  useEffect(() => {
    setProjectName(currentProject?.title || "Untitled Project");
  }, [currentProject]);

  // Handle outside click to dismiss dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpenMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleToggleProjects = async () => {
    if (!isOpenMenuVisible) {
      try {
        setLoadingProjects(true);
        const res = await api.get("/projects/history");
        setProjectsList(res.data);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoadingProjects(false);
      }
    }
    setIsOpenMenuVisible((prev) => !prev);
  };

  const handleFocus = () => {
    if (projectName === "Untitled Project") {
      setProjectName("");
    }
  };

  const handleBlur = () => {
    const trimmed = projectName.trim();

    // 1. If user cleared it or did not type anything on a new project:
    if (!trimmed || trimmed === "Untitled Project") {
      // Revert back to original title if project already exists, otherwise "Untitled Project"
      setProjectName(currentProject?.title || "Untitled Project");
      
      // Prevent creating a new project in DB if it was never created
      if (!currentProject?._id) {
        return;
      }
    }

    // 2. If existing project and name did not change, skip the API call
    if (currentProject?._id && trimmed === currentProject.title) {
      return;
    }

    // 3. Save only when a valid new title exists
    handleSave(trimmed || currentProject?.title);
  };

  const handleSave = async (customTitle) => {
    const rawTitle = customTitle ?? projectName;
    const finalTitle = rawTitle.trim();

    // Do not create a new DB document if title is empty or still the default placeholder
    if (!currentProject?._id && (!finalTitle || finalTitle === "Untitled Project")) {
      setProjectName("Untitled Project");
      return;
    }

    const titleToPersist = finalTitle || currentProject?.title || "Untitled Project";

    try {
      setStatus("saving");
      const res = await api.post("/projects/save", {
        id: currentProject?._id || null,
        title: titleToPersist,
        canvasData: components,
      });

      if (onProjectSaved) {
        onProjectSaved(res.data);
      }

      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      console.error("Save error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  return (
    <header className="relative flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Left: Navigation + Open Project */}
      <div className="flex items-center gap-4 z-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
        >
          <FaArrowLeft className="text-xs" />
          Back
        </Link>

        <div className="h-5 w-px bg-gray-200"></div>

        {/* Open Project Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={handleToggleProjects}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none"
          >
            <FaFolderOpen className="text-blue-600" />
            <span>Open Project</span>
            <FaChevronDown className="text-[9px] text-gray-400" />
          </button>

          {isOpenMenuVisible && (
            <div className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-gray-200 bg-white p-2 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-gray-100 px-2 pb-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Projects
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onNewProject();
                    setIsOpenMenuVisible(false);
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <FaPlus className="text-[10px]" /> New
                </button>
              </div>

              {loadingProjects ? (
                <div className="flex items-center justify-center py-6 text-gray-400">
                  <FaSpinner className="animate-spin text-sm" />
                </div>
              ) : projectsList.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-500">
                  No previous projects found.
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                  {projectsList.map((project) => (
                    <button
                      key={project._id}
                      type="button"
                      onClick={() => {
                        onSelectProject(project);
                        setIsOpenMenuVisible(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg transition flex flex-col gap-0.5 hover:bg-blue-50 ${
                        project._id === currentProject?._id
                          ? "bg-blue-50/70"
                          : ""
                      }`}
                    >
                      <span className="text-xs font-semibold text-gray-800 truncate">
                        {project.title}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-gray-400">
                        <FaClock className="text-[9px]" />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Middle: Centered Project Title Input */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
        <input
          type="text"
          value={projectName}
          onFocus={handleFocus}
          onChange={(e) => setProjectName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
          placeholder="Untitled Project"
          className="rounded px-2.5 py-1 text-center text-sm font-semibold text-slate-800 transition hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {status === "saving" && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <FaSpinner className="animate-spin text-[10px]" /> Saving...
          </span>
        )}
        {status === "saved" && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <FaCheck className="text-[10px]" /> Saved
          </span>
        )}
        {status === "error" && (
          <span className="text-xs font-medium text-red-500">Failed to save</span>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 z-10">
        <button
          type="button"
          onClick={() => handleSave()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Save
        </button>

        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Export Code
        </button>
      </div>
    </header>
  );
}

export default BuildHeader;