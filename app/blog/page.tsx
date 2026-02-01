// "use client";

// import { motion } from "framer-motion";
// import type { Variants } from "framer-motion";
// import { Navigation, Footer, Card } from "@/app/components";
// import { Calendar, User, ArrowRight } from "lucide-react";

// export default function Blog() {
// 	const blogPosts = [
// 		{
// 			title: "5 Tips to Improve Your Credit Score",
// 			author: "Sarah Williams",
// 			date: "January 15, 2026",
// 			category: "Credit",
// 			excerpt:
// 				"Learn proven strategies to boost your credit score and get better loan rates.",
// 			image: "📊",
// 		},
// 		{
// 			title: "The Complete Guide to Personal Loans",
// 			author: "Mike Johnson",
// 			date: "January 10, 2026",
// 			category: "Loans",
// 			excerpt:
// 				"Everything you need to know about personal loans, from application to repayment.",
// 			image: "💰",
// 		},
// 		{
// 			title: "Home Buying in 2026: What You Need to Know",
// 			author: "Emily Chen",
// 			date: "January 8, 2026",
// 			category: "Home",
// 			excerpt:
// 				"Current mortgage rates and tips for first-time homebuyers in the real estate market.",
// 			image: "🏠",
// 		},
// 		{
// 			title: "Understanding Loan Interest Rates",
// 			author: "John Smith",
// 			date: "January 5, 2026",
// 			category: "Education",
// 			excerpt:
// 				"A comprehensive guide to how interest rates work and what affects your APR.",
// 			image: "📈",
// 		},
// 		{
// 			title: "Starting a Business? Here's Our Loan Guide",
// 			author: "Lisa Anderson",
// 			date: "December 28, 2025",
// 			category: "Business",
// 			excerpt:
// 				"Everything entrepreneurs need to know about business loans and financing.",
// 			image: "🚀",
// 		},
// 		{
// 			title: "Debt Consolidation: Is It Right for You?",
// 			author: "Robert Davis",
// 			date: "December 22, 2025",
// 			category: "Finance",
// 			excerpt:
// 				"Explore whether consolidating your debts is the right financial decision.",
// 			image: "💳",
// 		},
// 	];

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
// 						className='text-center mb-16'>
// 						<h1 className='text-5xl sm:text-6xl font-bold mb-6'>Blog</h1>
// 						<p className='text-xl text-gray-600 max-w-2xl mx-auto'>
// 							Financial tips, loan guides, and expert insights to help you make
// 							better decisions
// 						</p>
// 					</motion.div>

// 					<motion.div
// 						variants={containerVariants}
// 						initial='hidden'
// 						animate='visible'
// 						className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
// 						{blogPosts.map((post, index) => (
// 							<motion.div key={index} variants={itemVariants}>
// 								<Card hover className='p-6 h-full flex flex-col'>
// 									<div className='text-5xl mb-4'>{post.image}</div>

// 									<div className='inline-block mb-3'>
// 										<span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold'>
// 											{post.category}
// 										</span>
// 									</div>

// 									<h3 className='text-xl font-bold mb-3 flex-grow'>
// 										{post.title}
// 									</h3>

// 									<p className='text-gray-600 text-sm mb-4'>{post.excerpt}</p>

// 									<div className='border-t pt-4 space-y-2 text-xs text-gray-500'>
// 										<div className='flex items-center gap-2'>
// 											<User size={14} />
// 											<span>{post.author}</span>
// 										</div>
// 										<div className='flex items-center gap-2'>
// 											<Calendar size={14} />
// 											<span>{post.date}</span>
// 										</div>
// 									</div>

// 									<div className='mt-4 flex items-center gap-2 text-blue-600 font-semibold hover:gap-4 transition-all'>
// 										Read More <ArrowRight size={16} />
// 									</div>
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

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Navigation, Footer, Card, Button } from "@/app/components";
import {
	Calendar,
	User,
	ArrowRight,
	Clock,
	Loader2,
	AlertCircle,
} from "lucide-react";
import LoadingOverlay from "../components/LoadingOverlay";

export default function Blog() {
	// --- LOADING & ERROR STATES ---
	const [isGlobalLoading, setIsGlobalLoading] = useState(false);
	const [showError, setShowError] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState(
		"Loading more articles...",
	);

	// --- TIMEOUT LOGIC ---
	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isGlobalLoading) {
			setShowError(false);
			timer = setTimeout(() => {
				setShowError(true);
			}, 5000);
		}
		return () => clearTimeout(timer);
	}, [isGlobalLoading]);

	const handlePaginationClick = (pageNum: number) => {
		setLoadingMessage(`Fetching page ${pageNum}...`);
		setIsGlobalLoading(true);
	};

	const handleCloseOverlay = () => {
		setIsGlobalLoading(false);
		setShowError(false);
	};

	const blogPosts = [
		{
			title: "5 Strategies to Boost Your Credit Score Fast",
			author: "Sarah Williams",
			date: "Jan 15, 2026",
			readTime: "6 min read",
			category: "Credit",
			excerpt:
				"Proven methods to improve your creditworthiness and unlock lower interest rates for your next major purchase.",
			image:
				"https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
		},
		{
			title: "The 2026 Guide to Personal Loan Consolidation",
			author: "Mike Johnson",
			date: "Jan 10, 2026",
			readTime: "8 min read",
			category: "Loans",
			excerpt:
				"Everything you need to know about merging high-interest debts into a single, manageable monthly payment.",
			image:
				"https://images.unsplash.com/photo-1573163281534-dd5a60c3f5b0?auto=format&fit=crop&q=80&w=800",
		},
		{
			title: "Market Outlook: Real Estate & Mortgage Trends",
			author: "Emily Chen",
			date: "Jan 8, 2026",
			readTime: "5 min read",
			category: "Home",
			excerpt:
				"An analysis of the current housing market and what first-time buyers should expect in the coming quarter.",
			image:
				"https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
		},
		{
			title: "Understanding APR vs. Interest Rates",
			author: "John Smith",
			date: "Jan 5, 2026",
			readTime: "4 min read",
			category: "Education",
			excerpt:
				"Don't be fooled by low teaser rates. We break down the true cost of borrowing and how to read the fine print.",
			image:
				"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
		},
		{
			title: "Financing Your Small Business Dreams",
			author: "Lisa Anderson",
			date: "Dec 28, 2025",
			readTime: "10 min read",
			category: "Business",
			excerpt:
				"From SBA loans to private lines of credit, explore the best capital sources for entrepreneurs in 2026.",
			image:
				"https://images.unsplash.com/photo-1664575602554-2087b04935a5?auto=format&fit=crop&q=80&w=800",
		},
		{
			title: "Financial Wellness: Managing Holiday Debt",
			author: "Robert Davis",
			date: "Dec 22, 2025",
			readTime: "7 min read",
			category: "Finance",
			excerpt:
				"Practical steps to recover your savings and balance your budget after the peak spending season.",
			image:
				"https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800",
		},
	];

	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1, delayChildren: 0.2 },
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { type: "spring", stiffness: 100 },
		},
	};

	return (
		<main className='bg-white overflow-x-hidden'>
			<Navigation />

			<LoadingOverlay
				isLoading={isGlobalLoading}
				message={loadingMessage}
				onClose={handleCloseOverlay}
			/>

			{/* Premium Blog Header */}
			<section className='pt-24 md:pt-32 pb-12 md:pb-16 px-4 bg-[#002D62]'>
				<div className='max-w-7xl mx-auto'>
					<div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-12 border-b border-white/10 pb-8 md:pb-12'>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							className='max-w-2xl'>
							<span className='text-amber-400 font-bold uppercase tracking-widest text-xs md:text-sm'>
								Expert Insights
							</span>
							<h1 className='text-4xl sm:text-5xl md:text-7xl font-black text-white mt-4 mb-4 md:mb-6 leading-tight'>
								The <span className='text-blue-400'>Knowledge</span> Hub
							</h1>
							<p className='text-blue-100/70 text-lg md:text-xl leading-relaxed'>
								Expert financial advice, loan guides, and market analysis to
								help you navigate your financial journey with confidence.
							</p>
						</motion.div>
						<div className='w-full md:w-auto flex gap-4'>
							<Button
								variant='outline'
								className='w-full md:w-auto border-white/20 text-white hover:bg-white hover:text-[#002D62] px-8'>
								Subscribe
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Post */}
			<section className='px-4 -mt-8 md:-mt-16 overflow-hidden'>
				<div className='max-w-7xl mx-auto'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='relative rounded-[24px] md:rounded-[40px] overflow-hidden bg-slate-900 aspect-[4/5] sm:aspect-square md:aspect-[21/9] min-h-[400px] shadow-2xl group cursor-pointer'>
						<img
							src='https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=2000'
							className='absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700'
							alt='Featured'
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-[#002D62] via-[#002D62]/60 to-transparent' />
						<div className='absolute bottom-0 left-0 p-6 sm:p-10 md:p-16 w-full max-w-3xl'>
							<span className='bg-amber-400 text-[#002D62] px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase mb-3 md:mb-4 inline-block'>
								Featured Article
							</span>
							<h2 className='text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 leading-tight'>
								The Future of Digital Banking: What to Expect in late 2026
							</h2>
							<div className='flex flex-wrap items-center gap-4 md:gap-6 text-white/80 text-xs md:text-sm'>
								<span className='flex items-center gap-2'>
									<User size={14} className='text-amber-400' /> By David Thorne
								</span>
								<span className='flex items-center gap-2'>
									<Clock size={14} className='text-amber-400' /> 12 min read
								</span>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Blog Feed */}
			<section className='py-16 md:py-24 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-7xl mx-auto'>
					<div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12'>
						<h2 className='text-2xl md:text-3xl font-black text-[#002D62]'>
							Recent Articles
						</h2>
						<div className='flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar'>
							{["All", "Loans", "Credit", "Business"].map((cat) => (
								<button
									key={cat}
									className='whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-[#002D62] hover:text-white transition-all'>
									{cat}
								</button>
							))}
						</div>
					</div>

					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10'>
						{blogPosts.map((post, index) => (
							<motion.div
								key={index}
								variants={itemVariants}
								className='group h-full'>
								<Card className='p-0 overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col rounded-[24px] md:rounded-[32px]'>
									<div className='relative h-52 sm:h-64 overflow-hidden'>
										<img
											src={post.image}
											alt={post.title}
											className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
										/>
										<div className='absolute top-4 left-4'>
											<span className='bg-white/90 backdrop-blur-md text-[#002D62] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm'>
												{post.category}
											</span>
										</div>
									</div>
									<div className='p-6 md:p-8 flex flex-col flex-grow'>
										<div className='flex items-center gap-4 mb-4 text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest'>
											<span className='flex items-center gap-1.5'>
												<Calendar size={14} /> {post.date}
											</span>
											<span className='flex items-center gap-1.5'>
												<Clock size={14} /> {post.readTime}
											</span>
										</div>
										<h3 className='text-xl md:text-2xl font-black text-[#002D62] mb-3 md:mb-4 group-hover:text-blue-600 transition-colors leading-tight'>
											{post.title}
										</h3>
										<p className='text-slate-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3'>
											{post.excerpt}
										</p>
										<div className='pt-6 border-t border-slate-100 flex items-center justify-between mt-auto'>
											<div className='flex items-center gap-2'>
												<div className='w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-200 border-2 border-white overflow-hidden shrink-0'>
													<div className='w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600' />
												</div>
												<span className='text-[10px] md:text-xs font-bold text-slate-700 truncate max-w-[80px] sm:max-w-none'>
													{post.author}
												</span>
											</div>
											<div className='flex items-center gap-1 text-[#002D62] text-[10px] md:text-xs font-black uppercase tracking-wider group-hover:gap-3 transition-all cursor-pointer whitespace-nowrap'>
												Read Story{" "}
												<ArrowRight size={14} className='text-blue-600' />
											</div>
										</div>
									</div>
								</Card>
							</motion.div>
						))}
					</motion.div>

					{/* Pagination Buttons */}
					<div className='mt-16 md:mt-20 flex justify-center items-center gap-3 md:gap-4'>
						<Button
							variant='outline'
							className='rounded-xl w-10 h-10 md:w-12 md:h-12 p-0 border-slate-200 text-slate-400'
							disabled>
							1
						</Button>
						{[2, 3].map((num) => (
							<Button
								key={num}
								onClick={() => handlePaginationClick(num)}
								variant='outline'
								className='rounded-xl w-10 h-10 md:w-12 md:h-12 p-0 border-slate-200 hover:bg-[#002D62] hover:text-white transition-colors'>
								{num}
							</Button>
						))}
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
}
