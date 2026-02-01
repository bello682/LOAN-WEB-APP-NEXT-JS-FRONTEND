"use client";
import { Navigation, Footer, Button } from "@/app/components";
import { Rocket, Bell } from "lucide-react";

export default function Journey() {
	return (
		<main className='bg-white'>
			<Navigation />
			<section className='pt-32 pb-24 px-4 flex items-center justify-center min-h-[80vh]'>
				<div className='max-w-2xl w-full text-center space-y-8'>
					<div className='w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6'>
						<Rocket className='text-amber-500' size={40} />
					</div>
					<h1 className='text-4xl md:text-6xl font-black text-[#002D62]'>
						Be Part of the Evolution
					</h1>
					<p className='text-xl text-slate-600'>
						Our journey is just beginning. Subscribe to our inner circle for
						exclusive updates, early access to new features, and financial
						insights.
					</p>

					<div className='bg-slate-50 p-8 rounded-[32px] border border-slate-100 shadow-xl'>
						<div className='flex flex-col sm:flex-row gap-3'>
							<input
								type='email'
								placeholder='Enter your email'
								className='flex-1 px-6 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
							<Button className='bg-[#002D62] text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-900 transition-colors'>
								Subscribe
							</Button>
						</div>
						<p className='text-xs text-slate-400 mt-4 flex items-center justify-center gap-2'>
							<Bell size={12} /> No spam. Only the milestones that matter.
						</p>
					</div>
				</div>
			</section>
			<Footer />
		</main>
	);
}
