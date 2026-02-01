"use client";

import { motion } from "framer-motion";
import { Card, Button, Navigation, Footer } from "@/app/components";
import {
	BookOpen,
	Calculator,
	FileText,
	TrendingUp,
	ArrowRight,
	Download,
	Lightbulb,
	Star,
} from "lucide-react";
import Link from "next/link";

export default function ResourcesPage() {
	const resourceCategories = [
		{
			title: "Financial Guides",
			icon: BookOpen,
			description:
				"Deep dives into credit scores, debt consolidation, and financial planning.",
			count: "12 Guides",
			color: "bg-blue-50 text-blue-600",
			href: "/resources/guides",
		},
		{
			title: "Calculators",
			icon: Calculator,
			description:
				"Interactive tools to estimate monthly payments and interest savings.",
			count: "4 Tools",
			color: "bg-amber-50 text-amber-600",
			href: "/calculator",
		},
		{
			title: "Market Insights",
			icon: TrendingUp,
			description:
				"Stay updated with the latest interest rate trends and economic news.",
			count: "Weekly Updates",
			color: "bg-green-50 text-green-600",
			href: "/resources/market-news",
		},
	];

	const featuredArticles = [
		{
			tag: "Personal Finance",
			title: "How to Improve Your Credit Score in 60 Days",
			excerpt:
				"Practical steps you can take today to boost your score and secure better rates.",
			image:
				"https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400",
			slug: "improve-credit-score",
		},
		{
			tag: "Business",
			title: "Choosing the Right Loan for Your Small Business",
			excerpt:
				"Understanding the difference between term loans, SBA loans, and lines of credit.",
			image:
				"https://images.unsplash.com/photo-1454165833767-027ffeb99cbe?auto=format&fit=crop&q=80&w=400",
			slug: "business-loan-guide",
		},
		{
			tag: "Education",
			title: "The True Cost of Hidden Fees in Lending",
			excerpt:
				"What to look for in your loan agreement to ensure you aren't paying more than you think.",
			image:
				"https://images.unsplash.com/photo-1579621970795-87faff2f9070?auto=format&fit=crop&q=80&w=400",
			slug: "hidden-fees-guide",
		},
	];

	return (
		<main className='min-h-screen bg-white'>
			<Navigation />

			{/* Header Section */}
			<section className='bg-[#002D62] pt-40 pb-24 px-6 text-center relative overflow-hidden'>
				<div className='absolute inset-0 opacity-5'>
					<div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
				</div>

				<div className='max-w-4xl mx-auto relative z-10'>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-8'>
						<Star size={14} className='text-[#EBB04D] fill-[#EBB04D]' />
						<span className='text-xs font-bold text-white uppercase tracking-widest'>
							Trustworthy Financial Education
						</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter'>
						Knowledge <span className='text-[#EBB04D]'>Center</span>
					</motion.h1>
					<p className='text-xl text-blue-100/80 font-medium max-w-2xl mx-auto leading-relaxed'>
						Master your money with our professional-grade tools, expert-led
						guides, and the latest market intelligence.
					</p>
				</div>
			</section>

			{/* Category Grid */}
			<section className='py-20 px-6 max-w-7xl mx-auto -mt-12 relative z-20'>
				<div className='grid md:grid-cols-3 gap-8'>
					{resourceCategories.map((cat, i) => (
						<Card key={i} className='flex flex-col h-full group'>
							<div
								className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${cat.color}`}>
								<cat.icon size={28} />
							</div>
							<h3 className='text-2xl font-black text-[#002D62] mb-3'>
								{cat.title}
							</h3>
							<p className='text-gray-500 text-sm mb-8 flex-grow leading-relaxed'>
								{cat.description}
							</p>
							<div className='flex items-center justify-between pt-6 border-t border-gray-100'>
								<span className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>
									{cat.count}
								</span>
								<Button
									variant='ghost'
									size='sm'
									href={cat.href}
									className='text-[#002D62] p-0 font-black hover:text-[#EBB04D]'>
									Explore{" "}
									<ArrowRight
										size={16}
										className='ml-2 transition-transform group-hover:translate-x-1'
									/>
								</Button>
							</div>
						</Card>
					))}
				</div>
			</section>

			{/* Featured Articles Section */}
			<section className='py-24 px-6 max-w-7xl mx-auto bg-gray-50 rounded-[3rem] my-20'>
				<div className='flex flex-col md:flex-row justify-between items-end mb-16 gap-6'>
					<div>
						<h2 className='text-4xl font-black text-[#002D62] mb-3 uppercase tracking-tighter'>
							The Knowledge Base
						</h2>
						<p className='text-gray-500 text-lg font-medium'>
							Premium advice from our senior financial analysts.
						</p>
					</div>
					<Button
						variant='outline'
						className='border-[#002D62] text-[#002D62] hover:bg-[#002D62] hover:text-white'>
						View All Articles
					</Button>
				</div>

				<div className='grid md:grid-cols-3 gap-12'>
					{featuredArticles.map((post, i) => (
						<Link
							href={`/resources/${post.slug}`}
							key={i}
							className='group block'>
							<div className='aspect-video rounded-[2rem] overflow-hidden mb-8 relative shadow-xl'>
								<img
									src={post.image}
									alt={post.title}
									className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
								/>
								<div className='absolute top-6 left-6 bg-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-[#002D62] shadow-lg'>
									{post.tag}
								</div>
							</div>
							<h4 className='text-2xl font-black text-[#002D62] mb-4 group-hover:text-[#EBB04D] transition-colors leading-tight'>
								{post.title}
							</h4>
							<p className='text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2'>
								{post.excerpt}
							</p>
							<span className='text-[#002D62] font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all'>
								Full Story <ArrowRight size={14} className='text-[#EBB04D]' />
							</span>
						</Link>
					))}
				</div>
			</section>

			{/* Newsletter/Download Section */}
			<section className='py-24 px-6 max-w-7xl mx-auto'>
				<div className='bg-[#002D62] rounded-[4rem] p-12 md:p-20 overflow-hidden relative'>
					{/* Decorative Element */}
					<div className='absolute bottom-0 right-0 w-96 h-96 bg-[#EBB04D] rounded-full blur-[120px] opacity-10' />

					<div className='grid lg:grid-cols-2 gap-16 items-center relative z-10'>
						<div>
							<div className='inline-flex items-center gap-2 text-[#EBB04D] mb-6'>
								<FileText size={24} />
								<span className='font-black uppercase tracking-[0.2em] text-sm'>
									Exclusive Content
								</span>
							</div>
							<h2 className='text-4xl md:text-5xl font-black text-white mb-8 leading-tight'>
								The 2026 Borrowing Guide: <br />
								<span className='text-[#EBB04D] italic underline underline-offset-8 decoration-4'>
									Mastering Interest Rates
								</span>
							</h2>
							<p className='text-blue-100/70 mb-10 text-lg leading-relaxed max-w-md'>
								Join 50,000+ subscribers getting our free weekly guide on
								navigating the changing economy.
							</p>
							<Button
								variant='secondary'
								size='lg'
								className='h-16 px-10 shadow-2xl shadow-[#EBB04D]/20 gap-3'>
								<Download size={22} /> Get Your Free PDF
							</Button>
						</div>
						<div className='hidden lg:flex justify-end'>
							<motion.div
								whileHover={{ rotate: 0, scale: 1.05 }}
								className='w-72 h-96 bg-white rounded-[2rem] border-[12px] border-white/10 flex flex-col items-center justify-center -rotate-6 shadow-2xl relative'>
								<Lightbulb size={100} className='text-[#EBB04D] mb-6' />
								<div className='text-center px-6'>
									<p className='text-[#002D62] font-black text-xl leading-tight'>
										THE 2026 EDITION
									</p>
									<p className='text-gray-400 text-xs mt-2 uppercase font-bold tracking-widest'>
										LoanExample Press
									</p>
								</div>
							</motion.div>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
}
