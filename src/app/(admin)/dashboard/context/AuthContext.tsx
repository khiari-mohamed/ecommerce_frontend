"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loginAdmin,
  registerAdmin,
  requestPasswordReset,
  resetPassword,
} from "../../dashboard/utils/api";

interface AuthContextType {
  adminUsername: string | null;
  adminRole: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("dashboard_admin_token");
    const storedUsername = localStorage.getItem("dashboard_admin_username");
    const storedRole = localStorage.getItem("dashboard_admin_role");
    if (storedToken) setToken(storedToken);
    if (storedUsername) setAdminUsername(storedUsername);
    if (storedRole) setAdminRole(storedRole);
  }, []);

  const login = async (username: string, password: string) => {
    const { token, adminUsername, adminRole } = await loginAdmin(username, password);
    setToken(token);
    setAdminUsername(adminUsername);
    setAdminRole(adminRole);
    localStorage.setItem("dashboard_admin_token", token);
    localStorage.setItem("dashboard_admin_username", adminUsername);
    localStorage.setItem("dashboard_admin_role", adminRole);
  };

  const register = async (username: string, password: string, role = "admin") => {
    const { token, adminUsername, adminRole } = await registerAdmin(username, password, role);
    setToken(token);
    setAdminUsername(adminUsername);
    setAdminRole(adminRole);
    localStorage.setItem("dashboard_admin_token", token);
    localStorage.setItem("dashboard_admin_username", adminUsername);
    localStorage.setItem("dashboard_admin_role", adminRole);
  };

  const logout = () => {
    setToken(null);
    setAdminUsername(null);
    setAdminRole(null);
    localStorage.removeItem("dashboard_admin_token");
    localStorage.removeItem("dashboard_admin_username");
    localStorage.removeItem("dashboard_admin_role");
  };

  return (
    <AuthContext.Provider
      value={{
        adminUsername,
        adminRole,
        token,
        login,
        register,
        logout,
        requestPasswordReset,
        resetPassword,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};