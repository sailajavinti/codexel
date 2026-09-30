import { useState } from "react";
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
  const [prevUser, setPrevUser] = useState(user);
  const [name, setName] = useState(user?.name || "User");
  const [selectedAvatar, setSelectedAvatar] = useState(
    user?.avatar || ""
  );
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (user !== prevUser) {
    setPrevUser(user);
    setName(user?.name || "User");
    setSelectedAvatar(user?.avatar || "");
  }

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
      setErrorMessage("Name must be at least 2 characters.");
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
    <div className="w-full">
      {/* Page Heading */}
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-[10px] font-bold tracking-wider text-blue-700 uppercase mb-2">
          Account Settings
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          My Profile
        </h1>

        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          View and manage your personal developer information and avatar.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="mb-6 sm:mb-8 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
        {/* Cover Banner with Technical Pattern */}
        <div className="relative h-24 sm:h-28 lg:h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 overflow-hidden">
          <div
            className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-15"
            aria-hidden="true"
          />
        </div>

        {/* User Details & Avatar */}
        <div className="px-5 pb-6 sm:px-8 sm:pb-8">
          {/* Avatar - Overlaps bottom edge of banner naturally */}
          <div className="relative -mt-12 sm:-mt-14 inline-block">
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl sm:text-3xl font-bold text-white shadow-md">
              {selectedAvatar ? (
                <img
                  src={selectedAvatar}
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg border-2 border-white bg-blue-600 text-white shadow-xs transition hover:bg-blue-700 cursor-pointer"
              title="Change Avatar"
              aria-label="Change Avatar"
            >
              <FaCamera className="text-[10px]" />
            </button>
          </div>

          {/* User Info & Actions - Positioned cleanly BELOW the blue banner */}
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Name, Email, Joined Date */}
            <div className="min-w-0">
              {isEditing ? (
                <div>
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
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm sm:text-base font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />

                    <button
                      type="button"
                      onClick={handleSaveName}
                      disabled={loading}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
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
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
                      title="Cancel"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>

                  {errorMessage && (
                    <span className="mt-1 block text-xs text-red-600 font-medium">
                      {errorMessage}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                    {name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Edit Name"
                  >
                    <FaPen className="text-xs" />
                  </button>
                </div>
              )}

              {/* Email and Joined date */}
              <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 truncate">
                  <FaEnvelope className="text-[11px] text-slate-400 shrink-0" />
                  <span className="truncate">{email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt className="text-[11px] text-slate-400 shrink-0" />
                  <span>Joined {joinedDate}</span>
                </span>
              </div>
            </div>

            {/* Choose Avatar button */}
            <div className="shrink-0 pt-1 sm:pt-0">
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                <FaCamera className="text-xs text-slate-400" />
                <span>Choose Avatar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completion Status Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">
              Profile Status
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Profile Completion
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Complete your profile for seamless project authorship and collaboration.
            </p>
          </div>

          <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200/80 px-3 py-1 text-xs font-bold text-blue-700 shadow-2xs">
            {completionPercentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="my-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
          <ProfileItem text="Display name added" completed={Boolean(name)} />
          <ProfileItem text="Email address verified" completed={Boolean(user?.email)} />
          <ProfileItem text="Developer account active" completed />
          <div
            onClick={() => setShowAvatarModal(true)}
            className="cursor-pointer transition hover:opacity-80"
          >
            <ProfileItem
              text={hasAvatar ? "Profile avatar chosen" : "Choose an avatar"}
              completed={hasAvatar}
            />
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Choose an Avatar
              </h3>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <p className="mt-2.5 text-xs text-slate-500 leading-relaxed">
              Pick one of the pre-rendered developer avatars below for your profile.
            </p>

            {/* Avatar Grid */}
            <div className="mt-5 grid grid-cols-3 gap-3.5">
              {AVATAR_OPTIONS.map((avatarUrl, index) => {
                const isSelected = selectedAvatar === avatarUrl;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectAvatar(avatarUrl)}
                    className={`relative flex aspect-square items-center justify-center rounded-xl border-2 p-1.5 transition-all cursor-pointer ${isSelected
                        ? "border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/20"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:scale-105"
                      }`}
                  >
                    <img
                      src={avatarUrl}
                      alt={`Avatar option ${index + 1}`}
                      className="h-full w-full rounded-lg object-cover"
                    />

                    {isSelected && (
                      <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white shadow-2xs">
                        <FaCheck />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
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
      className={`flex items-center gap-2.5 text-xs sm:text-sm font-medium ${completed ? "text-slate-800" : "text-slate-400"
        }`}
    >
      {completed ? (
        <FaCheckCircle className="shrink-0 text-emerald-500 text-sm" />
      ) : (
        <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-slate-300" />
      )}
      <span>{text}</span>
    </div>
  );
}

export default ProfileOverview;