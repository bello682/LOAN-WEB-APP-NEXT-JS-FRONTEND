"use client";
import React, { useState, useEffect } from "react";
import { RefreshCcw, CheckCircle2 } from "lucide-react";
import { adminAPI, getErrorMessage } from "../../../../lib/api"; // Importing your API layer

interface ResendStateProps {
  email?: string;
}

export default function ResendState({ email }: ResendStateProps) {
  const [timeLeft, setTimeLeft] = useState(59);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Countdown Logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResend = async () => {
    if (!email) {
      setMessage({
        type: "error",
        text: "Admin email not found. Please restart registration.",
      });
      return;
    }

    setIsResending(true);
    setMessage(null);

    try {
      await adminAPI.resendOtp(email);

      // Success feedback
      setMessage({
        type: "success",
        text: "A new security code has been sent!",
      });
      setTimeLeft(59); // Reset timer

      // Clear success message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="text-center space-y-4 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 mt-8">
      {/* Dynamic Feedback Message */}
      {message && (
        <div
          className={`mb-2 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-tight ${
            message.type === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {message.type === "success" && <CheckCircle2 size={14} />}
          {message.text}
        </div>
      )}

      <p className="text-sm text-blue-700 font-medium">
        Didn't receive the code?
      </p>

      <button
        type="button"
        onClick={handleResend}
        disabled={timeLeft > 0 || isResending}
        className={`flex items-center justify-center gap-2 mx-auto text-[#002D62] font-black transition-all ${
          timeLeft > 0 || isResending
            ? "opacity-30 cursor-not-allowed"
            : "hover:underline underline-offset-4 decoration-2"
        }`}
      >
        {isResending ? <RefreshCcw size={16} className="animate-spin" /> : null}
        {isResending ? "Sending..." : "Resend New Code"}
      </button>

      {timeLeft > 0 && !isResending && (
        <div className="text-[10px] text-blue-400 uppercase tracking-widest font-bold flex items-center justify-center gap-1">
          Available in
          <span className="text-[#002D62] tabular-nums">
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </span>
        </div>
      )}
    </div>
  );
}
