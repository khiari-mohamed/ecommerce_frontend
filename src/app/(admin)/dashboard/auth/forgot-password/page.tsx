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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-2">Forgot Password</h2>
        {error && <div className="text-red-600 text-sm text-center mb-2">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center mb-2">{success}</div>}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Enter your admin email"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition-colors duration-200 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <div className="flex justify-center mt-2">
          <Link href="/dashboard/auth/login" className="text-purple-600 hover:underline text-sm">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default DashboardForgotPasswordPage;