"use client";
import React, { useEffect, useState, useRef } from "react";
import { loanAPI } from "@/lib/api";
import { Card } from "@/app/components";
import {
  Trash2,
  ExternalLink,
  RefreshCw,
  X,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  Printer,
} from "lucide-react";
import toast from "react-hot-toast";

export const LoansContent = () => {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

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
      fetchLoans();
    } catch (err) {
      toast.error("Could not delete loan. It might be active.");
    }
  };

  // Function to handle Printing/PDF Download
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="space-y-6 relative">
      {/* Print Styles: This hides everything except the receipt when printing */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt,
          #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

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
            className="p-6 border-none shadow-sm bg-white flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow cursor-default"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    loan.status === "active"
                      ? "bg-green-100 text-green-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {loan.status}
                </span>
                <h3 className="font-black text-[#002D62] uppercase tracking-tight">
                  {loan.loanType} Loan
                </h3>
              </div>
              <p className="text-2xl font-black text-[#002D62]">
                ${loan.amount?.toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-400 font-mono uppercase">
                Acct: {loan.loanAccountNumber}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDelete(loan._id)}
                className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={() => setSelectedLoan(loan)}
                className="flex items-center gap-2 bg-[#002D62] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#003d82] transition-all"
              >
                View Receipt <ExternalLink size={14} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* --- RECEIPT MODAL --- */}
      {selectedLoan && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#002D62]/40 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedLoan(null)} // Close on background click
        >
          <div
            id="printable-receipt"
            className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent close on modal click
          >
            {/* Header / Status Banner (Fixed at top) */}
            <div
              className={`p-6 text-center ${selectedLoan.status === "active" ? "bg-green-500" : "bg-[#EBB04D]"} text-white relative flex-shrink-0`}
            >
              <button
                onClick={() => setSelectedLoan(null)}
                className="absolute right-6 top-6 p-1 hover:bg-black/10 rounded-full transition-colors no-print"
              >
                <X size={20} />
              </button>
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                {selectedLoan.status === "active" ? (
                  <CheckCircle2 size={32} />
                ) : (
                  <Clock size={32} />
                )}
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter">
                Loan{" "}
                {selectedLoan.status === "active"
                  ? "Approved"
                  : "Pending Review"}
              </h2>
              <p className="text-sm opacity-90 font-medium italic">
                Official Transaction Receipt
              </p>
            </div>

            {/* Scrollable Receipt Body */}
            <div className="p-8 space-y-6 overflow-y-auto scrollbar-hide">
              <div className="flex justify-between items-end border-b border-dashed border-gray-200 pb-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Account Number
                  </p>
                  <p className="text-lg font-mono font-bold text-[#002D62]">
                    {selectedLoan.loanAccountNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Date Applied
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    {new Date(selectedLoan.date_applied).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">
                    Principal Amount
                  </span>
                  <span className="text-[#002D62] font-black">
                    ${selectedLoan.amount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">
                    Interest Rate
                  </span>
                  <span className="text-[#002D62] font-black">
                    {selectedLoan.interestRate}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">
                    Loan Duration
                  </span>
                  <span className="text-[#002D62] font-black">
                    {selectedLoan.durationMonths} Months
                  </span>
                </div>
                <div className="flex justify-between text-sm text-red-500">
                  <span className="font-medium">Total Interest</span>
                  <span className="font-black">
                    +$
                    {selectedLoan.totalInterest?.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-orange-600">
                  <span className="font-medium">Processing Fee</span>
                  <span className="font-black">
                    ${selectedLoan.upfrontFee?.toLocaleString()}
                  </span>
                </div>

                <div className="pt-4 mt-4 border-t-2 border-gray-100 flex justify-between items-center">
                  <span className="text-[#002D62] font-black uppercase text-xs">
                    Total Repayable
                  </span>
                  <span className="text-2xl font-black text-[#002D62] tracking-tighter">
                    $
                    {selectedLoan.totalRepayment?.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>

              {/* Monthly Info Box */}
              <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm text-blue-600">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
                    Monthly Commitment
                  </p>
                  <p className="text-lg font-black text-[#002D62]">
                    $
                    {selectedLoan.monthlyPayment?.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              {/* Action Buttons (Hidden on Print) */}
              <div className="grid grid-cols-2 gap-3 pt-2 no-print">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 py-3 border-2 border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:bg-gray-50 transition-all"
                >
                  <Download size={14} /> Save PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 py-3 bg-[#002D62] rounded-xl text-[10px] font-black uppercase text-white hover:shadow-lg transition-all"
                >
                  <Printer size={14} /> Print
                </button>
              </div>

              <p className="text-[9px] text-center text-gray-400 font-medium uppercase tracking-[0.2em] pb-4">
                Verified by LoanHub Finance Systems
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
