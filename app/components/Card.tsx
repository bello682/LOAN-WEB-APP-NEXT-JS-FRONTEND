// "use client";

// import { motion } from "framer-motion";
// import React from "react";

// interface CardProps {
// 	children: React.ReactNode;
// 	className?: string;
// 	hover?: boolean;
// 	onClick?: () => void;
// }

// export const Card: React.FC<CardProps> = ({
// 	children,
// 	className = "",
// 	hover = true,
// 	onClick,
// }) => {
// 	return (
// 		<motion.div
// 			whileHover={
// 				hover ? { y: -8, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" } : {}
// 			}
// 			transition={{ type: "spring", stiffness: 300, damping: 30 }}
// 			onClick={onClick}
// 			className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${
// 				hover ? "cursor-pointer" : ""
// 			} ${className}`}>
// 			{children}
// 		</motion.div>
// 	);
// };
"use client";

import { motion } from "framer-motion";
import React from "react";

interface CardProps {
	children: React.ReactNode;
	className?: string;
	hover?: boolean;
	variant?: "white" | "navy" | "glass";
	onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
	children,
	className = "",
	hover = true,
	variant = "white",
	onClick,
}) => {
	const variants = {
		white: "bg-white border-gray-100 boxShadow-[0_8px_30px_rgb(0,0,0,0.04)]",
		navy: "bg-[#002D62] text-white border-white/10 shadow-xl",
		glass: "bg-white/80 backdrop-blur-md border-white shadow-2xl",
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			whileHover={
				hover
					? {
							y: -10,
							// Use boxShadow instead of shadow
							boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
							borderColor: variant === "white" ? "#EBB04D" : "transparent",
						}
					: {}
			}
			transition={{ type: "spring", stiffness: 260, damping: 20 }}
			onClick={onClick}
			// Added 'group' class so children can react to parent hover
			className={`
                relative p-8 rounded-[2rem] border transition-colors group
                ${variants[variant]} 
                ${hover ? "cursor-pointer" : ""} 
                ${className}
            `}>
			{/* Subtle brand accent - Now visible because of 'group-hover' */}
			{variant === "white" && hover && (
				<div className='absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#EBB04D] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity' />
			)}

			{children}
		</motion.div>
	);
};
