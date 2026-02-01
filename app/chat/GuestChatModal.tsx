"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { X, Mail, User, MessageSquare, Loader2,  ArrowRight,   CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/redux/hooks";
import { initGuestChat } from "@/lib/redux/features/guestChatSlice";

interface GuestChatModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: (session: any) => void;
}

export default function GuestChatModal({
	isOpen,
	onClose,
	onSuccess,
}: GuestChatModalProps) {
	const dispatch = useAppDispatch();
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	// Load saved guest info from localStorage when modal opens
  useEffect(() => {
    if (isOpen && !fullName && !email && typeof window !== "undefined") {
      // Prevent loading guest info if a registered user is present
      const token = localStorage.getItem("token");
      if (token) return;
      const savedInfo = localStorage.getItem("guest_info");
      if (savedInfo) {
        try {
          const { fullName: savedName, email: savedEmail } = JSON.parse(savedInfo);
          if (savedName) setFullName(savedName);
          if (savedEmail) setEmail(savedEmail);
        } catch (error) {
          console.error("Failed to load saved guest info:", error);
        }
      }
    }
  }, [isOpen]);

	const validateForm = () => {
		const newErrors: { [key: string]: string } = {};

		if (!fullName.trim()) {
			newErrors.fullName = "Please enter your name";
		}

		if (!email.trim()) {
			newErrors.email = "Please enter your email";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "Please enter a valid email address";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);

		try {
			const result = await dispatch(
				initGuestChat({
					fullName: fullName.trim(),
					email: email.trim().toLowerCase(),
					loanAmount: 0,
				})
			).unwrap();

      // Save guest session AND guest info to localStorage
      if (typeof window !== "undefined") {
        // Prevent saving guest session/info if a registered user is present
        const token = localStorage.getItem("token");
        if (!token) {
          localStorage.setItem("guest_session", JSON.stringify(result));
          // Save guest info separately for quick access on return visits
          localStorage.setItem(
            "guest_info",
            JSON.stringify({
              fullName: fullName.trim(),
              email: email.trim().toLowerCase(),
            })
          );
        }
      }

			toast.success("Welcome! Chat session started.");
			onSuccess(result);
			onClose();
		} catch (error: any) {
			toast.error(
				error?.message || "Failed to start chat session. Please try again."
			);
			console.error("Guest chat init error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
	<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="fixed inset-0 bg-[#001529]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  onClick={onClose}
>
  <motion.div
    initial={{ scale: 0.95, opacity: 0, y: 15 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    exit={{ scale: 0.95, opacity: 0, y: 15 }}
    onClick={(e) => e.stopPropagation()}
    className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] max-w-[440px] w-full overflow-hidden border border-slate-100"
  >
    {/* Header - Professional & Focused */}
    <div className="bg-white pt-8 px-8 pb-4 relative text-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition-all"
      >
        <X size={18} />
      </button>

      <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
        <MessageSquare className="text-[#002D62]" size={32} strokeWidth={2.5} />
      </div>
      
      <h2 className="text-2xl font-bold text-[#002D62] tracking-tight">
        Guest Concierge
      </h2>
      <p className="text-slate-500 text-sm mt-1">
        Enter your details to start a secure session.
      </p>
    </div>

    {/* Form - High Contrast Inputs */}
    <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 space-y-4">
      {/* Name Field */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
          Full Name
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#002D62] transition-colors">
            <User size={18} />
          </div>
          <input
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) setErrors({ ...errors, fullName: "" });
            }}
            placeholder="e.g. John Doe"
            className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl text-black font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none ${
              errors.fullName ? "border-red-500 bg-red-50" : "border-slate-200 focus:border-[#002D62]"
            }`}
            disabled={isLoading}
          />
        </div>
        {errors.fullName && (
          <p className="text-[11px] font-bold text-red-500 ml-1 uppercase">{errors.fullName}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
          Email Address
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#002D62] transition-colors">
            <Mail size={18} />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            placeholder="john@example.com"
            className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl text-black font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none ${
              errors.email ? "border-red-500 bg-red-50" : "border-slate-200 focus:border-[#002D62]"
            }`}
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="text-[11px] font-bold text-red-500 ml-1 uppercase">{errors.email}</p>
        )}
      </div>

      {/* Modern Tooltip / Notice */}
      <div className="flex gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
        <div className="shrink-0 text-blue-500 mt-0.5">
          <CheckCircle2 size={14} />
        </div>
        <p className="text-[12px] leading-relaxed text-slate-600">
          Your history will be automatically synced when you create an account later.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#002D62] hover:bg-[#001D42] active:scale-[0.98] disabled:bg-slate-300 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span>Verifying Session...</span>
          </>
        ) : (
          <>
            <span>Connect with Agent</span>
            <ArrowRight size={18} />
          </>
        )}
      </button>

      <div className="pt-2 text-center">
        <p className="text-sm text-slate-500 font-medium">
          Registered user?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-[#002D62] font-bold transition-colors underline decoration-blue-200 underline-offset-4"
          >
            Log in here
          </Link>
        </p>
      </div>
    </form>
  </motion.div>
</motion.div>
	);
}
