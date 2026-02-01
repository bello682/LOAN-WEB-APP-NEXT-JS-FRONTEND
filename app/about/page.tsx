// "use client";

// import { motion } from "framer-motion";
// import type { Variants } from "framer-motion";
// import { Navigation, Footer, Card, Button } from "@/app/components";
// import { Award, Users, Globe, Zap } from "lucide-react";

// export default function About() {
// 	const containerVariants: Variants = {
// 		hidden: { opacity: 0 },
// 		visible: {
// 			opacity: 1,
// 			transition: {
// 				staggerChildren: 0.1,
// 				delayChildren: 0.3,
// 			},
// 		},
// 	};

// 	const itemVariants: Variants = {
// 		hidden: { opacity: 0, y: 20 },
// 		visible: {
// 			opacity: 1,
// 			y: 0,
// 			transition: { type: "spring", stiffness: 100 } as const,
// 		},
// 	};

// 	return (
// 		<main>
// 			<Navigation />

// 			{/* Hero */}
// 			<section className='min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white'>
// 				<div className='max-w-7xl mx-auto'>
// 					<motion.div
// 						initial={{ opacity: 0, y: 20 }}
// 						animate={{ opacity: 1, y: 0 }}
// 						className='text-center'>
// 						<h1 className='text-5xl sm:text-6xl font-bold mb-6'>
// 							About LoanHub
// 						</h1>
// 						<p className='text-xl text-gray-600 max-w-3xl mx-auto mb-12'>
// 							We're revolutionizing the lending industry with technology,
// 							transparency, and genuine care for our customers' financial
// 							futures.
// 						</p>
// 					</motion.div>

// 					<motion.div
// 						initial={{ opacity: 0 }}
// 						animate={{ opacity: 1 }}
// 						transition={{ delay: 0.3 }}
// 						className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-20'>
// 						<div className='space-y-6'>
// 							<h2 className='text-3xl font-bold'>Our Story</h2>
// 							<p className='text-gray-600 leading-relaxed'>
// 								Founded in 2015, LoanHub emerged from a simple idea: financial
// 								services should be fast, fair, and transparent. Our founders
// 								believed that traditional lending was outdated and that
// 								technology could make loans accessible to everyone.
// 							</p>
// 							<p className='text-gray-600 leading-relaxed'>
// 								Today, we've grown to serve over 500,000 customers across the
// 								United States, helping them achieve their dreams whether it's
// 								buying a home, starting a business, or covering unexpected
// 								expenses.
// 							</p>
// 						</div>
// 						<motion.div
// 							whileHover={{ scale: 1.05 }}
// 							className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center'>
// 							<div className='text-5xl font-bold mb-2'>Since 2015</div>
// 							<div className='text-xl opacity-90'>
// 								Transforming lending for millions
// 							</div>
// 						</motion.div>
// 					</motion.div>
// 				</div>
// 			</section>

// 			{/* Values */}
// 			<section className='py-20 px-4 sm:px-6 lg:px-8 bg-white'>
// 				<div className='max-w-7xl mx-auto'>
// 					<motion.div
// 						initial={{ opacity: 0, y: 20 }}
// 						whileInView={{ opacity: 1, y: 0 }}
// 						viewport={{ once: true }}
// 						className='text-center mb-16'>
// 						<h2 className='text-4xl font-bold mb-4'>Our Core Values</h2>
// 						<p className='text-xl text-gray-600'>
// 							Principles that guide everything we do
// 						</p>
// 					</motion.div>

// 					<motion.div
// 						variants={containerVariants}
// 						initial='hidden'
// 						whileInView='visible'
// 						viewport={{ once: true }}
// 						className='grid grid-cols-1 md:grid-cols-4 gap-8'>
// 						{[
// 							{
// 								icon: Award,
// 								title: "Excellence",
// 								desc: "We strive for excellence in every interaction",
// 							},
// 							{
// 								icon: Users,
// 								title: "Customer First",
// 								desc: "Our customers' success is our success",
// 							},
// 							{
// 								icon: Globe,
// 								title: "Integrity",
// 								desc: "We operate with complete transparency",
// 							},
// 							{
// 								icon: Zap,
// 								title: "Innovation",
// 								desc: "We embrace technology to improve lives",
// 							},
// 						].map((value, index) => (
// 							<motion.div key={index} variants={itemVariants}>
// 								<Card className='p-8 h-full text-center'>
// 									<motion.div
// 										className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4'
// 										whileHover={{ rotate: 360 }}
// 										transition={{ duration: 0.6 }}>
// 										<value.icon size={32} className='text-white' />
// 									</motion.div>
// 									<h3 className='text-xl font-bold mb-2'>{value.title}</h3>
// 									<p className='text-gray-600'>{value.desc}</p>
// 								</Card>
// 							</motion.div>
// 						))}
// 					</motion.div>
// 				</div>
// 			</section>

// 			{/* Team */}
// 			<section className='py-20 px-4 sm:px-6 lg:px-8 bg-gray-50'>
// 				<div className='max-w-7xl mx-auto'>
// 					<motion.div
// 						initial={{ opacity: 0, y: 20 }}
// 						whileInView={{ opacity: 1, y: 0 }}
// 						viewport={{ once: true }}
// 						className='text-center mb-16'>
// 						<h2 className='text-4xl font-bold mb-4'>Our Leadership Team</h2>
// 						<p className='text-xl text-gray-600'>
// 							Experienced professionals dedicated to your success
// 						</p>
// 					</motion.div>

// 					<motion.div
// 						variants={containerVariants}
// 						initial='hidden'
// 						whileInView='visible'
// 						viewport={{ once: true }}
// 						className='grid grid-cols-1 md:grid-cols-3 gap-8'>
// 						{[
// 							{ name: "John Smith", role: "CEO & Founder", emoji: "👨‍💼" },
// 							{ name: "Sarah Williams", role: "CTO", emoji: "👩‍💻" },
// 							{ name: "Michael Johnson", role: "CFO", emoji: "👨‍💰" },
// 						].map((member, index) => (
// 							<motion.div key={index} variants={itemVariants}>
// 								<Card className='p-8 text-center h-full'>
// 									<div className='text-6xl mb-4'>{member.emoji}</div>
// 									<h3 className='text-xl font-bold mb-2'>{member.name}</h3>
// 									<p className='text-gray-600 mb-4'>{member.role}</p>
// 									<p className='text-sm text-gray-500'>
// 										Leading innovation and customer success at LoanHub
// 									</p>
// 								</Card>
// 							</motion.div>
// 						))}
// 					</motion.div>
// 				</div>
// 			</section>

// 			<Footer />
// 		</main>
// 	);
// }

"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Navigation, Footer, Card, Button } from "@/app/components";
import {
	ShieldCheck,
	CheckCircle2,
	Building2,
	TrendingUp,
	Zap,
} from "lucide-react";
import Link from "next/link";

export default function About() {
	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.15, delayChildren: 0.2 },
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { type: "spring", stiffness: 100 } as const,
		},
	};

	return (
		<main className='bg-white'>
			<Navigation />

			{/* Hero Section */}
			<section className='relative pt-32 pb-24 px-4 overflow-hidden bg-[#002D62]'>
				<div className='absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] rounded-full -mr-20 -mt-20'></div>
				<div className='max-w-7xl mx-auto relative z-10'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-center'>
						<span className='inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold uppercase tracking-widest mb-4'>
							Our Mission
						</span>
						<h1 className='text-4xl md:text-6xl font-black text-white mb-6 tracking-tight'>
							Empowering Your{" "}
							<span className='text-amber-400'>Financial Future</span>
						</h1>
						<p className='text-xl text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium'>
							We’re redefining the lending experience through advanced
							technology and unwavering transparency, making capital accessible
							when you need it most.
						</p>
						<div className='flex flex-wrap justify-center gap-4'>
							<Link href='/journey'>
								<Button className='bg-amber-400 hover:bg-amber-500 text-[#002D62] font-bold px-8 py-4 rounded-xl shadow-lg shadow-amber-400/20'>
									Join Our Journey
								</Button>
							</Link>
							<Link href='/careers'>
								<Button className='bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-8 py-4 rounded-xl backdrop-blur-sm'>
									View Careers
								</Button>
							</Link>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Stats Section */}
			<section className='py-12 bg-slate-50 border-y border-slate-100'>
				<div className='max-w-7xl mx-auto px-4'>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
						{[
							{ label: "Founded", value: "2015" },
							{ label: "Active Users", value: "500K+" },
							{ label: "Total Loans", value: "$2.4B+" },
							{ label: "Trust Score", value: "4.9/5" },
						].map((stat, i) => (
							<div key={i} className='text-center'>
								<div className='text-3xl font-black text-[#002D62]'>
									{stat.value}
								</div>
								<div className='text-slate-500 text-sm font-bold uppercase tracking-tighter mt-1'>
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Story & Content Section */}
			<section className='py-24 px-4 bg-white'>
				<div className='max-w-7xl mx-auto'>
					<div className='grid lg:grid-cols-2 gap-16 items-center'>
						{/* Story Left */}
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className='space-y-6'>
							<div className='w-12 h-1 bg-amber-400 mb-4'></div>
							<h2 className='text-4xl font-black text-[#002D62] tracking-tight'>
								The LoanHub Story
							</h2>
							<p className='text-slate-600 text-lg leading-relaxed'>
								Founded in 2015, LoanHub emerged from a frustration with
								traditional banking's slow and opaque processes. Our founders
								believed that speed and integrity shouldn't be mutually
								exclusive.
							</p>
							<div className='space-y-4'>
								{[
									"Pioneered instant risk-assessment algorithms",
									"Eliminated predatory hidden processing fees",
									"Built a human-centric support ecosystem",
								].map((item, i) => (
									<div key={i} className='flex items-center gap-3'>
										<CheckCircle2 className='text-blue-600' size={20} />
										<span className='font-bold text-slate-700'>{item}</span>
									</div>
								))}
							</div>
						</motion.div>

						{/* Quote Right */}
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							className='relative p-8 bg-slate-900 rounded-[40px] overflow-hidden group shadow-2xl'>
							<div className='absolute inset-0 bg-gradient-to-br from-blue-600/40 to-transparent'></div>
							<div className='relative z-10 text-white space-y-8 py-10 px-4'>
								<div className='flex gap-4 items-center'>
									<div className='p-3 bg-amber-400 rounded-2xl'>
										<TrendingUp className='text-[#002D62]' size={28} />
									</div>
									<div>
										<div className='text-2xl font-black'>Fastest Growing</div>
										<div className='text-blue-200'>
											Fintech of the Year 2025
										</div>
									</div>
								</div>
								<p className='text-blue-100/70 italic text-lg leading-relaxed'>
									"Our goal was never just to provide loans, but to provide a
									foundation for long-term financial stability for every
									applicant we serve."
								</p>
								<div className='flex items-center gap-4 border-t border-white/10 pt-6'>
									<div className='w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-amber-400'>
										JS
									</div>
									<div>
										<div className='font-bold'>John Smith</div>
										<div className='text-sm text-blue-300 font-medium tracking-wide'>
											CEO & Founder
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Values Grid */}
			<section className='py-24 px-4 bg-slate-50'>
				<div className='max-w-7xl mx-auto'>
					<div className='text-center mb-16'>
						<h2 className='text-4xl font-black text-[#002D62] mb-4'>
							Core Principles
						</h2>
						<p className='text-slate-500 font-medium'>
							Built on a foundation of trust and technological excellence.
						</p>
					</div>

					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						{[
							{
								icon: ShieldCheck,
								title: "Radical Integrity",
								desc: "We operate with a 'no hidden fees' policy, ensuring total transparency in every contract.",
								color: "text-blue-600",
							},
							{
								icon: Zap,
								title: "Hyper Innovation",
								desc: "Our AI-driven backend reduces approval times from days to mere minutes.",
								color: "text-amber-500",
							},
							{
								icon: Building2,
								title: "Financial Inclusion",
								desc: "Expanding access to capital for underserved communities through alternative data metrics.",
								color: "text-emerald-500",
							},
						].map((value, index) => (
							<motion.div key={index} variants={itemVariants}>
								<Card className='p-10 border-none shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-[32px] bg-white h-full group'>
									<div
										className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-slate-50 group-hover:scale-110 transition-transform`}>
										<value.icon size={28} className={value.color} />
									</div>
									<h3 className='text-xl font-black text-[#002D62] mb-3 uppercase tracking-tight'>
										{value.title}
									</h3>
									<p className='text-slate-500 leading-relaxed font-medium'>
										{value.desc}
									</p>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			<Footer />
		</main>
	);
}
