import { useState } from "react";
import {
  FaUser,
  FaLock,
  FaBell,
  FaShieldAlt,
} from "react-icons/fa";

function ProfileSettings({ user, onUpdateProfile }) {
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const email = user?.email || "";

  const handleSave = async () => {
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    try {
      setSaving(true);

      await onUpdateProfile(name.trim());

      setMessage("Profile updated successfully");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1000px]">

      {/* Heading */}
      <div className="mb-8">
        <p className="mb-2 text-[11px] font-bold tracking-[2px] text-blue-600">
          ACCOUNT
        </p>

        <h1 className="text-[32px] font-bold text-gray-900">
          Settings
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage your account preferences and security.
        </p>
      </div>

      {/* Personal Information */}
      <section className="mb-5 rounded-2xl border border-gray-200 bg-white p-6">

        <SectionHeader
          icon={<FaUser />}
          iconClass="bg-blue-50 text-blue-600"
          title="Personal Information"
          description="Edit your profile details."
        />

        <div className="mt-6">

          <label className="mb-2 block text-[13px] font-semibold text-gray-700">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-blue-600"
          />

          <label className="mb-2 mt-4 block text-[13px] font-semibold text-gray-700">
            Email
          </label>

          <input
            type="email"
            value={email}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-600 outline-none"
          />

          {error && (
            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {message && (
            <p className="mt-3 text-sm text-emerald-600">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-5 rounded-lg bg-blue-600 px-[18px] py-[11px] font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>
      </section>

      {/* Password */}
      <section className="mb-5 rounded-2xl border border-gray-200 bg-white p-6">
        <SectionHeader
          icon={<FaLock />}
          iconClass="bg-emerald-50 text-emerald-600"
          title="Password & Security"
          description="Manage your account password."
        />

        <button
          type="button"
          className="mt-5 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-[11px] text-gray-700 transition hover:bg-gray-100"
        >
          Change Password
          <span>→</span>
        </button>
      </section>

      {/* Notifications */}
      <section className="mb-5 rounded-2xl border border-gray-200 bg-white p-6">
        <SectionHeader
          icon={<FaBell />}
          iconClass="bg-orange-50 text-orange-600"
          title="Notifications"
          description="Manage your notification preferences."
        />

        <button
          type="button"
          className="mt-5 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-[11px] text-gray-700 transition hover:bg-gray-100"
        >
          Notification Settings
          <span>→</span>
        </button>
      </section>

      {/* Privacy */}
      <section className="mb-5 rounded-2xl border border-gray-200 bg-white p-6">
        <SectionHeader
          icon={<FaShieldAlt />}
          iconClass="bg-violet-50 text-violet-600"
          title="Privacy & Security"
          description="Control your account privacy."
        />

        <button
          type="button"
          className="mt-5 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-[11px] text-gray-700 transition hover:bg-gray-100"
        >
          Privacy Settings
          <span>→</span>
        </button>
      </section>

    </div>
  );
}

function SectionHeader({
  icon,
  iconClass,
  title,
  description,
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-[45px] w-[45px] items-center justify-center rounded-xl text-lg ${iconClass}`}
      >
        {icon}
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900">
          {title}
        </h2>

        <p className="mt-1 text-[13px] text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

export default ProfileSettings;