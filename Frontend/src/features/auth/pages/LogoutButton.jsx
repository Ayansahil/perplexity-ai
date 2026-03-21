import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { handleLogout: performLogout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogoutClick = async () => {
    setLoading(true);
    try {
      await performLogout();
      toast.success("Logged out successfully.");
    } catch (err) {
      // Log error but still proceed to navigate to login
      console.error("Logout failed:", err);
      toast.error("Logout failed. Please try again.");
    } finally {
      // Always navigate to login page after attempting logout
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogoutClick}
      disabled={loading}
      className="w-full flex items-center gap-3 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/8 rounded-xl transition-colors disabled:opacity-50"
    >
      <span
        className="material-symbols-outlined select-none text-sm"
        style={{ fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24" }}
      >
        logout
      </span>
      <span>{loading ? 'Logging out...' : 'Logout'}</span>
    </button>
  );
};

export default LogoutButton;