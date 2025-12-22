"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { 
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  Menu,
  Store,
  Settings,
  Loader2,
  Info
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface UserData {
  id: string;
  email: string;
  name: string;
  shopName?: string;
  role: string;
  status: string;
}

interface SellerHeaderProps {
  onMobileMenuToggle: () => void;
}

export default function SellerHeader({ onMobileMenuToggle }: SellerHeaderProps) {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userDataString = localStorage.getItem('userData');

    if (!token || !userDataString) {
      router.push('/seller/auth/login');
      return;
    }

    try {
      const user = JSON.parse(userDataString);
      setUserData(user);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      handleLogout();
    }

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, [router]);

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        // ensure cookie is cleared on server
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        console.warn('Logout API failed, continuing with cleanup');
      }

      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      toast.success('Successfully logged out!', {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        window.location.href = '/seller/auth/login';
      }, 1000);

    } catch (error) {
      console.error('Logout error:', error);
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      toast.error('Signed out (with errors)', {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        window.location.href = '/seller/auth/login';
      }, 1000);
      
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <header className="bg-gradient-to-r from-card via-card to-card/95 border-b border-primary/20 sticky top-0 z-30 backdrop-filter backdrop-blur-xl shadow-lg shadow-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={onMobileMenuToggle}
              className="p-2 rounded-xl hover:bg-primary/10 transition-all duration-300 lg:hidden mr-2 hover:scale-110"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center space-x-3 animate-slide-right">
              <div className="bg-gradient-to-br from-primary to-primary/70 p-2.5 rounded-xl shadow-lg shadow-primary/40">
                <Store className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {userData.shopName || 'Seller Dashboard'}
                </h1>
                <p className="text-xs text-muted-foreground flex items-center">
                  Status: <span className="capitalize font-semibold text-primary ml-1">{userData.status}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 animate-fade-in">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/50" />
              <input
                type="text"
                placeholder="Search products, orders..."
                className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-primary/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:border-primary/40"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            
            {/* Notifications */}
            <button 
              onClick={() => router.push('/seller/notifications')}
              className="p-2.5 rounded-xl hover:bg-primary/10 relative transition-all duration-300 hover:scale-110 group"
            >
              <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl hover:bg-primary/10 transition-all duration-300 hover:scale-110"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-muted-foreground hover:text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground hover:text-primary" />
              )}
            </button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-1.5 hover:bg-primary/10 rounded-xl transition-all duration-300 group">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-card-foreground">{userData.name}</p>
                    <p className="text-xs text-muted-foreground">{userData.email}</p>
                  </div>
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/40 group-hover:scale-110 transition-all duration-300">
                    <span className="text-primary-foreground font-bold text-sm">
                      {userData.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border-primary/20">
                <DropdownMenuItem 
                  onClick={() => router.push('/seller/about')}
                  className="cursor-pointer transition-all duration-200 hover:bg-primary/10"
                >
                  <Info className="w-4 h-4 mr-3 text-cyan-500" />
                  <span>About LocalHunt</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => router.push('/seller/profile')}
                  className="cursor-pointer transition-all duration-200 hover:bg-primary/10"
                >
                  <Settings className="w-4 h-4 mr-3 text-primary" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => router.push('/seller/notifications')}
                  className="cursor-pointer transition-all duration-200 hover:bg-primary/10"
                >
                  <Bell className="w-4 h-4 mr-3 text-blue-500" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-border/50" />
                
                <DropdownMenuItem 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 transition-all duration-200"
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4 mr-3" />
                  )}
                  {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
