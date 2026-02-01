// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import { Loader2 } from "lucide-react";

// interface LoadingOverlayProps {
// 	isLoading: boolean;
// 	message?: string;
// }

// export default function LoadingOverlay({
// 	isLoading,
// 	message = "Processing your request...",
// }: LoadingOverlayProps) {
// 	return (
// 		<AnimatePresence>
// 			{isLoading && (
// 				<motion.div
// 					initial={{ opacity: 0 }}
// 					animate={{ opacity: 1 }}
// 					exit={{ opacity: 0 }}
// 					className='fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm'>
// 					<div className='flex flex-col items-center p-8 rounded-3xl bg-white shadow-2xl border border-slate-100'>
// 						{/* The Animated Spinner */}
// 						<motion.div
// 							animate={{ rotate: 360 }}
// 							transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
// 							className='mb-4'>
// 							<Loader2 size={48} className='text-[#002D62]' />
// 						</motion.div>

// 						{/* Dynamic Text */}
// 						<motion.p
// 							initial={{ opacity: 0, y: 10 }}
// 							animate={{ opacity: 1, y: 0 }}
// 							transition={{ delay: 0.2 }}
// 							className='text-[#002D62] font-bold text-lg tracking-tight'>
// 							{message}
// 						</motion.p>

// 						{/* Subtle Progress bar effect */}
// 						<div className='w-48 h-1 bg-slate-100 rounded-full mt-4 overflow-hidden'>
// 							<motion.div
// 								initial={{ x: "-100%" }}
// 								animate={{ x: "100%" }}
// 								transition={{
// 									repeat: Infinity,
// 									duration: 1.5,
// 									ease: "easeInOut",
// 								}}
// 								className='w-full h-full bg-[#EBB04D]'
// 							/>
// 						</div>
// 					</div>
// 				</motion.div>
// 			)}
// 		</AnimatePresence>
// 	);
// }
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom"; // Add this
import { Button } from "@/app/components";

interface LoadingOverlayProps {
	isLoading: boolean;
	message?: string;
	onClose: () => void;
}

export default function LoadingOverlay({
	isLoading,
	message = "Processing your request...",
	onClose,
}: LoadingOverlayProps) {
	const [showError, setShowError] = useState(false);
	const [mounted, setMounted] = useState(false);

	// Handle hydration to prevent SSR errors with Portals
	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isLoading) {
			setShowError(false);
			timer = setTimeout(() => {
				setShowError(true);
			}, 5000);
		}
		return () => clearTimeout(timer);
	}, [isLoading]);

	const handleReset = () => {
		setShowError(false);
		onClose();
	};

	if (!mounted) return null;

	// We render into document.body to jump out of any CSS traps
	return createPortal(
		<AnimatePresence>
			{isLoading && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					// z-[999999] combined with Portal will guarantee top-level visibility
					className='fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm px-4'>
					<motion.div
						layout
						className='flex flex-col items-center p-8 rounded-[32px] bg-white shadow-2xl border border-slate-100 max-w-sm w-full text-center'>
						{!showError ? (
							<>
								<motion.div
									animate={{ rotate: 360 }}
									transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
									className='mb-6'>
									<Loader2 size={48} className='text-[#002D62]' />
								</motion.div>
								<motion.p className='text-[#002D62] font-bold text-lg tracking-tight'>
									{message}
								</motion.p>
								<div className='w-48 h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden'>
									<motion.div
										initial={{ x: "-100%" }}
										animate={{ x: "100%" }}
										transition={{
											repeat: Infinity,
											duration: 1.5,
											ease: "easeInOut",
										}}
										className='w-full h-full bg-[#EBB04D]'
									/>
								</div>
							</>
						) : (
							<motion.div
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}>
								<div className='w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto'>
									<AlertCircle size={32} className='text-red-500' />
								</div>
								<h3 className='text-xl font-black text-[#002D62] mb-2'>
									Request Failed
								</h3>
								<p className='text-slate-500 text-sm leading-relaxed mb-6'>
									Sorry, we are unable to perform your request at the moment.
									Please try again later.
								</p>
								<Button
									onClick={handleReset}
									className='w-full bg-[#002D62] text-white font-bold py-4 rounded-2xl'>
									Okay
								</Button>
							</motion.div>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.body,
	);
}
