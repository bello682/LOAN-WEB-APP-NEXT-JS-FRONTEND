"use client";

import { motion } from "framer-motion";
import { Navigation, Footer, Card, Button } from "@/app/components";
import {
	Briefcase,
	Users,
	Star,
	MapPin,
	Coffee,
	Heart,
	Globe,
	Shield,
	ChevronRight,
	Zap,
} from "lucide-react";
import Link from "next/link";

export default function Careers() {
	const perks = [
		{
			icon: Globe,
			title: "Remote-First",
			desc: "Work from anywhere in the world with a flexible schedule.",
		},
		{
			icon: Heart,
			title: "Health & Wellness",
			desc: "Comprehensive private medical, dental, and vision insurance.",
		},
		{
			icon: Zap,
			title: "Growth Budget",
			desc: "$2,000 annual stipend for courses, books, and conferences.",
		},
		{
			icon: Coffee,
			title: "Modern Setup",
			desc: "We provide the latest MacBook Pro and a $500 home-office credit.",
		},
	];

	const jobs = [
		{
			title: "Senior Backend Engineer",
			dept: "Engineering",
			type: "Remote",
			salary: "$140k - $180k",
		},
		{
			title: "Risk Compliance Officer",
			dept: "Legal",
			type: "London / Hybrid",
			salary: "$110k - $150k",
		},
		{
			title: "Lead UI/UX Designer",
			dept: "Product",
			type: "Remote",
			salary: "$120k - $160k",
		},
		{
			title: "Customer Success Lead",
			dept: "Operations",
			type: "New York",
			salary: "$90k - $120k",
		},
	];

	return (
		<main className='bg-white selection:bg-amber-100'>
			<Navigation />

			{/* Hero Section */}
			<section className='pt-40 pb-20 px-4 bg-gradient-to-b from-slate-50 to-white'>
				<div className='max-w-4xl mx-auto text-center'>
					<motion.span
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest'>
						We're Hiring
					</motion.span>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-5xl md:text-7xl font-black text-[#002D62] mt-6 mb-8 tracking-tight'>
						Change the way the world{" "}
						<span className='text-[#EBB04D]'>borrows.</span>
					</motion.h1>
					<p className='text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed'>
						At LoanHub, we don't just build software; we build financial
						freedom. Join us in our mission to democratize access to capital.
					</p>
				</div>
			</section>

			{/* Culture/Perks Section */}
			<section className='py-24 px-4'>
				<div className='max-w-7xl mx-auto'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
						{perks.map((perk, i) => (
							<motion.div
								key={i}
								whileHover={{ y: -5 }}
								className='p-8 rounded-[32px] bg-slate-50 border border-slate-100 group transition-colors hover:bg-[#002D62]'>
								<perk.icon
									size={32}
									className='text-blue-600 group-hover:text-amber-400 transition-colors mb-6'
								/>
								<h3 className='text-xl font-bold text-[#002D62] group-hover:text-white mb-3'>
									{perk.title}
								</h3>
								<p className='text-slate-500 group-hover:text-blue-100 text-sm leading-relaxed'>
									{perk.desc}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Job Board Section */}
			<section className='py-24 px-4 bg-[#002D62] rounded-[60px] mx-4 mb-10 overflow-hidden relative'>
				<div className='absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none'>
					<div className='absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400 rounded-full blur-[120px]'></div>
				</div>

				<div className='max-w-5xl mx-auto relative z-10'>
					<div className='flex flex-col md:flex-row justify-between items-end mb-12 gap-6'>
						<div>
							<h2 className='text-4xl font-black text-white tracking-tight'>
								Open Positions
							</h2>
							<p className='text-blue-200 mt-2 font-medium'>
								Found your perfect role? Apply today.
							</p>
						</div>
						<div className='flex gap-2'>
							<span className='bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold border border-white/10'>
								All Departments
							</span>
						</div>
					</div>

					<div className='grid gap-4'>
						{jobs.map((job, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ delay: i * 0.1 }}
								className='group relative p-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl transition-all cursor-pointer flex flex-col md:flex-row justify-between items-center'>
								<div className='space-y-2 text-center md:text-left'>
									<div className='flex items-center gap-3 justify-center md:justify-start'>
										<h3 className='text-2xl font-bold text-white group-hover:text-amber-400 transition-colors'>
											{job.title}
										</h3>
										<span className='hidden md:block px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider'>
											New
										</span>
									</div>
									<div className='flex flex-wrap gap-4 text-sm text-blue-200/60 font-medium justify-center md:justify-start'>
										<span className='flex items-center gap-1.5'>
											<Briefcase size={14} /> {job.dept}
										</span>
										<span className='flex items-center gap-1.5'>
											<MapPin size={14} /> {job.type}
										</span>
										<span className='flex items-center gap-1.5'>
											<Star size={14} className='text-amber-400' /> {job.salary}
										</span>
									</div>
								</div>
								<Button className='mt-6 md:mt-0 bg-amber-400 hover:bg-white text-[#002D62] font-black px-8 py-4 rounded-2xl flex items-center gap-2 group-hover:scale-105 transition-transform'>
									Apply Now <ChevronRight size={18} />
								</Button>
							</motion.div>
						))}
					</div>

					<div className='mt-16 text-center'>
						<p className='text-blue-200/50 text-sm'>
							Don't see a role that fits? Email us at{" "}
							<span className='text-white font-bold'>talent@loanhub.com</span>
						</p>
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
}
