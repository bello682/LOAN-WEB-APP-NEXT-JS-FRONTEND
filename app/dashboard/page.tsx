"use client";

import { Suspense } from "react";
import Dashboard from "./dashboardPage"; // Assuming you move your Dashboard component here

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <Dashboard />
    </Suspense>
  );
}
