"use client";
import React, { useState, useRef, useEffect } from "react";
import { ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { AuthLayout } from "../page";
import ResendState from "../resend-admin-otp/ResendState";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../../../lib/redux/hooks";
import {
  verifyAdminOtp,
  clearError,
  clearSuccess,
} from "../../../../lib/redux/features/adminSlice";

export default function VerifyOtp() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [displayEmail, setDisplayEmail] = useState("");

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isVerifying, setIsVerifying] = useState(false);

  // Get state from Redux
  const { isLoading, error, isSuccess, admin } = useAppSelector(
    (state) => state.admin,
  );

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value.substring(element.value.length - 1);
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    data.forEach((char, index) => {
      if (!isNaN(Number(char))) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);
    const nextIndex = data.length >= 6 ? 5 : data.length;
    inputRefs.current[nextIndex]?.focus();
  };

  useEffect(() => {
    // ONLY redirect if isSuccess is true AND we were actually in the middle of verifying
    // Check if verification was successful
    if (isSuccess && admin && isVerifying) {
      // 1. CLEAN UP: Remove the temporary email from storage
      sessionStorage.removeItem("pendingAdminEmail");
      //  / 2. NAVIGATE: Send them to the login page
      router.push("/admin/auth/login-admin");

      // 3. RESET: Clear the success flag so they don't get stuck in a loop
      dispatch(clearSuccess());
    }
  }, [isSuccess, admin, router, isVerifying, dispatch]);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("pendingAdminEmail");
    if (admin?.email) {
      setDisplayEmail(admin.email);
    } else if (savedEmail) {
      setDisplayEmail(savedEmail);
      // Optionally: dispatch an action to put this email back into Redux
    }
  }, [admin]);

  const handleVerify = () => {
    const otpString = otp.join("");

    // Use the email from Redux OR the one we recovered from sessionStorage
    const emailToVerify =
      admin?.email || sessionStorage.getItem("pendingAdminEmail");

    if (otpString.length === 6 && emailToVerify) {
      setIsVerifying(true);
      dispatch(verifyAdminOtp({ email: emailToVerify, otp: otpString }));
    }
  };

  return (
    <AuthLayout
      title="Security Verification"
      subtitle={
        admin?.email || displayEmail ? (
          <span>
            A 6-digit code has been sent to your registered admin email:{" "}
            <strong className="text-[#002D62] break-all">
              {admin?.email || displayEmail}
            </strong>
          </span>
        ) : (
          "Verification email not found. Please go back and try again."
        )
      }
    >
      <div className="space-y-8">
        {!admin?.email && (
          <Link
            href="/admin/auth/register-admin"
            className="flex items-center justify-center gap-2 text-sm font-bold text-[#002D62] hover:underline"
          >
            <ArrowLeft size={16} /> Back to Registration
          </Link>
        )}

        {error && (
          <div className="p-3 text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl text-center uppercase tracking-wide">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-2xl border border-gray-200">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#002D62]">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Verification Method
            </p>
            <p className="text-sm font-bold text-[#002D62]">
              Two-Factor Auth (2FA)
            </p>
          </div>
        </div>

        <div
          className="flex justify-between gap-2 sm:gap-4"
          onPaste={handlePaste}
        >
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              name="otp"
              maxLength={1}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-full h-14 sm:h-16 text-center text-2xl font-black bg-white border-2 border-gray-200 rounded-xl focus:border-[#002D62] focus:ring-4 focus:ring-[#002D62]/5 outline-none text-[#002D62] transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          // The button is now enabled if we have 6 digits AND an email from any source
          disabled={
            otp.join("").length < 6 ||
            isLoading ||
            (!admin?.email && !displayEmail)
          }
          className="w-full py-4 bg-[#002D62] text-white rounded-xl font-bold shadow-xl shadow-blue-900/20 hover:bg-[#001D42] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Verify & Access Dashboard"
          )}
        </button>

        <ResendState email={displayEmail || admin?.email} />
      </div>
    </AuthLayout>
  );
}
