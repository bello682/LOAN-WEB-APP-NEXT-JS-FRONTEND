"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { fetchMessages } from "@/lib/redux/features/chatSlice";
import toast from "react-hot-toast";
import { MessageCircle } from "lucide-react";

export default function ChatNotification() {
	const dispatch = useAppDispatch();
	const pathname = usePathname();
	const router = useRouter();

	const { messages, application, user } = useAppSelector(
		(state: RootState) => state.chat,
	);

	const prevMessageCount = useRef<number | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const originalTitle = useRef<string>("");
	const [isNotificationActive, setIsNotificationActive] = useState(false);

	const isAdmin = pathname.startsWith("/admin") || user?.role === "admin";

	// DEBUG: Test if Toasts work AT ALL on mount
	// useEffect(() => {
	//  if (!isAdmin) {
	//      console.log("System: Notification Listener Active");
	//      // Remove this line once you see the toast works
	//      toast.success("Notification System Online");
	//  }
	// }, [isAdmin]);

	useEffect(() => {
		if (isAdmin) return;
		audioRef.current = new Audio(
			"https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
		);
		originalTitle.current = document.title;
		return () => {
			document.title = originalTitle.current;
		};
	}, [isAdmin]);

	// Polling
	useEffect(() => {
		if (isAdmin || !application?._id) return;
		const interval = setInterval(() => {
			dispatch(fetchMessages(application._id));
		}, 5000);
		return () => clearInterval(interval);
	}, [application?._id, dispatch, isAdmin]);

	// Detection Logic
	useEffect(() => {
		if (isAdmin) return;

		// Force initialize ref on first message load
		if (prevMessageCount.current === null) {
			prevMessageCount.current = messages.length;
			return;
		}

		if (messages.length > prevMessageCount.current) {
			const latestMessage = messages[messages.length - 1];

			// LOGGING - Check your browser console!
			console.log("NEW MESSAGE DATA:", latestMessage);

			if (latestMessage.senderType !== "user" && pathname !== "/chat") {
				setIsNotificationActive(true);
				audioRef.current?.play().catch(() => console.log("Audio blocked"));

				toast.custom(
					(t) => (
						<div
							style={{ zIndex: 99999 }} // Force z-index on the div itself
							onClick={() => {
								router.push("/chat");
								setIsNotificationActive(false);
								toast.dismiss(t.id);
							}}
							className={`${
								t.visible ? "animate-enter" : "animate-leave"
							} max-w-md w-full bg-white dark:bg-slate-900 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 cursor-pointer border-l-4 border-[#EBB04D]`}>
							<div className='flex-1 w-0 p-4'>
								<div className='flex items-start'>
									<div className='flex-shrink-0 pt-0.5'>
										<div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600'>
											<MessageCircle size={20} />
										</div>
									</div>
									<div className='ml-3 flex-1'>
										<p className='text-sm font-bold text-gray-900 dark:text-white'>
											Support Specialist
										</p>
										<p className='mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1'>
											{latestMessage.text}
										</p>
									</div>
								</div>
							</div>
							<div className='flex border-l border-gray-200'>
								<button
									onClick={(e) => {
										e.stopPropagation();
										setIsNotificationActive(false);
										toast.dismiss(t.id);
									}}
									className='w-full p-4 flex items-center justify-center text-sm font-medium text-gray-400'>
									Close
								</button>
							</div>
						</div>
					),
					{ duration: 10000 },
				);
			}
		}
		prevMessageCount.current = messages.length;
	}, [messages, pathname, router, isAdmin]);

	useEffect(() => {
		if (pathname === "/chat") setIsNotificationActive(false);
	}, [pathname]);

	if (isAdmin) return null;
	return null;
}
