"use client";
import { useEffect } from "react";

export default function ErrorGuard() {
  useEffect(() => {
    const isExtensionError = (error: any) => {
      const message = error?.message || "";
      const stack = error?.stack || "";
      const stringified = JSON.stringify(error || "");

      return (
        message.includes("MetaMask") ||
        message.includes("nkbihfbeogaeaoehlefnkodbefgpgknn") || // MetaMask's ID
        message.includes("inpage.js") ||
        stack.includes("chrome-extension") ||
        stringified.includes("MetaMask")
      );
    };

    const handleError = (e: ErrorEvent) => {
      if (isExtensionError(e.error) || isExtensionError(e)) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };

    const handleRejection = (e: PromiseRejectionEvent) => {
      if (isExtensionError(e.reason)) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };

    window.addEventListener("error", handleError, true); // Use capture phase
    window.addEventListener("unhandledrejection", handleRejection, true);

    return () => {
      window.removeEventListener("error", handleError, true);
      window.removeEventListener("unhandledrejection", handleRejection, true);
    };
  }, []);

  return null;
}
