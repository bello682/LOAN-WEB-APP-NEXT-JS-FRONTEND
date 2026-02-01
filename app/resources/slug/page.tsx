// app/resources/[slug]/page.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components";
import { ArrowLeft, Clock, Share2 } from "lucide-react";
import Link from "next/link";

export default function ArticlePage({ params }: { params: { slug: string } }) {
	// In a real app, you'd fetch the article data using the slug
	return (
		<main className='pt-32 pb-20 bg-white'>
			<div className='max-w-3xl mx-auto px-6'>
				<Link
					href='/resources'
					className='flex items-center gap-2 text-gray-400 hover:text-[#002D62] mb-10 transition-colors'>
					<ArrowLeft size={16} /> Back to Resources
				</Link>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}>
					<div className='flex items-center gap-4 mb-6 text-sm font-bold text-[#EBB04D] uppercase tracking-widest'>
						<span>Financial Education</span>
						<span className='w-1 h-1 bg-gray-300 rounded-full' />
						<span className='flex items-center gap-1 text-gray-400'>
							<Clock size={14} /> 5 min read
						</span>
					</div>

					<h1 className='text-4xl md:text-5xl font-black text-[#002D62] mb-8 leading-tight'>
						How to Optimize Your Credit for a 2026 Loan Application
					</h1>

					<div className='aspect-video bg-gray-100 rounded-[2rem] mb-10 overflow-hidden'>
						<img
							src='https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200'
							className='w-full h-full object-cover'
							alt='Article header'
						/>
					</div>

					<div className='prose prose-lg max-w-none text-gray-600 leading-relaxed'>
						<p className='mb-6'>
							Lending standards have shifted significantly this year. To secure
							the 4.99% APR rates advertised, your debt-to-income ratio and
							credit utilization need to be in peak condition...
						</p>
						<h2 className='text-2xl font-bold text-[#002D62] mt-10 mb-4'>
							1. Lower Your Utilization
						</h2>
						<p>
							Keep your credit card balances below 10% of their limits at least
							30 days before applying...
						</p>
					</div>

					<div className='mt-16 p-8 bg-gray-50 rounded-3xl flex items-center justify-between'>
						<div>
							<p className='font-bold text-[#002D62]'>Was this helpful?</p>
							<p className='text-sm text-gray-500'>
								Share this guide with your network.
							</p>
						</div>
						<div className='flex gap-2'>
							<Button variant='outline' size='sm' className='rounded-full'>
								<Share2 size={16} />
							</Button>
						</div>
					</div>
				</motion.div>
			</div>
		</main>
	);
}
