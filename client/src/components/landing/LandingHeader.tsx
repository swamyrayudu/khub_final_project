'use client';

import React from 'react';
import { Moon, Sun, ShoppingBag } from 'lucide-react';

interface LandingHeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function LandingHeader({ darkMode, toggleDarkMode }: LandingHeaderProps) {
  return (
    <header className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2 md:space-x-3 group cursor-pointer">
          <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-r from-primary to-primary/60 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
            <ShoppingBag className="w-5 md:w-6 h-5 md:h-6 text-white" />
          </div>
          <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            LocalHunt
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 hover:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-200 cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-4 md:w-5 h-4 md:h-5 text-primary" />
          ) : (
            <Moon className="w-4 md:w-5 h-4 md:h-5 text-primary" />
          )}
        </button>
      </div>
    </header>
  );
}
