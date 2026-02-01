// "use client";

// import { motion } from "framer-motion";
// import type { Variants } from "framer-motion";
// import { Navigation, Footer, Card, Button } from "@/app/components";
// import { Home, Car, Briefcase, User } from "lucide-react";

// export default function LoanProducts() {
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

// 	const products = [
// 		{
// 			icon: User,
// 			title: "Personal Loans",
// 			rate: "From 6.99%",
// 			amount: "Up to $50,000",
// 			term: "3-7 years",
// 			features: [
// 				"Fast approval",
// 				"Flexible terms",
// 				"No hidden fees",
// 				"Competitive rates",
// 			],
// 		},
// 		{
// 			icon: Home,
// 			title: "Home Loans",
// 			rate: "From 3.49%",
// 			amount: "Up to $1,000,000",
// 			term: "15-30 years",
// 			features: [
// 				"Fixed rates",
// 				"Expert guidance",
// 				"Quick closing",
// 				"Refinancing options",
// 			],
// 		},
// 		{
// 			icon: Car,
// 			title: "Auto Loans",
// 			rate: "From 4.99%",
// 			amount: "Up to $100,000",
// 			term: "3-7 years",
// 			features: [
// 				"Same-day funding",
// 				"New or used",
// 				"Flexible terms",
// 				"Bad credit OK",
// 			],
// 		},
// 		{
// 			icon: Briefcase,
// 			title: "Business Loans",
// 			rate: "From 5.49%",
// 			amount: "Up to $500,000",
// 			term: "2-10 years",
// 			features: [
// 				"Fast approval",
// 				"No collateral needed",
// 				"Flexible use",
// 				"Growth focused",
// 			],
// 		},
// 	];

// 	return (
// 		<main>
// 			<Navigation />

// 			{/* Hero */}
// 			<section className='min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-950'>
// 				<div className='max-w-7xl mx-auto text-center'>
// 					<motion.h1
// 						initial={{ opacity: 0, y: 20 }}
// 						animate={{ opacity: 1, y: 0 }}
// 						className='text-5xl sm:text-6xl font-bold mb-6 text-gray-900 dark:text-white'>
// 						Our Loan Products
// 					</motion.h1>
// 					<motion.p
// 						initial={{ opacity: 0, y: 20 }}
// 						animate={{ opacity: 1, y: 0 }}
// 						transition={{ delay: 0.2 }}
// 						className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-16'>
// 						Find the perfect loan solution for your needs with competitive rates
// 						and flexible terms
// 					</motion.p>
// 				</div>
// 			</section>

// 			{/* Products */}
// 			<section className='py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 transition-colors'>
// 				<div className='max-w-7xl mx-auto'>
// 					<motion.div
// 						variants={containerVariants}
// 						initial='hidden'
// 						whileInView='visible'
// 						viewport={{ once: true }}
// 						className='grid grid-cols-1 md:grid-cols-2 gap-8'>
// 						{products.map((product, index) => (
// 							<motion.div key={index} variants={itemVariants}>
// 								<div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 h-full hover:shadow-lg dark:hover:shadow-gray-900/30 transition-shadow'>
// 									<motion.div
// 										className='w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6'
// 										whileHover={{ scale: 1.1, rotate: 10 }}>
// 										<product.icon
// 											size={32}
// 											className='text-blue-600 dark:text-blue-400'
// 										/>
// 									</motion.div>
// 									<h3 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
// 										{product.title}
// 									</h3>
// 									<div className='space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700'>
// 										<div className='flex justify-between'>
// 											<span className='text-gray-600 dark:text-gray-400'>
// 												Interest Rate:
// 											</span>
// 											<span className='font-bold text-blue-600 dark:text-blue-400'>
// 												{product.rate}
// 											</span>
// 										</div>
// 										<div className='flex justify-between'>
// 											<span className='text-gray-600 dark:text-gray-400'>
// 												Loan Amount:
// 											</span>
// 											<span className='font-bold text-gray-900 dark:text-white'>
// 												{product.amount}
// 											</span>
// 										</div>
// 										<div className='flex justify-between'>
// 											<span className='text-gray-600 dark:text-gray-400'>
// 												Loan Term:
// 											</span>
// 											<span className='font-bold text-gray-900 dark:text-white'>
// 												{product.term}
// 											</span>
// 										</div>
// 									</div>
// 									<div className='mb-6'>
// 										<h4 className='font-bold mb-3 text-gray-900 dark:text-white'>
// 											Key Features:
// 										</h4>
// 										<ul className='space-y-2'>
// 											{product.features.map((feature, i) => (
// 												<li
// 													key={i}
// 													className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
// 													<span className='text-blue-600 dark:text-blue-400'>
// 														✓
// 													</span>{" "}
// 													{feature}
// 												</li>
// 											))}
// 										</ul>
// 									</div>
// 									<motion.button
// 										whileHover={{ scale: 1.02 }}
// 										whileTap={{ scale: 0.98 }}
// 										className='w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors'>
// 										Apply Now
// 									</motion.button>
// 								</div>
// 							</motion.div>
// 						))}
// 					</motion.div>
// 				</div>
// 			</section>

// 			{/* Comparison */}
// 			<section className='py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800 transition-colors'>
// 				<div className='max-w-7xl mx-auto'>
// 					<motion.div
// 						initial={{ opacity: 0, y: 20 }}
// 						whileInView={{ opacity: 1, y: 0 }}
// 						viewport={{ once: true }}
// 						className='text-center mb-16'>
// 						<h2 className='text-4xl font-bold mb-4 text-gray-900 dark:text-white'>
// 							Why LoanHub is Better
// 						</h2>
// 						<p className='text-xl text-gray-600 dark:text-gray-400'>
// 							Competitive advantages you can trust
// 						</p>
// 					</motion.div>

// 					<Card className='p-8 overflow-x-auto'>
// 						<table className='w-full text-left'>
// 							<thead>
// 								<tr className='border-b border-gray-200'>
// 									<th className='pb-4 font-bold'>Feature</th>
// 									<th className='pb-4 text-center'>LoanHub</th>
// 									<th className='pb-4 text-center'>Traditional Banks</th>
// 								</tr>
// 							</thead>
// 							<tbody>
// 								{[
// 									{
// 										feature: "Approval Time",
// 										loanhub: "Minutes",
// 										traditional: "Days/Weeks",
// 									},
// 									{
// 										feature: "Application",
// 										loanhub: "Online",
// 										traditional: "In-person",
// 									},
// 									{
// 										feature: "Hidden Fees",
// 										loanhub: "None",
// 										traditional: "Common",
// 									},
// 									{ feature: "24/7 Support", loanhub: "✓", traditional: "✗" },
// 									{
// 										feature: "Minimum Credit",
// 										loanhub: "580+",
// 										traditional: "650+",
// 									},
// 								].map((row, index) => (
// 									<motion.tr
// 										key={index}
// 										initial={{ opacity: 0 }}
// 										whileInView={{ opacity: 1 }}
// 										viewport={{ once: true }}
// 										transition={{ delay: index * 0.1 }}
// 										className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
// 										<td className='py-4 font-semibold'>{row.feature}</td>
// 										<td className='py-4 text-center text-blue-600 font-bold'>
// 											{row.loanhub}
// 										</td>
// 										<td className='py-4 text-center text-gray-500'>
// 											{row.traditional}
// 										</td>
// 									</motion.tr>
// 								))}
// 							</tbody>
// 						</table>
// 					</Card>
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
	Home,
	Car,
	Briefcase,
	User,
	CheckCircle2,
	ArrowRight,
} from "lucide-react";

export default function LoanProducts() {
	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1, delayChildren: 0.2 },
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { type: "spring", stiffness: 100 } as const,
		},
	};

	const products = [
		{
			icon: User,
			title: "Personal Loans",
			rate: "From 6.99%",
			amount: "Up to $50,000",
			term: "3-7 years",
			features: ["Fast approval", "No hidden fees", "Competitive rates"],
			color: "blue",
		},
		{
			icon: Home,
			title: "Home Loans",
			rate: "From 3.49%",
			amount: "Up to $1.2M",
			term: "15-30 years",
			features: ["Fixed rates", "Expert guidance", "Refinancing options"],
			color: "emerald",
		},
		{
			icon: Car,
			title: "Auto Loans",
			rate: "From 4.99%",
			amount: "Up to $100,000",
			term: "3-7 years",
			features: ["Same-day funding", "New or used", "Flexible terms"],
			color: "amber",
		},
		{
			icon: Briefcase,
			title: "Business Loans",
			rate: "From 5.49%",
			amount: "Up to $500,000",
			term: "2-10 years",
			features: ["No collateral", "Growth focused", "Fast approval"],
			color: "indigo",
		},
	];

	return (
		<main className='bg-white'>
			<Navigation />

			{/* Hero Section - Matching the Mockup Style */}
			<section className='relative pt-32 pb-20 px-4 overflow-hidden bg-[#002D62]'>
				<div className='absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[100px] rounded-full'></div>
				<div className='max-w-7xl mx-auto relative z-10 text-center'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}>
						<span className='inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold uppercase tracking-widest mb-4'>
							Our Products
						</span>
						<h1 className='text-5xl md:text-6xl font-black text-white mb-6 tracking-tight'>
							Simple Solutions for{" "}
							<span className='text-amber-400'>Every Need</span>
						</h1>
						<p className='text-xl text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed'>
							Transparent lending with competitive rates. Whether it's a new
							home, a car, or growing your business, we've got you covered.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Product Grid */}
			<section className='py-24 px-4 bg-slate-50'>
				<div className='max-w-7xl mx-auto'>
					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						{products.map((product, index) => (
							<motion.div key={index} variants={itemVariants}>
								<Card className='p-0 border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-[32px] bg-white overflow-hidden group'>
									<div className='p-8 md:p-10'>
										<div className='flex justify-between items-start mb-8'>
											<div className='w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
												<product.icon size={32} className='text-[#002D62]' />
											</div>
											<div className='text-right'>
												<div className='text-xs font-bold text-slate-400 uppercase tracking-widest'>
													Starts At
												</div>
												<div className='text-3xl font-black text-blue-600'>
													{product.rate}
												</div>
											</div>
										</div>

										<h3 className='text-3xl font-black text-[#002D62] mb-6'>
											{product.title}
										</h3>

										<div className='grid grid-cols-2 gap-6 mb-8 py-6 border-y border-slate-100'>
											<div>
												<div className='text-xs font-bold text-slate-400 uppercase mb-1'>
													Max Amount
												</div>
												<div className='font-bold text-slate-700'>
													{product.amount}
												</div>
											</div>
											<div>
												<div className='text-xs font-bold text-slate-400 uppercase mb-1'>
													Loan Term
												</div>
												<div className='font-bold text-slate-700'>
													{product.term}
												</div>
											</div>
										</div>

										<ul className='space-y-3 mb-10'>
											{product.features.map((feature, i) => (
												<li
													key={i}
													className='flex items-center gap-3 text-slate-600 font-medium'>
													<CheckCircle2
														size={18}
														className='text-emerald-500'
													/>
													{feature}
												</li>
											))}
										</ul>

										<Button className='w-full bg-[#002D62] hover:bg-blue-800 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 group'>
											Apply for {product.title}
											<ArrowRight
												size={18}
												className='group-hover:translate-x-1 transition-transform'
											/>
										</Button>
									</div>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* Comparison Table Section */}
			<section className='py-24 px-4 bg-white'>
				<div className='max-w-4xl mx-auto'>
					<div className='text-center mb-16'>
						<h2 className='text-4xl font-black text-[#002D62] mb-4'>
							Why Choose Us?
						</h2>
						<p className='text-slate-500 font-medium'>
							Traditional banking speed vs. LoanHub efficiency.
						</p>
					</div>

					<div className='bg-[#002D62] rounded-[40px] p-8 md:p-12 shadow-2xl text-white overflow-hidden relative'>
						<div className='absolute top-0 left-0 w-full h-1 bg-amber-400'></div>
						<table className='w-full'>
							<thead>
								<tr className='border-b border-white/10'>
									<th className='pb-6 text-left font-bold text-lg'>
										Advantage
									</th>
									<th className='pb-6 text-center font-bold text-amber-400'>
										LoanHub
									</th>
									<th className='pb-6 text-center font-bold text-blue-300'>
										Banks
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-white/5'>
								{[
									{ label: "Approval Time", hub: "Minutes", bank: "2-3 Weeks" },
									{ label: "Hidden Fees", hub: "Zero", bank: "Standard" },
									{
										label: "24/7 Support",
										hub: "Included",
										bank: "Phone Only",
									},
									{ label: "Min. Credit", hub: "580", bank: "680+" },
								].map((row, i) => (
									<tr key={i} className='group'>
										<td className='py-6 font-medium text-blue-100'>
											{row.label}
										</td>
										<td className='py-6 text-center font-black text-white'>
											{row.hub}
										</td>
										<td className='py-6 text-center text-blue-300/60'>
											{row.bank}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
}
