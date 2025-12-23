'use client';

import React, { useState, useEffect } from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import DualCTASection from '@/components/landing/DualCTASection';
import StatsSection from '@/components/landing/StatsSection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import Footer from '@/components/layouts/Footer';

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);

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
