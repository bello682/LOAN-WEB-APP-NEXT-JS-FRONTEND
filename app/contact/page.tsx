// "use client";

// import { motion } from "framer-motion";
// import { Navigation, Footer, Card, Button } from "@/app/components";
// import { Mail, Phone, MapPin } from "lucide-react";
// import { useState } from "react";

// export default function Contact() {
// 	const [formData, setFormData] = useState({
// 		name: "",
// 		email: "",
// 		phone: "",
// 		subject: "",
// 		message: "",
// 	});

// 	const handleChange = (
// 		e: React.ChangeEvent<
// 			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
// 		>,
// 	) => {
// 		setFormData({
// 			...formData,
// 			[e.target.name]: e.target.value,
// 		});
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
// 						<h1 className='text-5xl sm:text-6xl font-bold mb-6'>Contact Us</h1>
// 						<p className='text-xl text-gray-600 max-w-2xl mx-auto'>
// 							Have a question? We'd love to hear from you. Get in touch with our
// 							team.
// 						</p>
// 					</motion.div>

// 					<div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
// 						{/* Contact Info */}
// 						<motion.div
// 							initial={{ opacity: 0, x: -20 }}
// 							animate={{ opacity: 1, x: 0 }}
// 							transition={{ delay: 0.2 }}
// 							className='space-y-8'>
// 							<Card className='p-8'>
// 								<div className='flex items-start gap-4 mb-6'>
// 									<div className='w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center'>
// 										<Phone size={24} className='text-white' />
// 									</div>
// 									<div>
// 										<h3 className='text-xl font-bold mb-2'>Phone</h3>
// 										<p className='text-gray-600'>1-800-LOANHUB</p>
// 										<p className='text-gray-600'>Mon-Fri: 8AM-8PM EST</p>
// 									</div>
// 								</div>
// 							</Card>

// 							<Card className='p-8'>
// 								<div className='flex items-start gap-4 mb-6'>
// 									<div className='w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center'>
// 										<Mail size={24} className='text-white' />
// 									</div>
// 									<div>
// 										<h3 className='text-xl font-bold mb-2'>Email</h3>
// 										<p className='text-gray-600'>support@loanhub.com</p>
// 										<p className='text-gray-600'>Response within 24 hours</p>
// 									</div>
// 								</div>
// 							</Card>

// 							<Card className='p-8'>
// 								<div className='flex items-start gap-4 mb-6'>
// 									<div className='w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center'>
// 										<MapPin size={24} className='text-white' />
// 									</div>
// 									<div>
// 										<h3 className='text-xl font-bold mb-2'>Address</h3>
// 										<p className='text-gray-600'>123 Financial Street</p>
// 										<p className='text-gray-600'>New York, NY 10001, USA</p>
// 									</div>
// 								</div>
// 							</Card>
// 						</motion.div>

// 						{/* Contact Form */}
// 						<motion.div
// 							initial={{ opacity: 0, x: 20 }}
// 							animate={{ opacity: 1, x: 0 }}
// 							transition={{ delay: 0.3 }}>
// 							<Card className='p-8'>
// 								<h2 className='text-2xl font-bold mb-6'>Send us a Message</h2>
// 								<form className='space-y-6'>
// 									<div>
// 										<label className='block text-sm font-semibold mb-2'>
// 											Name *
// 										</label>
// 										<input
// 											type='text'
// 											name='name'
// 											value={formData.name}
// 											onChange={handleChange}
// 											className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
// 											placeholder='Your name'
// 										/>
// 									</div>

// 									<div>
// 										<label className='block text-sm font-semibold mb-2'>
// 											Email *
// 										</label>
// 										<input
// 											type='email'
// 											name='email'
// 											value={formData.email}
// 											onChange={handleChange}
// 											className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
// 											placeholder='your@email.com'
// 										/>
// 									</div>

// 									<div>
// 										<label className='block text-sm font-semibold mb-2'>
// 											Phone
// 										</label>
// 										<input
// 											type='tel'
// 											name='phone'
// 											value={formData.phone}
// 											onChange={handleChange}
// 											className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
// 											placeholder='(555) 000-0000'
// 										/>
// 									</div>

// 									<div>
// 										<label className='block text-sm font-semibold mb-2'>
// 											Subject *
// 										</label>
// 										<select
// 											name='subject'
// 											value={formData.subject}
// 											onChange={handleChange}
// 											className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
// 											<option>Select a subject</option>
// 											<option>Loan Application</option>
// 											<option>Account Support</option>
// 											<option>General Inquiry</option>
// 											<option>Complaint</option>
// 										</select>
// 									</div>

// 									<div>
// 										<label className='block text-sm font-semibold mb-2'>
// 											Message *
// 										</label>
// 										<textarea
// 											name='message'
// 											value={formData.message}
// 											onChange={handleChange}
// 											rows={5}
// 											className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
// 											placeholder='Your message here...'
// 										/>
// 									</div>

// 									<Button variant='primary' fullWidth>
// 										Send Message
// 									</Button>
// 								</form>
// 							</Card>
// 						</motion.div>
// 					</div>
// 				</div>
// 			</section>

// 			<Footer />
// 		</main>
// 	);
// }

"use client";

import { motion } from "framer-motion";
import { Navigation, Footer, Card, Button } from "@/app/components";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Contact() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		subject: "General Inquiry",
		message: "",
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<main className='bg-white'>
			<Navigation />

			{/* Hero Section */}
			<section className='pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f0f7ff] to-white'>
				<div className='max-w-7xl mx-auto text-center'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='mb-16'>
						<h1 className='text-5xl sm:text-6xl font-black text-[#002D62] mb-6'>
							Contact Us
						</h1>
						<p className='text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed'>
							Have questions about our loan products? Our dedicated team is here
							to help you secure your financial future.
						</p>
					</motion.div>

					<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 text-left'>
						{/* Contact Info Cards */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
							className='space-y-6'>
							{[
								{
									icon: Phone,
									title: "Phone",
									detail: "1-800-LOANHUB",
									sub: "Mon-Fri: 8AM-8PM EST",
								},
								{
									icon: Mail,
									title: "Email",
									detail: "support@loanhub.com",
									sub: "Response within 24 hours",
								},
								{
									icon: MapPin,
									title: "Address",
									detail: "123 Financial Street",
									sub: "New York, NY 10001, USA",
								},
							].map((item, idx) => (
								<Card
									key={idx}
									className='p-8 border-none shadow-xl shadow-blue-900/5 hover:shadow-blue-900/10 transition-shadow bg-white rounded-2xl'>
									<div className='flex items-center gap-6'>
										<div className='w-14 h-14 bg-[#002D62] rounded-xl flex items-center justify-center shrink-0'>
											<item.icon size={28} className='text-white' />
										</div>
										<div>
											<h3 className='text-lg font-bold text-[#002D62]'>
												{item.title}
											</h3>
											<p className='text-[#002D62] font-semibold text-xl'>
												{item.detail}
											</p>
											<p className='text-gray-500 text-sm mt-1'>{item.sub}</p>
										</div>
									</div>
								</Card>
							))}
						</motion.div>

						{/* Contact Form */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3 }}>
							<Card className='p-10 border-none shadow-2xl shadow-blue-900/10 rounded-3xl bg-white'>
								<h2 className='text-2xl font-black text-[#002D62] mb-8'>
									Send us a Message
								</h2>
								<form
									className='space-y-5'
									onSubmit={(e) => e.preventDefault()}>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
										<div className='space-y-2'>
											<label className='text-xs font-bold uppercase tracking-wider text-gray-400 ml-1'>
												Full Name
											</label>
											<input
												type='text'
												name='name'
												onChange={handleChange}
												className='w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#002D62] outline-none transition-all'
												placeholder='John Doe'
											/>
										</div>
										<div className='space-y-2'>
											<label className='text-xs font-bold uppercase tracking-wider text-gray-400 ml-1'>
												Email Address
											</label>
											<input
												type='email'
												name='email'
												onChange={handleChange}
												className='w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#002D62] outline-none transition-all'
												placeholder='john@example.com'
											/>
										</div>
									</div>

									<div className='space-y-2'>
										<label className='text-xs font-bold uppercase tracking-wider text-gray-400 ml-1'>
											Subject
										</label>
										<select
											name='subject'
											onChange={handleChange}
											className='w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#002D62] outline-none transition-all appearance-none'>
											<option>Loan Application Inquiry</option>
											<option>Repayment Support</option>
											<option>General Question</option>
										</select>
									</div>

									<div className='space-y-2'>
										<label className='text-xs font-bold uppercase tracking-wider text-gray-400 ml-1'>
											Your Message
										</label>
										<textarea
											name='message'
											rows={4}
											onChange={handleChange}
											className='w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#002D62] outline-none transition-all'
											placeholder='How can we help you?'
										/>
									</div>

									<Button className='w-full h-16 bg-[#002D62] hover:bg-[#003a7d] text-white rounded-xl shadow-xl shadow-blue-900/20 transition-all duration-300 group mt-4 overflow-hidden relative'>
										<div className='flex items-center justify-center gap-3 relative z-10'>
											<span className='font-bold text-lg'>Send Message</span>
											<motion.div
												initial={{ x: 0 }}
												whileHover={{ x: 5 }}
												className='flex items-center'>
												<ArrowRight size={22} strokeWidth={2.5} />
											</motion.div>
										</div>
									</Button>
								</form>
							</Card>
						</motion.div>
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
}
