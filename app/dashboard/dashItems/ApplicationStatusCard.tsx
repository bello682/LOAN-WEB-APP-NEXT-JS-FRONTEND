"use client";
import React, { useEffect, useState } from "react";
import { loanAPI } from "@/lib/api";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

export const ApplicationStatusCard = ({ loanId }: { loanId: string }) => {
  const [statusDetails, setStatusDetails] = useState<any>(null);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await loanAPI.getApplicationStatus(loanId);
        setStatusDetails(res.data);
      } catch (err) {
        console.error("Could not fetch status details");
      }
    };
    if (loanId) getDetails();
  }, [loanId]);

  if (!statusDetails) return null;

  return (
    <div className="bg-gradient-to-r from-[#002D62] to-[#003a7d] p-6 rounded-3xl text-white shadow-xl mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="text-[#EBB04D]" size={20} />
        <h3 className="text-xs font-black uppercase tracking-widest">
          Application Tracking
        </h3>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-2xl font-black mb-1">
            {statusDetails.stepName || "Under Review"}
          </p>
          <p className="text-blue-200 text-xs">
            Updated on {new Date(statusDetails.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-[#EBB04D] mb-1">
            Probability
          </p>
          <p className="text-xl font-black">High</p>
        </div>
      </div>
      {/* Visual Progress Bar */}
      <div className="mt-6 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-[#EBB04D]" style={{ width: "65%" }} />
      </div>
    </div>
  );
};
