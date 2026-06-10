"use client";

import React, { useEffect, useState } from "react";
import { Bell, ChevronRight, User } from "lucide-react";

interface UserInfo {
  fullName: string;
  // verified: boolean;
  status: string;
  // add other fields if you have them, like email: string;
}
export const DashboardHeader = ({ activeTab, user }: any) => {
  const [authUser, setAuthUser] = useState<UserInfo | null>(null);
  useEffect(() => {
    // 2. Safe check for browser environment
    const data = localStorage.getItem("user_info");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setAuthUser(parsedData);
      } catch (error) {
        console.error("Error parsing user_info from localStorage", error);
      }
    }
  }, []);

  console.log("Authenticated User:", authUser);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between transition-all">
      {/* Left Side: Breadcrumbs (Hidden on very small screens) */}
      <div className="flex items-center">
        <div className="hidden sm:flex items-center text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
          <span className="hover:text-[#002D62] cursor-pointer transition-colors">
            Portal
          </span>
          <ChevronRight size={14} className="mx-1 md:mx-2 opacity-50" />
          <span className="text-[#002D62] truncate max-w-[100px] md:max-w-none">
            {activeTab}
          </span>
        </div>

        {/* Mobile Identity (Visible only on small screens) */}
        <div className="sm:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-[#EBB04D] rounded-lg shrink-0" />
          <span className="font-black text-[#002D62] text-sm tracking-tighter uppercase">
            LOAN<span className="text-[#EBB04D]">EX</span>
          </span>
        </div>
      </div>

      {/* Right Side: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-400 hover:text-[#002D62] hover:bg-gray-50 rounded-xl transition-all group">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full group-hover:scale-110 transition-transform"></span>
        </button>

        {/* Profile Section */}
        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-gray-100 ml-1 md:ml-0">
          <div className="hidden md:block text-right">
            <p className="text-xs font-black text-[#002D62] leading-tight uppercase tracking-tight">
              {authUser?.fullName || "Guest User"}
            </p>
            <p className="text-[9px] text-[#EBB04D] font-black tracking-widest">
              {/* VERIFIED CLIENT */}
              {authUser?.status}
            </p>
          </div>

          {/* Avatar with Initials */}
          <button className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-[#002D62] text-white flex items-center justify-center font-bold border-2 border-white shadow-lg shadow-blue-900/10 hover:scale-105 active:scale-95 transition-all">
            {authUser?.fullName ? (
              <span className="text-xs md:text-sm">
                {authUser.fullName.charAt(0)}
              </span>
            ) : (
              <User size={18} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
