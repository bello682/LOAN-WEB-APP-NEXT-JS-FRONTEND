// "use client";

// import { motion } from "framer-motion";
// import Link from "next/link";
// import {
// 	Mail,
// 	Phone,
// 	MapPin,
// 	Facebook,
// 	Twitter,
// 	Linkedin,
// 	Instagram,
// } from "lucide-react";

// export const Footer = () => {
// 	const containerVariants = {
// 		hidden: { opacity: 0 },
// 		visible: {
// 			opacity: 1,
// 			transition: {
// 				staggerChildren: 0.1,
// 				delayChildren: 0.2,
// 			},
// 		},
// 	};

// 	const itemVariants = {
// 		hidden: { opacity: 0, y: 20 },
// 		visible: {
// 			opacity: 1,
// 			y: 0,
// 			transition: { type: "spring", stiffness: 100 } as const,
// 		},
// 	};

// 	return (
// 		<footer className='bg-gradient-to-b from-gray-900 to-black text-white pt-20 pb-10'>
// 			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
// 				<motion.div
// 					variants={containerVariants}
// 					initial='hidden'
// 					whileInView='visible'
// 					viewport={{ once: true }}
// 					className='grid grid-cols-1 md:grid-cols-4 gap-12 mb-12'>
// 					{/* Company Info */}
// 					<motion.div variants={itemVariants}>
// 						<h3 className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4'>
// 							LoanHub
// 						</h3>
// 						<p className='text-gray-400 text-sm leading-relaxed'>
// 							Your trusted financial partner for personal and business loans.
// 							Fast approval, transparent terms, and excellent customer service.
// 						</p>
// 					</motion.div>

// 					{/* Quick Links */}
// 					<motion.div variants={itemVariants}>
// 						<h4 className='text-lg font-bold mb-4'>Quick Links</h4>
// 						<ul className='space-y-2 text-sm text-gray-400'>
// 							<li>
// 								<Link
// 									href='/about'
// 									className='hover:text-blue-400 transition-colors'>
// 									About Us
// 								</Link>
// 							</li>
// 							<li>
// 								<Link
// 									href='/loan-products'
// 									className='hover:text-blue-400 transition-colors'>
// 									Loan Products
// 								</Link>
// 							</li>
// 							<li>
// 								<Link
// 									href='/calculator'
// 									className='hover:text-blue-400 transition-colors'>
// 									Loan Calculator
// 								</Link>
// 							</li>
// 							<li>
// 								<Link
// 									href='/blog'
// 									className='hover:text-blue-400 transition-colors'>
// 									Blog
// 								</Link>
// 							</li>
// 						</ul>
// 					</motion.div>

// 					{/* Support */}
// 					<motion.div variants={itemVariants}>
// 						<h4 className='text-lg font-bold mb-4'>Support</h4>
// 						<ul className='space-y-2 text-sm text-gray-400'>
// 							<li>
// 								<Link
// 									href='/contact'
// 									className='hover:text-blue-400 transition-colors'>
// 									Contact Us
// 								</Link>
// 							</li>
// 							<li>
// 								<Link
// 									href='/faq'
// 									className='hover:text-blue-400 transition-colors'>
// 									FAQ
// 								</Link>
// 							</li>
// 							<li>
// 								<a href='#' className='hover:text-blue-400 transition-colors'>
// 									Privacy Policy
// 								</a>
// 							</li>
// 							<li>
// 								<a href='#' className='hover:text-blue-400 transition-colors'>
// 									Terms & Conditions
// 								</a>
// 							</li>
// 						</ul>
// 					</motion.div>

// 					{/* Contact Info */}
// 					<motion.div variants={itemVariants}>
// 						<h4 className='text-lg font-bold mb-4'>Contact</h4>
// 						<ul className='space-y-3 text-sm'>
// 							<li className='flex items-center gap-2 text-gray-400'>
// 								<Phone size={16} className='text-blue-400' />
// 								<span>1-800-LOANHUB</span>
// 							</li>
// 							<li className='flex items-center gap-2 text-gray-400'>
// 								<Mail size={16} className='text-blue-400' />
// 								<span>support@loanhub.com</span>
// 							</li>
// 							<li className='flex items-start gap-2 text-gray-400'>
// 								<MapPin size={16} className='text-blue-400 mt-1' />
// 								<span>123 Financial St, NY 10001, USA</span>
// 							</li>
// 						</ul>
// 					</motion.div>
// 				</motion.div>

// 				{/* Social Links */}
// 				<motion.div
// 					variants={itemVariants}
// 					initial='hidden'
// 					whileInView='visible'
// 					viewport={{ once: true }}
// 					className='border-t border-gray-800 pt-8 mb-8'>
// 					<div className='flex justify-center gap-6'>
// 						{[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
// 							<motion.a
// 								key={index}
// 								href='#'
// 								whileHover={{ scale: 1.2, color: "#60a5fa" }}
// 								className='p-2 rounded-full bg-gray-800 hover:bg-blue-600 transition-colors'>
// 								<Icon size={20} />
// 							</motion.a>
// 						))}
// 					</div>
// 				</motion.div>

// 				{/* Bottom */}
// 				<motion.div
// 					variants={itemVariants}
// 					initial='hidden'
// 					whileInView='visible'
// 					viewport={{ once: true }}
// 					className='text-center text-gray-400 text-sm'>
// 					<p>&copy; 2026 LoanHub Financial Services. All rights reserved.</p>
// 				</motion.div>
// 			</div>
// 		</footer>
// 	);
// };

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
	Mail,
	Phone,
	MapPin,
	Facebook,
	Twitter,
	Linkedin,
	Instagram,
} from "lucide-react";

export const Footer = () => {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { type: "spring", stiffness: 100 } as const,
		},
	};

	return (
		<footer className='bg-[#002D62] text-white pt-20 pb-10'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					className='grid grid-cols-1 md:grid-cols-4 gap-12 mb-12'>
					{/* Company Info - Updated to LoanExample */}
					<motion.div variants={itemVariants}>
						<h3 className='text-2xl font-bold mb-4'>
							Loan<span className='text-[#EBB04D]'>Example</span>
						</h3>
						<p className='text-gray-300 text-sm leading-relaxed'>
							Your trusted financial partner for personal and business loans.
							Fast approval, transparent terms, and excellent customer service.
						</p>
					</motion.div>

					{/* Quick Links - Added "Our Company" */}
					<motion.div variants={itemVariants}>
						<h4 className='text-lg font-bold mb-4'>Quick Links</h4>
						<ul className='space-y-2 text-sm text-gray-300'>
							<li>
								<Link
									href='/company'
									className='hover:text-[#EBB04D] transition-colors'>
									• Our Company
								</Link>
							</li>
							<li>
								<Link
									href='/loan-products'
									className='hover:text-[#EBB04D] transition-colors'>
									• Loan Products
								</Link>
							</li>
							<li>
								<Link
									href='/calculator'
									className='hover:text-[#EBB04D] transition-colors'>
									• Loan Calculator
								</Link>
							</li>
							<li>
								<Link
									href='/blog'
									className='hover:text-[#EBB04D] transition-colors'>
									• Blog
								</Link>
							</li>
						</ul>
					</motion.div>

					{/* Support */}
					<motion.div variants={itemVariants}>
						<h4 className='text-lg font-bold mb-4'>Support</h4>
						<ul className='space-y-2 text-sm text-gray-300'>
							<li>
								<Link
									href='/contact'
									className='hover:text-[#EBB04D] transition-colors'>
									• Contact Us
								</Link>
							</li>
							<li>
								<Link
									href='/faq'
									className='hover:text-[#EBB04D] transition-colors'>
									• FAQ
								</Link>
							</li>
							<li>
								<a
									href='/privacy'
									className='hover:text-[#EBB04D] transition-colors'>
									• Privacy Policy
								</a>
							</li>
						</ul>
					</motion.div>

					{/* Contact Info - Matched to Mockup Data */}
					<motion.div variants={itemVariants}>
						<h4 className='text-lg font-bold mb-4'>Get in Touch</h4>
						<ul className='space-y-3 text-sm'>
							<li className='flex items-center gap-2 text-gray-300'>
								<Phone size={16} className='text-[#EBB04D]' />
								<span>413 (083) 23 8807</span>
							</li>
							<li className='flex items-center gap-2 text-gray-300'>
								<Mail size={16} className='text-[#EBB04D]' />
								<span>info@loanexample.com</span>
							</li>
							<li className='flex items-start gap-2 text-gray-300'>
								<MapPin size={16} className='text-[#EBB04D] mt-1' />
								<span>123 Financial St, NY 10001</span>
							</li>
						</ul>
					</motion.div>
				</motion.div>

				{/* Social Links - Updated Hover Color */}
				<motion.div
					variants={itemVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					className='border-t border-white/10 pt-8 mb-8'>
					<div className='flex justify-center gap-6'>
						{[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
							<motion.a
								key={index}
								href='#'
								whileHover={{ scale: 1.2, color: "#EBB04D" }}
								className='p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors'>
								<Icon size={20} />
							</motion.a>
						))}
					</div>
				</motion.div>

				<motion.div
					variants={itemVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					className='text-center text-gray-400 text-xs'>
					<p>
						&copy; 2026 LoanExample Financial Services. All rights reserved.
					</p>
				</motion.div>
			</div>
		</footer>
	);
};
