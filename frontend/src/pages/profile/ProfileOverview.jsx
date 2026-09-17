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
  const [selectedAvatar, setSelectedAvatar] = useState(
    user?.avatar || ""
  );
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
        await onUpdateProfile({
          name: trimmed,
          avatar: selectedAvatar,
        });
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update name:", err);

      setErrorMessage(
        err.response?.data?.message ||
          "Failed to update profile name"
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
        await onUpdateProfile({
          name,
          avatar: avatarUrl,
        });
      }
    } catch (err) {
      console.error("Failed to update avatar:", err);
    }
  };

  const hasAvatar = Boolean(selectedAvatar);
  const completionPercentage = hasAvatar ? 100 : 75;

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      {/* =====================================================
          PAGE HEADING
          ===================================================== */}
      <div className="mb-6 sm:mb-7">
        <p className="mb-1.5 text-[10px] font-bold tracking-[2px] text-blue-600 sm:mb-2 sm:text-[11px]">
          ACCOUNT
        </p>

        <h1 className="text-2xl font-bold text-gray-900 sm:text-[32px]">
          My Profile
        </h1>

        <p className="mt-1.5 text-xs text-gray-500 sm:mt-2 sm:text-sm">
          View and manage your profile information.
        </p>
      </div>

      {/* =====================================================
          PROFILE CARD
          ===================================================== */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:mb-8 sm:rounded-[18px]">
        {/* Cover */}
        <div className="relative h-[90px] overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 sm:h-[105px] lg:h-[115px]">
          {/* Right circle */}
          <div className="absolute -right-12 -top-20 h-[180px] w-[180px] rounded-full border-[28px] border-white/10 sm:-right-[50px] sm:-top-[100px] sm:h-[220px] sm:w-[220px] sm:border-[35px]" />

          {/* Center circle */}
          <div className="absolute left-[55%] -top-10 h-[80px] w-[80px] rounded-full bg-white/10 sm:left-[45%] sm:-top-[50px] sm:h-[100px] sm:w-[100px]" />
        </div>

        {/* User Details */}
        <div className="flex items-start gap-4 px-4 pb-5 sm:gap-5 sm:px-6 sm:pb-7 lg:px-9 lg:pb-8">
          {/* Avatar */}
          <div className="relative -mt-10 shrink-0 sm:-mt-[48px] lg:-mt-[52px]">
            <div className="flex h-[82px] w-[82px] items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-gradient-to-br from-blue-600 to-violet-600 text-3xl font-bold text-white shadow-lg sm:h-[95px] sm:w-[95px] sm:border-[6px] sm:text-[35px] lg:h-[105px] lg:w-[105px] lg:text-[38px]">
              {selectedAvatar ? (
                <img
                  src={selectedAvatar}
                  alt="Avatar"
                  className="h-full w-full bg-slate-100 object-cover"
                />
              ) : (
                initial
              )}
            </div>

            {/* Camera */}
            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              className="absolute bottom-0.5 right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow transition hover:bg-blue-700 sm:h-8 sm:w-8"
              title="Choose Avatar"
            >
              <FaCamera className="text-[10px] sm:text-xs" />
            </button>
          </div>

          {/* User Information */}
          <div className="min-w-0 flex-1 pt-3 sm:pt-4 lg:pt-[18px]">
            {/* Name */}
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {isEditing ? (
                <div className="w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveName();
                        }

                        if (e.key === "Escape") {
                          handleCancel();
                        }
                      }}
                      autoFocus
                      disabled={loading}
                      className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base font-bold text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-xl"
                    />

                    <button
                      type="button"
                      onClick={handleSaveName}
                      disabled={loading}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
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
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      title="Cancel"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>

                  {errorMessage && (
                    <span className="mt-1 block text-xs font-medium text-red-500">
                      {errorMessage}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex min-w-0 items-center gap-2">
                  <h2 className="truncate text-lg font-bold text-gray-900 sm:text-[23px] lg:text-[25px]">
                    {name}
                  </h2>

                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="shrink-0 rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
                    title="Edit Name"
                  >
                    <FaPen className="text-xs sm:text-sm" />
                  </button>
                </div>
              )}
            </div>

            {/* Email + Joined Date */}
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-gray-500 sm:mt-3 sm:gap-6 sm:text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <FaEnvelope className="shrink-0" />

                <span className="truncate">
                  {email}
                </span>
              </span>

              <span className="flex items-center gap-2">
                <FaCalendarAlt className="shrink-0" />
                Joined {joinedDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          PROFILE COMPLETION
          ===================================================== */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-1 text-[9px] font-bold tracking-[1.5px] text-blue-600 sm:text-[10px]">
              PROFILE STATUS
            </p>

            <h2 className="text-base font-bold text-gray-900 sm:text-[19px]">
              Profile Completion
            </h2>

            <p className="mt-1.5 text-xs text-gray-500 sm:mt-2 sm:text-[13px]">
              Complete your profile to get the best CodeXel experience.
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-600 sm:px-3 sm:py-2 sm:text-[13px]">
            {completionPercentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="my-5 h-2 overflow-hidden rounded-full bg-gray-200 sm:my-6 sm:h-[9px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Checklist */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <ProfileItem
            text="Name added"
            completed={Boolean(name)}
          />

          <ProfileItem
            text="Email added"
            completed={Boolean(user?.email)}
          />

          <ProfileItem
            text="Account created"
            completed
          />

          <div
            onClick={() => setShowAvatarModal(true)}
            className="cursor-pointer transition hover:opacity-80"
          >
            <ProfileItem
              text={
                hasAvatar
                  ? "Avatar chosen"
                  : "Choose an avatar"
              }
              completed={hasAvatar}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          AVATAR SELECTION MODAL
          ===================================================== */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                Choose an Avatar
              </h3>

              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Pick one of the avatars below to represent your CodeXel profile.
            </p>

            {/* Avatars */}
            <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
              {AVATAR_OPTIONS.map((avatarUrl, index) => {
                const isSelected =
                  selectedAvatar === avatarUrl;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      handleSelectAvatar(avatarUrl)
                    }
                    className={`relative flex aspect-square items-center justify-center rounded-2xl border-2 p-2 transition hover:scale-105 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/50 shadow-md"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={avatarUrl}
                      alt={`Avatar option ${index + 1}`}
                      className="h-full w-full rounded-full object-contain"
                    />

                    {isSelected && (
                      <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white shadow">
                        <FaCheck />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Close */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
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
      className={`flex items-center gap-2 text-xs sm:text-sm ${
        completed ? "text-gray-700" : "text-gray-400"
      }`}
    >
      {completed ? (
        <FaCheckCircle className="shrink-0 text-emerald-500" />
      ) : (
        <div className="h-4 w-4 shrink-0 rounded-full border-2 border-gray-300" />
      )}

      <span>{text}</span>
    </div>
  );
}

export default ProfileOverview;