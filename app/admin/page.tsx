"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  ChevronRight,
  TrendingUp,
  BellRing,
  MessageCircle,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Cpu,
} from "lucide-react";
import { Navigation } from "@/app/components";
import Link from "next/link";
import { getSocket } from "@/lib/socket";
import { adminAPI } from "@/lib/api";
import AdminLayout from "./layout/AdminLayout";

interface DashboardStats {
  totalUsers: number;
  activeLoans: number;
  revenue: number;
  aiManaged: number;
}

const initialStats: DashboardStats = {
  totalUsers: 0,
  activeLoans: 0,
  revenue: 0,
  aiManaged: 0,
};

export default function AdminDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeLoans: 0,
    revenue: 0,
    aiManaged: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const socket = getSocket();

  // Notification & UI State
  const [unreadAppIds, setUnreadAppIds] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState({
    show: false,
    name: "",
    email: "",
  });
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const isFetching = useRef(false);

  // 1. DATA INTEGRATION: Fetching from adminAPI
  const refreshData = async () => {
    if (isFetching.current) return;
    isFetching.current = true;

    // 1. Fetch Loans (The fast one)
    adminAPI
      .getAllLoans()
      .then((loanRes) => {
        setApplications(loanRes?.loans || loanRes?.data?.loans || []);
      })
      .catch((err) => console.error("Loan Fetch Error:", err));

    // 2. Fetch Stats (The slow/failing one)
    try {
      const statRes = await adminAPI.getDashboardStats();
      setStats(statRes?.data?.stats || initialStats);
    } catch (error: any) {
      if (error.code === "ECONNABORTED") {
        console.error("Stats request timed out. Check server logs/DB indexes.");
      }
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  // 2. AI MANAGEMENT: Toggle Logic
  const handleToggleAI = async (loanId: string, currentState: boolean) => {
    try {
      setIsUpdating(loanId); // Set loading state for this specific row
      await adminAPI.toggleLoanAI(loanId, !currentState);

      // Optimistic update or refresh
      refreshData();
    } catch (error) {
      console.error("AI Toggle Error:", error);
      alert("Failed to update AI status. Please try again.");
    } finally {
      setIsUpdating(null); // Clear loading state
    }
  };

  // 3. DANGER ZONE: User Deletion
  const handleDeleteUser = async (userId: string) => {
    if (confirm("CRITICAL: Delete user completely? This cannot be undone.")) {
      try {
        await adminAPI.deleteUserCompletely(userId);
        refreshData();
      } catch (error) {
        alert("Error deleting user");
      }
    }
  };

  // 4. EFFECTS: Socket.io & Polling
  useEffect(() => {
    setLoading(true);
    refreshData();

    // --- 1. SET UP SOCKETS ---
    socket.on("new_message", (message: any) => {
      if (message.senderType === "user") {
        triggerNotification(message.senderName, message.text);
        setUnreadAppIds((prev) => [
          ...new Set([...prev, message.applicationId]),
        ]);

        // OPTIONAL: Since a message arrived, we know data changed.
        // You could trigger a refreshData() here to be ultra-responsive.
      }
    });

    // --- 2. SET UP SMART POLLING ---
    let timeoutId: NodeJS.Timeout;
    const poll = async () => {
      if (!document.hidden) {
        await refreshData();
      }
      timeoutId = setTimeout(poll, 60000);
    };
    timeoutId = setTimeout(poll, 60000);

    // --- 3. CLEANUP EVERYTHING ---
    return () => {
      socket.off("new_message");
      clearTimeout(timeoutId);
    };
  }, [socket]); // Keep socket in dependency if the instance can change

  const triggerNotification = (name: string, email: string) => {
    setShowNotification({ show: true, name, email });
    const audio = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
    );
    audio.play().catch(() => {}); // Catch prevents errors if browser blocks autoplay

    setTimeout(
      () => setShowNotification({ show: false, name: "", email: "" }),
      5000,
    );
  };

  return (
    <AdminLayout>
      {/* High-End Notification Toast */}
      <AnimatePresence>
        {showNotification.show && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-24 right-6 z-[999] bg-white border-l-4 border-blue-600 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-4 rounded-xl flex items-center gap-4 min-w-[350px]"
          >
            <div className="bg-blue-600 text-white p-2.5 rounded-lg">
              <MessageCircle size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm">{showNotification.name}</h4>
              <p className="text-xs text-slate-500">New message received</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-10 pb-20 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
              Systems Overview
            </h1>
            <p className="text-slate-500 font-medium">
              Real-time lending surveillance and AI-decision matrix.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              API Stable
            </div>
          </div>
        </div>

        {/* PRO-LEVEL METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            label="Total Capital"
            value={`$${stats.revenue.toLocaleString()}`}
            icon={TrendingUp}
            trend="+12.5%"
          />
          <StatCard
            label="Active Files"
            value={stats.activeLoans}
            icon={Users}
          />
          <StatCard
            label="AI Managed"
            value={stats.aiManaged}
            icon={Cpu}
            color="text-indigo-600"
          />
          <StatCard
            label="Alerts"
            value={unreadAppIds.length}
            icon={ShieldAlert}
            color="text-rose-600"
          />
        </div>

        {/* MAIN DATA TABLE */}
        <div className="bg-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold">Loan Management</h2>
              <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold">
                LATEST {applications.length} RECORDS
              </span>
            </div>
            <div className="relative w-full md:w-auto">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Filter by name..."
                className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 w-full md:w-80 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div
            className={`overflow-x-auto transition-opacity ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
          >
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Borrower Profile</th>
                  <th className="px-8 py-5">Financial Details</th>
                  <th className="px-8 py-5">AI Governance</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {applications
                  .filter((app) =>
                    app.userName
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()),
                  )
                  .map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-slate-50/50 transition-all group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-lg">
                              {app.userName?.substring(0, 2).toUpperCase()}
                            </div>
                            {unreadAppIds.includes(app._id) && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-white rounded-full" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {app.userName}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">
                              {app.userEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-slate-700">
                          ${app.amount?.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                          {app.term} Months / 4.2% APR
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <button
                          onClick={() => handleToggleAI(app._id, app.aiEnabled)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                            app.aiEnabled
                              ? "bg-indigo-50 border-indigo-100 text-indigo-600"
                              : "bg-slate-50 border-slate-200 text-slate-400"
                          }`}
                        >
                          <Cpu
                            size={14}
                            className={app.aiEnabled ? "animate-pulse" : ""}
                          />
                          <span className="text-[10px] font-black uppercase">
                            {app.aiEnabled ? "AI Active" : "Manual"}
                          </span>
                        </button>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            app.status === "approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : app.status === "rejected"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {app.status || "reviewing"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDeleteUser(app.userId)}
                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                          <Link
                            href={`/admin/chat/${app._id}`}
                            onClick={() =>
                              setUnreadAppIds((prev) =>
                                prev.filter((id) => id !== app._id),
                              )
                            }
                            className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md"
                          >
                            <ChevronRight size={18} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {applications.length === 0 && !loading && (
              <div className="py-20 text-center text-slate-400 text-sm">
                No loan applications found.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Sub-component for clean Stats
function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-blue-600",
  trend,
}: any) {
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-slate-50 ${color}`}>
          <Icon size={22} />
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            {trend}
          </span>
        )}
      </div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-3xl font-black text-slate-900 tracking-tighter">
        {value}
      </p>
    </div>
  );
}
