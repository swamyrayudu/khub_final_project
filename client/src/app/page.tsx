'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import DualCTASection from '@/components/landing/DualCTASection';
import StatsSection from '@/components/landing/StatsSection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import Footer from '@/components/layouts/Footer';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Check for admin token (cookie) and redirect if logged in
  useEffect(() => {
    const checkAdminAuth = () => {
      // Check for admin_token cookie
      const cookies = document.cookie.split(';');
      const adminToken = cookies.find(cookie => cookie.trim().startsWith('admin_token='));
      
      if (adminToken) {
        router.replace('/admin/home');
        return true;
      }
      return false;
    };

    if (checkAdminAuth()) return;
  }, [router]);

  // Check for seller token and redirect if logged in
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
        console.error('Error checking auth:', error);
      }
      setIsLoading(false);
    };

    checkSellerAuth();
  }, [router]);

  // Check for shop user session and redirect
  useEffect(() => {
    if (status === 'authenticated' && session) {
      // User is logged in, redirect to shop products
      router.replace('/shop/products');
    }
  }, [status, session, router]);

  // Check for saved theme preference or default to dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  // Show loading while checking auth
  if (isLoading || status === 'loading' || (status === 'authenticated' && session)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" suppressHydrationWarning>
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <LandingHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <HeroSection />
      <FeaturesSection />
      <DualCTASection />
      <StatsSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
