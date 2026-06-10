import {
  LayoutDashboard,
  CreditCard,
  MessageSquare,
  History,
  Settings,
  LogOut,
  Calculator,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Sidebar = ({ activeTab, setActiveTab }: any) => {
  const router = useRouter(); // Initialize the router
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "loans", label: "My Loans", icon: CreditCard },
    { id: "calculator", label: "Loan Estimator", icon: Calculator },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "chat", label: "Chat with Support", icon: MessageSquare },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-[#002D62] p-8 text-white sticky h-screen top-0 border-r border-white/5">
      <div className="mb-12">
        <Link
          href="/"
          className="text-2xl font-black tracking-tighter flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-[#EBB04D] rounded-lg" />
          LOAN<span className="text-[#EBB04D]">EX</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === item.id
                ? "bg-[#EBB04D] text-[#002D62]"
                : "text-blue-100/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="pt-8 border-t border-white/10">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user_info");
            localStorage.removeItem("dashboard_last_tab");
            localStorage.removeItem("user_session");
            localStorage.removeItem("user_loan_id");
            router.push("/login");
          }}
          className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-400 hover:text-red-300 w-full"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};
