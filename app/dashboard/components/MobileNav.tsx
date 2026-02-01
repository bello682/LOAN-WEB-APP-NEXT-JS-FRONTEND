// import { LayoutDashboard, CreditCard, MessageSquare, History, Settings } from "lucide-react";

// export const MobileNav = ({ activeTab, setActiveTab }: any) => {
//     const menuItems = [
//         { id: "overview", label: "Home", icon: LayoutDashboard },
//         { id: "loans", label: "Loans", icon: CreditCard },
//         { id: "chat", label: "Chat", icon: MessageSquare },
//         { id: "history", label: "History", icon: History },
//         { id: "settings", label: "Settings", icon: Settings },
//     ];

//     return (
//         <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#002D62] text-white border-t border-white/10 px-2 py-3 z-50">
//             <div className="flex justify-around items-center">
//                 {menuItems.map((item) => (
//                     <button
//                         key={item.id}
//                         onClick={() => setActiveTab(item.id)}
//                         className={`flex flex-col items-center gap-1 transition-all ${
//                             activeTab === item.id ? "text-[#EBB04D]" : "text-blue-100/50"
//                         }`}
//                     >
//                         <item.icon size={22} />
//                         <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
//                     </button>
//                 ))}
//             </div>
//         </nav>
//     );
// };

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CreditCard,
  MessageSquare,
  History,
  Settings,
  Bell,
  Calculator,
} from "lucide-react";

export const MobileNav = ({ activeTab, setActiveTab }: any) => {
  const menuItems = [
    { id: "overview", label: "Home", icon: LayoutDashboard },
    { id: "loans", label: "Loans", icon: CreditCard },
    { id: "calculator", label: "Loan Estimator", icon: Calculator },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="lg:hidden fixed bottom-6 left-0 right-0 px-6 z-50">
      <nav className="bg-[#002D62]/90 backdrop-blur-lg border border-white/10 shadow-2xl shadow-blue-900/40 rounded-3xl p-2 relative overflow-hidden">
        <div className="flex justify-between items-center relative">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex-1 flex flex-col items-center justify-center py-3 px-1 transition-colors duration-300 z-10 ${
                  isActive
                    ? "text-[#002D62]"
                    : "text-blue-100/50 hover:text-white"
                }`}
              >
                {/* Active Background Pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-x-1 inset-y-1 bg-[#EBB04D] rounded-2xl z-[-1]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                <motion.div
                  animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>

                <span
                  className={`text-[9px] font-black uppercase tracking-tighter mt-1 transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-60"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
