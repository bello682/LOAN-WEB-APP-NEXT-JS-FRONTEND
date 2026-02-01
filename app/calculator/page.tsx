"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Info,
  ArrowRight,
  Wallet,
  MessageCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import { Navigation, Footer, Card, Button } from "@/app/components";

function CalculatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- STATE ---
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(6.99);
  const [loanTerm, setLoanTerm] = useState(5); // In Years
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- SYNC WITH HOME PAGE & URL ---
  useEffect(() => {
    const savedData = localStorage.getItem("loan_calculation");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setLoanAmount(parsed.amount || 100000);
      setLoanTerm(parsed.term / 12 || 5);

      if (parsed.type === "home") setInterestRate(4.5);
      else if (parsed.type === "business") setInterestRate(6.5);
      else setInterestRate(8.5);
    }

    const amountFromUrl = searchParams.get("amount");
    if (amountFromUrl) {
      const parsedAmount = Number(amountFromUrl);
      if (!isNaN(parsedAmount)) setLoanAmount(parsedAmount);
    }
  }, [searchParams]);

  // --- LOGIC ---
  const UPFRONT_PERCENTAGE = 0.1; // 10%

  const calculatePayment = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    if (monthlyRate === 0) return principal / numberOfPayments;
    return (
      (principal *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    );
  };

  const monthlyPaymentNum = calculatePayment();
  const totalPaymentNum = monthlyPaymentNum * loanTerm * 12;
  const totalInterestNum = totalPaymentNum - loanAmount;
  const upfrontPaymentNum = loanAmount * UPFRONT_PERCENTAGE;

  // Formatted for Display
  const monthlyPayment = monthlyPaymentNum.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const totalPayment = totalPaymentNum.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const totalInterest = totalInterestNum.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const upfrontPayment = upfrontPaymentNum.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // --- CHAT PREPARATION ---
  //   const handleProceedToChat = () => {
  //     const loanDetails = {
  //       amount: loanAmount,
  //       interest: totalInterestNum,
  //       upfront: upfrontPaymentNum,
  //       monthly: monthlyPaymentNum,
  //       term: loanTerm * 12,
  //     };

  //     // Save the data so the chat page can "see" it
  //     localStorage.setItem("pending_loan_message", JSON.stringify(loanDetails));

  //     // Encode data securely
  //     const encodedData = btoa(JSON.stringify(loanDetails));
  //     router.push(`/chat?details=${encodedData}`);
  //   };

  /* =========================================================================
 =========================================================================*/

  // --- CHAT PREPARATION & ROUTING ---
  const handleProceedToChat = () => {
    // 1. Prepare the loan message details
    const loanDetails = {
      amount: loanAmount.toLocaleString(),
      upfront: upfrontPayment,
      monthly: monthlyPayment,
      duration: `${loanTerm} years (${loanTerm * 12} months)`,
      totalInterest: totalInterest,
    };

    const autoMessage = `I would like to apply for a loan:
  - Amount: $${loanDetails.amount}
  - Upfront Deposit (10%): $${loanDetails.upfront}
  - Monthly Repayment: $${loanDetails.monthly}
  - Duration: ${loanDetails.duration}
  - Total Interest: $${loanDetails.totalInterest}`; // Save details and message for the chat component to pick up

    localStorage.setItem("pending_loan_message", autoMessage);
    localStorage.setItem("pending_loan_data", JSON.stringify(loanDetails)); // 2. Check Authentication Status

    const savedUser = localStorage.getItem("user_info");
    const token = localStorage.getItem("token"); // Assuming your token is stored as "token"

    let isAuthenticated = false;

    if (savedUser && token) {
      try {
        // Basic check if token is expired (if it's a JWT)
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = Date.now() >= payload.exp * 1000;

        if (!isExpired) {
          isAuthenticated = true;
        }
      } catch (e) {
        // If not a JWT or error parsing, we treat as authenticated if token exists
        isAuthenticated = !!token;
      }
    } // 3. Navigation Logic

    if (savedUser && isAuthenticated) {
      // REGISTERED & LOGGED IN: Go to Dashboard Chat
      // We pass a query param 'tab' so the Dashboard knows to open the Chat tab
      router.push("/dashboard?tab=chat");
    } else if (savedUser && !isAuthenticated) {
      // REGISTERED BUT TOKEN EXPIRED: Go to Login
      // Redirect back to dashboard chat after login
      // BACKUP: Save the intent so the dashboard can catch it even if login redirects to /dashboard
      localStorage.setItem("after_login_redirect", "chat");
      router.push("/login?redirect=/dashboard?tab=chat");
    } else {
      // GUEST: Go to Main Landing Page Chat
      router.push("/chat/");
    }
  };

  /* =========================================================================
 =========================================================================*/

  return (
    <main className="bg-slate-50 min-h-screen relative overflow-x-hidden">
      <Navigation />

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#002D62]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[32px] shadow-2xl max-w-lg w-full p-8 md:p-12 overflow-hidden"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-[#002D62] mb-4">
                  Application Ready!
                </h2>
                <p className="text-slate-500 mb-8 leading-relaxed text-sm md:text-base break-words">
                  To finalize your loan of{" "}
                  <span className="font-bold text-[#002D62]">
                    ${loanAmount.toLocaleString()}
                  </span>{" "}
                  and receive instructions for the{" "}
                  <span className="font-bold text-amber-600">
                    ${upfrontPayment}
                  </span>{" "}
                  upfront deposit, please connect with an admin.
                </p>
                <div className="space-y-4">
                  <Button
                    onClick={handleProceedToChat}
                    className="w-full bg-[#002D62] hover:bg-blue-800 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all"
                  >
                    <MessageCircle size={22} /> Chat with Admin Now
                  </Button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="group relative flex items-center justify-center gap-2 mx-auto py-2 text-slate-500 text-sm font-bold uppercase tracking-widest transition-colors hover:text-[#002D62]"
                  >
                    <ArrowRight
                      size={16}
                      className="rotate-180 transition-transform duration-300 group-hover:-translate-x-2 text-amber-500"
                    />
                    <span className="relative">
                      Back to Calculator{" "}
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-amber-400 transition-all duration-300 group-hover:w-full" />
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <section className="pt-32 pb-16 px-4 bg-[#002D62] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-5xl font-black mb-4">
              Finalize Your <span className="text-amber-400">Loan</span>
            </h1>
            <p className="text-blue-100/70 max-w-2xl mx-auto text-base md:text-lg">
              Review your details and click the button below to speak with an
              administrator for final approval.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CALCULATOR INTERFACE */}
      <section className="pb-24 px-4 -mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* INPUTS */}
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 md:p-10 shadow-2xl border-none rounded-[32px] bg-white h-full">
                <h2 className="text-xl md:text-2xl font-black text-[#002D62] mb-10 flex items-center gap-2">
                  Loan Parameters <Info size={18} className="text-slate-400" />
                </h2>
                <div className="space-y-10">
                  <div className="space-y-6">
                    <div className="flex flex-wrap justify-between items-end gap-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Loan Amount
                      </label>
                      <span className="text-xl md:text-3xl font-black text-[#002D62] break-all">
                        ${loanAmount.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="500000"
                      step="5000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Interest Rate (%)
                      </label>
                      <span className="text-xl md:text-3xl font-black text-[#002D62]">
                        {interestRate}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="18"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Duration (Years)
                      </label>
                      <span className="text-xl md:text-3xl font-black text-[#002D62]">
                        {loanTerm} Yrs
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* SUMMARY & ACTION */}
            <motion.div
              className="lg:col-span-5 flex flex-col gap-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-8 bg-[#002D62] text-white border-none rounded-[32px] shadow-xl relative overflow-hidden flex flex-col justify-center">
                <p className="text-blue-300 font-bold uppercase text-[10px] tracking-widest mb-2">
                  Monthly Repayment
                </p>
                {/* Added fluid text sizing to prevent overflow */}
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-400 break-words leading-tight">
                  ${monthlyPayment}
                </h3>
                <div className="h-1 w-16 bg-amber-400 mt-6 rounded-full" />
              </Card>

              <Card className="p-8 bg-amber-50 border-2 border-amber-200 rounded-[32px] relative overflow-hidden">
                <Wallet
                  className="absolute -right-4 -top-4 text-amber-200 opacity-40"
                  size={100}
                />
                <p className="text-amber-700 font-bold uppercase text-[10px] tracking-widest mb-1">
                  Required Security Deposit (10%)
                </p>
                {/* Added responsive text and break-all for extremely large numbers */}
                <h3 className="text-2xl sm:text-3xl font-black text-[#002D62] break-all leading-tight">
                  ${upfrontPayment}
                </h3>
                <p className="text-[10px] text-amber-800/60 mt-2 italic">
                  * To be discussed with an administrator.
                </p>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-5 bg-white border-none rounded-2xl shadow-md overflow-hidden">
                  <TrendingUp className="text-emerald-500 mb-2" size={18} />
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Total Interest
                  </p>
                  <p className="text-base md:text-lg font-black text-[#002D62] break-all">
                    ${totalInterest}
                  </p>
                </Card>
                <Card className="p-5 bg-white border-none rounded-2xl shadow-md overflow-hidden">
                  <Calendar className="text-indigo-500 mb-2" size={18} />
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Total Return
                  </p>
                  <p className="text-base md:text-lg font-black text-[#002D62] break-all">
                    ${totalPayment}
                  </p>
                </Card>
              </div>

              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-4 rounded-[24px] flex items-center justify-center gap-2 shadow-xl transition-all group active:scale-95 text-sm sm:text-base"
              >
                <span className="truncate">
                  Confirm & Apply for ${loanAmount.toLocaleString()}
                </span>
                <ArrowRight
                  size={20}
                  className="shrink-0 group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default function Calculator() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <CalculatorContent />
    </Suspense>
  );
}
