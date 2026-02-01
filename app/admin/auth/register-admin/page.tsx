"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Lock, Loader2 } from "lucide-react";
import { AuthLayout } from "../page";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../lib/redux/hooks";
import {
  registerAdmin,
  clearError,
  clearSuccess,
} from "../../../../lib/redux/features/adminSlice";

export default function RegisterAdmin() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get Redux state
  const { isLoading, error, isSuccess } = useAppSelector(
    (state) => state.admin,
  );

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  // Handle Redirection on Success
  useEffect(() => {
    if (isSuccess) {
      router.push("/admin/auth/verify-admin-otp");
    }
    // Cleanup error on unmount
    return () => {
      dispatch(clearError());
    };
  }, [isSuccess, router, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const adminData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email.trim(),
      phoneNumber: `+234${formData.phoneNumber}`,
      password: formData.password,
    };

    // 1. Dispatch the action and wait for the result
    const resultAction = await dispatch(registerAdmin(adminData));

    // 2. Check if the registration was successful
    if (registerAdmin.fulfilled.match(resultAction)) {
      // SAVE EMAIL HERE before moving
      sessionStorage.setItem("pendingAdminEmail", formData.email);
      // 3. Navigate to OTP page
      router.push("/admin/auth/verify-admin-otp");

      // 4. Reset the success flag so the OTP page doesn't auto-redirect to dashboard
      dispatch(clearSuccess());
    }
  };

  return (
    <AuthLayout
      title="Create Admin Account"
      subtitle="Join the lending management team."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Error Message Display */}
        {error && (
          <div className="p-3 text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl text-center uppercase tracking-wide">
            {error}
          </div>
        )}

        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">
              First Name
            </label>
            <input
              required
              name="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl outline-none text-black focus:border-[#002D62] transition-all placeholder:text-gray-300"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">
              Last Name
            </label>
            <input
              required
              name="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl outline-none text-black focus:border-[#002D62] transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">
            Work Email
          </label>
          <input
            required
            name="email"
            type="email"
            placeholder="admin@company.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl outline-none text-black focus:border-[#002D62] transition-all placeholder:text-gray-300"
          />
        </div>

        {/* Phone Number Field */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-200 pr-3">
              <Phone size={16} className="text-gray-400" />
              <span className="text-sm font-bold text-[#002D62]">+234</span>
            </div>
            <input
              required
              name="phoneNumber"
              type="tel"
              placeholder="801 234 5678"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full pl-24 pr-4 py-4 bg-white border border-gray-200 rounded-xl outline-none text-black focus:border-[#002D62] transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Lock size={16} className="text-gray-400" />
            </div>
            <input
              required
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl outline-none text-black focus:border-[#002D62] transition-all placeholder:text-gray-300"
            />
          </div>
          <p className="mt-1.5 ml-1 text-[10px] text-gray-400 italic">
            Must be at least 8 characters with a symbol.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#002D62] text-white rounded-xl font-bold shadow-lg shadow-blue-900/10 hover:bg-[#001D42] transition-all mt-2 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Initialize Registration"
          )}
        </button>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already an admin?{" "}
          <Link
            href="/admin/auth/login-admin"
            className="text-[#002D62] font-bold hover:text-[#EBB04D] transition-colors"
          >
            Login here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
