'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { EncryptedText } from '../ui/encrypted-text';

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="min-h-screen pt-16 md:pt-24 lg:pt-32 pb-16 px-4 relative overflow-hidden flex items-center justify-center bg-white dark:bg-black">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-blue-100/20 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-1/4 w-96 h-96 bg-amber-100/20 dark:bg-amber-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-5xl">
        {/* Main Hero Content - Centered */}
        <div className="text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Sparkles className="w-4 h-4 text-slate-800 dark:text-slate-300" />
            <span className="text-xs md:text-sm font-medium">
              <EncryptedText
                text="Welcome to the localhunt"
                encryptedClassName="text-neutral-500"
                revealedClassName="dark:text-slate-300 text-slate-800"
                revealDelayMs={50}
              />
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight animate-in fade-in slide-in-from-bottom-6 duration-500 delay-100">
            <span className="block text-foreground">Discover Amazing</span>
            <span className="block whitespace-nowrap text-primary">
              Products & Support Local
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-500 delay-200">
            Join thousands of happy customers discovering unique products from trusted sellers. Connect with local businesses and support your community.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-row items-center justify-center gap-2 md:gap-4 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300">
            <button
              onClick={() => router.push('/shop/products')}
              className="px-3 md:px-6 py-2 md:py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-xs md:text-base flex items-center justify-center space-x-1 md:space-x-2 hover:bg-primary/90 transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            <button
              onClick={() => router.push('/seller/auth/login')}
              className="px-3 md:px-6 py-2 md:py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-lg font-semibold text-xs md:text-base flex items-center justify-center space-x-1 md:space-x-2 hover:bg-slate-200 dark:hover:bg-slate-900 transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
            >
              <span>Become Seller</span>
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInFromBottom4 {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
        }

        @keyframes slideInFromBottom6 {
          from {
            opacity: 0;
            transform: translateY(1.5rem);
          }
        }

        @keyframes slideInFromBottom8 {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
        }
      `}</style>
    </section>
  );
}
