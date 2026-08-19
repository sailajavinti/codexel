import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function BuildHeader() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">

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

        <span className="text-sm font-semibold text-slate-800">
          Untitled Project
        </span>

      </div>

      {/* Actions */}

      <div className="flex items-center gap-3">

        <button
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Preview
        </button>

        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Export Code
        </button>

      </div>

    </header>
  );
}

export default BuildHeader;