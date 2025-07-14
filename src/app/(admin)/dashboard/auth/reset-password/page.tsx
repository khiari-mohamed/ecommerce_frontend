"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../dashboard/context/AuthContext";
import Link from "next/link";
import "../../../dashboard/styles/dashboard.css";

// Move the main logic into a separate component
const DashboardResetPasswordPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get token from query string
  const token = searchParams?.get("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => router.replace("/dashboard/auth/login"), 1500);
    } catch (err: any) {
      setError(err.message || "Password reset failed.");
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
        <h2 className="auth-title">Reset Password</h2>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        <div className="auth-field">
          <label htmlFor="newPassword" className="auth-label">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            className="auth-input"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            placeholder="Enter new password"
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
            placeholder="Confirm new password"
          />
        </div>
        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
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

const DashboardResetPasswordPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <DashboardResetPasswordPageContent />
  </Suspense>
);

export default DashboardResetPasswordPage;