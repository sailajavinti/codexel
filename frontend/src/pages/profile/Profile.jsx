import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProfileSidebar from "./ProfileSidebar";
import ProfileOverview from "./ProfileOverview";
import ProfileHistory from "./ProfileHistory";

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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f7f9fc] font-sans text-gray-900 max-md:flex-col">
      <ProfileSidebar
        user={user}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />

      <main className="min-w-0 flex-1 px-10 pb-[70px] pt-[45px] max-md:px-4 max-md:py-8">
        {activeSection === "profile" && (
          <ProfileOverview
            user={user}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeSection === "history" && <ProfileHistory />}
      </main>
    </div>
  );
}

export default Profile;