// "use client";

// import { ThemeProvider } from "next-themes";
// import { ReactNode } from "react";

// export function ClientThemeProvider({ children }: { children: ReactNode }) {
// 	return (
// 		<ThemeProvider attribute='class' defaultTheme='light' enableSystem>
// 			{children}
// 		</ThemeProvider>
// 	);
// }

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
	isDark: false,
	toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const [isDark, setIsDark] = useState(false);

	// On mount, check local storage or system preference
	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (
			savedTheme === "dark" ||
			(!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
		) {
			setIsDark(true);
			document.documentElement.classList.add("dark");
		}
	}, []);

	const toggleTheme = () => {
		if (isDark) {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		} else {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		}
		setIsDark(!isDark);
	};

	return (
		<ThemeContext.Provider value={{ isDark, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
