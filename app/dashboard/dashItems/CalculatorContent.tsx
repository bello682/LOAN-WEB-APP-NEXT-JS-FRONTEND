// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   DollarSign,
//   TrendingUp,
//   Calendar,
//   Info,
//   ArrowRight,
//   Wallet,
//   MessageCircle,
//   X,
//   CheckCircle2,
// } from "lucide-react";
// import { Card, Button } from "@/app/components";

// interface CalculatorProps {
//   setActiveTab: (tab: string) => void;
// }

// export const CalculatorContent = ({ setActiveTab }: CalculatorProps) => {
//   const searchParams = useSearchParams();

//   // --- STATE (Logic preserved) ---
//   const [loanAmount, setLoanAmount] = useState(100000);
//   const [interestRate, setInterestRate] = useState(6.99);
//   const [loanTerm, setLoanTerm] = useState(5);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // --- SYNC WITH LOCALSTORAGE & URL (Logic preserved) ---
//   useEffect(() => {
//     const savedData = localStorage.getItem("loan_calculation");
//     if (savedData) {
//       const parsed = JSON.parse(savedData);
//       setLoanAmount(parsed.amount || 100000);
//       setLoanTerm(parsed.term / 12 || 5);
//       if (parsed.type === "home") setInterestRate(4.5);
//       else if (parsed.type === "business") setInterestRate(6.5);
//       else setInterestRate(8.5);
//     }

//     const amountFromUrl = searchParams.get("amount");
//     if (amountFromUrl) {
//       const parsedAmount = Number(amountFromUrl);
//       if (!isNaN(parsedAmount)) setLoanAmount(parsedAmount);
//     }
//   }, [searchParams]);

//   // --- CALCULATION LOGIC (Untouched) ---
//   const UPFRONT_PERCENTAGE = 0.1;
//   const calculatePayment = () => {
//     const principal = loanAmount;
//     const monthlyRate = interestRate / 100 / 12;
//     const numberOfPayments = loanTerm * 12;
//     if (monthlyRate === 0) return principal / numberOfPayments;
//     return (
//       (principal *
//         (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
//       (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
//     );
//   };

//   const monthlyPaymentNum = calculatePayment();
//   const totalPaymentNum = monthlyPaymentNum * loanTerm * 12;
//   const totalInterestNum = totalPaymentNum - loanAmount;
//   const upfrontPaymentNum = loanAmount * UPFRONT_PERCENTAGE;

//   const monthlyPayment = monthlyPaymentNum.toLocaleString(undefined, {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });
//   const totalPayment = totalPaymentNum.toLocaleString(undefined, {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });
//   const totalInterest = totalInterestNum.toLocaleString(undefined, {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });
//   const upfrontPayment = upfrontPaymentNum.toLocaleString(undefined, {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

//   // --- ROUTING LOGIC (Adapted for Dashboard) ---
//   const handleProceedToChat = () => {
//     const loanDetails = {
//       amount: loanAmount.toLocaleString(),
//       upfront: upfrontPayment,
//       monthly: monthlyPayment,
//       duration: `${loanTerm} years (${loanTerm * 12} months)`,
//       totalInterest: totalInterest,
//     };

//     const autoMessage = `I would like to apply for a loan:
// - Amount: $${loanDetails.amount}
// - Upfront Deposit (10%): $${loanDetails.upfront}
// - Monthly Repayment: $${loanDetails.monthly}
// - Duration: ${loanDetails.duration}
// - Total Interest: $${loanDetails.totalInterest}`;

//     localStorage.setItem("pending_loan_message", autoMessage);
//     localStorage.setItem("pending_loan_data", JSON.stringify(loanDetails));

//     // In the dashboard, we just switch the tab to chat
//     setIsModalOpen(false);
//     setActiveTab("chat");
//   };

//   return (
//     <div className="space-y-8 max-w-6xl mx-auto pb-10">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-black text-[#002D62] uppercase tracking-tighter">
//           Loan <span className="text-[#EBB04D]">Calculator</span>
//         </h1>
//         <p className="text-gray-500 text-sm font-medium">
//           Configure your loan parameters and see your estimated repayments
//           instantly.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//         {/* INPUT CONTROLS */}
//         <div className="lg:col-span-7">
//           <Card className="p-8 shadow-sm border-none rounded-[2rem] bg-white h-full space-y-10">
//             <h2 className="text-sm font-black text-[#002D62] uppercase tracking-widest flex items-center gap-2">
//               Configure Parameters <Info size={14} className="text-slate-300" />
//             </h2>

//             <div className="space-y-12">
//               {/* Amount Slider */}
//               <div className="space-y-4">
//                 <div className="flex justify-between items-end">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     Loan Amount
//                   </label>
//                   <span className="text-2xl font-black text-[#002D62]">
//                     ${loanAmount.toLocaleString()}
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min="5000"
//                   max="500000"
//                   step="5000"
//                   value={loanAmount}
//                   onChange={(e) => setLoanAmount(Number(e.target.value))}
//                   className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#002D62]"
//                 />
//               </div>

//               {/* Interest Slider */}
//               <div className="space-y-4">
//                 <div className="flex justify-between items-end">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     Interest Rate (%)
//                   </label>
//                   <span className="text-2xl font-black text-[#EBB04D]">
//                     {interestRate}%
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min="2"
//                   max="18"
//                   step="0.1"
//                   value={interestRate}
//                   onChange={(e) => setInterestRate(Number(e.target.value))}
//                   className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#EBB04D]"
//                 />
//               </div>

//               {/* Term Slider */}
//               <div className="space-y-4">
//                 <div className="flex justify-between items-end">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     Duration (Years)
//                   </label>
//                   <span className="text-2xl font-black text-[#002D62]">
//                     {loanTerm} Years
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min="1"
//                   max="30"
//                   step="1"
//                   value={loanTerm}
//                   onChange={(e) => setLoanTerm(Number(e.target.value))}
//                   className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
//                 />
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* RESULTS PANEL */}
//         <div className="lg:col-span-5 flex flex-col gap-6">
//           <Card className="p-8 bg-[#002D62] text-white border-none rounded-[2rem] shadow-xl relative overflow-hidden group">
//             <div className="relative z-10">
//               <p className="text-blue-200 font-black uppercase text-[10px] tracking-widest mb-2">
//                 Monthly Repayment
//               </p>
//               <h3 className="text-5xl font-black text-[#EBB04D] tracking-tighter">
//                 ${monthlyPayment}
//               </h3>
//               <div className="h-1 w-12 bg-[#EBB04D] mt-6 rounded-full group-hover:w-20 transition-all duration-500" />
//             </div>
//             <TrendingUp className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32" />
//           </Card>

//           <Card className="p-8 bg-amber-50 border border-amber-100 rounded-[2rem] relative overflow-hidden">
//             <p className="text-amber-700 font-black uppercase text-[10px] tracking-widest mb-1">
//               Required Upfront Deposit (10%)
//             </p>
//             <h3 className="text-2xl font-black text-[#002D62]">
//               ${upfrontPayment}
//             </h3>
//             <p className="text-[10px] text-amber-800/50 mt-2 italic font-medium">
//               * To be paid upon application approval.
//             </p>
//             <Wallet className="absolute -right-2 top-0 text-amber-200/20 w-24 h-24" />
//           </Card>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
//               <p className="text-[9px] text-gray-400 font-black uppercase mb-1">
//                 Total Interest
//               </p>
//               <p className="text-lg font-black text-[#002D62]">
//                 ${totalInterest}
//               </p>
//             </div>
//             <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
//               <p className="text-[9px] text-gray-400 font-black uppercase mb-1">
//                 Total Return
//               </p>
//               <p className="text-lg font-black text-[#002D62]">
//                 ${totalPayment}
//               </p>
//             </div>
//           </div>

//           <Button
//             onClick={() => setIsModalOpen(true)}
//             className="w-full bg-[#002D62] text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:bg-[#001f42] transition-all group"
//           >
//             Apply for ${loanAmount.toLocaleString()}{" "}
//             <ArrowRight
//               size={18}
//               className="group-hover:translate-x-1 transition-transform"
//             />
//           </Button>
//         </div>
//       </div>

//       {/* SUCCESS MODAL (Design preserved, integrated into Dashboard) */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsModalOpen(false)}
//               className="absolute inset-0 bg-[#002D62]/40 backdrop-blur-sm"
//             />
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0, y: 20 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0.9, opacity: 0, y: 20 }}
//               className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 text-center"
//             >
//               <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <CheckCircle2 size={40} />
//               </div>
//               <h2 className="text-2xl font-black text-[#002D62] mb-4 uppercase tracking-tight">
//                 Calculation Ready
//               </h2>
//               <p className="text-gray-500 text-sm mb-8 leading-relaxed">
//                 Your loan request for{" "}
//                 <span className="font-bold text-[#002D62]">
//                   ${loanAmount.toLocaleString()}
//                 </span>{" "}
//                 has been prepared. Proceed to chat to finalize with an
//                 administrator.
//               </p>
//               <div className="space-y-3 flex flex-col">
//                 <Button
//                   onClick={handleProceedToChat}
//                   className="w-full bg-[#002D62] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2"
//                 >
//                   <MessageCircle size={20} /> Open Chat Now
//                 </Button>
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="text-[10px] font-black text-gray-400 uppercase hover:text-[#002D62] transition-colors"
//                 >
//                   Adjust Parameters
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  // Added Icons for the Loan Type Selector
  User,
  Briefcase,
  Home as HomeIcon,
  PieChart,
} from "lucide-react";
import { Card, Button } from "@/app/components";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../lib/redux/store"; // Adjust path to your store type
import { createLoan } from "../../../lib/redux/features/loanSlice"; // Adjust path to your slice
import { toast } from "react-hot-toast"; // Recommended for feedback

interface CalculatorProps {
  setActiveTab: (tab: string) => void;
}

export const CalculatorContent = ({ setActiveTab }: CalculatorProps) => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  // --- RATES DATA (As requested) ---
  const rates: Record<string, number> = {
    personal: 8.5, // 8.5%
    business: 6.5, // 6.5%
    home: 4.5, // 4.5%
  };

  // --- STATE (Logic preserved) ---
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTerm, setLoanTerm] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loanType, setLoanType] = useState("personal");
  const { user } = useSelector((state: any) => state.auth);

  // --- SYNC WITH LOCALSTORAGE & URL (Logic preserved) ---
  useEffect(() => {
    const savedData = localStorage.getItem("loan_calculation");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setLoanAmount(parsed.amount || 100000);
      setLoanTerm(parsed.term / 12 || 5);

      const type = parsed.type || "personal";
      setLoanType(type);
      setInterestRate(rates[type]);
    }

    const amountFromUrl = searchParams.get("amount");
    if (amountFromUrl) {
      const parsedAmount = Number(amountFromUrl);
      if (!isNaN(parsedAmount)) setLoanAmount(parsedAmount);
    }
  }, [searchParams]);

  // --- CALCULATION LOGIC (Untouched) ---
  const UPFRONT_PERCENTAGE = 0.1;
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

  // Chart Logic: Percentage of Total
  const principalPercentage = (loanAmount / totalPaymentNum) * 100;
  const interestPercentage = (totalInterestNum / totalPaymentNum) * 100;

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

  // --- ROUTING LOGIC (Adapted for Dashboard) ---
  //   const handleProceedToChat = () => {
  //     const loanDetails = {
  //       amount: loanAmount.toLocaleString(),
  //       type: loanType,
  //       upfront: upfrontPayment,
  //       monthly: monthlyPayment,
  //       duration: `${loanTerm} years (${loanTerm * 12} months)`,
  //       totalInterest: totalInterest,
  //     };

  //     const autoMessage = `I would like to apply for a ${loanType} loan:
  // - Amount: $${loanDetails.amount}
  // - Upfront Deposit (10%): $${loanDetails.upfront}
  // - Monthly Repayment: $${loanDetails.monthly}
  // - Duration: ${loanDetails.duration}
  // - Total Interest: $${loanDetails.totalInterest}`;

  //     localStorage.setItem("pending_loan_message", autoMessage);
  //     localStorage.setItem("pending_loan_data", JSON.stringify(loanDetails));

  //     setIsModalOpen(false);
  //     setActiveTab("chat");
  //   };

  const handleProceedToChat = async () => {
    if (!user?._id) {
      toast.error("You must be logged in to apply.");
      return;
    }
    // Prepare the data exactly as your backend Controller expects it
    const loanSubmissionData = {
      userId: user._id,
      loanType: loanType,
      amount: loanAmount,
      durationYears: loanTerm,
      interestRate: interestRate,
      upfront: upfrontPaymentNum, // Use the raw numbers, not the formatted strings
      monthly: monthlyPaymentNum,
      totalInterest: totalInterestNum,
      totalReturn: totalPaymentNum,
    };

    try {
      // 2. Dispatch the action to save to backend
      const resultAction = await dispatch(createLoan(loanSubmissionData));

      if (createLoan.fulfilled.match(resultAction)) {
        // 3. Keep your existing "Chat Admin" logic for the UI experience
        //         const autoMessage = `I have just submitted a ${loanType} loan application:
        // - Amount: $${loanAmount.toLocaleString()}
        // - Monthly Repayment: $${monthlyPayment}
        // - Status: Pending Review`;

        const autoMessage = `I have just submitted a ${loanType} loan application:
        - Amount: $${loanAmount}
        - Upfront Deposit (10%): $${upfrontPaymentNum}
        - Monthly Repayment: $${monthlyPaymentNum}
        - Duration: ${loanTerm} years (${loanTerm * 12} months)
        - Total Interest: $${totalInterestNum}`;
        localStorage.setItem("pending_loan_message", autoMessage);

        setIsModalOpen(false);
        setActiveTab("chat"); // Move to chat
      } else {
        toast.error("Failed to submit loan application. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[#002D62] uppercase tracking-tighter">
          Loan <span className="text-[#EBB04D]">Calculator</span>
        </h1>
        <p className="text-gray-500 text-sm font-medium">
          Configure your loan parameters and see your estimated repayments
          instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT CONTROLS */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-8 shadow-sm border-none rounded-[2rem] bg-white space-y-10">
            <h2 className="text-sm font-black text-[#002D62] uppercase tracking-widest flex items-center gap-2">
              Configure Parameters <Info size={14} className="text-slate-300" />
            </h2>

            <div className="space-y-10">
              {/* LOAN TYPE SELECTOR */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
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
                        setInterestRate(rates[type.id]);
                      }}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                        loanType === type.id
                          ? "bg-[#EBB04D] border-[#EBB04D] text-[#002D62]"
                          : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      <type.icon size={24} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Loan Amount
                  </label>
                  <span className="text-2xl font-black text-[#002D62]">
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
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#002D62]"
                />
              </div>

              {/* Interest Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Interest Rate (%)
                  </label>
                  <span className="text-2xl font-black text-[#EBB04D]">
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
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#EBB04D]"
                />
              </div>

              {/* Term Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Duration (Years)
                  </label>
                  <span className="text-2xl font-black text-[#002D62]">
                    {loanTerm} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </Card>

          {/* VISUAL CHART BREAKDOWN */}
          <Card className="p-8 shadow-sm border-none rounded-[2rem] bg-white">
            <h2 className="text-sm font-black text-[#002D62] uppercase tracking-widest flex items-center gap-2 mb-6">
              Repayment Breakdown{" "}
              <PieChart size={14} className="text-slate-300" />
            </h2>
            <div className="space-y-6">
              <div className="h-4 w-full flex rounded-full overflow-hidden bg-gray-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${principalPercentage}%` }}
                  className="bg-[#002D62]"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${interestPercentage}%` }}
                  className="bg-[#EBB04D]"
                />
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#002D62]" />
                  <span className="text-slate-500">
                    Principal: ${loanAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EBB04D]" />
                  <span className="text-slate-500">
                    Interest: ${totalInterest}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* RESULTS PANEL */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="p-8 bg-[#002D62] text-white border-none rounded-[2rem] shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-blue-200 font-black uppercase text-[10px] tracking-widest mb-2">
                Monthly Repayment
              </p>
              <h3 className="text-5xl font-black text-[#EBB04D] tracking-tighter">
                ${monthlyPayment}
              </h3>
              <div className="h-1 w-12 bg-[#EBB04D] mt-6 rounded-full group-hover:w-20 transition-all duration-500" />
            </div>
            <TrendingUp className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32" />
          </Card>

          <Card className="p-8 bg-amber-50 border border-amber-100 rounded-[2rem] relative overflow-hidden">
            <p className="text-amber-700 font-black uppercase text-[10px] tracking-widest mb-1">
              Required Upfront Deposit (10%)
            </p>
            <h3 className="text-2xl font-black text-[#002D62]">
              ${upfrontPayment}
            </h3>
            <p className="text-[10px] text-amber-800/50 mt-2 italic font-medium">
              * To be paid upon application approval.
            </p>
            <Wallet className="absolute -right-2 top-0 text-amber-200/20 w-24 h-24" />
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[9px] text-gray-400 font-black uppercase mb-1">
                Total Interest
              </p>
              <p className="text-lg font-black text-[#002D62]">
                ${totalInterest}
              </p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[9px] text-gray-400 font-black uppercase mb-1">
                Total Return
              </p>
              <p className="text-lg font-black text-[#002D62]">
                ${totalPayment}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#002D62] text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:bg-[#001f42] transition-all group"
          >
            Apply for ${loanAmount.toLocaleString()}{" "}
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#002D62]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 text-center"
            >
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-[#002D62] mb-4 uppercase tracking-tight">
                Calculation Ready
              </h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Your{" "}
                <span className="capitalize font-bold text-[#EBB04D]">
                  {loanType}
                </span>{" "}
                loan request for{" "}
                <span className="font-bold text-[#002D62]">
                  ${loanAmount.toLocaleString()}
                </span>{" "}
                has been prepared. Proceed to chat to finalize with an
                administrator.
              </p>
              <div className="space-y-3 flex flex-col">
                <Button
                  onClick={handleProceedToChat}
                  className="w-full bg-[#002D62] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} /> Open Chat Now
                </Button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-[10px] font-black text-gray-400 uppercase hover:text-[#002D62] transition-colors"
                >
                  Adjust Parameters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
