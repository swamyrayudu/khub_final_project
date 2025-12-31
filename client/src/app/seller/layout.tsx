"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SellerHeader from '@/components/seller/SellerHeader';
import SellerSidebar from '@/components/seller/SellerSidebar';
import Footer from '@/components/layouts/Footer';
import { Loader2 } from 'lucide-react';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCheckingShopUser, setIsCheckingShopUser] = useState(true);

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

  // Redirect shop users to shop products
  useEffect(() => {
    // If user is authenticated with NextAuth (shop user), redirect to shop
    if (status === 'authenticated' && session) {
      // Check if this is NOT a seller trying to access seller pages
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // This is a shop user, redirect them
        router.replace('/shop/products');
        return;
      }
    }
    
    if (status !== 'loading') {
      setIsCheckingShopUser(false);
    }
  }, [status, session, router]);

  // Define routes where header should NOT be shown
  const noHeaderRoutes = [
    '/seller/auth/login',
    '/seller/auth/login/wait',
    '/seller/auth/forgot-password',
    '/seller/auth/register/step1',
    '/seller/auth/register/step2',
    '/seller/auth/register/step3',
    '/seller/auth/register/step4'
  ];

  // Check if current route should show header
  const showHeader = !noHeaderRoutes.some(route => pathname.startsWith(route));

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        // ensure cookie is cleared on server
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      setTimeout(() => {
        window.location.href = '/seller/auth/login';
      }, 1000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Error during logout:', errorMessage, error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      setTimeout(() => {
        window.location.href = '/seller/auth/login';
      }, 1000);
      
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show loading while checking if user is a shop user
  if (isCheckingShopUser && status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Conditionally render header and sidebar */}
      {showHeader && (
        <>
          <SellerHeader onMobileMenuToggle={() => setSidebarOpen(true)} />
          <SellerSidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
          />
        </>
      )}
      
      {/* Main content */}
      <main className={showHeader ? 'pt-0' : ''}>
        {children}
      </main>
      
      {/* Footer */}
      {showHeader && <Footer />}
    </div>
  );
}
