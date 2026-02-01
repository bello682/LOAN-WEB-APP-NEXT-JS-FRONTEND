"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navigation, Footer, Button } from "@/app/components";
import {
  FileText,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Lock,
  Headphones,
  ArrowRight,
  Star,
} from "lucide-react";

export default function Apply() {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState("");

  // New states for the name fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    // Check both potential keys
    const savedUser =
      localStorage.getItem("user_info") || localStorage.getItem("guest_info");

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);

        // If fullName exists in the object
        if (userData.fullName) {
          const nameParts = userData.fullName.trim().split(/\s+/);
          if (nameParts.length > 0) {
            setFirstName(nameParts[0]);
            // If there's more than one word, join the rest as the last name
            if (nameParts.length > 1) {
              setLastName(nameParts.slice(1).join(" "));
            }
          }
        }
      } catch (e) {
        console.error("Error parsing user info from local storage", e);
      }
    }
  }, []);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass name and amount to calculator
    const targetPath = loanAmount
      ? // `/calculator?amount=${loanAmount}`
        `/calculator?amount=${loanAmount}&firstName=${firstName}&lastName=${lastName}`
      : "/calculator";
    router.push(targetPath);
  };

  const steps = [
    {
      id: "1.",
      title: "Apply Online",
      desc: "Fill out our simple application in minutes",
    },
    {
      id: "2.",
      title: "Get Approved",
      desc: "Receive approval in as little as 24 hours",
    },
    {
      id: "3.",
      title: "Receive Funds",
      desc: "Get your money directly into your account",
    },
  ];

  return (
    <main className="bg-[#F8FAFC]">
      <Navigation />

      {/* High-Impact Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-[#002D62] mb-6"
          >
            Apply for Your Loan Today!
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 relative">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                className="relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 z-10"
              >
                <span className="text-4xl font-black text-slate-200 absolute top-4 right-6">
                  {step.id}
                </span>
                <h3 className="text-lg font-bold text-[#002D62] mb-2 text-left">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 text-left leading-relaxed">
                  {step.desc}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#002D62] rounded-b-2xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Split Content Layout */}
      <section className="py-20 px-4 max-w-7xl mx-auto grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl shadow-blue-900/5 border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <FileText size={20} />
              </div>
              <h2 className="text-2xl font-bold text-[#002D62]">
                Loan Details
              </h2>
            </div>

            <form
              onSubmit={handleContinue}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  First Name
                </label>
                <input
                  required
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. John"
                  className="w-full bg-slate-50 text-[black] border-none rounded-xl p-4 focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Last Name
                </label>
                <input
                  required
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Doe"
                  className="w-full bg-slate-50 text-[black] border-none rounded-xl p-4 focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Loan Amount ($)
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="5,000"
                    className="w-full bg-slate-50 text-[black] border-none rounded-xl p-4 pl-12 focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>
              <div className="md:col-span-2 mt-4">
                <Button
                  type="submit"
                  className="w-full h-16 text-lg font-bold bg-[#002D62] hover:bg-blue-900 shadow-xl shadow-blue-900/20 rounded-xl transition-all duration-300 group flex items-center justify-center gap-3 text-white"
                >
                  <span>Continue to Next Step</span>
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-center"
                  >
                    <ArrowRight size={22} strokeWidth={2.5} />
                  </motion.div>
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-5 order-1 lg:order-2 space-y-12">
          <div>
            <h2 className="text-3xl font-black text-[#002D62] mb-8">
              Why Choose Us?
            </h2>
            <div className="space-y-6">
              {[
                {
                  icon: ShieldCheck,
                  title: "Secure Processing",
                  desc: "Your data is protected with 256-bit encryption.",
                },
                {
                  icon: Star,
                  title: "Competitive Rates",
                  desc: "Fixed rates that won't change over your loan term.",
                },
                {
                  icon: CheckCircle2,
                  title: "Trusted by Thousands",
                  desc: "Over 50,000+ successful loans funded this year.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 w-12 h-12 shrink-0 bg-white shadow-md rounded-xl flex items-center justify-center text-blue-600">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#002D62]">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#002D62] p-8 rounded-[32px] text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="italic text-lg mb-4 text-blue-100">
                "The process was seamless and quick, I got my loan approved the
                next day."
              </p>
              <p className="font-bold">— Michael T.</p>
            </div>
            <div className="absolute -bottom-4 -right-4 text-white/5 font-black text-8xl italic">
              "
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 opacity-70">
          <div className="flex items-center gap-3 text-white">
            <CheckCircle2 className="text-green-400" />
            <span className="font-bold">No Hidden Fees</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Lock className="text-blue-400" />
            <span className="font-bold">Safe & Secure</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Headphones className="text-purple-400" />
            <span className="font-bold">24/7 Support</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
