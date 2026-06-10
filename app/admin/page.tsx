"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  ShieldAlert,
  Trash2,
  Cpu,
  Wallet,
  Landmark,
  Receipt,
  Clock,
  ShieldCheck,
  Banknote,
  Percent,
} from "lucide-react";
import Link from "next/link";
import { getSocket } from "@/lib/socket";
import { adminAPI } from "@/lib/api";
import AdminLayout from "./layout/AdminLayout";
import { useAppDispatch } from "@/lib/redux/hooks";
import { fetchAdminNotifications } from "@/lib/redux/features/adminSlice";

interface DashboardStats {
  totalUsers: number;
  pendingLoans: number;
  activeLoans: number;
  revenue: number;
  aiManaged: number;
}

// Helper to handle Axios response types safely
interface AxiosStatResponse {
  data: {
    success: boolean;
    stats: DashboardStats;
  };
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingLoans: 0,
    activeLoans: 0,
    revenue: 0,
    aiManaged: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const socket = getSocket();
  const [unreadAppIds, setUnreadAppIds] = useState<string[]>([]);
  const isFetching = useRef(false);
  const dispatch = useAppDispatch();

  // --- REFINED FINANCIAL CALCULATIONS ---

  // Total Volume of all loans applied for
  const totalLoanVolume = applications.reduce(
    (acc, app) => acc + (app.amount || 0),
    0,
  );

  // Expected Interest (Profit Margin)
  const totalExpectedInterest = applications.reduce(
    (acc, app) => acc + (app.totalInterest || 0),
    0,
  );

  // Upfront Fees (Immediate Cashflow)
  const totalUpfrontFees = applications.reduce(
    (acc, app) => acc + (app.upfrontFee || 0),
    0,
  );

  // Total Paid Back (Calculated from repaymentProgress percentage if available)
  // Logic: (Progress / 100) * Total Repayment
  const totalCollectedToDate = applications.reduce((acc, app) => {
    const progress = app.repaymentProgress || 0;
    const repayment = app.totalRepayment || 0;
    return acc + repayment * (progress / 100);
  }, 0);

  const refreshData = async () => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      // Use "as any" or define the specific Axios return type to bypass the .stats error
      const [loanRes, statRes]: [any, any] = await Promise.all([
        adminAPI.getAllLoans(),
        adminAPI.getDashboardStats(),
      ]);

      setApplications(loanRes || []);

      // Safe access to stats to avoid the Axios 'status' vs 'stats' confusion
      const rawStats = statRes?.data?.stats || statRes?.stats;
      if (rawStats) {
        setStats(rawStats);
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    refreshData();
    const intervalId = setInterval(() => {
      if (!document.hidden) refreshData();
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Inside your Admin Dashboard component

  useEffect(() => {
    dispatch(fetchAdminNotifications());

    const socket = getSocket();
    socket.on("new_admin_notification", (data) => {
      // You can add a simple reducer to prepend the new notification to the state
      // Or just re-fetch
      dispatch(fetchAdminNotifications());
    });
  }, [dispatch]);

  return (
    <AdminLayout>
      <div className="pt-10 pb-20 px-6 max-w-[1600px] mx-auto">
        {/* Header with quick system status */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 italic uppercase">
              Terminal <span className="text-blue-600">v3.0</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Monitoring {applications.length} active financial instruments.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
              Real-time Data Flowing
            </span>
          </div>
        </div>

        {/* FINANCIAL DATA CENTER - High Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Gross Portfolio"
            value={`$${totalLoanVolume.toLocaleString()}`}
            icon={Landmark}
            trend="Loan Volume"
            color="text-blue-600"
          />
          <StatCard
            label="Total Collected"
            value={`$${totalCollectedToDate.toLocaleString()}`}
            icon={Banknote}
            trend="Repayments"
            color="text-emerald-600"
          />
          <StatCard
            label="Projected Revenue"
            value={`$${totalExpectedInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            icon={Percent}
            trend="Interest"
            color="text-indigo-600"
          />
          <StatCard
            label="Upfront Cash"
            value={`$${totalUpfrontFees.toLocaleString()}`}
            icon={Receipt}
            trend="Fee Revenue"
            color="text-amber-600"
          />
        </div>

        {/* OPERATIONAL INSIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            label="Pending Review"
            value={stats.pendingLoans}
            icon={Clock}
            trend="Applications"
            color="text-rose-600"
          />
          <StatCard
            label="AI Risk Managed"
            value={stats.aiManaged}
            icon={Cpu}
            trend="Automation"
            color="text-violet-600"
          />
          <StatCard
            label="Registered Users"
            value={stats.totalUsers}
            icon={Users}
            trend="Total Base"
            color="text-slate-600"
          />
        </div>

        {/* PORTFOLIO TABLE */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Portfolio Analysis
              </h2>
              <p className="text-sm text-slate-400 font-medium">
                Drill down into individual loan performance.
              </p>
            </div>
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search ledger..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white rounded-3xl text-sm transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-8 py-6 border-b border-slate-100">
                    Borrower
                  </th>
                  <th className="px-8 py-6 border-b border-slate-100">
                    Asset Detail
                  </th>
                  <th className="px-8 py-6 border-b border-slate-100">
                    Financials
                  </th>
                  <th className="px-8 py-6 border-b border-slate-100">
                    Repayment
                  </th>
                  <th className="px-8 py-6 border-b border-slate-100 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {applications
                  .filter(
                    (app) =>
                      app.userName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      app.loanAccountNumber?.includes(searchTerm),
                  )
                  .map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-blue-50/30 transition-all group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-slate-200">
                            {app.userName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 leading-tight">
                              {app.userName}
                            </p>
                            <p className="text-[11px] text-slate-400 font-bold">
                              {app.userEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-[13px] font-black text-slate-700 uppercase tracking-tighter">
                          {app.loanAccountNumber}
                        </p>
                        <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md font-black uppercase">
                          {app.loanType}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900">
                            ${app.amount?.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-indigo-600 font-black uppercase tracking-tighter">
                            Rate: {app.interestRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="w-full max-w-[120px]">
                          <div className="flex justify-between mb-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase">
                              {app.repaymentProgress || 0}% Paid
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                              style={{
                                width: `${app.repaymentProgress || 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link
                          href={`/admin/chat/${app._id}`}
                          className="inline-flex items-center justify-center w-12 h-12 bg-white border border-slate-100 text-slate-900 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                        >
                          <ChevronRight size={20} />
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Sub-component remains similar but with updated shadows
function StatCard({ label, value, icon: Icon, color, trend }: any) {
  return (
    <div className="bg-white p-7 rounded-[35px] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-4 rounded-2xl bg-slate-50 ${color} group-hover:scale-110 transition-transform`}
        >
          <Icon size={26} />
        </div>
        <div className="bg-slate-50 px-3 py-1 rounded-full">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">
            {trend}
          </span>
        </div>
      </div>
      <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-xl font-black text-slate-900 tracking-tighter">
        {value}
      </p>
    </div>
  );
}
