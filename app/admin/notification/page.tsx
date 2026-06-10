// "use client";
// import React, { useState } from "react";
// import { adminAPI } from "@/lib/api";
// import toast from "react-hot-toast";

// export const NotificationForm = () => {
//   // 1. Define the type for your form data
//   type NotificationScope = "individual" | "global";

//   interface NotificationFormData {
//     scope: NotificationScope;
//     recipientId: string;
//     title: string;
//     message: string;
//     category: string;
//   }

//   const [formData, setFormData] = useState<NotificationFormData>({
//     scope: "global",
//     recipientId: "",
//     title: "",
//     message: "",
//     category: "info",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await adminAPI.sendNotification(formData);
//       toast.success("Notification sent successfully!");
//       setFormData({
//         scope: "global",
//         recipientId: "",
//         title: "",
//         message: "",
//         category: "info",
//       });
//     } catch (err) {
//       toast.error("Failed to send notification");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
//     >
//       <h3 className="text-lg font-bold mb-4">Send New Alert</h3>

//       <select
//         value={formData.scope}
//         onChange={(e) =>
//           setFormData({
//             ...formData,
//             scope: e.target.value as NotificationScope,
//           })
//         }
//         className="w-full p-3 border rounded-xl mb-4"
//       >
//         <option value="global">Global Broadcast</option>
//         <option value="individual">Individual User</option>
//       </select>

//       {formData.scope === "individual" && (
//         <input
//           placeholder="User ID"
//           className="w-full p-3 border rounded-xl mb-4"
//           onChange={(e) =>
//             setFormData({ ...formData, recipientId: e.target.value })
//           }
//         />
//       )}

//       <input
//         placeholder="Title"
//         className="w-full p-3 border rounded-xl mb-4"
//         onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//       />

//       <textarea
//         placeholder="Message"
//         className="w-full p-3 border rounded-xl mb-4"
//         onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//       />

//       <button className="bg-[#002D62] text-white w-full py-3 rounded-xl font-bold">
//         Send Notification
//       </button>
//     </form>
//   );
// };

// const NotificationPage = () => {
//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Manage Notifications</h1>
//       {/* Include your form component here */}
//       <NotificationForm />
//     </div>
//   );
// };

// // You must have exactly one default export
// export default NotificationPage;

"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { adminAPI } from "@/lib/api";
import toast from "react-hot-toast";
import {
  Send,
  Globe,
  User,
  ChevronDown,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  Zap,
  Megaphone,
  Hash,
  MessageSquare,
  Loader2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
type NotificationScope = "individual" | "global";

interface NotificationFormData {
  scope: NotificationScope;
  recipientId: string;
  title: string;
  message: string;
  category: string;
}

// ─── Title presets list ──────────────────────────────────────────────
const TITLE_PRESETS = [
  {
    value: "⚠️ Warning",
    label: "Warning",
    icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    value: "✅ Success",
    label: "Success",
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    value: "ℹ️ Info",
    label: "Info",
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    value: "🚨 Urgent Alert",
    label: "Urgent Alert",
    icon: Zap,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    value: "📣 Announcement",
    label: "Announcement",
    icon: Megaphone,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    value: "🔔 Reminder",
    label: "Reminder",
    icon: Bell,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    value: "💬 Message",
    label: "Message",
    icon: MessageSquare,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    value: "custom",
    label: "Custom title...",
    icon: Hash,
    color: "text-gray-400",
    bg: "bg-gray-50",
  },
];

const CATEGORY_OPTIONS = [
  { value: "info", label: "Info", color: "bg-blue-100 text-blue-600" },
  { value: "warning", label: "Warning", color: "bg-amber-100 text-amber-600" },
  { value: "success", label: "Success", color: "bg-green-100 text-green-600" },
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-600" },
];

// ─── Custom Dropdown ─────────────────────────────────────────────────
const TitleDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const selected =
    TITLE_PRESETS.find((p) => p.value === value) || TITLE_PRESETS[7];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#002D62] hover:border-[#EBB04D] focus:outline-none focus:ring-2 focus:ring-[#EBB04D]/30 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className={`p-1.5 rounded-lg ${selected.bg}`}>
            <selected.icon size={14} className={selected.color} />
          </span>
          <span
            className={value === "custom" ? "text-gray-400" : "text-[#002D62]"}
          >
            {value === "custom" ? "Custom title..." : value}
          </span>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden"
          >
            {TITLE_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => {
                  onChange(preset.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors ${
                  value === preset.value
                    ? "bg-[#EBB04D]/10 text-[#002D62]"
                    : "text-gray-600"
                }`}
              >
                <span className={`p-1.5 rounded-lg ${preset.bg}`}>
                  <preset.icon size={14} className={preset.color} />
                </span>
                {preset.label}
                {value === preset.value && (
                  <CheckCircle2 size={14} className="ml-auto text-[#EBB04D]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// NOTIFICATION FORM
// ════════════════════════════════════════════════════════════════════
export const NotificationForm = () => {
  const [formData, setFormData] = useState<NotificationFormData>({
    scope: "global",
    recipientId: "",
    title: "",
    message: "",
    category: "info",
  });
  const [isSending, setIsSending] = useState(false);
  const [titleMode, setTitleMode] = useState<"preset" | "custom">("preset");
  const [presetTitle, setPresetTitle] = useState("custom");

  const handlePresetChange = (val: string) => {
    if (val === "custom") {
      setTitleMode("custom");
      setPresetTitle("custom");
      setFormData({ ...formData, title: "" });
    } else {
      setTitleMode("preset");
      setPresetTitle(val);
      setFormData({ ...formData, title: val });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await adminAPI.sendNotification(formData);
      toast.success("Notification sent successfully!");
      setFormData({
        scope: "global",
        recipientId: "",
        title: "",
        message: "",
        category: "info",
      });
      setPresetTitle("custom");
      setTitleMode("preset");
    } catch (err) {
      toast.error("Failed to send notification");
    } finally {
      setIsSending(false);
    }
  };

  const selectedCategory = CATEGORY_OPTIONS.find(
    (c) => c.value === formData.category,
  );

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* ── Scope Toggle ─────────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
          Recipient Scope
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(["global", "individual"] as NotificationScope[]).map((scope) => (
            <button
              key={scope}
              type="button"
              onClick={() =>
                setFormData({ ...formData, scope, recipientId: "" })
              }
              className={`flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider border-2 transition-all ${
                formData.scope === scope
                  ? "bg-[#002D62] text-white border-[#002D62] shadow-lg shadow-blue-900/20"
                  : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
              }`}
            >
              {scope === "global" ? <Globe size={16} /> : <User size={16} />}
              {scope === "global" ? "Broadcast" : "Individual"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Recipient ID (conditional) ────────────────── */}
      <AnimatePresence>
        {formData.scope === "individual" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden space-y-2"
          >
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
              User ID
            </label>
            <input
              type="text"
              placeholder="Paste user ID here..."
              value={formData.recipientId}
              onChange={(e) =>
                setFormData({ ...formData, recipientId: e.target.value })
              }
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-[#002D62] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EBB04D]/30 focus:border-[#EBB04D] transition-all"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Title Selector ────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
          Title
        </label>
        <TitleDropdown value={presetTitle} onChange={handlePresetChange} />

        <AnimatePresence>
          {titleMode === "custom" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <input
                type="text"
                placeholder="Write a custom title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full mt-2 px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-[#002D62] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EBB04D]/30 focus:border-[#EBB04D] transition-all"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Category Pills ────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setFormData({ ...formData, category: cat.value })}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border-2 ${
                formData.category === cat.value
                  ? `${cat.color} border-current scale-105 shadow-sm`
                  : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Message ──────────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
          Message
        </label>
        <textarea
          rows={4}
          placeholder="Write your notification message here..."
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-[#002D62] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EBB04D]/30 focus:border-[#EBB04D] transition-all resize-none"
        />
        <p className="text-[10px] text-gray-400 text-right font-medium">
          {formData.message.length} characters
        </p>
      </div>

      {/* ── Preview Banner ───────────────────────────── */}
      {(formData.title || formData.message) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-1"
        >
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Preview
          </p>
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-xl ${selectedCategory?.color || "bg-blue-100 text-blue-600"}`}
            >
              <Bell size={14} />
            </div>
            <div>
              <p className="text-sm font-black text-[#002D62]">
                {formData.title || "—"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                {formData.message || "—"}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Submit ───────────────────────────────────── */}
      <motion.button
        type="submit"
        disabled={isSending || !formData.title || !formData.message}
        whileTap={{ scale: 0.97 }}
        className="w-full flex items-center justify-center gap-3 py-4 bg-[#002D62] text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#001f42] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-900/20"
      >
        {isSending ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Send size={16} /> Send Notification
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

// ════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════
const NotificationPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-black text-[#002D62] uppercase tracking-tighter">
            Send <span className="text-[#EBB04D]">Alerts</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium mt-1">
            Broadcast system alerts or send targeted notifications to users.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: "Sent Today", value: "12", color: "text-[#002D62]" },
            { label: "Global Reach", value: "1.4k", color: "text-[#EBB04D]" },
            { label: "Open Rate", value: "94%", color: "text-green-500" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center"
            >
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.14 }}
          className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-[#002D62] rounded-xl">
              <Bell size={16} className="text-[#EBB04D]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#002D62] uppercase tracking-widest">
                New Alert
              </h3>
              <p className="text-[10px] text-gray-400 font-medium">
                Fill in the details below to dispatch
              </p>
            </div>
          </div>

          <NotificationForm />
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationPage;
