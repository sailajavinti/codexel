import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

import ProfileSidebar from "./ProfileSidebar";
import ProfileOverview from "./ProfileOverview";
import ProfileHistory from "./ProfileHistory";
import ProfilePassword from "./ProfilePassword";

import {
  getProfile,
  updateProfile,
} from "../../services/profileService";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data.user);
      } catch (error) {
        console.error("Error loading profile:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.dispatchEvent(new Event("authChange"));
        navigate("/auth");
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChange"));
    navigate("/auth");
  };

  const handleUpdateProfile = async (payload) => {
    const data = await updateProfile(payload);

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.dispatchEvent(new Event("authChange"));
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <FaSpinner className="animate-spin text-3xl text-blue-600" />
          <span className="text-sm font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      {/* Sidebar & Mobile Navigation */}
      <ProfileSidebar
        user={user}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="max-w-5xl mx-auto">
          {activeSection === "profile" && (
            <ProfileOverview
              user={user}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeSection === "history" && <ProfileHistory />}
          {activeSection === "password" && <ProfilePassword />}
        </div>
      </main>
    </div>
  );
}

export default Profile;