"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchMyLoans } from "@/lib/redux/features/loanSlice";
import { Loader2, FileText, Clock, CheckCircle, XCircle } from "lucide-react";

export const LoansList = () => {
  const dispatch = useAppDispatch();
  const { loans, isLoading, error } = useAppSelector((state) => state.loans);

  useEffect(() => {
    dispatch(fetchMyLoans());
  }, [dispatch]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  if (loans.length === 0)
    return (
      <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
        <p className="text-gray-500">You haven't applied for any loans yet.</p>
      </div>
    );

  return (
    <div className="space-y-4">
      {loans.map((loan) => (
        <div
          key={loan._id}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <FileText size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{loan.loanType}</h4>
              <p className="text-sm text-gray-500">
                Applied on {new Date(loan.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:flex md:items-center gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                Amount
              </p>
              <p className="font-bold text-gray-900">
                ${loan.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                Status
              </p>
              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full border ${getStatusStyle(loan.status)}`}
              >
                {loan.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
