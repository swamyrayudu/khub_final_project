"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface SellerRedirectGuardProps {
  children: React.ReactNode;
}

// Pages that sellers should NOT be able to access when logged in
const restrictedPagesForSellers = [
  "/",           // Landing page
  "/auth",       // User auth page
  "/shop",       // Shop pages (for customers)
];

// Pages that should be accessible even when seller is logged in
const allowedPagesForSellers = [
  "/seller",     // All seller pages
  "/admin",      // Admin pages (handled separately)
  "/api",        // API routes
  "/_next",      // Next.js internals
];

export default function SellerRedirectGuard({ children }: SellerRedirectGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const checkSellerAuth = () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const userDataString = localStorage.getItem("userData");

        // If no seller token, allow access to all pages
        if (!authToken || !userDataString) {
          setShouldRender(true);
          setIsChecking(false);
          return;
        }

        // Parse user data to check if it's a seller
        const userData = JSON.parse(userDataString);
        
        // Check if the user is a seller (has seller-related properties)
        const isSeller = userData.role === "seller" || userData.shopName !== undefined;

        if (!isSeller) {
          // Not a seller, allow access
          setShouldRender(true);
          setIsChecking(false);
          return;
        }

        // User is a seller with a valid token
        // Check if the current page should be accessible

        // Check if current path starts with any allowed path for sellers
        const isAllowedPage = allowedPagesForSellers.some(
          (allowedPath) => pathname.startsWith(allowedPath)
        );

        if (isAllowedPage) {
          // Seller can access this page
          setShouldRender(true);
          setIsChecking(false);
          return;
        }

        // Check if current path is a restricted page for sellers
        const isRestrictedPage = 
          pathname === "/" || // Exact match for landing page
          restrictedPagesForSellers.some(
            (restrictedPath) => restrictedPath !== "/" && pathname.startsWith(restrictedPath)
          );

        if (isRestrictedPage) {
          // Redirect seller to their dashboard
          // Check seller status
          if (userData.status === "pending") {
            router.replace("/seller/auth/login/wait");
          } else {
            router.replace("/seller/home");
          }
          return;
        }

        // For any other page, allow access
        setShouldRender(true);
        setIsChecking(false);
      } catch (error) {
        console.error("Error checking seller auth:", error);
        // On error, allow access
        setShouldRender(true);
        setIsChecking(false);
      }
    };

    checkSellerAuth();
  }, [pathname, router]);

  // Show nothing while checking (prevents flash)
  if (isChecking && !shouldRender) {
    return null;
  }

  return <>{children}</>;
}
