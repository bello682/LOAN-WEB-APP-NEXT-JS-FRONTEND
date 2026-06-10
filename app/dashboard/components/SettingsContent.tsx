"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Bell,
  Shield,
  CreditCard,
  ChevronRight,
  Camera,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  Smartphone,
  Mail,
  Globe,
  Moon,
  Sun,
  LogOut,
  Trash2,
  Download,
  ToggleLeft,
  ToggleRight,
  Save,
} from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";

// ─── Section Tab Types ──────────────────────────────────────────────
type SettingsTab =
  | "profile"
  | "security"
  | "notifications"
  | "privacy"
  | "billing";

// ─── Toggle Switch ───────────────────────────────────────────────────
const Toggle = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
      enabled ? "bg-[#EBB04D]" : "bg-gray-200"
    }`}
  >
    <span
      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
        enabled ? "left-6" : "left-0.5"
      }`}
    />
  </button>
);

// ─── Section Header ──────────────────────────────────────────────────
const SectionTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="mb-8">
    <h2 className="text-2xl font-black text-[#002D62] uppercase tracking-tighter">
      {title.split(" ")[0]}{" "}
      <span className="text-[#EBB04D]">
        {title.split(" ").slice(1).join(" ")}
      </span>
    </h2>
    <p className="text-gray-400 text-sm font-medium mt-1">{subtitle}</p>
  </div>
);

// ─── Input Field ─────────────────────────────────────────────────────
const SettingsInput = ({
  label,
  value,
  type = "text",
  placeholder,
  onChange,
  disabled,
  suffix,
}: {
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  suffix?: React.ReactNode;
}) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#EBB04D]/30 focus:border-[#EBB04D] ${
          disabled
            ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
            : "bg-white text-[#002D62] border-gray-200 hover:border-gray-300"
        } ${suffix ? "pr-12" : ""}`}
      />
      {suffix && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {suffix}
        </div>
      )}
    </div>
  </div>
);

// ─── Save Button ─────────────────────────────────────────────────────
const SaveButton = ({
  onClick,
  saved,
}: {
  onClick: () => void;
  saved: boolean;
}) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.97 }}
    className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg ${
      saved
        ? "bg-green-500 text-white shadow-green-200"
        : "bg-[#002D62] text-white hover:bg-[#001f42] shadow-blue-900/20"
    }`}
  >
    {saved ? (
      <>
        <Check size={16} /> Saved
      </>
    ) : (
      <>
        <Save size={16} /> Save Changes
      </>
    )}
  </motion.button>
);

// ════════════════════════════════════════════════════════════════════
// PROFILE SECTION
// ════════════════════════════════════════════════════════════════════
const ProfileSection = ({ user }: { user: any }) => {
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Profile Information"
        subtitle="Manage your personal details and public-facing information."
      />

      {/* Avatar Block */}
      <div className="flex items-center gap-6 p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="relative group">
          <div className="w-20 h-20 rounded-2xl bg-[#002D62] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-900/20">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#EBB04D] rounded-xl flex items-center justify-center shadow-md hover:scale-110 transition-transform">
            <Camera size={14} className="text-[#002D62]" />
          </button>
        </div>
        <div>
          <p className="font-black text-[#002D62] text-lg uppercase tracking-tight">
            {user?.fullName || "Guest User"}
          </p>
          <p className="text-[10px] text-[#EBB04D] font-black tracking-widest uppercase">
            Verification Status:
          </p>
          <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
        </div>
        <div className="ml-auto">
          <span className="flex items-center gap-1.5 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            KYC {user?.verified ? "Verified" : "Unverified"}
          </span>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingsInput
            label="Full Name"
            value={fullName}
            onChange={setFullName}
            placeholder="Your full legal name"
          />
          <SettingsInput
            label="Email Address"
            value={email}
            disabled
            suffix={
              <span className="text-[9px] font-black text-[#EBB04D] uppercase bg-amber-50 px-2 py-0.5 rounded-md">
                Locked
              </span>
            }
          />
          <SettingsInput
            label="User Status"
            value={user?.status}
            disabled
            suffix={
              <span className="text-[9px] font-black text-[#EBB04D] uppercase bg-amber-50 px-2 py-0.5 rounded-md">
                Locked
              </span>
            }
          />

          <SettingsInput
            label="User ID"
            value={user?._id || "N/A"}
            disabled
            suffix={
              <span className="text-[9px] font-black text-[#EBB04D] uppercase bg-amber-50 px-2 py-0.5 rounded-md">
                Locked
              </span>
            }
          />
          <SettingsInput
            label="Registered User ID"
            value={user?.isVerified ? "Registered" : "Not Registered"}
            disabled
            suffix={
              <span className="text-[9px] font-black text-[#EBB04D] uppercase bg-amber-50 px-2 py-0.5 rounded-md">
                Locked
              </span>
            }
          />
          <SettingsInput
            label="Facial Verification"
            value={user?.facialVerification}
            disabled
            suffix={
              <span className="text-[9px] font-black text-[#EBB04D] uppercase bg-amber-50 px-2 py-0.5 rounded-md">
                Locked
              </span>
            }
          />
          <SettingsInput
            label="Phone Number"
            value={phone}
            onChange={setPhone}
            placeholder="+1 (555) 000-0000"
          />

          <SettingsInput
            label="Home Address"
            value={address}
            onChange={setAddress}
            placeholder="123 Main St, City, State"
          />
        </div>

        <div className="flex justify-end pt-2">
          <SaveButton onClick={handleSave} saved={saved} />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/50 rounded-[2rem] p-8 border border-red-100 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={16} className="text-red-400" />
          <p className="text-xs font-black text-red-400 uppercase tracking-widest">
            Danger Zone
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-red-100 rounded-xl text-xs font-black uppercase text-red-400 hover:bg-red-50 transition-all">
            <Download size={14} /> Export My Data
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-red-200 rounded-xl text-xs font-black uppercase text-red-500 hover:bg-red-100 transition-all">
            <Trash2 size={14} /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// SECURITY SECTION
// ════════════════════════════════════════════════════════════════════
const SecuritySection = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [twoFA, setTwoFA] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [saved, setSaved] = useState(false);

  const strength =
    newPw.length === 0 ? 0 : newPw.length < 6 ? 1 : newPw.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Moderate", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-[#EBB04D]", "bg-green-500"][
    strength
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Security Settings"
        subtitle="Keep your account safe with a strong password and two-factor authentication."
      />

      {/* Password Change */}
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
        <p className="text-xs font-black text-[#002D62] uppercase tracking-widest flex items-center gap-2">
          <Lock size={14} className="text-[#EBB04D]" /> Change Password
        </p>

        <SettingsInput
          label="Current Password"
          value={currentPw}
          type={showCurrent ? "text" : "password"}
          onChange={setCurrentPw}
          placeholder="••••••••••"
          suffix={
            <button
              onClick={() => setShowCurrent(!showCurrent)}
              className="text-gray-400 hover:text-[#002D62]"
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <SettingsInput
          label="New Password"
          value={newPw}
          type={showNew ? "text" : "password"}
          onChange={setNewPw}
          placeholder="••••••••••"
          suffix={
            <button
              onClick={() => setShowNew(!showNew)}
              className="text-gray-400 hover:text-[#002D62]"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        {/* Password Strength */}
        {newPw.length > 0 && (
          <div className="space-y-2">
            <div className="flex gap-1.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= strength ? strengthColor : "bg-gray-100"
                  }`}
                />
              ))}
            </div>
            <p
              className={`text-[10px] font-black uppercase tracking-widest ${
                strength === 1
                  ? "text-red-400"
                  : strength === 2
                    ? "text-amber-500"
                    : "text-green-500"
              }`}
            >
              {strengthLabel}
            </p>
          </div>
        )}

        <SettingsInput
          label="Confirm New Password"
          value={confirmPw}
          type="password"
          onChange={setConfirmPw}
          placeholder="••••••••••"
          suffix={
            confirmPw.length > 0 ? (
              confirmPw === newPw ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <AlertTriangle size={16} className="text-red-400" />
              )
            ) : null
          }
        />

        <div className="flex justify-end">
          <SaveButton onClick={handleSave} saved={saved} />
        </div>
      </div>

      {/* 2FA & Extra */}
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
        <p className="text-xs font-black text-[#002D62] uppercase tracking-widest flex items-center gap-2">
          <Shield size={14} className="text-[#EBB04D]" /> Authentication
        </p>

        {[
          {
            icon: Smartphone,
            label: "Two-Factor Authentication",
            sub: "Receive a one-time code via SMS on every login",
            state: twoFA,
            set: setTwoFA,
          },
          {
            icon: Shield,
            label: "Biometric Login",
            sub: "Use fingerprint or face ID to log in on supported devices",
            state: biometric,
            set: setBiometric,
          },
        ].map(({ icon: Icon, label, sub, state, set }) => (
          <div
            key={label}
            className="flex items-center justify-between p-5 bg-gray-50/60 rounded-2xl border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm text-[#002D62]">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-black text-[#002D62]">{label}</p>
                <p className="text-[10px] text-gray-400 font-medium">{sub}</p>
              </div>
            </div>
            <Toggle enabled={state} onChange={() => set(!state)} />
          </div>
        ))}
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-4">
        <p className="text-xs font-black text-[#002D62] uppercase tracking-widest flex items-center gap-2 mb-4">
          <Globe size={14} className="text-[#EBB04D]" /> Active Sessions
        </p>
        {[
          {
            device: "Chrome · MacOS",
            location: "Lagos, NG",
            time: "Current session",
            active: true,
          },
          {
            device: "Safari · iPhone 14",
            location: "Lagos, NG",
            time: "2 days ago",
            active: false,
          },
        ].map((session, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  session.active ? "bg-green-500 animate-pulse" : "bg-gray-300"
                }`}
              />
              <div>
                <p className="text-sm font-bold text-[#002D62]">
                  {session.device}
                </p>
                <p className="text-[10px] text-gray-400 font-medium">
                  {session.location} · {session.time}
                </p>
              </div>
            </div>
            {!session.active && (
              <button className="text-[10px] font-black text-red-400 uppercase hover:text-red-600 transition-colors">
                Revoke
              </button>
            )}
            {session.active && (
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">
                You
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// NOTIFICATIONS SECTION
// ════════════════════════════════════════════════════════════════════
const NotificationsSection = () => {
  const [prefs, setPrefs] = useState({
    loanUpdates: true,
    paymentReminders: true,
    marketing: false,
    securityAlerts: true,
    adminMessages: true,
    smsAlerts: false,
    emailDigest: true,
    pushNotifs: true,
  });

  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const groups = [
    {
      title: "Loan Alerts",
      icon: CreditCard,
      items: [
        {
          key: "loanUpdates" as const,
          label: "Loan Status Updates",
          sub: "Be notified when your loan status changes",
        },
        {
          key: "paymentReminders" as const,
          label: "Payment Reminders",
          sub: "Get reminded 3 days before a payment is due",
        },
        {
          key: "adminMessages" as const,
          label: "Admin Messages",
          sub: "Receive messages from your loan officer",
        },
      ],
    },
    {
      title: "Delivery Channels",
      icon: Mail,
      items: [
        {
          key: "emailDigest" as const,
          label: "Email Digest",
          sub: "Weekly summary of your account activity",
        },
        {
          key: "smsAlerts" as const,
          label: "SMS Alerts",
          sub: "Receive critical alerts via text message",
        },
        {
          key: "pushNotifs" as const,
          label: "Push Notifications",
          sub: "In-app alerts for real-time updates",
        },
      ],
    },
    {
      title: "Other",
      icon: Bell,
      items: [
        {
          key: "securityAlerts" as const,
          label: "Security Alerts",
          sub: "Get notified of unusual login activity",
        },
        {
          key: "marketing" as const,
          label: "Promotions & Offers",
          sub: "Receive special offers and product news",
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Notification Preferences"
        subtitle="Control exactly what updates and alerts you receive."
      />

      {groups.map(({ title, icon: Icon, items }) => (
        <div
          key={title}
          className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-4"
        >
          <p className="text-xs font-black text-[#002D62] uppercase tracking-widest flex items-center gap-2 mb-6">
            <Icon size={14} className="text-[#EBB04D]" /> {title}
          </p>
          {items.map(({ key, label, sub }) => (
            <div
              key={key}
              className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="text-sm font-bold text-[#002D62]">{label}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                  {sub}
                </p>
              </div>
              <Toggle enabled={prefs[key]} onChange={() => toggle(key)} />
            </div>
          ))}
        </div>
      ))}

      <div className="flex justify-end">
        <SaveButton
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
          }}
          saved={saved}
        />
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// PRIVACY SECTION
// ════════════════════════════════════════════════════════════════════
const PrivacySection = () => {
  const [dataSharing, setDataSharing] = useState(false);
  const [activityLog, setActivityLog] = useState(true);
  const [thirdParty, setThirdParty] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Privacy & Appearance"
        subtitle="Control how your data is used and personalise your experience."
      />

      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-4">
        <p className="text-xs font-black text-[#002D62] uppercase tracking-widest flex items-center gap-2 mb-6">
          <Shield size={14} className="text-[#EBB04D]" /> Data & Privacy
        </p>
        {[
          {
            label: "Activity Logging",
            sub: "Store logs of your login and account activity",
            state: activityLog,
            set: setActivityLog,
          },
          {
            label: "Data Sharing with Partners",
            sub: "Allow anonymized data sharing for loan rate improvement",
            state: dataSharing,
            set: setDataSharing,
          },
          {
            label: "Third-Party Integrations",
            sub: "Let approved third-party services access your profile",
            state: thirdParty,
            set: setThirdParty,
          },
        ].map(({ label, sub, state, set }) => (
          <div
            key={label}
            className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0"
          >
            <div>
              <p className="text-sm font-bold text-[#002D62]">{label}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                {sub}
              </p>
            </div>
            <Toggle enabled={state} onChange={() => set(!state)} />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
        <p className="text-xs font-black text-[#002D62] uppercase tracking-widest flex items-center gap-2 mb-6">
          {darkMode ? (
            <Moon size={14} className="text-[#EBB04D]" />
          ) : (
            <Sun size={14} className="text-[#EBB04D]" />
          )}{" "}
          Appearance
        </p>
        <div className="flex items-center justify-between p-5 bg-gray-50/60 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-[#002D62]" />
              <div className="w-8 h-8 rounded-lg bg-[#EBB04D]" />
            </div>
            <div>
              <p className="text-sm font-black text-[#002D62]">Dark Mode</p>
              <p className="text-[10px] text-gray-400">
                Switch to a darker interface theme
              </p>
            </div>
          </div>
          <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-3">
        <p className="text-xs font-black text-[#002D62] uppercase tracking-widest flex items-center gap-2 mb-4">
          <Download size={14} className="text-[#EBB04D]" /> Your Data
        </p>
        <p className="text-sm text-gray-500">
          You can request a full export of your account data including loan
          history, transactions, and personal information.
        </p>
        <button className="flex items-center gap-2 mt-4 px-6 py-3 bg-[#002D62] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#001f42] transition-all shadow-lg shadow-blue-900/20">
          <Download size={14} /> Request Data Export
        </button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// BILLING SECTION
// ════════════════════════════════════════════════════════════════════
const BillingSection = () => {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="Billing & Repayment"
        subtitle="Manage your repayment methods and payment schedule."
      />

      {/* Active Payment Method */}
      <div className="bg-[#002D62] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl border-b-4 border-[#EBB04D]">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 mb-4">
          Primary Payment Method
        </p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-black tracking-[0.3em]">
              •••• •••• •••• 4291
            </p>
            <p className="text-blue-200 text-xs mt-2">Expires 09 / 27</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-[#EBB04D] uppercase">
              Visa Debit
            </p>
            <p className="text-sm font-bold mt-1">Auto-Debit ON</p>
          </div>
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -right-2 -bottom-2 w-20 h-20 rounded-full bg-white/5" />
      </div>

      {/* Payment Schedule */}
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-4">
        <p className="text-xs font-black text-[#002D62] uppercase tracking-widest flex items-center gap-2 mb-4">
          <CreditCard size={14} className="text-[#EBB04D]" /> Upcoming Payments
        </p>
        {[
          { date: "Jul 15, 2026", amount: "$1,240.00", status: "scheduled" },
          { date: "Aug 15, 2026", amount: "$1,240.00", status: "scheduled" },
          { date: "Jun 15, 2026", amount: "$1,240.00", status: "paid" },
        ].map((pay, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0"
          >
            <div>
              <p className="text-sm font-bold text-[#002D62]">{pay.date}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-wider">
                Monthly Repayment
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm font-black text-[#002D62]">{pay.amount}</p>
              <span
                className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${
                  pay.status === "paid"
                    ? "bg-green-100 text-green-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {pay.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm text-left hover:shadow-md transition-shadow group">
          <CreditCard
            size={20}
            className="text-[#EBB04D] mb-3 group-hover:scale-110 transition-transform"
          />
          <p className="text-sm font-black text-[#002D62] uppercase">
            Add New Card
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            Link a debit or credit card
          </p>
        </button>
        <button className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm text-left hover:shadow-md transition-shadow group">
          <Download
            size={20}
            className="text-[#002D62] mb-3 group-hover:scale-110 transition-transform"
          />
          <p className="text-sm font-black text-[#002D62] uppercase">
            Download Invoice
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            Get your latest billing statement
          </p>
        </button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// MAIN SETTINGS COMPONENT
// ════════════════════════════════════════════════════════════════════
export const SettingsContent = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const router = useRouter(); // Initialize the router

  const tabs: {
    id: SettingsTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock, badge: "2FA On" },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const renderSection = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection user={user} />;
      case "security":
        return <SecuritySection />;
      case "notifications":
        return <NotificationsSection />;
      case "privacy":
        return <PrivacySection />;
      case "billing":
        return <BillingSection />;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-[#002D62] uppercase tracking-tighter">
          Account <span className="text-[#EBB04D]">Settings</span>
        </h1>
        <p className="text-gray-500 text-sm font-medium">
          Manage your profile, security, and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Left Nav ─────────────────────────────────── */}
        <aside className="lg:w-64 shrink-0">
          <nav className="bg-white rounded-[2rem] p-3 border border-gray-100 shadow-sm space-y-1 sticky top-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-[#EBB04D] text-[#002D62]"
                    : "text-gray-400 hover:bg-gray-50 hover:text-[#002D62]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon size={18} />
                  {tab.label}
                </div>
                <div className="flex items-center gap-2">
                  {tab.badge && activeTab === tab.id && (
                    <span className="text-[8px] font-black bg-[#002D62] text-white px-2 py-0.5 rounded-full uppercase">
                      {tab.badge}
                    </span>
                  )}
                  <ChevronRight
                    size={14}
                    className={`transition-opacity ${
                      activeTab === tab.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              </button>
            ))}

            {/* Logout at bottom of nav */}
            <div className="pt-3 mt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user_info");
                  localStorage.removeItem("dashboard_last_tab");
                  localStorage.removeItem("user_session");
                  localStorage.removeItem("user_loan_id");
                  router.push("/login");
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </nav>
        </aside>

        {/* ── Right Content ─────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
