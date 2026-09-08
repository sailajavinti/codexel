import { useState, useEffect } from "react";
import { FaHistory, FaFolder, FaTrash, FaSpinner } from "react-icons/fa";
import api from "../../api/axios";

function ProfileHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects/history");
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setHistory((prev) => prev.filter((project) => project._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-[1000px] items-center justify-center py-20 text-gray-400">
        <FaSpinner className="animate-spin text-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="mb-8">
        <p className="mb-2 text-[11px] font-bold tracking-[2px] text-blue-600">
          ACTIVITY
        </p>
        <h1 className="text-[32px] font-bold text-gray-900">History</h1>
        <p className="mt-2 text-sm text-gray-500">
          View your recent CodeXel activity.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-8 py-[70px] text-center">
          <div className="mx-auto flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gray-100 text-[27px] text-gray-400">
            <FaHistory />
          </div>
          <h2 className="mt-5 text-xl font-bold text-gray-900">
            No History Yet
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Your recent project activity will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {history.map((project) => (
            <div
              key={project._id}
              className="flex items-center justify-between p-5 transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FaFolder />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Last modified: {new Date(project.updatedAt).toLocaleDateString()} at{" "}
                    {new Date(project.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(project._id)}
                className="p-2 text-gray-400 transition hover:text-red-500"
                title="Delete project"
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfileHistory;