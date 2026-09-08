import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaCalendarAlt,
  FaCheckCircle,
  FaPen,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaCamera,
} from "react-icons/fa";

const AVATAR_OPTIONS = [
  "/avatars/avatar1.jpg",
  "/avatars/avatar2.jpg",
  "/avatars/avatar3.jpg",
  "/avatars/avatar4.jpg",
  "/avatars/avatar5.jpg",
  "/avatars/avatar6.jpg",
];
function ProfileOverview({ user, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "User");
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
    if (user?.avatar) {
      setSelectedAvatar(user.avatar);
    }
  }, [user]);

  const email = user?.email || "No email available";

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
    : "Recently";

  const initial = (name || "U").charAt(0).toUpperCase();

  const handleSaveName = async () => {
    const trimmed = name.trim();
    setErrorMessage("");

    if (!trimmed || trimmed === user?.name) {
      setName(user?.name || "User");
      setIsEditing(false);
      return;
    }

    if (trimmed.length < 2) {
      setErrorMessage("Name must be at least 2 characters");
      return;
    }

    try {
      setLoading(true);
      if (onUpdateProfile) {
        await onUpdateProfile({ name: trimmed, avatar: selectedAvatar });
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update name:", err);
      setErrorMessage(
        err.response?.data?.message || "Failed to update profile name"
      );
      setName(user?.name || "User");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || "User");
    setErrorMessage("");
    setIsEditing(false);
  };

  const handleSelectAvatar = async (avatarUrl) => {
    try {
      setSelectedAvatar(avatarUrl);
      setShowAvatarModal(false);
      if (onUpdateProfile) {
        await onUpdateProfile({ name, avatar: avatarUrl });
      }
    } catch (err) {
      console.error("Failed to update avatar:", err);
    }
  };

  const hasAvatar = Boolean(selectedAvatar);
  const completionPercentage = hasAvatar ? 100 : 75;

  return (
    <div className="mx-auto max-w-[1180px]">
      {/* Heading */}
      <div className="mb-7">
        <p className="mb-2 text-[11px] font-bold tracking-[2px] text-blue-600">
          ACCOUNT
        </p>
        <h1 className="text-[32px] font-bold text-gray-900">My Profile</h1>
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

        {/* User Details */}
        <div className="flex items-center gap-5 px-9 pb-8 max-md:flex-col max-md:items-start max-md:px-5">
          {/* Avatar Container with Edit Camera Button */}
          <div className="relative -mt-[52px]">
            <div className="flex h-[105px] w-[105px] shrink-0 items-center justify-center overflow-hidden rounded-full border-[6px] border-white bg-gradient-to-br from-blue-600 to-violet-600 text-[38px] font-bold text-white shadow-lg">
              {selectedAvatar ? (
                <img
                  src={selectedAvatar}
                  alt="Avatar"
                  className="h-full w-full object-cover bg-slate-100"
                />
              ) : (
                initial
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow hover:bg-blue-700 transition"
              title="Choose Avatar"
            >
              <FaCamera className="text-xs" />
            </button>
          </div>

          <div className="flex-1 pt-[18px]">
            <div className="flex flex-wrap items-center gap-3">
              {isEditing ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveName();
                        if (e.key === "Escape") handleCancel();
                      }}
                      autoFocus
                      disabled={loading}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-xl font-bold text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleSaveName}
                      disabled={loading}
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                      title="Save name"
                    >
                      {loading ? (
                        <FaSpinner className="animate-spin text-xs" />
                      ) : (
                        <FaCheck className="text-xs" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      title="Cancel"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                  {errorMessage && (
                    <span className="text-xs font-medium text-red-500">
                      {errorMessage}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[25px] font-bold text-gray-900">
                    {name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition"
                    title="Edit Name"
                  >
                    <FaPen className="text-sm" />
                  </button>
                </div>
              )}
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
            {completionPercentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="my-6 h-[9px] overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Checklist */}
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <ProfileItem text="Name added" completed={Boolean(name)} />
          <ProfileItem text="Email added" completed={Boolean(user?.email)} />
          <ProfileItem text="Account created" completed />
          <div
            onClick={() => setShowAvatarModal(true)}
            className="cursor-pointer transition hover:opacity-80"
          >
            <ProfileItem
              text={hasAvatar ? "Avatar chosen" : "Choose an avatar"}
              completed={hasAvatar}
            />
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Choose an Avatar</h3>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Pick one of the avatars below to represent your CodeXel profile.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-4">
              {AVATAR_OPTIONS.map((avatarUrl, index) => {
                const isSelected = selectedAvatar === avatarUrl;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectAvatar(avatarUrl)}
                    className={`relative flex aspect-square items-center justify-center rounded-2xl border-2 p-2 transition hover:scale-105 ${isSelected
                        ? "border-blue-600 bg-blue-50/50 shadow-md"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                  >
                    <img
                      src={avatarUrl}
                      alt={`Avatar option ${index + 1}`}
                      className="h-full w-full object-contain rounded-full"
                    />
                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white shadow">
                        <FaCheck />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileItem({ text, completed }) {
  return (
    <div
      className={`flex items-center gap-2 text-sm ${completed ? "text-gray-700" : "text-gray-400"
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