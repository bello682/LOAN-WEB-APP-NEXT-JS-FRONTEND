import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./globals.markdown.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { StoreProvider } from "../components/StoreProvider";
import { Toaster } from "react-hot-toast";
import ChatNotification from "./components/ChatNotification"; // Import here
import ErrorGuard from "./components/ErrorGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoanHub - Fast & Easy Loans",
  description:
    "Get approved for personal, home, auto, and business loans in minutes. Competitive rates, transparent terms, 24/7 support.",
  icons: {
    icon: "/images/logo.jpg", // Correct: starts from the folder inside public
    shortcut: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors duration-200`}
      >
        <StoreProvider>
          <ErrorGuard />
          {/* The Notification Listener sits here globally */}
          <ChatNotification />

          <ThemeProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: {
                  borderRadius: "12px",
                  padding: "16px",
                  fontSize: "14px",
                  fontWeight: "500",
                },
                success: {
                  style: {
                    background: "#002D62",
                    color: "#FFFFFF",
                    border: "1px solid #EBB04D",
                  },
                  iconTheme: {
                    primary: "#EBB04D",
                    secondary: "#002D62",
                  },
                },
                error: {
                  style: {
                    background: "#FEF2F2",
                    color: "#991B1B",
                    border: "1px solid #FCA5A5",
                  },
                },
              }}
            />

            {children}
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
