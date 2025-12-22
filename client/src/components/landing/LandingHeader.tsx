'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, ShoppingBag } from 'lucide-react';

interface LandingHeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function LandingHeader({ darkMode, toggleDarkMode }: LandingHeaderProps) {
  return (
    <header className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/60 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            LocalHunt
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-card border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
}
