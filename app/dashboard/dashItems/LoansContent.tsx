"use client";
import React, { useEffect, useState } from "react";
import { loanAPI } from "@/lib/api";
import { Card } from "@/app/components";
import { Trash2, ExternalLink, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export const LoansContent = () => {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await loanAPI.getMyLoans();
      setLoans(Array.isArray(res.data) ? res.data : res.data?.loans || []);
    } catch (err) {
      toast.error("Failed to load your loans");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this loan record?")) return;
    try {
      await loanAPI.deleteLoan(id);
      toast.success("Loan record deleted");
      fetchLoans(); // Refresh list
    } catch (err) {
      toast.error("Could not delete loan. It might be active.");
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-[#002D62] uppercase italic">
          My Loan Portfolio
        </h2>
        <button
          onClick={fetchLoans}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid gap-4">
        {loans.map((loan) => (
          <Card
            key={loan._id}
            className="p-6 border-none shadow-sm bg-white flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`w-3 h-3 rounded-full ${loan.status === "active" ? "bg-green-500" : "bg-amber-500"}`}
                />
                <h3 className="font-black text-[#002D62] uppercase tracking-tight">
                  {loan.loanType} Loan
                </h3>
              </div>
              <p className="text-2xl font-black text-[#002D62]">
                ${loan.amount?.toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-400 font-mono">{loan._id}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDelete(loan._id)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Delete Record"
              >
                <Trash2 size={20} />
              </button>
              <button className="flex items-center gap-2 bg-[#002D62] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all">
                Details <ExternalLink size={14} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
