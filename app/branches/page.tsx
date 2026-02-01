"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Navigation, Footer, Card, Button } from "@/app/components";
import { MapPin, Phone, Clock } from "lucide-react";

export default function Branches() {
	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.3,
			},
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

	const branches = [
		{
			city: "New York, NY",
			address: "123 Financial Street, New York, NY 10001",
			phone: "(212) 555-1000",
			hours: "Mon-Fri: 9AM-5PM, Sat: 10AM-2PM",
		},
		{
			city: "Los Angeles, CA",
			address: "456 Commerce Ave, Los Angeles, CA 90001",
			phone: "(213) 555-2000",
			hours: "Mon-Fri: 8AM-6PM, Sat: 10AM-3PM",
		},
		{
			city: "Chicago, IL",
			address: "789 Business Blvd, Chicago, IL 60601",
			phone: "(312) 555-3000",
			hours: "Mon-Fri: 9AM-5PM, Sat: 10AM-2PM",
		},
		{
			city: "Houston, TX",
			address: "321 Enterprise Drive, Houston, TX 77001",
			phone: "(713) 555-4000",
			hours: "Mon-Fri: 8AM-6PM, Sat: 10AM-3PM",
		},
		{
			city: "Miami, FL",
			address: "654 Capital Plaza, Miami, FL 33101",
			phone: "(305) 555-5000",
			hours: "Mon-Fri: 9AM-5PM, Sat: 10AM-2PM",
		},
		{
			city: "Seattle, WA",
			address: "987 Tech Street, Seattle, WA 98101",
			phone: "(206) 555-6000",
			hours: "Mon-Fri: 8AM-6PM, Sat: 10AM-3PM",
		},
	];

	return (
		<main>
			<Navigation />

			{/* Hero */}
			<section className='min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white'>
				<div className='max-w-7xl mx-auto'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-center mb-16'>
						<h1 className='text-5xl sm:text-6xl font-bold mb-6'>
							Our Branches
						</h1>
						<p className='text-xl text-gray-600 max-w-2xl mx-auto'>
							Visit our locations across the United States for personalized
							service
						</p>
					</motion.div>

					<motion.div
						variants={containerVariants}
						initial='hidden'
						animate='visible'
						className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{branches.map((branch, index) => (
							<motion.div key={index} variants={itemVariants}>
								<Card className='p-8 h-full'>
									<h3 className='text-2xl font-bold mb-6 text-blue-600'>
										{branch.city}
									</h3>

									<div className='space-y-4'>
										<div className='flex items-start gap-3'>
											<MapPin size={20} className='text-blue-600 mt-1' />
											<div>
												<p className='font-semibold mb-1'>Address</p>
												<p className='text-gray-600 text-sm'>
													{branch.address}
												</p>
											</div>
										</div>

										<div className='flex items-start gap-3'>
											<Phone size={20} className='text-blue-600 mt-1' />
											<div>
												<p className='font-semibold mb-1'>Phone</p>
												<a
													href={`tel:${branch.phone}`}
													className='text-blue-600 hover:underline text-sm'>
													{branch.phone}
												</a>
											</div>
										</div>

										<div className='flex items-start gap-3'>
											<Clock size={20} className='text-blue-600 mt-1' />
											<div>
												<p className='font-semibold mb-1'>Hours</p>
												<p className='text-gray-600 text-sm'>{branch.hours}</p>
											</div>
										</div>
									</div>

									<Button variant='primary' fullWidth className='mt-6'>
										Get Directions
									</Button>
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
