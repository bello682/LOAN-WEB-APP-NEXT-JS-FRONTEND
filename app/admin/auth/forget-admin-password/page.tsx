"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ChevronLeft,
  Mail,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { AuthLayout } from "../page";
import { adminAPI } from "../../../../lib/api"; // Adjust path to your API layer
import { toast, Toaster } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Assuming your API has a forgotPassword method
      await adminAPI.forgotPassword(email);

      setIsSubmitted(true);
      toast.success("Recovery instructions sent!");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // If the email was sent successfully, show the success state
  if (isSubmitted) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="Recovery link sent successfully."
      >
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
              <CheckCircle2 size={48} />
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            We've sent a password reset link to <br />
            <strong className="text-[#002D62]">{email}</strong>. <br />
            Please check your inbox and follow the instructions.
          </p>
          <div className="pt-4">
            <Link
              href="/admin/auth/login-admin"
              className="inline-flex items-center gap-2 text-[#002D62] font-bold hover:underline"
            >
              <ChevronLeft size={16} /> Back to Login
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Access"
      subtitle="We'll send you instructions to regain access."
    >
      <Toaster position="top-right" />
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Security Notice Box */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
          <AlertCircle className="text-amber-600 shrink-0" size={20} />
          <p className="text-xs text-amber-700 leading-relaxed font-medium">
            For security reasons, resetting admin passwords requires email
            verification and may trigger an audit log for compliance tracking.
          </p>
        </div>

        {/* Email Input with Icon */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">
            Admin Email Address
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@loanexample.com"
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl outline-none text-black focus:border-[#002D62] transition-all placeholder:text-gray-300"
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#002D62] text-white rounded-xl font-bold shadow-lg shadow-blue-900/10 hover:bg-[#001D42] transition-all flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Send Recovery Link"
            )}
          </button>

          <Link
            href="/admin/auth/login-admin"
            className="flex items-center justify-center gap-2 w-full py-2 text-sm font-bold text-gray-500 hover:text-[#002D62] transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
