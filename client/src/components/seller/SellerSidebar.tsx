"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  X,
  Home, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  Users,
  LogOut,
  Loader2,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

interface SellerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export default function SellerSidebar({ isOpen, onClose, onLogout, isLoggingOut }: SellerSidebarProps) {
  const router = useRouter();

  const navigationItems = [
    { name: 'Dashboard', href: '/seller/home', icon: Home, current: true },
    { name: 'Products', href: '/seller/products', icon: Package, current: false },
    { name: 'Messages', href: '/seller/messages', icon: MessageSquare, current: false },
    { name: 'Orders', href: '/seller/orders', icon: ShoppingCart, current: false },
    { name: 'Analytics', href: '/seller/analytics', icon: BarChart3, current: false },
    { name: 'Customers', href: '/seller/customers', icon: Users, current: false },
    { name: 'Settings', href: '/seller/settings', icon: Settings, current: false },
  ];

  const handleNavigation = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar for mobile */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-card to-card/95 border-r border-primary/20 transform transition-all duration-300 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-primary/10 transition-all duration-200"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          {navigationItems.map((item, index) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 animate-slide-left ${
                item.current
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
              }`}
            >
              <span className="flex items-center">
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </span>
              {item.current && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
          
          <div className="my-4 border-t border-border/50" />
          
          {/* Logout button in mobile sidebar */}
          <button
            onClick={onLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 text-destructive hover:bg-destructive/10 disabled:opacity-50 hover:scale-105 transform"
          >
            {isLoggingOut ? (
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5 mr-3" />
            )}
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </nav>
      </div>
    </>
  );
}
