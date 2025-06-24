"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../dashboard/context/AuthContext";
import Link from "next/link";
import "../../../dashboard/styles/dashboard.css";

const DashboardRegisterPage = () => {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await register(username, password);
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => router.replace("/dashboard"), 1500);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
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
        <h2 className="auth-title">Admin Register</h2>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
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
            placeholder="Choose a username"
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
            placeholder="Create a password"
          />
        </div>
        <div className="auth-field">
          <label htmlFor="confirmPassword" className="auth-label">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="auth-input"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
          />
        </div>
        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="auth-links">
          <Link href="/dashboard/auth/login" className="auth-link">
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default DashboardRegisterPage;