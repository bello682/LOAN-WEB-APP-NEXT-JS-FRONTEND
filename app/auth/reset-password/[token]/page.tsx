"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { Navigation, Footer, Button } from "@/app/components";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { resetPassword, resetAuth } from "@/lib/redux/features/authSlice";
import { toast } from "react-hot-toast";

export default function ResetPassword() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const params = useParams();
	const router = useRouter();
	const dispatch = useAppDispatch();

	const { isLoading, error, isSuccess } = useAppSelector((state) => state.auth);
	const token = params.token as string;

	useEffect(() => {
		if (error) {
			toast.error(error);
			dispatch(resetAuth());
		}
		if (isSuccess) {
			toast.success("Password reset successful! Please login.");
			dispatch(resetAuth());
			router.push("/login");
		}
	}, [error, isSuccess, dispatch, router]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (password.length < 8) {
			return toast.error("Password must be at least 8 characters");
		}
		if (password !== confirmPassword) {
			return toast.error("Passwords do not match");
		}

		dispatch(resetPassword({ password, token }));
	};

	return (
		<main className='min-h-screen bg-[#f8faff] flex flex-col'>
			<Navigation />
			<div className='flex-grow flex items-center justify-center px-4 py-20'>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className='max-w-md w-full bg-white rounded-[32px] shadow-xl p-8 md:p-12 border border-slate-100'>
					<div className='mb-8 text-center'>
						<div className='inline-flex items-center justify-center w-14 h-14 bg-green-50 rounded-2xl mb-4'>
							<Lock className='text-[#002D62] w-8 h-8' />
						</div>
						<h1 className='text-2xl font-bold text-[#002D62]'>
							Create New Password
						</h1>
						<p className='text-slate-500 mt-2 text-sm'>
							Your new password must be different from previous passwords.
						</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-5'>
						{/* Password Field */}
						<div>
							<label className='block text-xs font-bold text-slate-500 uppercase mb-2'>
								New Password
							</label>
							<div className='relative group'>
								<Lock
									className='absolute left-4 top-3.5 text-slate-400'
									size={18}
								/>
								<input
									type={showPassword ? "text" : "password"}
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className='w-full pl-12 pr-12 py-3 bg-slate-50 text-[black] border border-slate-200 rounded-xl outline-none focus:border-[#002D62] transition-all'
									placeholder='••••••••'
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute right-4 top-3 text-slate-400 hover:text-slate-600'>
									{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							</div>
						</div>

						{/* Confirm Password Field */}
						<div>
							<label className='block text-xs font-bold text-slate-500 uppercase mb-2'>
								Confirm Password
							</label>
							<div className='relative'>
								<Lock
									className='absolute left-4 top-3.5 text-slate-400'
									size={18}
								/>
								<input
									type={showPassword ? "text" : "password"}
									required
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className='w-full pl-12 pr-4 py-3 bg-slate-50 text-[black] border border-slate-200 rounded-xl outline-none focus:border-[#002D62] transition-all'
									placeholder='••••••••'
								/>
							</div>
						</div>

						{/* Password Requirements UI */}
						<div className='bg-slate-50 p-4 rounded-xl space-y-2'>
							<div
								className={`flex items-center gap-2 text-xs font-medium ${password.length >= 8 ? "text-green-600" : "text-slate-400"}`}>
								<CheckCircle2 size={14} /> At least 8 characters
							</div>
							<div
								className={`flex items-center gap-2 text-xs font-medium ${password === confirmPassword && password !== "" ? "text-green-600" : "text-slate-400"}`}>
								<CheckCircle2 size={14} /> Passwords match
							</div>
						</div>

						<Button
							type='submit'
							disabled={isLoading}
							className='w-full py-4 bg-[#002D62] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20'>
							{isLoading ? (
								<Loader2 className='animate-spin' />
							) : (
								"Update Password"
							)}
						</Button>
					</form>
				</motion.div>
			</div>
			<Footer />
		</main>
	);
}
