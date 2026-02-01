"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/app/components";
import {
  History,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Search,
  Filter,
} from "lucide-react";
import { userAPI } from "@/lib/api"; // Assuming your transaction API is here
import toast from "react-hot-toast";

export const HistoryContent = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(false);
        // If you have a specific endpoint for payments, use it here:
        // const res = await userAPI.getTransactions();
        // setTransactions(res.data);

        // Static Mock Data for now so you can see the UI immediately:
        setTransactions([
          {
            id: "TX-9921",
            date: "2024-07-12",
            amount: 450.0,
            type: "Repayment",
            method: "Auto-Debit",
            status: "success",
          },
          {
            id: "TX-9844",
            date: "2024-06-12",
            amount: 450.0,
            type: "Repayment",
            method: "Manual",
            status: "success",
          },
          {
            id: "TX-9712",
            date: "2024-05-15",
            amount: 1200.0,
            type: "Principal Payoff",
            method: "Bank Transfer",
            status: "success",
          },
          {
            id: "TX-9601",
            date: "2024-04-12",
            amount: 450.0,
            type: "Repayment",
            method: "Auto-Debit",
            status: "failed",
          },
        ]);
      } catch (err) {
        toast.error("Failed to load transaction history");
      }
    };
    fetchHistory();
  }, []);

  if (loading)
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-2xl" />
        ))}
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
            Detailed log of your loan repayments and disbursements.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white border-2 border-[#002D62] text-[#002D62] px-6 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-[#002D62] hover:text-white transition-all">
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
            placeholder="Search by ID or type..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EBB04D]/20"
          />
        </div>
        <button className="bg-white p-3 rounded-2xl border border-gray-100 text-gray-400 hover:text-[#002D62]">
          <Filter size={20} />
        </button>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Transaction Details
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
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                      {tx.id}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${tx.type.includes("Payoff") ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}
                      >
                        {tx.type.includes("Payoff") ? (
                          <ArrowUpRight size={16} />
                        ) : (
                          <ArrowDownLeft size={16} />
                        )}
                      </div>
                      <p className="text-sm font-black text-[#002D62] uppercase tracking-tight">
                        {tx.type}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                    {tx.method}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-sm font-black text-[#002D62]">
                      ${tx.amount.toFixed(2)}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          tx.status === "success"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
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
        </div>
      </div>
    </div>
  );
};
