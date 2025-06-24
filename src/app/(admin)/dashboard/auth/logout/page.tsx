"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../dashboard/context/AuthContext";
import { logoutAdmin } from "../../../dashboard/utils/api"; // <-- ADD THIS LINE
import "../../../dashboard/styles/dashboard.css";

const DashboardLogoutPage = () => {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const doLogout = async () => {
      try {
        if (token) {
          await logoutAdmin(token);
        }
        logout(); // Clear context/localStorage
        router.replace("/dashboard/auth/login");
      } catch (err: any) {
        setError(err.message || "Logout failed.");
        // Still clear local state and redirect
        logout();
        router.replace("/dashboard/auth/login");
      }
    };
    doLogout();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="auth-bg flex min-h-screen items-center justify-center">
      <div className="auth-card">
        <h2 className="auth-title">Logging out...</h2>
        {error && <div className="auth-error">{error}</div>}
      </div>
    </div>
  );
};

export default DashboardLogoutPage;