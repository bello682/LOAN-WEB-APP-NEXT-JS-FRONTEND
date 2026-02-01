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
  ChevronRight,
  Clock, // Added for status
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
  const [pendingLoan, setPendingLoan] = useState<any>(null); // Track pending apps
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setIsLoading(true);
        const response = await loanAPI.getMyLoans();
        const loans = Array.isArray(response.data)
          ? response.data
          : response.data?.loans || [];

        setUserLoans(loans);

        // Logic: Find the most recent loan that isn't active to show in the tracker
        const pending = loans.find((l: any) => l.status !== "active");
        if (pending) {
          // Fetch deeper details for the tracker
          const statusRes = await loanAPI.getApplicationStatus(pending._id);
          setPendingLoan(statusRes.data);
        }

        const totalBorrowed = loans.reduce(
          (sum: number, loan: any) => sum + (Number(loan.amount) || 0),
          0,
        );
        const activeCount = loans.filter(
          (l: any) => l.status === "active",
        ).length;

        setStats([
          {
            label: "Total Borrowed",
            value: `$${totalBorrowed.toLocaleString()}`,
            icon: Wallet,
            color: "text-blue-600",
            bg: "bg-blue-50",
            change: "+12%",
          },
          {
            label: "Active Loans",
            value: activeCount.toString(),
            icon: Target,
            color: "text-purple-600",
            bg: "bg-purple-50",
            change: "Current",
          },
          {
            label: "Amount Repaid",
            value: "$0",
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50",
            change: "On Track",
          },
          {
            label: "Credit Score",
            value: (user as any)?.creditScore?.toString() || "N/A",
            icon: BarChart3,
            color: "text-amber-600",
            bg: "bg-amber-50",
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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-32 w-full bg-gray-100 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero Section */}
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
          onClick={() => setActiveTab("loans")}
          className="bg-[#002D62] text-white px-8 h-12 rounded-xl flex gap-2 text-xs font-black uppercase tracking-widest hover:bg-[#001f42] transition-all shadow-lg"
        >
          Apply for New Loan <ArrowUpRight size={18} />
        </Button>
      </div>

      {/* NEW: Application Status Tracker (Only shows if a loan is pending) */}
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
                  {pendingLoan.stepName || "Verification Stage"}
                </h2>
                <p className="text-blue-200 text-xs mt-1">
                  Loan ID: {pendingLoan._id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-[#EBB04D]">
                  Est. Completion
                </p>
                <p className="font-bold">24-48 Hours</p>
              </div>
            </div>

            {/* Visual Progress Steps */}
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

      {/* Stats Grid */}
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
            <p className="text-2xl font-black text-[#002D62]">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Loan List Section */}
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
                {/* ... (Your existing Loan Card JSX) ... */}
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
