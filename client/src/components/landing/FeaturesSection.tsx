'use client';

import React from 'react';
import { ShoppingBag, Store, Zap, Shield, Users, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: ShoppingBag,
    title: 'Wide Selection',
    description: 'Browse thousands of products from trusted sellers in one convenient place.',
  },
  {
    icon: Shield,
    title: 'Secure & Safe',
    description: 'Your transactions are protected with advanced security measures and buyer protection.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Support local businesses and build connections with amazing sellers.',
  },
  {
    icon: Zap,
    title: 'Fast & Easy',
    description: 'Simple checkout process and quick delivery to your doorstep.',
  },
  {
    icon: Store,
    title: 'Easy Selling',
    description: 'Start your own store with our intuitive seller dashboard and tools.',
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Business',
    description: 'Access powerful analytics and marketing tools to scale your sales.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-3">
            Why LocalHunt
          </h2>
          <p className="text-muted-foreground max-w-lg">
            Everything you need to buy and sell with confidence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-6 border border-border bg-card rounded-lg hover:border-foreground/20 hover:shadow-sm transition-all duration-200"
              >
                {/* Icon */}
                <Icon className="w-5 h-5 text-muted-foreground mb-4 group-hover:text-foreground transition-colors duration-200" />
                
                {/* Content */}
                <h3 className="font-medium mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
