"use client";
import React, { useState } from "react";
import { useAuth } from "../../../dashboard/context/AuthContext";
import Link from "next/link";
import "../../../dashboard/styles/dashboard.css";


const DashboardForgotPasswordPage = () => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSuccess("Password reset link sent! Check your email.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
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
        <h2 className="auth-title">Forgot Password</h2>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        <div className="auth-field">
          <label htmlFor="email" className="auth-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="auth-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Enter your admin email"
          />
        </div>
        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <div className="auth-links">
          <Link href="/dashboard/auth/login" className="auth-link">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default DashboardForgotPasswordPage;