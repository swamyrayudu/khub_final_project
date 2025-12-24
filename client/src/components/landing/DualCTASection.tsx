'use client';

import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '@/styles/animations.css';

const buyerBenefits = [
  'Browse thousands of curated products',
  'Secure payment options',
  'Fast and reliable shipping',
  'Customer support 24/7',
  'Easy returns and refunds',
];

const sellerBenefits = [
  'Set up your store in minutes',
  'Unlimited product listings',
  'Powerful analytics dashboard',
  'Marketing tools included',
  'Dedicated seller support',
];

export default function DualCTASection() {
  const router = useRouter();

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Shimmer CTA Section */}
        <div className="text-center space-y-4 mb-12">
          <button className="inline-flex h-10 md:h-12 items-center justify-center rounded-md border-2 border-slate-900 dark:border-slate-400 bg-white dark:bg-slate-900 px-4 md:px-6 font-medium text-xs md:text-sm text-slate-900 dark:text-slate-100 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900">
            Welcome to the Future of Shopping
          </button>
        </div>

        {/* Section Header */}
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold">
            Choose Your Path
          </h2>
          <p className="text-sm md:text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you&apos;re looking to shop or sell, we have everything you need.
          </p>
        </div>

        {/* Dual Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Buyer Card */}
          <div className="group relative p-4 md:p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/30 rounded-3xl hover:border-primary/60 transition-all duration-300 hover:shadow-2xl">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ShoppingIcon className="w-5 md:w-6 h-5 md:h-6 text-primary" />
                </div>
                <h3 className="text-xl md:text-3xl font-bold text-foreground">Shop with Us</h3>
              </div>

              <p className="text-xs md:text-base text-muted-foreground mb-5">
                Discover amazing products from trusted sellers and support your local community.
              </p>

              {/* Benefits List */}
              <ul className="space-y-2 mb-5">
                {buyerBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3 text-foreground text-xs md:text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Star className="w-3 h-3 text-primary" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => router.push('/shop/products')}
                className="w-full group/btn px-4 md:px-6 py-2 md:py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-sm md:text-base transition-all duration-300 flex items-center justify-center space-x-2 hover:-translate-y-1 hover:bg-primary/90 shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/70"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-4 md:w-5 h-4 md:h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Seller Card */}
          <div className="group relative p-4 md:p-8 bg-gradient-to-br from-secondary/10 via-secondary/5 to-background border border-secondary/30 rounded-3xl hover:border-secondary/60 transition-all duration-300 hover:shadow-2xl">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/5 to-secondary/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <StoreIcon className="w-5 md:w-6 h-5 md:h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl md:text-3xl font-bold text-foreground">Sell with Us</h3>
              </div>

              <p className="text-xs md:text-base text-muted-foreground mb-5">
                Build your online store and reach thousands of customers looking for great products.
              </p>

              {/* Benefits List */}
              <ul className="space-y-2 mb-5">
                {sellerBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3 text-foreground text-xs md:text-sm">
                    <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Star className="w-3 h-3 text-secondary-foreground" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => router.push('/seller/auth/login')}
                className="w-full group/btn px-4 md:px-6 py-2 md:py-4 bg-secondary text-secondary-foreground rounded-xl font-semibold text-sm md:text-base transition-all duration-300 flex items-center justify-center space-x-2 hover:-translate-y-1 hover:bg-secondary/90 shadow-lg shadow-secondary/50 hover:shadow-xl hover:shadow-secondary/70"
              >
                <span>Register as Seller</span>
                <ArrowRight className="w-4 md:w-5 h-4 md:h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShoppingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );
}

function StoreIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 9l12 0"></path>
      <path d="M6 9l-1 12a1 1 0 0 0 1 1h12a1 1 0 0 0 1 -1l-1 -12"></path>
      <path d="M9 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v2H9V5"></path>
    </svg>
  );
}
