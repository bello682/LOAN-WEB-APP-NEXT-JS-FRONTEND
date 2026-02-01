"use client";

import { Navigation, Footer, Button } from "@/app/components";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { loginUser, resetAuth } from "@/lib/redux/features/authSlice";
import { toast } from "react-hot-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  // Grab state from Redux
  const { isLoading, error, isSuccess, user } = useAppSelector(
    (state) => state.auth,
  );

  // Add this useEffect to load saved credentials on mount
  useEffect(() => {
    const savedData = localStorage.getItem("user_credential_login");

    if (savedData) {
      try {
        const {
          email: savedEmail,
          password: savedPassword,
          remember,
        } = JSON.parse(savedData);
        if (remember) {
          setRemember(true);
          setEmail(savedEmail || "");
          setPassword(savedPassword || "");
        }
      } catch (err) {
        console.error("Error parsing saved credentials", err);
      }
    }
  }, []);

  // Handle Redirects and Errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      // If backend says "Email not verified", we could redirect to verify page
      if (error.toLowerCase().includes("verify")) {
        router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
      }
      dispatch(resetAuth());
    }

    if (isSuccess && user) {
      toast.success(`Welcome back, ${user.fullName || "User"}!`);
      router.push("/dashboard");
      dispatch(resetAuth());
    }
  }, [error, isSuccess, user, dispatch, router, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // --- REMEMBER ME LOGIC START ---
    // Single object storage logic
    if (remember) {
      const credentialData = {
        email,
        password,
        remember: true,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(
        "user_credential_login",
        JSON.stringify(credentialData),
      );
    } else {
      // If they uncheck "Remember me", wipe the credential object entirely
      localStorage.removeItem("user_credential_login");
    }
    // --- REMEMBER ME LOGIC END ---

    dispatch(loginUser({ email, password }));
  };

  return (
    <main className="min-h-screen bg-[#f8faff] flex flex-col ">
      <Navigation />

      <div className="flex-grow flex items-center justify-center px-4 py-20 mt-[30px]">
        <div className="flex flex-col md:flex-row max-w-5xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
          {/* Left Side: Login Form */}
          <div className="p-8 md:p-16 w-full md:w-1/2">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-4">
                <ShieldCheck className="text-[#002D62] w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold text-[#002D62] tracking-tight">
                Welcome Back
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                Please enter your details to sign in.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#002D62] transition-colors"
                    size={18}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 text-[black] border border-slate-200 rounded-xl outline-none focus:border-[#002D62] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-start mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Password
                  </label>
                </div>

                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#002D62] transition-colors"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 text-[black] border border-slate-200 rounded-xl outline-none focus:border-[#002D62] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-bold text-blue-600 hover:text-[#002D62]"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-slate-300 text-[#002D62] focus:ring-[#002D62]"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-slate-500 font-medium cursor-pointer"
                >
                  Keep me signed in
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#002D62] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-[#001d40] transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* ... rest of the social login UI remains same ... */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                <span className="px-4 bg-white">Trusted Security</span>
              </div>
            </div>

            <p className="mt-8 text-center text-slate-500 text-sm font-medium">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-[#002D62] font-bold"
              >
                Apply now
              </Link>
            </p>
          </div>

          {/* Right Side: Visual Content (Marketing) */}
          <div className="hidden md:flex flex-col justify-center p-12 bg-[#002D62] w-1/2 text-white relative">
            <div className="relative z-10">
              <span className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-4 block">
                Security First
              </span>
              <h2 className="text-4xl font-bold mb-6 tracking-tight leading-tight">
                Your financial security is our priority.
              </h2>
              <p className="text-blue-100/80 mb-10 leading-relaxed">
                Log in to manage your loans, view repayment schedules, and
                access personalized financial tools designed to help you grow.
              </p>

              <div className="space-y-5">
                {[
                  "Biometric & Two-Factor Authentication",
                  "Real-time fraud monitoring",
                  "Encrypted document storage",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="bg-white/10 p-1 rounded-full">
                      <CheckCircle2 className="text-amber-400" size={18} />
                    </div>
                    <span className="font-medium text-sm text-blue-50">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
