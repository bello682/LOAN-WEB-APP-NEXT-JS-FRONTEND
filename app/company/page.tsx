"use client";

import { motion } from "framer-motion";
import {
	Shield,
	Target,
	Rocket,
	Award,
	CheckCircle2,
	ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Footer, Navigation } from "../components";

export default function CompanyPage() {
	const fadeUp = {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
	};

	return (
		<main className='bg-white overflow-x-hidden'>
			<Navigation />
			{/* Hero Section */}
			<section className='relative pt-32 md:pt-40 pb-16 md:pb-24 bg-[#002D62]'>
				<div className='absolute inset-0 opacity-10'>
					<div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
				</div>

				<div className='max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center'>
					<motion.span
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='inline-block px-4 py-1.5 mb-6 text-[10px] md:text-sm font-bold tracking-widest text-[#EBB04D] uppercase bg-white/10 rounded-full'>
						Established 2014
					</motion.span>
					<motion.h1
						initial='hidden'
						whileInView='visible'
						variants={fadeUp}
						className='text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 md:mb-8 leading-tight'>
						Empowering Your <br className='hidden sm:block' />
						<span className='text-[#EBB04D]'>Financial Future</span>
					</motion.h1>
					<motion.p
						variants={fadeUp}
						className='text-lg md:text-xl text-blue-100/80 max-w-3xl mx-auto font-medium leading-relaxed'>
						We’ve spent over a decade perfecting a lending platform that
						prioritizes people over paperwork. With LoanExample, transparent
						financing is finally within reach.
					</motion.p>
				</div>
			</section>

			{/* Mission & Vision */}
			<section className='py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto'>
				<div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
					<motion.div
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						variants={fadeUp}
						className='order-2 lg:order-1 space-y-6 md:space-y-8'>
						<div className='flex items-center gap-3 text-[#002D62]'>
							<Target className='text-[#EBB04D] shrink-0' size={32} />
							<h2 className='text-2xl md:text-3xl font-black uppercase tracking-tighter'>
								Our Mission
							</h2>
						</div>
						<p className='text-gray-600 text-base md:text-lg leading-relaxed'>
							To provide accessible, fair, and transparent credit solutions that
							enable individuals and businesses to achieve their goals without
							the burden of traditional banking bureaucracy.
						</p>
						<ul className='grid sm:grid-cols-2 lg:grid-cols-1 gap-4'>
							{[
								"100% Digital Application",
								"No Hidden Fees Guarantee",
								"Decisions in under 24 hours",
							].map((item, i) => (
								<li
									key={i}
									className='flex items-center gap-3 text-[#002D62] font-bold text-sm md:text-base'>
									<CheckCircle2 className='text-[#EBB04D] shrink-0' size={20} />
									{item}
								</li>
							))}
						</ul>
					</motion.div>

					<div className='order-1 lg:order-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6'>
						<div className='bg-[#002D62] p-6 md:p-8 rounded-[24px] md:rounded-[32px] text-white'>
							<Rocket className='text-[#EBB04D] mb-4 w-8 h-8 md:w-10 md:h-10' />
							<h4 className='text-lg md:text-xl font-bold mb-2'>
								Fast Decisioning
							</h4>
							<p className='text-blue-100/70 text-sm'>
								Proprietary AI algorithms for instant credit assessment.
							</p>
						</div>
						<div className='bg-gray-50 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100'>
							<Shield className='text-[#002D62] mb-4 w-8 h-8 md:w-10 md:h-10' />
							<h4 className='text-lg md:text-xl font-bold text-[#002D62] mb-2'>
								Bank-Level Security
							</h4>
							<p className='text-gray-500 text-sm'>
								Your data is protected by AES-256 bit encryption.
							</p>
						</div>
						<div className='bg-gray-50 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100 sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
							<div>
								<h4 className='text-lg md:text-xl font-bold text-[#002D62]'>
									Global Recognition
								</h4>
								<p className='text-gray-500 text-sm'>
									Awarded 'Best Fintech Innovator' 2024
								</p>
							</div>
							<Award className='text-[#EBB04D] w-10 h-10 md:w-12 md:h-12' />
						</div>
					</div>
				</div>
			</section>

			{/* Corporate Stats */}
			<section className='bg-gray-50 py-16 md:py-20'>
				<div className='max-w-7xl mx-auto px-4 md:px-6'>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center'>
						{[
							{ label: "Loans Disbursed", val: "$450M+" },
							{ label: "Active Customers", val: "120K" },
							{ label: "Trust Score", val: "4.9/5" },
							{ label: "Support Hours", val: "24/7" },
						].map((stat, i) => (
							<div key={i}>
								<div className='text-2xl sm:text-3xl md:text-4xl font-black text-[#002D62] mb-1 md:mb-2'>
									{stat.val}
								</div>
								<div className='text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.1em] md:tracking-[0.2em]'>
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='py-16 md:py-24 px-4 md:px-6'>
				<div className='max-w-5xl mx-auto bg-[#002D62] rounded-[32px] md:rounded-[40px] p-8 md:p-12 text-center relative overflow-hidden'>
					<div className='absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-[#EBB04D]/10 rounded-full -translate-y-1/2 translate-x-1/2' />
					<h2 className='text-2xl sm:text-3xl md:text-5xl font-black text-white mb-6 md:mb-8 relative z-10 leading-tight'>
						Ready to start your <br /> financial journey?
					</h2>
					<div className='flex flex-col sm:flex-row gap-4 justify-center relative z-10'>
						<Link
							href='/apply'
							className='bg-[#EBB04D] text-[#002D62] px-6 md:px-10 py-3 md:py-4 rounded-xl font-black hover:bg-white transition-all flex items-center justify-center gap-2 text-sm md:text-base'>
							Apply Now <ArrowRight size={20} />
						</Link>
						<Link
							href='/contact'
							className='bg-white/10 text-white border border-white/20 px-6 md:px-10 py-3 md:py-4 rounded-xl font-black hover:bg-white/20 transition-all text-sm md:text-base'>
							Contact Sales
						</Link>
					</div>
				</div>
			</section>
			<Footer />
		</main>
	);
}
