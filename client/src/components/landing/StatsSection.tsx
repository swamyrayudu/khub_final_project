'use client';

import React, { useEffect, useState } from 'react';
import { getStats } from '@/actions/statsActions';

interface Stats {
  users: number;
  sellers: number;
  products: number;
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    sellers: 0,
    products: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      number: loading ? '...' : stats.users.toLocaleString(),
      label: 'Happy Customers',
      description: 'Satisfied buyers shopping every day',
    },
    {
      number: loading ? '...' : stats.sellers.toLocaleString(),
      label: 'Active Sellers',
      description: 'Successful businesses on our platform',
    },
    {
      number: loading ? '...' : stats.products.toLocaleString(),
      label: 'Products',
      description: 'Diverse selection across all categories',
    },
  ];

  return (
    <section className="py-12 md:py-20 lg:py-28 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12 md:mb-20">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold">
            Join Our Growing Community
          </h2>
          <p className="text-xs md:text-sm lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            See why thousands of customers and sellers trust LocalHunt for their marketplace needs.
          </p>
        </div>

        {/* Centered Single Page Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="group relative p-6 md:p-8 lg:p-10 bg-gradient-to-br from-primary/10 via-card/50 to-background border border-primary/30 rounded-2xl text-center hover:border-primary/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-primary mb-3">
                  {stat.number}
                </div>
                <h3 className="text-base md:text-lg lg:text-xl font-bold text-foreground mb-3">{stat.label}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
