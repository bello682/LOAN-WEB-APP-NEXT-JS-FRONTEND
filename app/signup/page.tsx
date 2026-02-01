"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Navigation, Footer, Button } from "@/app/components";
import { Mail, Lock, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Redux Imports
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { registerUser, resetAuth } from "@/lib/redux/features/authSlice";

export default function SignUp() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Get state from Redux
  const { isLoading, error, isSuccess, user } = useAppSelector(
    (state) => state.auth,
  );

  // Add this block inside your SignUp function
  useEffect(() => {
    const savedGuest = localStorage.getItem("guest_info");

    if (savedGuest) {
      try {
        const parsedGuest = JSON.parse(savedGuest);

        // Logic to split the name:
        // "Don Aza" -> firstName: Don, lastName: Aza
        // "Don" -> firstName: Don, lastName: ""
        const nameParts = parsedGuest.fullName
          ? parsedGuest.fullName.trim().split(/\s+/)
          : ["", ""];
        const fName = nameParts[0] || "";
        const lName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

        setFormData((prev) => ({
          ...prev,
          firstName: fName,
          lastName: lName,
          email: parsedGuest.email || "",
        }));

        // Optional: Remove it after pulling so it doesn't stay forever,
        // or keep it so they can refresh. I recommend keeping it for now.
      } catch (err) {
        console.error("Error parsing guest_info from localStorage", err);
      }
    }
  }, []); // Runs once on component mount

  useEffect(() => {
    if (error) {
      toast.error(error, {
        style: {
          borderRadius: "12px",
          background: "#333",
          color: "#fff",
        },
      });
      // We dispatch resetAuth so the toast doesn't keep popping up on re-renders
      dispatch(resetAuth());
    }

    if (isSuccess) {
      toast.success("Account created! Redirecting to verification...", {
        duration: 4000,
        icon: "🚀",
      });

      // Short delay so they can read the toast before redirecting
      const timer = setTimeout(() => {
        router.push("/auth/verify");
        dispatch(resetAuth());
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [error, isSuccess, dispatch, router]);

  // Local form state

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Combine names for your backend 'fullName' field
    const submissionData = {
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
    };

    dispatch(registerUser(submissionData));
  };

  // // Redirect on success
  useEffect(() => {
    if (isSuccess) {
      // Adjust this path to wherever you want users to go (e.g., /verify-otp)
      // router.push("/auth/verify");
      router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`);
      dispatch(resetAuth());
    }
  }, [isSuccess, router, dispatch, formData.email]);

  return (
    <main className="min-h-screen bg-[#f8faff] flex flex-col">
      <Navigation />

      <div className="flex-grow flex items-center justify-center px-4 py-20 mt-[30px]">
        <div className="flex flex-col md:flex-row max-w-5xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
          {/* Left Side: Marketing */}
          <div className="hidden md:flex flex-col justify-center p-12 bg-[#002D62] w-1/2 text-white relative">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6 tracking-tight">
                Join the future of personal lending.
              </h2>
              <ul className="space-y-6">
                {[
                  "Get approved in as little as 24 hours",
                  "No hidden fees or early repayment penalties",
                  "Bank-level 256-bit encryption",
                  "Rates starting as low as 3.49% APR",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-blue-100">
                    <CheckCircle2
                      className="text-amber-400 mt-1 shrink-0"
                      size={20}
                    />
                    <span className="font-medium">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
          </div>

          {/* Right Side: Form */}
          <div className="p-8 md:p-16 w-full md:w-1/2">
            <h1 className="text-3xl font-bold text-[#002D62] mb-2 tracking-tight">
              Create Account Here Today
            </h1>
            <p className="text-slate-500 mb-8 font-medium">
              Start your application journey today.
            </p>

            {/* Error Display */}
            {/* {error && (
							<div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium'>
								{error}
							</div>
						)} */}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border text-[black] border-slate-200 rounded-xl outline-none focus:border-[#002D62] transition-all"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 text-[black] border border-slate-200 rounded-xl outline-none focus:border-[#002D62] transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-3.5 text-slate-400"
                    size={18}
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 text-[black] border border-slate-200 rounded-xl outline-none focus:border-[#002D62] transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-3.5 text-slate-400"
                    size={18}
                  />
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 text-[black] border border-slate-200 rounded-xl outline-none focus:border-[#002D62] transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <input
                  type="checkbox"
                  required
                  className="mt-1 rounded border-slate-300 text-[#002D62] focus:ring-[#002D62]"
                />
                <p className="text-sm text-slate-500 leading-tight">
                  I agree to the{" "}
                  <Link href="#" className="text-blue-600 font-bold">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-blue-600 font-bold">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#002D62] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Creating Account...
                  </>
                ) : (
                  "Create My Account"
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-slate-500 text-sm font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-[#002D62] font-bold"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
