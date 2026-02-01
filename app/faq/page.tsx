// "use client";

// import { motion } from "framer-motion";
// import type { Variants } from "framer-motion";
// import { Navigation, Footer, Card } from "@/app/components";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { useState } from "react";

// export default function FAQ() {
// 	const [openIndex, setOpenIndex] = useState<number | null>(0);

// 	const faqs = [
// 		{
// 			question: "How long does it take to get approved for a loan?",
// 			answer:
// 				"Most loan applications are approved within 24 hours. Our fast online process means you can get a decision as quickly as a few minutes in many cases. Once approved, funds can be deposited within 1-2 business days.",
// 		},
// 		{
// 			question: "What credit score do I need?",
// 			answer:
// 				"We work with borrowers of all credit profiles. While we typically prefer a minimum credit score of 580, we may approve applicants with lower scores depending on other factors like income and employment history.",
// 		},
// 		{
// 			question: "Are there any hidden fees?",
// 			answer:
// 				"No. We believe in complete transparency. All fees, charges, and terms are clearly disclosed upfront. What you see is what you pay - no surprises.",
// 		},
// 		{
// 			question: "Can I pay off my loan early?",
// 			answer:
// 				"Yes! You can pay off your loan at any time without penalty. Early repayment will save you money on interest charges.",
// 		},
// 		{
// 			question: "What documents do I need to apply?",
// 			answer:
// 				"Typically, you'll need a valid ID, proof of income (recent pay stubs or tax returns), and proof of residence. Specific requirements may vary based on the loan type.",
// 		},
// 		{
// 			question: "Is my personal information secure?",
// 			answer:
// 				"Absolutely. We use bank-level encryption and security measures to protect your data. Your privacy is our top priority.",
// 		},
// 		{
// 			question: "Do you offer refinancing options?",
// 			answer:
// 				"Yes, we offer refinancing for many loan types. Refinancing can help you get a lower rate or reduce your monthly payment.",
// 		},
// 		{
// 			question: "What happens if I miss a payment?",
// 			answer:
// 				"We understand that sometimes situations change. If you miss a payment, contact us immediately. We work with our customers to find solutions and avoid negative impacts on your credit.",
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
// 				<div className='max-w-4xl mx-auto'>
// 					<motion.div
// 						initial={{ opacity: 0, y: 20 }}
// 						animate={{ opacity: 1, y: 0 }}
// 						className='text-center mb-16'>
// 						<h1 className='text-5xl sm:text-6xl font-bold mb-6'>
// 							Frequently Asked Questions
// 						</h1>
// 						<p className='text-xl text-gray-600'>
// 							Find answers to common questions about our loans and services
// 						</p>
// 					</motion.div>

// 					{/* FAQs */}
// 					<motion.div
// 						variants={containerVariants}
// 						initial='hidden'
// 						animate='visible'
// 						className='space-y-4'>
// 						{faqs.map((faq, index) => (
// 							<motion.div key={index} variants={itemVariants}>
// 								<Card className='p-6'>
// 									<button
// 										onClick={() =>
// 											setOpenIndex(openIndex === index ? null : index)
// 										}
// 										className='w-full flex items-center justify-between gap-4 text-left'>
// 										<h3 className='text-lg font-bold text-gray-900'>
// 											{faq.question}
// 										</h3>
// 										<motion.div
// 											animate={{ rotate: openIndex === index ? 180 : 0 }}
// 											transition={{ duration: 0.3 }}>
// 											{openIndex === index ? (
// 												<ChevronUp
// 													size={24}
// 													className='text-blue-600 flex-shrink-0'
// 												/>
// 											) : (
// 												<ChevronDown
// 													size={24}
// 													className='text-blue-600 flex-shrink-0'
// 												/>
// 											)}
// 										</motion.div>
// 									</button>

// 									<motion.div
// 										initial={{ opacity: 0, height: 0 }}
// 										animate={{
// 											opacity: openIndex === index ? 1 : 0,
// 											height: openIndex === index ? "auto" : 0,
// 										}}
// 										transition={{ duration: 0.3 }}
// 										className='overflow-hidden'>
// 										<p className='text-gray-600 pt-4 mt-4 border-t'>
// 											{faq.answer}
// 										</p>
// 									</motion.div>
// 								</Card>
// 							</motion.div>
// 						))}
// 					</motion.div>

// 					{/* Still Have Questions */}
// 					<motion.div
// 						initial={{ opacity: 0, y: 20 }}
// 						animate={{ opacity: 1, y: 0 }}
// 						transition={{ delay: 0.8 }}
// 						className='mt-16 text-center'>
// 						<Card className='p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200'>
// 							<h2 className='text-2xl font-bold mb-2'>Still have questions?</h2>
// 							<p className='text-gray-600 mb-6'>
// 								Our customer support team is available 24/7 to help you with any
// 								inquiries
// 							</p>
// 							<motion.a
// 								whileHover={{ scale: 1.05 }}
// 								whileTap={{ scale: 0.95 }}
// 								href='/contact'
// 								className='inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
// 								Contact Us
// 							</motion.a>
// 						</Card>
// 					</motion.div>
// 				</div>
// 			</section>

// 			<Footer />
// 		</main>
// 	);
// }

"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Navigation, Footer, Card, Button } from "@/app/components";
import { Plus, Minus, MessageCircle, PhoneCall } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function FAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	const faqs = [
		{
			question: "How long does it take to get approved for a loan?",
			answer:
				"Most loan applications are approved within 24 hours. Our fast online process means you can get a decision as quickly as a few minutes in many cases. Once approved, funds can be deposited within 1-2 business days.",
		},
		{
			question: "What credit score do I need for approval?",
			answer:
				"We work with borrowers of all credit profiles. While we typically prefer a minimum credit score of 580, we may approve applicants with lower scores depending on other factors like income and employment history.",
		},
		{
			question: "Are there any hidden fees or surprises?",
			answer:
				"No. We believe in complete transparency. All fees, charges, and terms are clearly disclosed upfront in your Loan Agreement. What you see is what you pay - no hidden maintenance or processing surprises.",
		},
		{
			question: "Can I pay off my loan early without penalties?",
			answer:
				"Yes! You can pay off your loan at any time without any prepayment penalties. In fact, early repayment is encouraged as it will save you money on total interest charges.",
		},
		{
			question: "What documents do I need to apply?",
			answer:
				"Typically, you'll need a valid government-issued ID, proof of income (recent pay stubs or tax returns), and proof of residence. Specific requirements may vary based on your specific loan type.",
		},
		{
			question: "Is my personal and financial information secure?",
			answer:
				"Absolutely. We use bank-level AES-256 encryption and advanced security measures to protect your data. Your privacy is our top priority, and we never sell your data to third parties.",
		},
	];

	return (
		<main className='bg-white'>
			<Navigation />

			{/* Premium Hero Section */}
			<section className='pt-40 pb-20 px-4 sm:px-6 lg:px-8 bg-[#002D62] relative overflow-hidden'>
				{/* Abstract Background Element to make it look "Real" */}
				<div className='absolute top-0 right-0 w-1/3 h-full bg-[#EBB04D]/10 skew-x-12 translate-x-20' />

				<div className='max-w-4xl mx-auto relative z-10 text-center'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}>
						<span className='text-[#EBB04D] font-bold tracking-widest uppercase text-sm mb-4 block'>
							Support Center
						</span>
						<h1 className='text-4xl sm:text-6xl font-black text-white mb-6 leading-tight'>
							Common Questions
						</h1>
						<p className='text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed'>
							Everything you need to know about our lending process, security,
							and repayment options.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Accordion Section */}
			<section className='py-24 px-4 bg-gray-50'>
				<div className='max-w-3xl mx-auto'>
					<div className='space-y-4'>
						{faqs.map((faq, index) => {
							const isOpen = openIndex === index;
							return (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.05 }}>
									<button
										onClick={() => setOpenIndex(isOpen ? null : index)}
										className={`w-full text-left p-6 rounded-2xl transition-all duration-300 flex items-start gap-4 ${
											isOpen
												? "bg-white shadow-xl shadow-blue-900/5 ring-1 ring-blue-100"
												: "bg-white/60 hover:bg-white border border-transparent"
										}`}>
										<div
											className={`mt-1 p-1 rounded-md transition-colors ${isOpen ? "bg-[#EBB04D] text-white" : "bg-gray-100 text-[#002D62]"}`}>
											{isOpen ? (
												<Minus size={18} strokeWidth={3} />
											) : (
												<Plus size={18} strokeWidth={3} />
											)}
										</div>
										<div>
											<h3
												className={`text-lg font-bold transition-colors ${isOpen ? "text-[#002D62]" : "text-gray-700"}`}>
												{faq.question}
											</h3>
											<AnimatePresence>
												{isOpen && (
													<motion.div
														initial={{ opacity: 0, height: 0 }}
														animate={{ opacity: 1, height: "auto" }}
														exit={{ opacity: 0, height: 0 }}
														className='overflow-hidden'>
														<p className='text-gray-600 mt-4 leading-relaxed border-t border-gray-100 pt-4'>
															{faq.answer}
														</p>
													</motion.div>
												)}
											</AnimatePresence>
										</div>
									</button>
								</motion.div>
							);
						})}
					</div>

					{/* High-Fidelity Support Section */}
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						className='mt-20 grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='p-8 rounded-3xl bg-[#002D62] text-white relative overflow-hidden group'>
							<div className='absolute -bottom-4 -right-4 text-white/10 group-hover:scale-110 transition-transform'>
								<MessageCircle size={120} />
							</div>
							<h4 className='text-xl font-bold mb-2'>Live Chat</h4>
							<p className='text-blue-100/80 mb-6 text-sm'>
								Average response time: 2 minutes
							</p>
							<Link href='/chat' className='w-full sm:w-auto'>
								<Button className='bg-[#EBB04D] text-[#002D62] font-bold hover:bg-white transition-colors border-none h-12 w-full'>
									Start Chatting
								</Button>
							</Link>
						</div>

						<div className='p-8 rounded-3xl bg-white border-2 border-gray-100 text-[#002D62] relative overflow-hidden group'>
							<div className='absolute -bottom-4 -right-4 text-gray-50 group-hover:scale-110 transition-transform'>
								<PhoneCall size={120} />
							</div>
							<h4 className='text-xl font-bold mb-2'>Call Center</h4>
							<p className='text-gray-500 mb-6 text-sm'>
								Mon - Fri • 8:00 AM - 8:00 PM
							</p>
							<Button className='bg-[#002D62] text-white font-bold hover:bg-[#003a7d] transition-colors h-12'>
								1-800-LOANHUB
							</Button>
						</div>
					</motion.div>
				</div>
			</section>

			<Footer />
		</main>
	);
}
