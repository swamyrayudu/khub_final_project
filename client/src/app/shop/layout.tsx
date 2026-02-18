'use client';

// Example: src/app/shop/layout.tsx

import React from 'react';
import { useRouter } from 'next/navigation';
import ShopHeader from "@/components/layouts/header";
import Footer from "@/components/layouts/Footer";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { LocationModal } from "@/components/ui/location-modal";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ShopLayout({ children } :{children:React.ReactNode}) {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [isCheckingSeller, setIsCheckingSeller] = useState(true);

  // Check for admin token and redirect
  useEffect(() => {
    const checkAdminAuth = () => {
      const cookies = document.cookie.split(';');
      const adminToken = cookies.find(cookie => cookie.trim().startsWith('admin_token='));
      
      if (adminToken) {
        router.replace('/admin/home');
        return true;
      }
      return false;
    };

    checkAdminAuth();
  }, [router]);

  // Check for seller token and redirect
  useEffect(() => {
    const checkSellerAuth = () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const userDataString = localStorage.getItem('userData');

        if (authToken && userDataString) {
          const userData = JSON.parse(userDataString);
          // Check if user is a seller
          if (userData.role === 'seller' || userData.shopName !== undefined) {
            // Redirect to seller dashboard
            if (userData.status === 'pending') {
              router.replace('/seller/auth/login/wait');
            } else {
              router.replace('/seller/home');
            }
            return;
          }
        }
      } catch (error) {
        console.error('Error checking seller auth:', error);
      }
      setIsCheckingSeller(false);
    };

    checkSellerAuth();
  }, [router]);

  useEffect(() => {
    async function checkProfileStatus() {
      if (status === 'loading') {
        return;
      }

      if (status === 'unauthenticated') {
        setIsCheckingProfile(false);
        return;
      }

      if (status === 'authenticated' && session?.user) {
        try {
          const response = await fetch('/api/user/profile-status');
          if (response.ok) {
            const data = await response.json();
            setShowLocationModal(!data.hasCompletedProfile);
          }
        } catch (error) {
          console.error('Error checking profile status:', error);
        } finally {
          setIsCheckingProfile(false);
        }
      }
    }

    checkProfileStatus();
  }, [status, session]);

  const handleLocationSet = () => {
    setShowLocationModal(false);
    // Refresh session data without a full page reload
    update();
  };

  // Show loading while checking seller auth
  if (isCheckingSeller) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <WishlistProvider>
      <ShopHeader/>
      {children}
      <Footer />
      {!isCheckingProfile && (
        <LocationModal open={showLocationModal} onLocationSet={handleLocationSet} />
      )}
    </WishlistProvider>
  )
}