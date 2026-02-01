"use client";
import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { AuthLayout } from "../../page";
import { useParams, useRouter } from "next/navigation";
import { adminAPI } from "../../../../../lib/api"; // Adjust based on your folder depth
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";

export default function ResetPassword() {
  const params = useParams();
  const router = useRouter();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 12) return 2;
    return 3;
  };

  const strength = getStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    if (strength < 2) {
      return toast.error("Please use a stronger password.");
    }

    setIsLoading(true);
    try {
      // We send 'newPassword' because your backend destructures { newPassword } = req.body
      // Find this line in your handleSubmit:
      await adminAPI.resetPassword(token as string, password);

      toast.success("Password updated! Redirecting to login...");

      // Clear states for security
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/admin/auth/login-admin");
      }, 2000);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Reset failed. Link may be expired.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout
        title="Invalid Link"
        subtitle="This password reset link is invalid or has expired."
      >
        <Link
          href="/admin/auth/login-admin"
          className="text-blue-600 font-bold"
        >
          Return to Login
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="New Credentials"
      subtitle="Ensure your new password is at least 12 characters."
    >
      <Toaster position="top-right" />
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* New Password Field */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">
            New Password
          </label>
          <div className="relative">
            <input
              required
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl outline-none text-black focus:border-[#002D62] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#002D62]"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Strength Meter Bars */}
          <div className="grid grid-cols-3 gap-2 mt-3 px-1">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${strength >= 1 ? "bg-orange-500" : "bg-gray-200"}`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${strength >= 2 ? "bg-yellow-500" : "bg-gray-200"}`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${strength >= 3 ? "bg-emerald-500" : "bg-gray-200"}`}
            />
          </div>
          <p className="text-[10px] font-bold text-gray-400 mt-2 ml-1 uppercase tracking-wider">
            {strength === 0 && "Enter a password"}
            {strength === 1 && "Too weak"}
            {strength === 2 && "Almost there"}
            {strength === 3 && "Strong admin password"}
          </p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              required
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl outline-none text-black focus:border-[#002D62] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#002D62]"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Security Warning */}
        <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
          <ShieldCheck className="text-[#002D62] shrink-0" size={18} />
          <p className="text-[11px] text-[#002D62] leading-relaxed">
            Changing your password will sign you out of all active sessions
            across all devices for security.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#002D62] text-white rounded-xl font-bold shadow-xl shadow-blue-900/20 hover:bg-[#001D42] transition-all flex items-center justify-center disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Update & Secure Account"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
