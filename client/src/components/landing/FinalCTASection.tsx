'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '@/styles/animations.css';

export default function FinalCTASection() {
  const router = useRouter();

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="relative p-4 md:p-8 lg:p-12 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/30 rounded-2xl overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />

          <div className="relative z-10 text-center space-y-5">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-xs md:text-sm lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of customers and sellers who are already enjoying the LocalHunt experience. 
              Whether you&apos;re shopping or selling, we&apos;re here to help you succeed.
            </p>

            <div className="flex flex-row items-center justify-center gap-2 md:gap-3 pt-6">
              <button
                onClick={() => router.push('/shop/products')}
                className="group px-3 md:px-8 py-2 md:py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-xs md:text-lg transition-all duration-300 flex items-center space-x-1 md:space-x-2 hover:-translate-y-1 hover:bg-primary/90 shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/70 whitespace-nowrap cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3 md:w-5 h-3 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={() => router.push('/seller/auth/login')}
                className="group px-3 md:px-8 py-2 md:py-4 bg-primary/20 backdrop-blur-md border-2 border-primary/50 text-primary rounded-xl font-semibold text-xs md:text-lg transition-all duration-300 flex items-center space-x-1 md:space-x-2 hover:-translate-y-1 hover:bg-primary/30 hover:border-primary/70 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 whitespace-nowrap cursor-pointer"
              >
                <span>Start Selling</span>
                <ArrowRight className="w-3 md:w-5 h-3 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
