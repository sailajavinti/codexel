import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHistory,
  FaFolder,
  FaTrash,
  FaSpinner,
  FaExclamationTriangle,
  FaLaptopCode,
  FaArrowRight,
} from "react-icons/fa";
import api from "../../api/axios";

function ProfileHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isCancelled = false;

    api
      .get("/projects/history")
      .then((res) => {
        if (!isCancelled) {
          setHistory(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching project history:", err);
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      setIsDeleting(true);
      await api.delete(`/projects/${projectToDelete._id}`);
      setHistory((prev) =>
        prev.filter((project) => project._id !== projectToDelete._id)
      );
      setProjectToDelete(null);
    } catch (err) {
      console.error("Failed to delete project:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <FaSpinner className="animate-spin text-2xl text-blue-600" />
          <span className="text-xs font-medium">Loading project history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-[10px] font-bold tracking-wider text-blue-700 uppercase mb-2">
            Activity
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Project History
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Manage your saved web projects and resume visual editing.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => navigate("/build")}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer"
          >
            <FaLaptopCode className="text-xs" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/90 bg-white px-6 py-16 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 text-2xl mb-4">
            <FaHistory />
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            No Projects Yet
          </h2>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            You haven't saved any web projects yet. Launch the studio to start building responsive websites visually.
          </p>

          <button
            type="button"
            onClick={() => navigate("/build")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Open Build Studio</span>
            <FaArrowRight className="text-[10px]" />
          </button>
        </div>
      ) : (
        /* Project List */
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs divide-y divide-slate-100">
          {history.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/build?id=${project._id}`)}
              className="flex items-center justify-between p-4 sm:p-5 transition hover:bg-slate-50 cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FaFolder className="text-sm" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {project.title || "Untitled Project"}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Last updated:{" "}
                    {new Date(project.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    at{" "}
                    {new Date(project.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open &rarr;
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProjectToDelete(project);
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete project"
                  aria-label="Delete project"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Project Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 mb-4 shadow-2xs">
              <FaExclamationTriangle className="text-base" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                Delete Project?
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <span className="font-semibold text-slate-800">
                  "{projectToDelete.title || "this project"}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                disabled={isDeleting}
                className="flex-1 rounded-lg border border-slate-300 bg-white py-2 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2 px-4 text-xs font-semibold text-white shadow-xs hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <FaSpinner className="animate-spin text-xs" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileHistory;