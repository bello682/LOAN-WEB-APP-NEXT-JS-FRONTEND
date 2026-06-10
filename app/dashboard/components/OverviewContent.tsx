"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, Button } from "@/app/components";
import {
  Wallet,
  Target,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { loanAPI } from "@/lib/api";
import { useAppSelector } from "@/lib/redux/hooks";
import toast from "react-hot-toast";

interface OverviewProps {
  setActiveTab: (tab: string) => void;
}

export const OverviewContent = ({ setActiveTab }: OverviewProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const [userLoans, setUserLoans] = useState<any[]>([]);
  const [pendingLoan, setPendingLoan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchOverviewData = async () => {
      // 1. If user isn't loaded from Redux yet, just exit this function.
      // The JSX return for "no user" is handled below the useEffect.
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await loanAPI.getMyLoans();

        // Extracting data safely from your API structure
        const loansData = response.data?.loans || [];
        const globalStatsData = response.data?.stats || {
          totalActiveDebt: 0,
          totalLoans: 0,
        };

        // Update basic loans list
        setUserLoans(loansData);

        // 2. FIND the most recent pending application for the Tracker
        const mostRecentPending = [...loansData]
          .sort(
            (a, b) =>
              new Date(b.date_applied).getTime() -
              new Date(a.date_applied).getTime(),
          )
          .find((l: any) => l.status === "pending");

        if (mostRecentPending) {
          setPendingLoan(mostRecentPending);
        }

        // 3. LOGGING (Using local variables to avoid "stale" state logs)
        console.log("Actual Loans from API:", loansData);
        console.log("Actual Stats from API:", globalStatsData);

        // 4. CALCULATE stats based on the data we just fetched
        // --- 1. CALCULATIONS ---
        const totalBorrowed = loansData.reduce(
          (sum: number, l: any) => sum + (Number(l.amount) || 0),
          0,
        );

        // Sum of all Upfront Fees
        const totalUpfrontFees = loansData.reduce(
          (sum: number, l: any) => sum + (Number(l.upfrontFee) || 0),
          0,
        );

        // Sum of Total Interest across all loans
        const totalInterest = loansData.reduce(
          (sum: number, l: any) => sum + (Number(l.totalInterest) || 0),
          0,
        );

        // Total amount user is expected to pay back (Principal + Interest)
        const totalPayable = loansData.reduce(
          (sum: number, l: any) => sum + (Number(l.totalRepayment) || 0),
          0,
        );

        // Actual amount paid back (based on repaymentProgress percentage)
        const totalRepaidSoFar = loansData.reduce((sum: number, l: any) => {
          const total = Number(l.totalRepayment) || 0;
          const progress = Number(l.repaymentProgress) || 0;
          return sum + total * (progress / 100);
        }, 0);

        const activeCount = loansData.filter(
          (l: any) => l.status === "active",
        ).length;
        const processingCount = loansData.filter(
          (l: any) => l.status === "pending",
        ).length;
        const currentDebt = globalStatsData.totalActiveDebt || 0;

        // --- 2. SETTING STATS ---
        setStats([
          {
            label: "Total Principal",
            value: `$${totalBorrowed.toLocaleString()}`,
            icon: Wallet,
            color: "text-blue-600",
            bg: "bg-blue-50",
            change: `Apps: ${loansData.length}`,
          },
          {
            label: "Upfront Fees",
            value: `$${totalUpfrontFees.toLocaleString()}`,
            icon: ArrowUpRight,
            color: "text-orange-600",
            bg: "bg-orange-50",
            change: "Total Due",
          },
          {
            label: "Total Interest",
            value: `$${totalInterest.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-red-600",
            bg: "bg-red-50",
            change: "Projected",
          },
          {
            label: "Repaid to Date",
            value: `$${totalRepaidSoFar.toLocaleString()}`,
            icon: Target,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            change: "Verified",
          },
          {
            label: "Total Payable",
            value: `$${totalPayable.toLocaleString()}`,
            icon: BarChart3,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            change: "Incl. Interest",
          },
          {
            label: "Active Debt",
            value: `$${currentDebt.toLocaleString()}`,
            icon: Wallet,
            color: "text-rose-600",
            bg: "bg-rose-50",
            change: activeCount > 0 ? "In Repayment" : "No Active",
          },
          {
            label: "Pending Apps",
            value: processingCount.toString(),
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
            change: "Processing",
          },
          {
            label: "Credit Score",
            value: user?.creditScore?.toString() || "0",
            icon: BarChart3,
            color: "text-purple-600",
            bg: "bg-purple-50",
            change: "Live",
          },
        ]);
      } catch (error) {
        console.error("Error loading overview:", error);
        toast.error("Failed to refresh dashboard stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverviewData();
  }, [user]);

  // --- RENDER LOGIC ---

  // 1. Loading User from Redux
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 p-4">
        {/* The Rolling Spinner and Text in the very middle */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#002D62] border-t-[#EBB04D] rounded-full animate-spin" />
          <div className="text-center">
            <p className="font-black text-[#002D62] uppercase tracking-[0.2em] text-sm animate-pulse">
              Syncing Account Data
            </p>
            <p className="text-gray-400 text-[10px] font-medium mt-1">
              Please wait while we verify your credentials...
            </p>
          </div>
        </div>

        {/* Faded skeletons in the background to show context */}
        <div className="w-full max-w-5xl opacity-20 pointer-events-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Loading API Data (Matches the 8-stat layout)
  if (isLoading) {
    return (
      <div className="relative min-h-[60vh] flex flex-col gap-8 p-4">
        {/* 1. The Rolling Icon Overlay - Positioned in the middle of the stats area */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]">
          <div className="w-12 h-12 border-4 border-[#002D62] border-t-[#EBB04D] rounded-full animate-spin" />
          <p className="mt-4 font-black text-[#002D62] uppercase tracking-widest text-[10px] animate-bounce">
            Fetching Financials...
          </p>
        </div>

        {/* 2. The Skeleton Background (Matches your 8-stat layout) */}
        <div className="animate-pulse flex flex-col gap-8 opacity-50">
          {/* Header Skeleton */}
          <div className="h-10 w-64 bg-gray-200 rounded-lg" />

          {/* Tracker Skeleton */}
          <div className="h-40 w-full bg-gray-200 rounded-[2rem]" />

          {/* Stats Grid Skeleton (8 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-36 bg-gray-200 rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Main Dashboard UI
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#002D62] uppercase tracking-tighter">
            Financial <span className="text-[#EBB04D]">Overview</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Welcome back, {user?.fullName?.split(" ")[0]}.
          </p>
        </div>
        <Button
          onClick={() => setActiveTab("calculator")}
          className="bg-[#002D62] text-white px-8 h-12 rounded-xl flex gap-2 text-xs font-black uppercase tracking-widest hover:bg-[#001f42] transition-all shadow-lg"
        >
          Apply for New Loan <ArrowUpRight size={18} />
        </Button>
      </div>

      {pendingLoan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-[#002D62] p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden border-b-8 border-[#EBB04D]">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-[#EBB04D]" size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">
                    Processing Application
                  </span>
                </div>
                <h2 className="text-2xl font-black uppercase italic">
                  {pendingLoan.status === "pending"
                    ? "Verification Stage"
                    : pendingLoan.status}
                </h2>
                <p className="text-blue-200 text-xs mt-1">
                  Loan ID: {pendingLoan._id || pendingLoan.loanAccountNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-[#EBB04D]">
                  Est. Completion
                </p>
                <p className="font-bold">24-48 Hours</p>
              </div>
            </div>
            <div className="mt-8 flex gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 flex-1 rounded-full ${step <= 2 ? "bg-[#EBB04D]" : "bg-white/10"}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="p-6 border-none shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
                {stat.change}
              </span>
            </div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className="text-xl font-black text-[#002D62]">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-[#002D62] uppercase tracking-[0.2em]">
            Active Accounts
          </h2>
          <button
            onClick={() => setActiveTab("loans")}
            className="text-[10px] font-black text-[#EBB04D] uppercase hover:underline cursor-pointer"
          >
            View All Portfolio
          </button>
        </div>

        {userLoans.filter((l) => l.status === "active").length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium">
              No active accounts to display.
            </p>
          </div>
        ) : (
          userLoans
            .filter((l) => l.status === "active")
            .map((loan, i) => (
              <Card
                key={loan._id || i}
                className="p-0 overflow-hidden border-none shadow-sm bg-white group border-l-4 border-l-[#EBB04D]"
              >
                <div className="flex flex-col md:flex-row p-8">
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-[#002D62] uppercase">
                      {loan.loanType} Loan
                    </h3>
                    <p className="text-2xl font-black text-[#002D62]">
                      ${loan.amount?.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("loans")}
                    className="mt-4 md:mt-0 bg-gray-50 px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-[#EBB04D] transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </Card>
            ))
        )}
      </div>
    </div>
  );
};
