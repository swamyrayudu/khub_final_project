'use client';

import React from 'react';
import { ShoppingBag, Store, Zap, Shield, Users, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: ShoppingBag,
    title: 'Wide Selection',
    description: 'Browse thousands of products from trusted sellers in one convenient place.',
    color: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary'
  },
  {
    icon: Shield,
    title: 'Secure & Safe',
    description: 'Your transactions are protected with advanced security measures and buyer protection.',
    color: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Support local businesses and build connections with amazing sellers.',
    color: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary'
  },
  {
    icon: Zap,
    title: 'Fast & Easy',
    description: 'Simple checkout process and quick delivery to your doorstep.',
    color: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary'
  },
  {
    icon: Store,
    title: 'Easy Selling',
    description: 'Start your own store with our intuitive seller dashboard and tools.',
    color: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary'
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Business',
    description: 'Access powerful analytics and marketing tools to scale your sales.',
    color: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary'
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Why Choose <span className="text-primary">LocalHunt</span>?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the best features designed to make your shopping and selling experience exceptional.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group p-6 md:p-8 bg-gradient-to-br ${feature.color} border border-border rounded-2xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
