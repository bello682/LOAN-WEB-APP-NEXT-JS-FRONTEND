"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthLayout } from "../page";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../../lib/redux/hooks";
import {
  loginAdmin,
  clearError,
  clearSuccess,
} from "../../../../lib/redux/features/adminSlice";

export default function LoginAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Redux State
  const { isLoading, error, isSuccess, admin } = useAppSelector(
    (state) => state.admin,
  );

  // 1. On Mount: Check the grouped storage for login info
  useEffect(() => {
    const savedInfo = localStorage.getItem("admin_login_info");
    if (savedInfo) {
      const { savedEmail, savedPassword, savedCheck } = JSON.parse(savedInfo);
      if (savedCheck) {
        setEmail(savedEmail || "");
        // setPassword(savedPassword || "");
        setRememberMe(true);
      }
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // 2. Success/Error Toast Listener
  useEffect(() => {
    // Handle Success
    if (isSuccess && admin) {
      toast.success(`Welcome back, ${admin.name || "Admin"}!`);
      const timer = setTimeout(() => {
        router.push("/admin");
        // Note: We clear success AFTER we have arrived at the new page
      }, 1500);
      return () => clearTimeout(timer);
    }

    // Handle Error
    if (error) {
      toast.error(error);
      // Remove dispatch(clearError()) from here temporarily
      // or call it only when the user starts typing again.
    }
  }, [isSuccess, error, admin, router]); // Remove dispatch from dependencies to avoid loops

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resultAction = await dispatch(loginAdmin({ email, password }));

    // Check if it was actually successful in the payload
    if (loginAdmin.fulfilled.match(resultAction)) {
      // Check if the backend actually sent a success status/data
      // This is a safety net in case your Thunk is misconfigured
      if (resultAction.payload?.error) {
        return; // Stop here if there's an error in the payload
      }

      if (rememberMe) {
        localStorage.setItem(
          "admin_login_info",
          JSON.stringify({
            savedEmail: email,
            savedCheck: true,
          }),
        );
      } else {
        localStorage.removeItem("admin_login_info");
      }
    }
  };

  return (
    <AuthLayout
      title="Admin Login"
      subtitle="Access your management dashboard."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Error Display */}
        {error && (
          <div className="p-3 text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl text-center uppercase">
            {error}
          </div>
        )}

        {/* Email Input */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">
            Work Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@company.com"
            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl outline-none text-black focus:border-[#002D62] transition-all"
          />
        </div>

        {/* Password Input Group */}
        <div>
          <div className="flex justify-between items-end mb-1 ml-1">
            <label className="block text-xs font-bold uppercase text-gray-400">
              Password
            </label>
            <Link
              href="/admin/auth/forget-admin-password"
              className="text-xs font-bold text-[#002D62] hover:text-[#EBB04D] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl outline-none text-black focus:border-[#002D62] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#002D62] transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center ml-1">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-[#002D62] border-gray-300 rounded focus:ring-[#002D62] cursor-pointer"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 text-xs font-bold text-gray-500 cursor-pointer"
          >
            Remember this device
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#002D62] text-white rounded-xl font-bold shadow-xl shadow-blue-900/20 hover:bg-[#001D42] transition-all flex items-center justify-center disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Sign In to Dashboard"
          )}
        </button>

        <p className="text-center text-sm text-gray-500">
          New administrator?{" "}
          <Link
            href="/admin/auth/register-admin"
            className="text-[#002D62] font-bold"
          >
            Request Access
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
