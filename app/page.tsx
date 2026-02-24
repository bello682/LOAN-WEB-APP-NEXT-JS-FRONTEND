"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Navigation,
  HeroSection,
  Footer,
  Card,
  Button,
} from "@/app/components";
import {
  ShieldCheck,
  Clock,
  Percent,
  Users,
  CheckCircle2,
  Star,
  MessageCircle,
  Zap,
  Headphones,
  DollarSign,
  TrendingUp,
  Briefcase,
  User,
  Home as HomeIcon,
  Save,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface UserData {
  fullName: string;
  _id?: string;
  email?: string;
}
export default function Home() {
  const router = useRouter();

  // --- State for Calculator ---
  const [loanAmount, setLoanAmount] = useState(25000);
  const [loanTerm, setLoanTerm] = useState(24);
  const [loanType, setLoanType] = useState("personal");
  const [isSaved, setIsSaved] = useState(false);

  // Phrases that all mean "Chat with Support"
  const phrases = [
    "Chat with Support",
    "Talk to an Agent",
    "Get Instant Help",
    "We are Online",
  ];
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  // Loan Rates Configuration
  const rates: Record<string, number> = {
    personal: 0.085, // 8.5%
    business: 0.065, // 6.5%
    home: 0.045, // 4.5%
  };

  // --- State for Live Activity Toast ---
  const [showToast, setShowToast] = useState(false);
  const [recentAction, setRecentAction] = useState({
    name: "David K.",
    amount: "15,000",
  });

  // --- Dynamic Calculation Logic ---
  const currentRate = rates[loanType];

  const monthlyPayment = useMemo(() => {
    const monthlyRate = currentRate / 12;
    const payment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
      (Math.pow(1 + monthlyRate, loanTerm) - 1);
    return Math.round(payment);
  }, [loanAmount, loanTerm, currentRate]);

  const securityDeposit = useMemo(() => {
    return Math.round(loanAmount * 0.05); // 5% Deposit
  }, [loanAmount]);

  const totalInterest = useMemo(() => {
    return monthlyPayment * loanTerm - loanAmount;
  }, [monthlyPayment, loanTerm, loanAmount]);

  // --- LocalStorage Logic ---
  useEffect(() => {
    // 1. Handle Loan Calculation
    const saved = localStorage.getItem("loan_calculation");
    if (saved) {
      const data = JSON.parse(saved);
      setLoanAmount(data.amount);
      setLoanTerm(data.term);
      setLoanType(data.type);
      setIsSaved(true);
    }

    // 2. Handle User Info (ADD THIS HERE)
    const savedUser = localStorage.getItem("user_info");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user info");
      }
    }
  }, []);

  // Function to handle "Apply Now" (Saves and Redirects)
  const handleApplyNow = () => {
    const calculation = {
      amount: loanAmount,
      term: loanTerm,
      type: loanType,
      monthly: monthlyPayment,
      deposit: securityDeposit,
    };
    // Save to storage so the /calculator page can read it
    localStorage.setItem("loan_calculation", JSON.stringify(calculation));
    // Navigate to the full calculator/application page
    router.push("/calculator");
  };

  const handleSaveOnly = (e: React.MouseEvent) => {
    e.preventDefault();
    const calculation = { amount: loanAmount, term: loanTerm, type: loanType };
    localStorage.setItem("loan_calculation", JSON.stringify(calculation));
    setIsSaved(true);
  };

  const handleReset = () => {
    setLoanAmount(25000);
    setLoanTerm(24);
    setLoanType("personal");
    localStorage.removeItem("loan_calculation");
    setIsSaved(false);
  };

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 } as const,
    },
  };

  useEffect(() => {
    const names = [
      "Sarah J.",
      "Michael R.",
      "Emma W.",
      "David K.",
      "James L.",
      "Nancy P.",
    ];
    const amounts = ["5,000", "25,000", "12,000", "50,000", "8,500", "50,000"];

    const timer = setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * names.length);
      setRecentAction({ name: names[randomIdx], amount: amounts[randomIdx] });
      setShowToast(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIdx];
    const timeout = setTimeout(
      () => {
        if (!isDeleting && displayText === currentPhrase) {
          // Pause at the end of the sentence
          setTimeout(() => setIsDeleting(true), 1500);
        } else if (isDeleting && displayText === "") {
          // Switch to next phrase after deleting
          setIsDeleting(false);
          setCurrentPhraseIdx((prev) => (prev + 1) % phrases.length);
        } else {
          // Add or remove a single character
          setDisplayText(
            currentPhrase.substring(
              0,
              isDeleting ? displayText.length - 1 : displayText.length + 1,
            ),
          );
        }
      },
      isDeleting ? 50 : 100,
    ); // Speed: Deleting is faster than typing
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPhraseIdx]);

  return (
    <main className="bg-white text-slate-900 selection:bg-blue-100 relative overflow-x-hidden">
      <Navigation />

      {/* LIVE ACTIVITY TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="fixed bottom-8 left-8 z-50 bg-white shadow-2xl rounded-2xl p-4 border border-slate-100 hidden md:flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Recently Approved
              </p>
              <p className="text-sm font-bold text-[#002D62]">
                {recentAction.name} just received ${recentAction.amount}
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-slate-300 hover:text-slate-500 ml-2 text-xl"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIVE ACTIVITY TOAST - RESPONSIVE UPDATE ALSO SHOWS ON MOBILE AND TABLET, THE ONE ABOVE SHOWS ON DESKTOP ONLY.*/}
      {/* <AnimatePresence>
				{showToast && (
					<motion.div
						initial={{ y: 50, x: 0, opacity: 0 }}
						animate={{ y: 0, x: 0, opacity: 1 }}
						exit={{ y: 50, opacity: 0 }}
						className='fixed bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-auto z-50 bg-white shadow-2xl rounded-2xl p-4 border border-slate-100 flex items-center gap-4 max-w-md md:max-w-sm'>
						<div className='w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0'>
							<Zap size={20} />
						</div>
						<div className='flex-1'>
							<p className='text-[10px] text-slate-400 font-bold uppercase tracking-wider'>
								Recently Approved
							</p>
							<p className='text-sm font-bold text-[#002D62]'>
								{recentAction.name} just received ${recentAction.amount}
							</p>
						</div>
						<button
							onClick={() => setShowToast(false)}
							className='text-slate-300 hover:text-slate-500 ml-2 text-xl leading-none'>
							&times;
						</button>
					</motion.div>
				)}
			</AnimatePresence> */}

      {/* FLOATING CHAT BUTTON */}
      {!user ? (
        <motion.div
          drag
          dragConstraints={{ left: -300, right: 0, top: -700, bottom: 0 }}
          // className='fixed bottom-25 md:bottom-8 right-8 z-[60] cursor-grab active:cursor-grabbing'>
          className="fixed bottom-8 right-8 z-[60] cursor-grab active:cursor-grabbing"
        >
          <Link href="/chat" draggable="false">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 min-w-[200px]"
            >
              <div className="relative shrink-0">
                <MessageCircle size={24} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-blue-600 rounded-full animate-pulse"></span>
              </div>
              <span className="font-bold text-sm pr-2 whitespace-nowrap">
                {displayText}
                <span className="inline-block w-1 h-4 bg-white/50 ml-1 animate-pulse">
                  |
                </span>
              </span>
            </motion.div>
          </Link>
        </motion.div>
      ) : (
        ""
      )}

      <div className="bg-[#f8faff] border-b border-slate-100">
        <HeroSection />
      </div>

      {/* LOAN CALCULATOR SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#002D62] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            {isSaved && (
              <span className="bg-amber-400/20 text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block border border-amber-400/30">
                Viewing Saved Selection
              </span>
            )}
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Personalized Loan Calculator
            </h2>
            <p className="text-blue-200">
              Choose your details below to see your custom rate.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* INPUTS COLUMN */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-[40px] p-8 md:p-12 border border-white/10 space-y-10">
              {/* LOAN TYPE SELECTOR */}
              <div>
                <label className="block text-sm font-medium mb-6 text-slate-300">
                  What is your loan for?
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "personal", label: "Personal", icon: User },
                    { id: "business", label: "Business", icon: Briefcase },
                    { id: "home", label: "Home", icon: HomeIcon },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setLoanType(type.id);
                        setIsSaved(false);
                      }}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                        loanType === type.id
                          ? "bg-amber-400 border-amber-400 text-[#002D62]"
                          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      }`}
                    >
                      <type.icon size={24} />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AMOUNT SLIDER */}
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-medium text-slate-300">
                    Loan Amount
                  </label>
                  <span className="text-amber-400 font-bold text-xl">
                    ${loanAmount.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="1000"
                  value={loanAmount}
                  onChange={(e) => {
                    setLoanAmount(Number(e.target.value));
                    setIsSaved(false);
                  }}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* TERM SLIDER */}
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-medium text-slate-300">
                    Repayment Period
                  </label>
                  <span className="text-amber-400 font-bold text-xl">
                    {loanTerm} Months
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="60"
                  step="12"
                  value={loanTerm}
                  onChange={(e) => {
                    setLoanTerm(Number(e.target.value));
                    setIsSaved(false);
                  }}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              <div className="flex gap-6 pt-4 border-t border-white/10">
                <button
                  onClick={handleSaveOnly}
                  className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
                >
                  <Save size={16} /> SAVE FOR LATER
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw size={16} /> RESET VALUES
                </button>
              </div>
            </div>

            {/* RESULTS COLUMN */}
            <div className="bg-white rounded-[40px] p-10 text-slate-900 shadow-2xl relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-[#002D62]">
                <TrendingUp size={120} />
              </div>

              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-2">
                Est. Monthly Payment
              </p>
              <div className="text-6xl font-black text-[#002D62] mb-8 tracking-tighter">
                ${monthlyPayment.toLocaleString()}
                <span className="text-lg text-slate-400 font-normal">/mo</span>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-sm border-b border-slate-50 pb-3">
                  <span className="text-slate-500">Interest Rate</span>
                  <span className="font-bold text-[#002D62]">
                    {(currentRate * 100).toFixed(1)}% APR
                  </span>
                </div>
                <div className="flex justify-between text-sm border-b border-slate-50 pb-3">
                  <span className="text-slate-500">Security Deposit (5%)</span>
                  <span className="font-bold text-green-600">
                    ${securityDeposit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total Interest Cost</span>
                  <span className="font-bold text-slate-700">
                    ${totalInterest.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleApplyNow}
                className="mt-auto w-full bg-[#002D62] text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#003d85] transition-all shadow-xl shadow-blue-900/10 group"
              >
                Continue to Apply{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <p className="text-center text-[10px] text-slate-400 mt-6 leading-relaxed">
                Clicking "Continue" will lock in this rate for your official
                application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#002D62] mb-6 tracking-tight">
              Why Choose LoanHub?
            </h2>
            <div className="w-20 h-1.5 bg-amber-400 mx-auto mb-6 rounded-full"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              {
                icon: <Clock className="w-8 h-8 text-amber-500" />,
                title: "Fast Processing",
                desc: "Our automated system ensures you get an answer in minutes, not days.",
              },
              {
                icon: <Percent className="w-8 h-8 text-amber-500" />,
                title: "Competitive Rates",
                desc: "We scan multiple markets to ensure you get the lowest possible interest rates.",
              },
              {
                icon: <Users className="w-8 h-8 text-amber-500" />,
                title: "Trusted by Thousands",
                desc: "Over 500,000 customers have trusted us with their financial journey.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group p-8 rounded-3xl hover:bg-slate-50 transition-all"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all border border-slate-100 group-hover:bg-white group-hover:shadow-xl">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[#002D62] mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#002D62] mb-16">
            Simple 3-Step Process
          </h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              {
                step: "01",
                title: "Apply Online",
                desc: "Complete our 3-minute application form.",
                icon: TrendingUp,
              },
              {
                step: "02",
                title: "Chat with Admin",
                desc: "Verification and security deposit discussion.",
                icon: Headphones,
              },
              {
                step: "03",
                title: "Get Funded",
                desc: "Funds disbursed to your bank in 4 hours.",
                icon: CheckCircle2,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="relative z-10 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm"
              >
                <div className="text-5xl font-black text-slate-50 absolute top-4 right-8">
                  {item.step}
                </div>
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <item.icon size={32} />
                </div>
                <h3 className="font-bold text-xl text-[#002D62] mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Small Business Owner",
                quote:
                  "LoanHub made it incredibly easy to get the capital I needed for my business expansion.",
                image: "https://i.pravatar.cc/150?u=sarah",
              },
              {
                name: "Michael Chen",
                role: "Homeowner",
                quote:
                  "I was impressed with how quickly they approved my loan application. Great customer service.",
                image: "https://i.pravatar.cc/150?u=michael",
              },
              {
                name: "Emily Davis",
                role: "Student",
                quote:
                  "Competitive rates and flexible repayment options. They genuinely care.",
                image: "https://i.pravatar.cc/150?u=emily",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="p-8 h-full border-slate-100 bg-[#fbfcfd]"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-600 italic mb-8">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#002D62] relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto text-center relative z-10 text-white"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            Ready to scale?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/calculator"
              size="lg"
              variant="secondary"
              className="px-12"
            >
              Get Started Now
            </Button>
            <Button
              href="/chat"
              variant="outline"
              size="lg"
              className="border-white/30 text-white px-12"
            >
              Speak with an Agent
            </Button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
