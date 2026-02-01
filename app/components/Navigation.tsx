// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { Menu, X, ChevronDown } from "lucide-react";

// export const Navigation = () => {
// 	const [isOpen, setIsOpen] = useState(false);
// 	const [scrolled, setScrolled] = useState(false);

// 	// Handle scroll effect for a "real" sticky header feel
// 	useEffect(() => {
// 		const handleScroll = () => setScrolled(window.scrollY > 20);
// 		window.addEventListener("scroll", handleScroll);
// 		return () => window.removeEventListener("scroll", handleScroll);
// 	}, []);

// 	const navItems = [
// 		{ label: "Home", href: "/" },
// 		{ label: "About Us", href: "/about" },
// 		{ label: "Resources", href: "/resources", hasDropdown: true },
// 		{ label: "Blog", href: "/blog" },
// 	];

// 	return (
// 		<nav
// 			className={`fixed w-full z-50 transition-all duration-300 ${
// 				scrolled
// 					? "bg-white shadow-md py-3"
// 					: "bg-white/90 backdrop-blur-md py-5"
// 			}`}>
// 			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
// 				<div className='flex justify-between items-center'>
// 					{/* Brand Logo - Matched to Mockup */}
// 					<Link href='/' className='flex items-center gap-2 group'>
// 						<div className='w-10 h-10 bg-[#002D62] rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform'>
// 							<div className='w-5 h-5 bg-[#EBB04D] rounded-sm rotate-45' />
// 						</div>
// 						<span className='text-2xl font-black text-[#002D62] tracking-tight'>
// 							Loan<span className='text-[#EBB04D]'>Example</span>
// 						</span>
// 					</Link>

// 					{/* Desktop Links - Pro Spacing */}
// 					<div className='hidden md:flex items-center gap-10'>
// 						{navItems.map((item) => (
// 							<Link
// 								key={item.label}
// 								href={item.href}
// 								className='text-[#002D62] font-semibold text-sm hover:text-[#EBB04D] transition-colors flex items-center gap-1'>
// 								{item.label}
// 								{item.hasDropdown && <ChevronDown size={14} />}
// 							</Link>
// 						))}
// 					</div>

// 					{/* CTA Buttons - Using the exact Deep Navy from your image */}
// 					<div className='hidden md:flex items-center gap-4'>
// 						<Link
// 							href='/login'
// 							className='text-[#002D62] font-bold text-sm px-4 py-2 hover:opacity-70 transition-opacity'>
// 							Sign In
// 						</Link>
// 						<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
// 							<Link
// 								href='/apply'
// 								className='bg-[#002D62] text-white px-7 py-2.5 rounded-md font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-[#003a7d] transition-all'>
// 								Apply Now
// 							</Link>
// 						</motion.div>
// 					</div>

// 					{/* Mobile Toggle */}
// 					<button
// 						className='md:hidden text-[#002D62]'
// 						onClick={() => setIsOpen(!isOpen)}>
// 						{isOpen ? <X size={28} /> : <Menu size={28} />}
// 					</button>
// 				</div>
// 			</div>

// 			{/* Mobile Menu - Clean Slide Down */}
// 			<AnimatePresence>
// 				{isOpen && (
// 					<motion.div
// 						initial={{ opacity: 0, y: -20 }}
// 						animate={{ opacity: 1, y: 0 }}
// 						exit={{ opacity: 0, y: -20 }}
// 						className='absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl md:hidden'>
// 						<div className='flex flex-col p-6 gap-4'>
// 							{navItems.map((item) => (
// 								<Link
// 									key={item.label}
// 									href={item.href}
// 									className='text-lg font-bold text-[#002D62]'
// 									onClick={() => setIsOpen(false)}>
// 									{item.label}
// 								</Link>
// 							))}
// 							<hr className='border-gray-100' />
// 							<Link
// 								href='/apply'
// 								className='bg-[#002D62] text-white w-full py-4 rounded-xl text-center font-bold'
// 								onClick={() => setIsOpen(false)}>
// 								Apply Now
// 							</Link>
// 						</div>
// 					</motion.div>
// 				)}
// 			</AnimatePresence>
// 		</nav>
// 	);
// };

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Resources", href: "/resources", hasDropdown: true },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md py-3"
          : "bg-white/90 backdrop-blur-md py-4 md:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-[#002D62] rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-[#EBB04D] rounded-sm rotate-45" />
            </div>
            <span className="text-xl md:text-2xl font-black text-[#002D62] tracking-tight">
              Loan<span className="text-[#EBB04D]">Example</span>
            </span>
          </Link>

          {/* Desktop/Tablet Links */}
          <div className="hidden md:flex items-center md:gap-4 lg:gap-10">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[#002D62] font-semibold text-sm hover:text-[#EBB04D] transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown size={14} />}
              </Link>
            ))}
          </div>

          {/* CTA Buttons - Visible on Desktop and Tablet (md and up) */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <Link
              href="/login"
              className="text-[#002D62] font-bold text-sm px-3 py-2 hover:text-[#EBB04D] transition-colors"
            >
              Sign In
            </Link>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/apply"
                className="bg-[#002D62] text-white px-5 lg:px-7 py-2.5 rounded-md font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-[#003a7d] transition-all whitespace-nowrap"
              >
                Apply Now
              </Link>
            </motion.div>
          </div>

          {/* Mobile Controls (below 768px) */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/login"
              className="text-[#002D62] font-bold text-xs px-2 py-1"
            >
              Sign In
            </Link>
            <button
              className="text-[#002D62] p-1"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-2xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-lg font-bold text-[#002D62] py-3 border-b border-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 mt-4">
                {/* Prominent Apply Button in Mobile Menu */}
                <Link
                  href="/apply"
                  className="bg-[#002D62] text-white w-full py-4 rounded-xl text-center font-bold shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Apply Now
                </Link>
                {/* Secondary Sign In in Mobile Menu */}
                <Link
                  href="/signup"
                  className="text-center font-bold text-gray-500 py-2 text-sm underline underline-offset-4"
                  onClick={() => setIsOpen(false)}
                >
                  Already have an account? Sign Un
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
