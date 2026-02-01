"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Navigation, Footer, Button } from "@/app/components";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { forgotPassword, resetAuth } from "@/lib/redux/features/authSlice";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const dispatch = useAppDispatch();
	const { isLoading, error, isSuccess } = useAppSelector((state) => state.auth);

	useEffect(() => {
		if (error) {
			toast.error(error);
			dispatch(resetAuth());
		}
		if (isSuccess) {
			setSubmitted(true);
			dispatch(resetAuth());
		}
	}, [error, isSuccess, dispatch]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return toast.error("Please enter your email");
		dispatch(forgotPassword(email));
	};

	return (
		<main className='min-h-screen bg-[#f8faff] flex flex-col'>
			<Navigation />
			<div className='flex-grow flex items-center justify-center px-4 py-20'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='max-w-md w-full bg-white rounded-[32px] shadow-xl p-8 md:p-12 border border-slate-100'>
					{!submitted ? (
						<>
							<div className='mb-8 text-center'>
								<div className='inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-4'>
									<ShieldCheck className='text-[#002D62] w-8 h-8' />
								</div>
								<h1 className='text-2xl font-bold text-[#002D62]'>
									Forgot Password?
								</h1>
								<p className='text-slate-500 mt-2'>
									No worries! Enter your email and we'll send you a reset link.
								</p>
							</div>

							<form onSubmit={handleSubmit} className='space-y-6'>
								<div>
									<label className='block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2'>
										Email Address
									</label>
									<div className='relative'>
										<Mail
											className='absolute left-4 top-3.5 text-slate-400'
											size={18}
										/>
										<input
											type='email'
											required
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className='w-full pl-12 pr-4 py-3 bg-slate-50 text-[black] border border-slate-200 rounded-xl outline-none focus:border-[#002D62] transition-all'
											placeholder='your@email.com'
										/>
									</div>
								</div>

								<Button
									type='submit'
									disabled={isLoading}
									className='w-full py-4 bg-[#002D62] text-white rounded-xl font-bold flex items-center justify-center gap-2'>
									{isLoading ? (
										<Loader2 className='animate-spin' />
									) : (
										"Send Reset Link"
									)}
								</Button>
							</form>
						</>
					) : (
						<div className='text-center py-4'>
							<div className='w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6'>
								<Mail size={40} />
							</div>
							<h2 className='text-2xl font-bold text-[#002D62] mb-2'>
								Check your email
							</h2>
							<p className='text-slate-500 mb-8'>
								We've sent a password reset link to <br />
								<span className='font-bold text-[#002D62]'>{email}</span>
							</p>
							<Button
								onClick={() => setSubmitted(false)}
								className='w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all'>
								Didn't get the email? Try again
							</Button>
						</div>
					)}

					<div className='mt-8 text-center'>
						<Link
							href='/login'
							className='inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-[#002D62] transition-colors'>
							<ArrowLeft size={16} />
							Back to Login
						</Link>
					</div>
				</motion.div>
			</div>
			<Footer />
		</main>
	);
}
