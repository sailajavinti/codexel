import { FaHistory } from "react-icons/fa";

function ProfileHistory() {
  return (
    <div className="mx-auto max-w-[1000px]">

      <div className="mb-8">
        <p className="mb-2 text-[11px] font-bold tracking-[2px] text-blue-600">
          ACTIVITY
        </p>

        <h1 className="text-[32px] font-bold text-gray-900">
          History
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View your recent CodeXel activity.
        </p>
      </div>

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
    </div>
  );
}

export default ProfileHistory;