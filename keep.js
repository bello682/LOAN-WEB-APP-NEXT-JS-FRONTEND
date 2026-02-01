// i see you you do not follow no,

// here is that dashboard i was using now just add all you need to add without changing my ui or removing anything please and provide complete code please  and i also noticed the gbost button and toggles and other things are for the super admin are on the normal admin if you put them there for hem to see so what is the assurance that they will not press the button and will see all what the superadmin sees and doing backdoor, i thouhnt that there is will be an api or a seperate page where whoever want to be the superadmin will register or login with just their email and when they do they can now use the same popup as the  normal admin does and that way the system will know who is normal admin and super admin and will now show does toggles and all you added to the dashborad of only the supper admin?

// "use client";

// import { useState, useEffect, useRef } from "react";

// import { motion, AnimatePresence } from "framer-motion";

// import {

//     Users,

//     Search,

//     Clock,

//     ChevronRight,

//     TrendingUp,

//     BellRing,

//     MessageCircle,

// } from "lucide-react";

// import { Navigation } from "@/app/components";

// import Link from "next/link";

// export default function AdminDashboard() {

//     const [applications, setApplications] = useState<any[]>([]);

//     const [loading, setLoading] = useState(true);

//     const [searchTerm, setSearchTerm] = useState("");

//     // Notification state includes sender details

//     const [showNotification, setShowNotification] = useState<{

//         show: boolean;

//         name: string;

//         email: string;

//     }>({

//         show: false,

//         name: "",

//         email: "",

//     });

//     // Track which apps have unread activity

//     const [unreadAppIds, setUnreadAppIds] = useState<string[]>([]);

//     const prevAppsCount = useRef<number>(0);

//     const lastUpdateRef = useRef<number>(0);

//     const tabIntervalRef = useRef<NodeJS.Timeout | null>(null);

//     // 1. Browser Tab Flashing Logic

//     const startTabFlash = (name: string) => {

//         if (tabIntervalRef.current) return;

//         let isOriginal = false;

//         tabIntervalRef.current = setInterval(() => {

//             document.title = isOriginal

//                 ? "Admin Dashboard"

//                 : `🔔 ${name.toUpperCase()}!`;

//             isOriginal = !isOriginal;

//         }, 1000);

//         const stopFlash = () => {

//             if (tabIntervalRef.current) {

//                 clearInterval(tabIntervalRef.current);

//                 tabIntervalRef.current = null;

//                 document.title = "Admin Dashboard";

//                 window.removeEventListener("mousedown", stopFlash);

//             }

//         };

//         window.addEventListener("mousedown", stopFlash);

//     };

//     // 2. Notification Trigger Logic

//     const handleNewNotification = (app?: any) => {

//         const name = app?.userName || "New User";

//         const email = app?.userEmail || "New Activity";

//         setShowNotification({ show: true, name, email });

//         startTabFlash(name);

//         // Add to unread list

//         if (app?._id) {

//             setUnreadAppIds((prev) => [...new Set([...prev, app._id])]);

//         }

//         // Sound effect

//         const audio = new Audio(

//             "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",

//         );

//         audio.play().catch(() => console.log("Audio blocked until interaction"));

//         // Auto-hide popup after 6 seconds

//         setTimeout(

//             () => setShowNotification({ show: false, name: "", email: "" }),

//             6000,

//         );

//     };

//     const fetchApplications = async () => {

//         const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//         if (!apiUrl) return;

//         try {

//             const response = await fetch(`${apiUrl}/api/chat/applications`, {

//                 method: "GET",

//                 headers: { "Content-Type": "application/json" },

//                 cache: "no-store",

//             });

//             if (!response.ok) throw new Error(`Server Error: ${response.status}`);

//             const data = await response.json();

//             if (Array.isArray(data) && data.length > 0) {

//                 // Find the most recently updated application

//                 const latestApp = data.reduce((prev: any, current: any) => {

//                     const currTime = new Date(

//                         current.updatedAt || current.createdAt,

//                     ).getTime();

//                     const prevTime = new Date(prev.updatedAt || prev.createdAt).getTime();

//                     return currTime > prevTime ? current : prev;

//                 }, data[0]);

//                 const latestTime = new Date(

//                     latestApp.updatedAt || latestApp.createdAt,

//                 ).getTime();

//                 // Trigger if count increased OR a message was sent (timestamp changed)

//                 const hasNewLoan =

//                     prevAppsCount.current > 0 && data.length > prevAppsCount.current;

//                 const hasNewMessage =

//                     lastUpdateRef.current > 0 && latestTime > lastUpdateRef.current;

//                 if (hasNewLoan || hasNewMessage) {

//                     handleNewNotification(latestApp);

//                 }

//                 prevAppsCount.current = data.length;

//                 lastUpdateRef.current = latestTime;

//             }

//             setApplications(Array.isArray(data) ? data : []);

//         } catch (error) {

//             console.error("Fetch error:", error);

//         } finally {

//             setLoading(false);

//         }

//     };

//     useEffect(() => {

//         fetchApplications();

//         const interval = setInterval(fetchApplications, 5000); // Poll every 5 seconds

//         return () => {

//             clearInterval(interval);

//             if (tabIntervalRef.current) clearInterval(tabIntervalRef.current);

//         };

//     }, []);

//     const markAsRead = (id: string) => {

//         setUnreadAppIds((prev) => prev.filter((appId) => appId !== id));

//     };

//     const filteredApps = applications.filter(

//         (app) =>

//             app.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||

//             app.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()),

//     );

//     const totalVolume = applications.reduce(

//         (sum, app) => sum + (app.amount || 0),

//         0,

//     );

//     return (

//         <main className='bg-[#F1F5F9] min-h-screen font-sans'>

//             <Navigation />

//             {/* Floating Notification Popup */}

//             <AnimatePresence>

//                 {showNotification.show && (

//                     <motion.div

//                         initial={{ opacity: 0, y: -50, x: 100 }}

//                         animate={{ opacity: 1, y: 0, x: 0 }}

//                         exit={{ opacity: 0, x: 100 }}

//                         className='fixed top-24 right-6 z-[999] bg-[#002D62] text-white p-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-blue-400 min-w-[320px]'>

//                         <div className='bg-blue-500 p-3 rounded-xl animate-pulse'>

//                             <MessageCircle size={24} />

//                         </div>

//                         <div className='flex-1'>

//                             <p className='font-bold text-lg leading-tight'>

//                                 {showNotification.name}

//                             </p>

//                             <p className='text-xs opacity-80 mb-1'>

//                                 {showNotification.email}

//                             </p>

//                             <div className='bg-blue-400/30 text-[10px] font-bold px-2 py-0.5 rounded inline-block uppercase tracking-wider'>

//                                 New Activity Detected

//                             </div>

//                         </div>

//                         <button

//                             onClick={() =>

//                                 setShowNotification({ show: false, name: "", email: "" })

//                             }

//                             className='ml-2 text-slate-400 hover:text-white transition-colors'>

//                             ✕

//                         </button>

//                     </motion.div>

//                 )}

//             </AnimatePresence>

//             <div className='pt-28 pb-12 px-4 max-w-7xl mx-auto'>

//                 <div className='flex justify-between items-center mb-8'>

//                     <div>

//                         <h1 className='text-3xl font-black text-[#002D62]'>

//                             Admin Control

//                         </h1>

//                         <p className='text-slate-500'>

//                             Real-time tracking of {applications.length} applications

//                         </p>

//                     </div>

//                     <button

//                         onClick={() =>

//                             handleNewNotification({

//                                 userName: "Test User",

//                                 userEmail: "test@demo.com",

//                                 _id: "test",

//                             })

//                         }

//                         className='bg-white text-[10px] font-bold py-2 px-4 rounded-full border border-slate-200 shadow-sm hover:bg-slate-50'>

//                         SIMULATE NOTIFICATION

//                     </button>

//                 </div>

//                 {/* Stats Section */}

//                 <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>

//                     <StatCard

//                         label='Total Clients'

//                         value={applications.length.toString()}

//                         icon={Users}

//                         color='text-blue-600'

//                         bg='bg-blue-50'

//                     />

//                     <StatCard

//                         label='Loan Volume'

//                         value={`$${totalVolume.toLocaleString()}`}

//                         icon={TrendingUp}

//                         color='text-emerald-600'

//                         bg='bg-emerald-50'

//                     />

//                     <StatCard

//                         label='Action Required'

//                         value={unreadAppIds.length.toString()}

//                         icon={BellRing}

//                         color='text-red-600'

//                         bg='bg-red-50'

//                     />

//                 </div>

//                 <div className='bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden'>

//                     <div className='p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4'>

//                         <h2 className='text-xl font-black text-[#002D62] uppercase tracking-tight'>

//                             Live Activity Queue

//                         </h2>

//                         <div className='relative'>

//                             <Search

//                                 className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'

//                                 size={18}

//                             />

//                             <input

//                                 type='text'

//                                 placeholder='Search name or email...'

//                                 value={searchTerm}

//                                 onChange={(e) => setSearchTerm(e.target.value)}

//                                 className='pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-600 w-64 text-black'

//                             />

//                         </div>

//                     </div>

//                     <div className='overflow-x-auto'>

//                         <table className='w-full text-left'>

//                             <thead>

//                                 <tr className='bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest'>

//                                     <th className='px-8 py-4'>Client Information</th>

//                                     <th className='px-8 py-4'>Loan Snapshot</th>

//                                     <th className='px-8 py-4'>Status</th>

//                                     <th className='px-8 py-4 text-right'>Action</th>

//                                 </tr>

//                             </thead>

//                             <tbody className='divide-y divide-slate-50'>

//                                 {filteredApps.map((app) => {

//                                     const isUnread = unreadAppIds.includes(app._id);

//                                     return (

//                                         <motion.tr

//                                             key={app._id}

//                                             animate={

//                                                 isUnread

//                                                     ? {

//                                                             backgroundColor: [

//                                                                 "#ffffff",

//                                                                 "#f8faff",

//                                                                 "#ffffff",

//                                                             ],

//                                                         }

//                                                     : {}

//                                             }

//                                             transition={{

//                                                 repeat: isUnread ? Infinity : 0,

//                                                 duration: 3,

//                                             }}

//                                             className='hover:bg-slate-50/80 transition-colors relative'>

//                                             <td className='px-8 py-6'>

//                                                 <div className='flex items-center gap-3 relative'>

//                                                     {/* Notification highlight bar */}

//                                                     {isUnread && (

//                                                         <div className='absolute -left-8 w-1.5 h-12 bg-blue-600 rounded-r-lg shadow-[0_0_10px_rgba(37,99,235,0.5)]' />

//                                                     )}

//                                                     <div

//                                                         className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold relative shadow-md ${isUnread ? "bg-blue-600" : "bg-slate-400"}`}>

//                                                         {app.userName?.charAt(0) || "U"}

//                                                         {isUnread && (

//                                                             <span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-bounce' />

//                                                         )}

//                                                     </div>

//                                                     <div>

//                                                         <p className='font-bold text-[#002D62] flex items-center gap-2'>

//                                                             {app.userName}

//                                                             {isUnread && (

//                                                                 <span className='text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-black uppercase'>

//                                                                     Unread

//                                                                 </span>

//                                                             )}

//                                                         </p>

//                                                         <p className='text-xs text-slate-400'>

//                                                             {app.userEmail}

//                                                         </p>

//                                                     </div>

//                                                 </div>

//                                             </td>

//                                             <td className='px-8 py-6'>

//                                                 <p className='text-sm font-bold text-slate-700'>

//                                                     ${app.amount?.toLocaleString()}

//                                                 </p>

//                                                 <p className='text-[10px] text-blue-600 font-bold uppercase'>

//                                                     {app.term} Month Term

//                                                 </p>

//                                             </td>

//                                             <td className='px-8 py-6'>

//                                                 <span

//                                                     className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${app.status === "approved" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>

//                                                     {app.status || "pending"}

//                                                 </span>

//                                             </td>

//                                             <td className='px-8 py-6 text-right'>

//                                                 <Link

//                                                     href={`/admin/chat/${app._id}`}

//                                                     onClick={() => markAsRead(app._id)}

//                                                     className={`px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center group transition-all shadow-sm ${

//                                                         isUnread

//                                                             ? "bg-blue-600 text-white hover:bg-blue-700 scale-105"

//                                                             : "bg-[#002D62] text-white hover:bg-blue-900"

//                                                     }`}>

//                                                     {isUnread ? "Review Activity" : "Open Chat"}

//                                                     <ChevronRight

//                                                         size={14}

//                                                         className='ml-1.5 group-hover:translate-x-1 transition-transform'

//                                                     />

//                                                 </Link>

//                                             </td>

//                                         </motion.tr>

//                                     );

//                                 })}

//                             </tbody>

//                         </table>

//                     </div>

//                 </div>

//             </div>

//         </main>

//     );

// }

// function StatCard({ label, value, icon: Icon, color, bg }: any) {

//     return (

//         <div className='bg-white p-6 rounded-[24px] shadow-sm border border-slate-200 flex items-center gap-5 hover:shadow-md transition-shadow'>

//             <div className={`${bg} ${color} p-4 rounded-2xl`}>

//                 <Icon size={28} />

//             </div>

//             <div>

//                 <p className='text-slate-500 text-sm font-medium uppercase tracking-tight'>

//                     {label}

//                 </p>

//                 <h3 className='text-2xl font-black text-[#002D62]'>{value}</h3>

//             </div>

//         </div>

//     );

// }
