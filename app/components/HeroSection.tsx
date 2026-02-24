"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";
import { ArrowRight, CheckCircle2, Star, Play, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

export const HeroSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { user, isLoggedIn, loading } = useAuth();
  const router = useRouter();

  // Neutral, high-quality educational video about loans
  const videoId = "Pzz88s_28fA";

  return (
    <section className="relative min-h-screen pt-20 flex items-center bg-[#F8FAFC] overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#002D62] clip-path-hero hidden lg:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Fast-Track Approvals Live
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-[#002D62] leading-[1.1] mb-6">
              Secure Your Future <br />
              <span className="text-blue-600">In Minutes.</span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
              Personal and business loans with rates starting at 4.99% APR. No
              hidden fees, just transparent financing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              {isLoggedIn ? (
                <Button
                  href="/dashboard"
                  className="h-16 px-8 text-lg bg-[#002D62] hover:bg-blue-900 shadow-xl shadow-blue-900/20"
                >
                  Apply Now <ArrowRight className="ml-2" />
                </Button>
              ) : (
                <Button
                  href="/apply"
                  className="h-16 px-8 text-lg bg-[#002D62] hover:bg-blue-900 shadow-xl shadow-blue-900/20"
                >
                  Apply Now <ArrowRight className="ml-2" />
                </Button>
              )}

              {/* TRIGGER: Opens the Video Modal */}
              <button
                onClick={() => setIsVideoOpen(true)}
                className="flex items-center gap-3 px-6 h-16 text-[#002D62] font-bold hover:text-blue-600 transition-colors group"
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-slate-200 group-hover:border-blue-600 transition-colors">
                  <Play size={18} fill="currentColor" />
                </span>
                How it works
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-8 border-t border-slate-200 pt-8">
              <div>
                <div className="flex text-amber-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  4.9/5 from 2k+ reviews
                </p>
              </div>
              <div className="h-10 w-[1px] bg-slate-200" />

              <img
                src="https://cdn.worldvectorlogo.com/logos/trustpilot-2.svg"
                alt="Rating"
                className="h-6 w-auto opacity-60 grayscale brightness-0"
              />
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-[12px] border-white/10">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
                alt="Professional woman smiling"
                className="w-full h-auto object-cover"
              />
            </div>

            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-10 bottom-20 z-20 bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">
                  Loan Approved
                </p>
                <p className="text-xl font-black text-[#002D62]">$25,000.00</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* VIDEO MODAL OVERLAY */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // Added onClick here so clicking the background closes the modal
            onClick={() => setIsVideoOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10 cursor-pointer"
          >
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents double-triggering
                setIsVideoOpen(false);
              }}
              className="absolute top-6 right-6 text-white hover:text-blue-400 transition-colors z-[110]"
            >
              <X size={40} />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              // stopPropagation prevents the video itself from closing the modal when clicked
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 cursor-default"
            >
              <iframe
                className="w-full h-full"
                // Added mute=1 to allow autoplay to work reliably
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`}
                title="Understanding Loans"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .clip-path-hero {
          clip-path: polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%);
        }
      `}</style>
    </section>
  );
};
