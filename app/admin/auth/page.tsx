"use client";
import React from "react";
import { motion } from "framer-motion";
import LoginAdmin from "./login-admin/page"; // Import your specific component

// Named export for the layout so other screens can use it
export const AuthLayout = ({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
}) => (
  <div className="min-h-screen flex bg-white">
    {/* Left Side: Branding */}
    <div className="hidden lg:flex lg:w-1/2 bg-[#002D62] p-12 flex-col justify-between relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <div className="w-5 h-5 bg-[#EBB04D] rounded-sm rotate-45" />
          </div>
          <span className="text-2xl font-black text-white italic">
            Loan<span className="text-[#EBB04D]">Admin</span>
          </span>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white leading-tight"
        >
          Secure Infrastructure <br /> for Professional <br />{" "}
          <span className="text-[#EBB04D]">Lending Operations.</span>
        </motion.h1>
      </div>
      <div className="relative z-10 border-t border-white/10 pt-8">
        <p className="text-blue-100/60 text-sm">
          Enterprise Grade Security • Multi-factor Auth
        </p>
      </div>
    </div>

    {/* Right Side: Render the Child (Login, Register, etc.) */}
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="text-gray-500 mt-2 font-medium">{subtitle}</p>
        </div>
        {children}
      </motion.div>
    </div>
  </div>
);

// Default export renders the LoginAdmin by default
export default function AdminAuthEntry() {
  return <LoginAdmin />;
}
