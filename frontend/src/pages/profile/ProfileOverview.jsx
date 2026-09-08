import {
  FaEnvelope,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

function ProfileOverview({ user }) {
  const userName = user?.name || "User";
  const email = user?.email || "No email available";

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-[1180px]">

      {/* Heading */}
      <div className="mb-7">
        <p className="mb-2 text-[11px] font-bold tracking-[2px] text-blue-600">
          ACCOUNT
        </p>

        <h1 className="text-[32px] font-bold text-gray-900">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View and manage your profile information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="mb-8 overflow-hidden rounded-[18px] border border-gray-200 bg-white shadow-sm">

        {/* Cover */}
        <div className="relative h-[115px] overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
          <div className="absolute right-[-50px] top-[-100px] h-[220px] w-[220px] rounded-full border-[35px] border-white/10" />

          <div className="absolute left-[45%] top-[-50px] h-[100px] w-[100px] rounded-full bg-white/10" />
        </div>

        {/* User */}
        <div className="flex items-center gap-5 px-9 pb-8 max-md:flex-col max-md:items-start max-md:px-5">

          <div className="-mt-[52px] flex h-[105px] w-[105px] shrink-0 items-center justify-center rounded-full border-[6px] border-white bg-gradient-to-br from-blue-600 to-violet-600 text-[38px] font-bold text-white shadow-lg">
            {initial}
          </div>

          <div className="flex-1 pt-[18px]">
            <div className="flex flex-wrap items-center gap-3">

              <h2 className="text-[25px] font-bold text-gray-900">
                {userName}
              </h2>

              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-[5px] text-xs font-semibold text-emerald-600">
                <FaCheckCircle />
                Active
              </span>

            </div>

            <div className="mt-3 flex flex-wrap gap-6 text-sm text-gray-500 max-md:flex-col max-md:gap-2">

              <span className="flex items-center gap-2">
                <FaEnvelope />
                {email}
              </span>

              <span className="flex items-center gap-2">
                <FaCalendarAlt />
                Joined {joinedDate}
              </span>

            </div>
          </div>

        </div>
      </div>

      {/* Profile Completion */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex items-start justify-between gap-5">

          <div>
            <p className="mb-1 text-[10px] font-bold tracking-[1.5px] text-blue-600">
              PROFILE STATUS
            </p>

            <h2 className="text-[19px] font-bold text-gray-900">
              Profile Completion
            </h2>

            <p className="mt-2 text-[13px] text-gray-500">
              Complete your profile to get the best CodeXel experience.
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-2 text-[13px] font-bold text-blue-600">
            75%
          </span>

        </div>

        {/* Progress */}
        <div className="my-6 h-[9px] overflow-hidden rounded-full bg-gray-200">
          <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-600 to-violet-600" />
        </div>

        {/* Checklist */}
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">

          <ProfileItem text="Name added" completed />

          <ProfileItem text="Email added" completed />

          <ProfileItem text="Account created" completed />

          <ProfileItem text="Add profile picture" />

        </div>

      </div>
    </div>
  );
}

function ProfileItem({ text, completed }) {
  return (
    <div
      className={`flex items-center gap-2 text-sm ${
        completed ? "text-gray-700" : "text-gray-400"
      }`}
    >
      {completed ? (
        <FaCheckCircle className="text-emerald-500" />
      ) : (
        <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
      )}

      <span>{text}</span>
    </div>
  );
}

export default ProfileOverview;