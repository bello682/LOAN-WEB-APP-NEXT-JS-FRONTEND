"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Search,
  Filter,
  Receipt,
} from "lucide-react";
import { loanAPI } from "@/lib/api";
import toast from "react-hot-toast";

export const HistoryContent = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await loanAPI.getMyLoans();
        const loans = res.data?.loans || [];

        const allTransactions = loans.flatMap((loan: any) => {
          // 1. Get actual payments if they exist
          const history = (loan.repaymentHistory || []).map((h: any) => ({
            ...h,
            loanType: loan.loanType,
            loanId: loan.loanAccountNumber || loan._id,
          }));

          // 2. IMPORTANT: Add the "Initial Application" as a transaction
          // so the history isn't empty while the loan is pending.
          const initialEntry = {
            id: `APP-${loan.loanAccountNumber?.split("-")[1] || loan._id.slice(-4)}`,
            date: loan.date_applied,
            amount: loan.amount,
            type: "Loan Application",
            method: "N/A",
            status: loan.status, // This will show "pending"
            loanType: loan.loanType,
            loanId: loan.loanAccountNumber || loan._id,
          };

          return [initialEntry, ...history];
        });

        const sorted = allTransactions.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        setTransactions(sorted);
        setFilteredTransactions(sorted);
      } catch (err) {
        console.error("History Load Error:", err);
        toast.error("Failed to load live transaction history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Handle Search Filtering
  useEffect(() => {
    const results = transactions.filter(
      (tx) =>
        tx.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.loanType?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredTransactions(results);
  }, [searchTerm, transactions]);

  console.log("All Transactions:", transactions);
  console.log("All Filtered Transactions:", filteredTransactions);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-4 border-[#002D62] border-t-[#EBB04D] rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase text-[#002D62] tracking-widest">
          Loading Records...
        </p>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#002D62] uppercase tracking-tighter">
            Transaction <span className="text-[#EBB04D]">History</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Live log of your payments and disbursements.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white border-2 border-[#002D62] text-[#002D62] px-6 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-[#002D62] hover:text-white transition-all shadow-sm">
          <Download size={16} /> Export Statement
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, loan type, or status..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EBB04D]/20 shadow-sm"
          />
        </div>
        <button className="bg-white p-3 rounded-2xl border border-gray-100 text-gray-400 hover:text-[#002D62] shadow-sm">
          <Filter size={20} />
        </button>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="py-20 text-center">
              <Receipt className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">
                No Transactions Found
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Date
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Type
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Method
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                    Amount
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTransactions.map((tx, idx) => (
                  <tr
                    key={tx.id || idx}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(tx.date).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase">
                        {tx.loanType} ID: {tx.loanId?.slice(-6)}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${tx.amount > 0 ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}
                        >
                          {tx.amount > 0 ? (
                            <ArrowDownLeft size={16} />
                          ) : (
                            <ArrowUpRight size={16} />
                          )}
                        </div>
                        <p className="text-sm font-black text-[#002D62] uppercase tracking-tight">
                          {tx.type || "Repayment"}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 font-medium capitalize">
                      {tx.method || "System Debit"}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p
                        className={`text-sm font-black ${tx.status === "failed" ? "text-gray-400 line-through" : "text-[#002D62]"}`}
                      >
                        ${(tx.amount || 0).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            tx.status === "success" || tx.status === "completed"
                              ? "bg-green-100 text-green-600"
                              : tx.status === "failed"
                                ? "bg-red-100 text-red-600"
                                : "bg-amber-100 text-amber-600"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
