'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '@/styles/animations.css';

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="min-h-screen pt-16 md:pt-24 lg:pt-32 pb-16 px-4 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-5xl">
        {/* Main Hero Content - Centered */}
        <div className="text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/30 border border-primary/60 rounded-full hover:border-primary/80 transition-colors duration-300">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs md:text-sm font-medium text-primary">Welcome to the Future of Shopping</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="block text-foreground">Discover Amazing</span>
            <span className="block text-primary">
              Products & Support Local
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of happy customers discovering unique products from trusted sellers. Connect with local businesses and support your community.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
            <button
              onClick={() => router.push('/shop/products')}
              className="btn-glassy-primary group w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm md:text-base transition-all duration-300 flex items-center justify-center space-x-2 hover:-translate-y-1 relative z-10 hover:bg-primary/90"
            >
              <span>Start Shopping Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button
              onClick={() => router.push('/seller/auth/login')}
              className="btn-glassy-secondary group w-full sm:w-auto px-6 py-3 bg-primary/20 border-2 border-primary/50 text-primary rounded-lg font-semibold text-sm md:text-base transition-all duration-300 flex items-center justify-center space-x-2 hover:-translate-y-1 relative z-10 hover:bg-primary/30 hover:border-primary/70"
            >
              <span>Become a Seller</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
