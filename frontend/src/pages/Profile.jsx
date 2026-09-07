import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaLock,
  FaBell,
  FaShieldAlt,
  FaSignOutAlt,
  FaCheckCircle,
  FaHistory,
} from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [editName, setEditName] = useState("");

  /* ================= LOAD USER ================= */

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/auth");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("token");

          // Tell Header that the user is logged out
          window.dispatchEvent(new Event("authChange"));

          navigate("/auth");
          return;
        }

        setUser(data.user);
        setEditName(data.user.name || "");
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadUser();
  }, [navigate]);

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    // Remove authentication token
    localStorage.removeItem("token");

    // Tell Header to remove Profile immediately
    window.dispatchEvent(new Event("authChange"));

    // Close profile and go to Auth page
    navigate("/auth");
  };

  /* ================= SAVE NAME ================= */

  const handleSaveName = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/auth/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editName,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.user) {
        setUser(data.user);
        setEditName(data.user.name);
      }
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  /* ================= LOADING ================= */

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc] text-gray-500">
        Loading profile...
      </div>
    );
  }

  const userName = user.name || "User";
  const email = user.email || "No email available";

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const initial = userName.charAt(0).toUpperCase();

  /* ================= PROFILE ================= */

  const renderProfile = () => {
    return (
      <div className="max-w-[1180px] mx-auto">

        <div className="mb-7">
          <p className="text-blue-600 text-[11px] font-bold tracking-[2px] mb-2">
            ACCOUNT
          </p>

          <h1 className="text-[32px] font-bold text-gray-900">
            My Profile
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            View and manage your profile information.
          </p>
        </div>

        {/* PROFILE HERO */}

        <div className="bg-white rounded-[18px] overflow-hidden border border-gray-200 shadow-sm mb-8">

          <div className="h-[115px] relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
            <div className="absolute w-[220px] h-[220px] rounded-full border-[35px] border-white/10 right-[-50px] top-[-100px]" />

            <div className="absolute w-[100px] h-[100px] rounded-full bg-white/10 left-[45%] top-[-50px]" />
          </div>

          <div className="flex items-center gap-5 px-9 pb-8 max-md:flex-col max-md:items-start max-md:px-5">

            <div className="w-[105px] h-[105px] min-w-[105px] -mt-[52px] rounded-full border-[6px] border-white bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center text-[38px] font-bold shadow-lg">
              {initial}
            </div>

            <div className="flex-1 pt-[18px]">

              <div className="flex items-center gap-3 flex-wrap">

                <h2 className="text-[25px] font-bold">
                  {userName}
                </h2>

                <span className="bg-emerald-50 text-emerald-600 px-3 py-[5px] rounded-full text-xs font-semibold flex items-center gap-1">
                  <FaCheckCircle />
                  Active
                </span>

              </div>

              <div className="flex flex-wrap gap-6 mt-3 text-gray-500 text-sm max-md:flex-col max-md:gap-2">

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

        {/* PROFILE COMPLETION */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

          <div className="flex justify-between items-start gap-5">

            <div>
              <p className="text-blue-600 text-[10px] font-bold tracking-[1.5px] mb-1">
                PROFILE STATUS
              </p>

              <h2 className="text-[19px] font-bold">
                Profile Completion
              </h2>

              <p className="text-gray-500 text-[13px] mt-2">
                Complete your profile to get the best CodeXel experience.
              </p>
            </div>

            <span className="bg-blue-50 text-blue-600 px-3 py-2 rounded-full font-bold text-[13px]">
              75%
            </span>

          </div>

          <div className="h-[9px] bg-gray-200 rounded-full my-6 overflow-hidden">
            <div className="w-3/4 h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full" />
          </div>

          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FaCheckCircle className="text-emerald-500" />
              <span>Name added</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FaCheckCircle className="text-emerald-500" />
              <span>Email added</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FaCheckCircle className="text-emerald-500" />
              <span>Account created</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
              <span>Add profile picture</span>
            </div>

          </div>
        </div>

      </div>
    );
  };

  /* ================= HISTORY ================= */

  const renderHistory = () => {
    return (
      <div className="max-w-[1000px] mx-auto">

        <div className="mb-8">

          <p className="text-blue-600 text-[11px] font-bold tracking-[2px] mb-2">
            ACTIVITY
          </p>

          <h1 className="text-[32px] font-bold">
            History
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            View your recent CodeXel activity.
          </p>

        </div>

        <div className="bg-white border border-gray-200 rounded-2xl px-8 py-[70px] text-center">

          <div className="w-[70px] h-[70px] mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[27px]">
            <FaHistory />
          </div>

          <h2 className="mt-5 text-xl font-bold">
            No History Yet
          </h2>

          <p className="text-gray-500 text-sm">
            Your recent project activity will appear here.
          </p>

        </div>

      </div>
    );
  };

  /* ================= SETTINGS ================= */

  const renderSettings = () => {
    return (
      <div className="max-w-[1000px] mx-auto">

        <div className="mb-8">

          <p className="text-blue-600 text-[11px] font-bold tracking-[2px] mb-2">
            ACCOUNT
          </p>

          <h1 className="text-[32px] font-bold">
            Settings
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Manage your account preferences and security.
          </p>

        </div>

        {/* PERSONAL INFORMATION */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">

          <div className="flex items-center gap-4">

            <div className="w-[45px] h-[45px] rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
              <FaUser />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Personal Information
              </h2>

              <p className="mt-1 text-gray-500 text-[13px]">
                Edit your profile details.
              </p>
            </div>

          </div>

          <div className="mt-6">

            <label className="block text-gray-700 text-[13px] font-semibold mb-2">
              Name
            </label>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full box-border px-3 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-600 text-sm"
            />

            <label className="block text-gray-700 text-[13px] font-semibold mt-4 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              readOnly
              className="w-full box-border px-3 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
            />

            <button
              onClick={handleSaveName}
              className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-[18px] py-[11px] rounded-lg cursor-pointer font-semibold"
            >
              Save Changes
            </button>

          </div>

        </div>

        {/* PASSWORD */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">

          <div className="flex items-center gap-4">

            <div className="w-[45px] h-[45px] rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
              <FaLock />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Password & Security
              </h2>

              <p className="mt-1 text-gray-500 text-[13px]">
                Manage your account password.
              </p>
            </div>

          </div>

          <button className="mt-5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-4 py-[11px] rounded-lg cursor-pointer flex items-center gap-3">
            Change Password
            <span>→</span>
          </button>

        </div>

        {/* NOTIFICATIONS */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">

          <div className="flex items-center gap-4">

            <div className="w-[45px] h-[45px] rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg">
              <FaBell />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Notifications
              </h2>

              <p className="mt-1 text-gray-500 text-[13px]">
                Manage your notification preferences.
              </p>
            </div>

          </div>

          <button className="mt-5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-4 py-[11px] rounded-lg cursor-pointer flex items-center gap-3">
            Notification Settings
            <span>→</span>
          </button>

        </div>

        {/* PRIVACY */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">

          <div className="flex items-center gap-4">

            <div className="w-[45px] h-[45px] rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-lg">
              <FaShieldAlt />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Privacy & Security
              </h2>

              <p className="mt-1 text-gray-500 text-[13px]">
                Control your account privacy.
              </p>
            </div>

          </div>

          <button className="mt-5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-4 py-[11px] rounded-lg cursor-pointer flex items-center gap-3">
            Privacy Settings
            <span>→</span>
          </button>

        </div>

      </div>
    );
  };

  /* ================= CONTENT ================= */

  const renderContent = () => {
    if (activeSection === "history") {
      return renderHistory();
    }

    if (activeSection === "settings") {
      return renderSettings();
    }

    return renderProfile();
  };

  /* ================= MAIN PAGE ================= */

  return (
    <div className="min-h-screen flex bg-[#f7f9fc] text-gray-900 font-sans max-md:flex-col">

      {/* SIDEBAR */}

      <aside className="w-[250px] min-h-screen bg-white border-r border-gray-200 flex flex-col px-4 py-6 sticky top-0 max-md:w-full max-md:min-h-0 max-md:relative">

        {/* USER */}

        <div className="flex items-center gap-3 px-[10px] pb-6 border-b border-gray-100">

          <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center text-white text-lg font-bold bg-gradient-to-br from-blue-600 to-violet-600">
            {initial}
          </div>

          <div className="min-w-0">

            <h3 className="text-sm max-w-[145px] overflow-hidden text-ellipsis whitespace-nowrap">
              {userName}
            </h3>

            <p className="mt-1 text-gray-400 text-xs">
              My Account
            </p>

          </div>

        </div>

        {/* MENU */}

        <nav className="flex flex-col gap-[6px] mt-6">

          {/* PROFILE */}

          <button
            className={`w-full px-[14px] py-[13px] rounded-[10px] flex items-center gap-[13px] text-sm cursor-pointer text-left transition ${
              activeSection === "profile"
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setActiveSection("profile")}
          >
            <FaUser />
            <span>Profile</span>
          </button>

          {/* HISTORY */}

          <button
            className={`w-full px-[14px] py-[13px] rounded-[10px] flex items-center gap-[13px] text-sm cursor-pointer text-left transition ${
              activeSection === "history"
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setActiveSection("history")}
          >
            <FaHistory />
            <span>History</span>
          </button>

          {/* SETTINGS */}

          <button
            className={`w-full px-[14px] py-[13px] rounded-[10px] flex items-center gap-[13px] text-sm cursor-pointer text-left transition ${
              activeSection === "settings"
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setActiveSection("settings")}
          >
            <FaShieldAlt />
            <span>Settings</span>
          </button>

          {/* LOGOUT */}

          <button
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-[14px] py-[13px] rounded-[10px] flex items-center gap-[13px] text-sm cursor-pointer transition"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>

        </nav>
      </aside>

      {/* MAIN CONTENT */}

      <main className="flex-1 min-w-0 px-10 pt-[45px] pb-[70px] max-md:px-4 max-md:py-8">
        {renderContent()}
      </main>

    </div>
  );
}

export default Profile;