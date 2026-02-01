"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "@/lib/redux/hooks";

// Use curly braces for Named Imports
import { Sidebar } from "./components/Sidebar";
import { MobileNav } from "./components/MobileNav";
import { DashboardHeader } from "./components/DashboardHeader";
import { OverviewContent } from "./components/OverviewContent";
import { ChatContent } from "./components/ChatContent";
import { useSearchParams } from "next/dist/client/components/navigation";
// Main Dashboard Component
import { LoansContent } from "./dashItems/LoansContent";
import { CalculatorContent } from "./dashItems/CalculatorContent";
import { NotificationList } from "./dashItems/NotificationList";
import { HistoryContent } from "./dashItems/HistoryContent";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMounted, setIsMounted] = useState(false); // To prevent hydration flickering
  const { user } = useAppSelector((state) => state.auth);
  const searchParams = useSearchParams();

  // 2. Handle the initial load from localStorage properly
  useEffect(() => {
    const savedTab = localStorage.getItem("dashboard_last_tab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
    setIsMounted(true); // Signal that we are now on the client
  }, []);

  // Save tab preference to localStorage whenever it changes
  // 3. Save the tab when it changes (Keep this from before)
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("dashboard_last_tab", activeTab);
    }
  }, [activeTab, isMounted]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    const backupRedirect = localStorage.getItem("after_login_redirect");

    // if (tab) {
    //   setActiveTab(tab);
    if (tab === "chat" || backupRedirect === "chat") {
      setActiveTab("chat");

      // Clean up both
      localStorage.removeItem("after_login_redirect");

      // Clear the URL parameters without reloading the page
      // This prevents the "refresh back to chat" issue
      const newRelativePathQuery = window.location.pathname;
      window.history.replaceState(null, "", newRelativePathQuery);
    }
  }, [searchParams]);

  // Dynamic View Switcher
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewContent setActiveTab={setActiveTab} />;
      case "chat":
        return <ChatContent />;
      case "loans":
        return <LoansContent />;
      case "calculator": // New Case
        return <CalculatorContent setActiveTab={setActiveTab} />;
      case "notifications": // New Case
        return <NotificationList />;
      case "history":
        return <HistoryContent />;
      case "settings":
        return <PlaceholderView title="Account Settings" />;
      default:
        return <OverviewContent setActiveTab={setActiveTab} />;
    }
  };

  if (!isMounted) return null; // Or a loading spinner

  // return (
  //     <main className="min-h-screen bg-[#F8FAFC] flex">
  //         <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

  //         <section className="flex-1 flex flex-col h-screen overflow-hidden">
  //             <DashboardHeader activeTab={activeTab} user={user} />

  //             <div className="flex-1 overflow-y-auto p-6 lg:p-12">
  //                 <AnimatePresence mode="wait">
  //                     <motion.div
  //                         key={activeTab}
  //                         initial={{ opacity: 0, y: 10 }}
  //                         animate={{ opacity: 1, y: 0 }}
  //                         exit={{ opacity: 0, y: -10 }}
  //                         transition={{ duration: 0.2 }}
  //                     >
  //                         {renderContent()}
  //                     </motion.div>
  //                 </AnimatePresence>
  //             </div>
  //         </section>
  //     </main>
  // );
  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Mobile/Tablet Bottom Tabs */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* <section className="flex-1 flex flex-col h-screen overflow-hidden pb-20 lg:pb-0"> */}
      <section className="flex-1 flex flex-col h-screen overflow-hidden pb-32 lg:pb-0">
        <DashboardHeader activeTab={activeTab} user={user} />

        <div className="flex-1 overflow-y-auto p-6 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} /* ... animation props ... */>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}

const PlaceholderView = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <h2 className="text-2xl font-black text-[#002D62] uppercase">{title}</h2>
    <p className="text-gray-500">This section is under construction.</p>
  </div>
);
