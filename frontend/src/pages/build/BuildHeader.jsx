import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaSpinner } from "react-icons/fa";
import api from "../../api/axios";

function BuildHeader() {
  const [projectName, setProjectName] = useState("Untitled Project");
  const [projectId, setProjectId] = useState(null);
  const [status, setStatus] = useState("idle"); // 'idle' | 'saving' | 'saved' | 'error'

  const handleSaveName = async () => {
    const trimmed = projectName.trim();
    if (!trimmed) return;

    try {
      setStatus("saving");
      const res = await api.post("/projects/save", {
        id: projectId,
        title: trimmed,
      });

      if (!projectId && res.data._id) {
        setProjectId(res.data._id);
      }

      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Navigation + Project Name */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
        >
          <FaArrowLeft className="text-xs" />
          Back
        </Link>

        <div className="h-5 w-px bg-gray-200"></div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
            placeholder="Untitled Project"
            className="rounded px-2 py-1 text-sm font-semibold text-slate-800 transition hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
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
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
          Preview
        </button>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
          Export Code
        </button>
      </div>
    </header>
  );
}

export default BuildHeader;