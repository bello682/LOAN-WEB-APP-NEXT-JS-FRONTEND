"use client";
import React, { useState, useEffect, Suspense } from "react";
import {
	ShieldCheck,
	ArrowRight,
	RefreshCw,
	Lock,
	LifeBuoy,
	Globe,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Card } from "@/app/components";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
	verifyOTP,
	resendOTP,
	resetAuth,
} from "@/lib/redux/features/authSlice";
import { toast } from "react-hot-toast";

// 1. Create a sub-component for the content that uses useSearchParams
function VerifyForm() {
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [timer, setTimer] = useState(59);
	const router = useRouter();
	const searchParams = useSearchParams();
	const dispatch = useAppDispatch();

	// Get email from URL safely
	const email = searchParams.get("email") || "Your Email";
	const { isLoading, error, isSuccess } = useAppSelector((state) => state.auth);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimer((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (error) {
			toast.error(error);
			dispatch(resetAuth());
		}
		if (isSuccess) {
			toast.success("Identity Verified! Welcome to LoanHub.");
			router.push("/login");
			dispatch(resetAuth());
		}
	}, [error, isSuccess, dispatch, router]);

	const handleChange = (element: HTMLInputElement, index: number) => {
		if (isNaN(Number(element.value))) return false;
		const newOtp = [
			...otp.map((d, idx) => (idx === index ? element.value : d)),
		];
		setOtp(newOtp);

		if (element.nextSibling && element.value !== "") {
			(element.nextSibling as HTMLInputElement).focus();
		}
	};

	const handleVerify = () => {
		const otpString = otp.join("");
		dispatch(verifyOTP({ email, otp: otpString }));
	};

	const handleResend = async () => {
		if (timer > 0) return;
		toast.promise(dispatch(resendOTP(email)).unwrap(), {
			loading: "Sending new code...",
			success: () => {
				setTimer(59);
				return "New code sent to your inbox!";
			},
			error: (err) => `Error: ${err}`,
		});
	};

	return (
		<div className='max-w-md w-full'>
			<div className='text-center mb-10'>
				<div className='inline-flex items-center justify-center w-16 h-16 bg-[#002D62] text-[#EBB04D] rounded-2xl mb-6 shadow-xl'>
					<ShieldCheck size={32} />
				</div>
				<h1 className='text-3xl font-black text-[#002D62] uppercase tracking-tighter'>
					Verify your <span className='text-[#EBB04D]'>Identity</span>
				</h1>
				<p className='text-gray-500 mt-2 font-medium italic'>
					Code sent to:{" "}
					<span className='text-[#002D62] font-bold'>{email}</span>
					<Link href='/signup' className='ml-2 text-xs text-blue-600 underline'>
						Edit
					</Link>
				</p>
			</div>

			<Card className='p-8 border-none shadow-2xl bg-white rounded-[2rem]'>
				<div className='flex justify-between gap-2 mb-8'>
					{otp.map((data, index) => (
						<input
							key={index}
							type='text'
							maxLength={1}
							className='w-12 h-14 border-2 border-gray-100 rounded-xl text-center text-xl font-black text-[#002D62] focus:border-[#EBB04D] focus:ring-0 transition-all outline-none'
							value={data}
							onChange={(e) => handleChange(e.target, index)}
							onFocus={(e) => e.target.select()}
						/>
					))}
				</div>

				<Button
					onClick={handleVerify}
					disabled={isLoading || otp.includes("")}
					className='w-full bg-[#002D62] hover:bg-[#003d85] text-white h-14 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50'>
					{isLoading ? "Verifying..." : "Confirm Code"}
					{!isLoading && <ArrowRight size={20} />}
				</Button>

				<div className='mt-8 text-center'>
					<button
						onClick={handleResend}
						disabled={timer > 0 || isLoading}
						className='text-[#002D62] font-black text-sm flex items-center gap-2 mx-auto hover:text-[#EBB04D] transition-colors disabled:text-gray-300'>
						<RefreshCw className={isLoading ? "animate-spin" : ""} size={16} />
						Resend Code {timer > 0 && `(${timer}s)`}
					</button>
				</div>
			</Card>
		</div>
	);
}

// 2. Main Page Export with Suspense Wrapper
export default function VerifyOTP() {
	return (
		<div className='min-h-screen bg-[#F8FAFC] flex flex-col'>
			<main className='flex-1 flex items-center justify-center p-6'>
				<Suspense
					fallback={
						<div className='flex flex-col items-center gap-4'>
							<RefreshCw className='animate-spin text-[#002D62]' size={32} />
							<p className='font-bold text-[#002D62]'>
								Loading Verification...
							</p>
						</div>
					}>
					<VerifyForm />
				</Suspense>
			</main>

			<footer className='w-full py-8 px-6 border-t border-gray-100 bg-white'>
				<div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6'>
					<div className='flex items-center gap-6'>
						<Link
							href='#'
							className='text-xs font-bold text-gray-400 hover:text-[#002D62] flex items-center gap-2'>
							<LifeBuoy size={14} /> Help Center
						</Link>
						<Link
							href='#'
							className='text-xs font-bold text-gray-400 hover:text-[#002D62] flex items-center gap-2'>
							<Lock size={14} /> Security & Privacy
						</Link>
					</div>
					<p className='text-[10px] font-bold text-gray-300 uppercase tracking-widest'>
						© 2026 LOANHUB FINANCIAL CORP.
					</p>
					<div className='flex items-center gap-4 text-gray-400'>
						<Globe size={16} />
						<span className='text-xs font-bold uppercase text-[#002D62]'>
							EN-US
						</span>
					</div>
				</div>
			</footer>
		</div>
	);
}
