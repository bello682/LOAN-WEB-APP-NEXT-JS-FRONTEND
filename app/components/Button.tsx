// 'use client';

// import { motion } from 'framer-motion';
// import React from 'react';

// interface ButtonProps {
//   children: React.ReactNode;
//   variant?: 'primary' | 'secondary' | 'outline';
//   size?: 'sm' | 'md' | 'lg';
//   fullWidth?: boolean;
//   onClick?: () => void;
//   href?: string;
//   className?: string;
//   disabled?: boolean;
// }

// export const Button: React.FC<ButtonProps> = ({
//   children,
//   variant = 'primary',
//   size = 'md',
//   fullWidth = false,
//   onClick,
//   href,
//   className = '',
//   disabled = false,
// }) => {
//   const baseClasses =
//     'font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

//   const variantClasses = {
//     primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg',
//     secondary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl focus:ring-blue-500',
//     outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
//   };

//   const sizeClasses = {
//     sm: 'px-4 py-2 text-sm',
//     md: 'px-6 py-3 text-base',
//     lg: 'px-8 py-4 text-lg',
//   };

//   const widthClass = fullWidth ? 'w-full' : '';

//   const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${
//     disabled ? 'opacity-50 cursor-not-allowed' : ''
//   } ${className}`;

//   const Component = href ? 'a' : 'button';

//   return (
//     <motion.div whileHover={{ scale: disabled ? 1 : 1.05 }} whileTap={{ scale: disabled ? 1 : 0.95 }}>
//       <Component href={href} onClick={onClick} className={buttonClasses} disabled={disabled}>
//         {children}
//       </Component>
//     </motion.div>
//   );
// };
"use client";

import { motion } from "framer-motion";
import React from "react";

interface ButtonProps {
	children: React.ReactNode;
	variant?: "primary" | "secondary" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
	fullWidth?: boolean;
	onClick?: () => void;
	href?: string;
	className?: string;
	disabled?: boolean;
	// ADDED: support for button types (submit, button, reset)
	type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
	children,
	variant = "primary",
	size = "md",
	fullWidth = false,
	onClick,
	href,
	className = "",
	disabled = false,
	type = "button", // Default to "button"
}) => {
	const baseClasses =
		"inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

	const variantClasses = {
		primary:
			"bg-[#002D62] text-white hover:bg-[#003d85] shadow-md active:scale-95",
		secondary:
			"bg-[#EBB04D] text-[#002D62] hover:bg-[#f5ba56] shadow-lg active:scale-95",
		outline:
			"border-2 border-[#002D62] text-[#002D62] hover:bg-[#002D62] hover:text-white",
		ghost: "text-[#002D62] hover:bg-gray-100 font-medium",
	};

	const sizeClasses = {
		sm: "px-4 py-2 text-xs uppercase tracking-widest",
		md: "px-6 py-3 text-sm uppercase tracking-wider",
		lg: "px-10 py-4 text-base uppercase tracking-widest",
	};

	const buttonClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${fullWidth ? "w-full" : ""} 
    ${variant === "ghost" ? "rounded-md" : "rounded-lg"} 
    ${className}
  `;

	const Component = href ? "a" : "button";

	return (
		<motion.div
			className={fullWidth ? "w-full" : "inline-block"}
			whileHover={!disabled ? { y: -2 } : {}}
			whileTap={!disabled ? { y: 0 } : {}}>
			<Component
				href={href}
				onClick={onClick}
				className={buttonClasses}
				// @ts-ignore
				disabled={disabled}
				// ADDED: pass the type prop here
				type={!href ? type : undefined}>
				{children}
			</Component>
		</motion.div>
	);
};
