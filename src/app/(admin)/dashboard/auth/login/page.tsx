"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../dashboard/context/AuthContext";
import Link from "next/link";
import "../../../dashboard/styles/dashboard.css";

const DashboardLoginPage = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="auth-card"
      >
        <h2 className="auth-title">Admin Dashboard Login</h2>
        {error && (
          <div className="auth-error">{error}</div>
        )}
        <div className="auth-field">
          <label htmlFor="username" className="auth-label">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="auth-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
            placeholder="Enter your admin username"
          />
        </div>
        <div className="auth-field">
          <label htmlFor="password" className="auth-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="auth-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="auth-links">
          <Link href="/dashboard/auth/forgot-password" className="auth-link">
            Forgot password?
          </Link>
          <span className="mx-2 text-gray-400">|</span>
          <Link href="/dashboard/auth/register" className="auth-link">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default DashboardLoginPage;