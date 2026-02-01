import React from "react";
import { ShieldCheck, Lock, Eye, FileText, Scale } from "lucide-react";
import { Footer, Navigation } from "../components";

const PrivacyPolicy = () => {
	const lastUpdated = "October 24, 2023";

	return (
		<>
			<Navigation />
			{/* Added pt-20 (padding-top) to push content below the fixed navbar */}
			<div className='max-w-4xl mx-auto px-6 pt-24 pb-12 text-gray-800 dark:text-gray-200'>
				{/* Header */}
				<div className='mb-12 text-center'>
					<h1 className='text-4xl font-extrabold text-[#002D62] dark:text-white mb-4'>
						Privacy Policy
					</h1>
					<p className='text-sm text-gray-500'>Last Updated: {lastUpdated}</p>
				</div>

				<div className='space-y-10'>
					{/* Intro Section */}
					<section>
						<div className='flex items-center gap-2 mb-4'>
							<ShieldCheck className='text-[#EBB04D]' size={24} />
							<h2 className='text-2xl font-bold text-[#002D62] dark:text-white'>
								1. Our Commitment
							</h2>
						</div>
						<p className='leading-relaxed'>
							At LoanHub, we value your trust. This Privacy Policy explains how
							we collect, use, and protect your personal information when you
							apply for a loan or use our services. We use bank-grade encryption
							to ensure your financial data remains confidential.
						</p>
					</section>

					{/* Data Collection Table */}
					<section className='bg-gray-50 dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800'>
						<div className='flex items-center gap-2 mb-4'>
							<FileText className='text-[#EBB04D]' size={24} />
							<h2 className='text-2xl font-bold text-[#002D62] dark:text-white'>
								2. Information We Collect
							</h2>
						</div>
						<div className='overflow-x-auto'>
							<table className='w-full text-left border-collapse'>
								<thead>
									<tr className='border-b border-gray-200 dark:border-gray-700'>
										<th className='py-3 font-semibold'>Category</th>
										<th className='py-3 font-semibold'>Examples</th>
									</tr>
								</thead>
								<tbody className='text-sm'>
									<tr className='border-b border-gray-100 dark:border-gray-800'>
										<td className='py-3 font-medium'>Identity Data</td>
										<td className='py-3'>
											Full name, Date of Birth, SSN/ID Number.
										</td>
									</tr>
									<tr className='border-b border-gray-100 dark:border-gray-800'>
										<td className='py-3 font-medium'>Contact Data</td>
										<td className='py-3'>
											Email address, phone number, residential address.
										</td>
									</tr>
									<tr className='border-b border-gray-100 dark:border-gray-800'>
										<td className='py-3 font-medium'>Financial Data</td>
										<td className='py-3'>
											Bank statements, income details, credit history.
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</section>

					{/* Data Usage */}
					<section>
						<div className='flex items-center gap-2 mb-4'>
							<Eye className='text-[#EBB04D]' size={24} />
							<h2 className='text-2xl font-bold text-[#002D62] dark:text-white'>
								3. How We Use Your Data
							</h2>
						</div>
						<ul className='list-disc ml-6 space-y-2'>
							<li>
								To verify your identity and assess creditworthiness for loan
								approval.
							</li>
							<li>To process loan disbursements and manage repayments.</li>
							<li>
								To comply with anti-money laundering (AML) and "Know Your
								Customer" (KYC) regulations.
							</li>
							<li>To provide customer support through our 24/7 chat system.</li>
						</ul>
					</section>

					{/* Security */}
					<section className='border-l-4 border-[#EBB04D] pl-6 italic'>
						<div className='flex items-center gap-2 mb-2'>
							<Lock className='text-[#002D62] dark:text-[#EBB04D]' size={20} />
							<h3 className='font-bold text-lg'>Security Protocol</h3>
						</div>
						<p>
							We implement 256-bit SSL encryption and multi-factor
							authentication to protect your account. We never sell your
							personal financial data to third-party marketers.
						</p>
					</section>

					{/* Legal Rights */}
					<section>
						<div className='flex items-center gap-2 mb-4'>
							<Scale className='text-[#EBB04D]' size={24} />
							<h2 className='text-2xl font-bold text-[#002D62] dark:text-white'>
								4. Your Legal Rights
							</h2>
						</div>
						<p className='mb-4'>
							Depending on your location, you have the right to:
						</p>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg'>
								<span className='font-bold block mb-1'>Right to Access</span>
								Request a copy of the data we hold about you.
							</div>
							<div className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg'>
								<span className='font-bold block mb-1'>Right to Erasure</span>
								Request deletion of your data (subject to legal retention
								periods).
							</div>
						</div>
					</section>

					{/* Contact Info */}
					{/* <footer className='mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center'>
                    <p className='text-gray-600 dark:text-gray-400'>
                        Questions about this policy? Contact our Privacy Officer at:
                    </p>
                    <p className='font-bold text-[#002D62] dark:text-[#EBB04D] mt-2'>
                        legal@loanhub.com
                    </p>
                </footer> */}
				</div>
			</div>
			<Footer />
		</>
	);
};

export default PrivacyPolicy;
