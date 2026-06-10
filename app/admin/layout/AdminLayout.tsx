"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  fetchAdminProfile,
  logoutAdmin,
} from "../../../lib/redux/features/adminSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare as ChatIcon,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: LayoutProps) => {
  const { admin, isLoading } = useAppSelector((state) => state.admin);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // States for toggle
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/admin/", icon: LayoutDashboard },
    { name: "Manage Loans", href: "/admin/loans", icon: FileText },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Chat", href: "/admin/chat/list", icon: ChatIcon },
    {
      name: "Notifications",
      href: "/admin/notification",
      icon: MessageSquare,
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!admin && token) {
      dispatch(fetchAdminProfile());
    }
  }, [admin, dispatch]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // console.log("Admin in Layout:", admin);

  // Shared Sidebar UI
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo Area */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800 h-20 shrink-0">
        {(!isCollapsed || isMobile) && (
          <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
            Loan<span className="text-blue-400">Admin</span>
          </span>
        )}

        {/* Desktop Collapse Toggle */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        )}

        {/* Mobile Close Button */}
        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)} // Auto-close on mobile click
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
              title={isCollapsed && !isMobile ? link.name : ""}
            >
              <Icon
                size={22}
                className={`${isActive ? "text-white" : "group-hover:text-blue-400"}`}
              />
              {(!isCollapsed || isMobile) && (
                <span className="font-medium whitespace-nowrap">
                  {link.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Bottom */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => {
            dispatch(logoutAdmin());
            router.push("/admin/auth/login-admin");
          }}
          className="flex items-center gap-4 w-full p-3 text-rose-400 hover:bg-rose-900/20 rounded-xl transition-colors font-medium group"
        >
          <LogOut size={22} />
          {(!isCollapsed || isMobile) && (
            <span className="whitespace-nowrap">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  if (!admin && isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* 1. Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 2. Sidebar - Desktop */}
      <aside
        className={`bg-slate-900 text-white hidden md:flex flex-col transition-all duration-300 ease-in-out z-30 shrink-0 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* 3. Sidebar - Mobile (Slide-in Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 bg-slate-900 text-white flex md:hidden flex-col transition-transform duration-300 z-50 w-72 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent isMobile={true} />
      </aside>

      {/* 4. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-4 md:px-8 shadow-sm z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="font-bold text-slate-800 text-lg md:text-xl truncate">
              {navLinks.find((l) => l.href === pathname)?.name || "Admin Panel"}
            </h2>
          </div>

          <div className="flex items-center gap-3 md:gap-4 ml-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">
                {mounted ? admin?.name || "Admin" : "Admin"}
              </p>
              <p className="text-[10px] uppercase tracking-tighter text-blue-600 font-bold mt-1">
                {/* 2. Wrap Role */}
                {mounted ? admin?.role || "Administrator" : "Administrator"}
              </p>
            </div>
            {/* Around line 206 in AdminLayout.tsx */}
            <div className="h-10 w-10 md:h-11 md:w-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 border-2 border-white">
              {/* Add the 'mounted' check here */}
              {mounted ? admin?.name?.charAt(0).toUpperCase() || "A" : "A"}
            </div>
          </div>
        </header>

        {/* Page Content Section */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto h-full">{children}</div>
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
