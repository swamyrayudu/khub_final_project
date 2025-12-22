'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap, Handshake, TrendingUp, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TeamMemberCard from '@/components/common/TeamMemberCard';

export default function SellerAboutPage() {
  const router = useRouter();

  const benefits = [
    {
      icon: Zap,
      title: 'Local Visibility',
      description: 'Connect with customers in your area and expand your local market presence',
    },
    {
      icon: Handshake,
      title: 'Direct Connection',
      description: 'Communicate directly with customers without intermediaries',
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'Track performance, manage inventory, and scale your operations',
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Safe and reliable platform for your business operations',
    },
    {
      icon: Handshake,
      title: 'Community Support',
      description: 'Join a network of local sellers and share best practices',
    },
    {
      icon: Globe,
      title: 'Digital Presence',
      description: 'Establish and grow your online presence in your community',
    },
  ];

  const teamLeaders = [
    {
      name: 'Praveen',
      role: 'Co-ordinator',
      initials: 'PV',
      email: 'praveen@localhunt.com',
      description: 'Leading coordination and strategic planning for the platform',
    },
    {
      name: 'Mohan',
      role: 'Team Lead',
      initials: 'MH',
      email: 'mohan@localhunt.com',
      description: 'Guiding the team towards excellence and innovation',
    },
  ];

  const seniorLeaders = [
    {
      name: 'Senior Lead 1',
      role: 'Senior Developer',
      initials: 'SL1',
      description: 'Leading technical architecture and development',
    },
    {
      name: 'Senior Lead 2',
      role: 'Senior Developer',
      initials: 'SL2',
      description: 'Managing backend infrastructure and databases',
    },
    {
      name: 'Senior Lead 3',
      role: 'Senior Developer',
      initials: 'SL3',
      description: 'Overseeing frontend development and UI/UX',
    },
    {
      name: 'Senior Lead 4',
      role: 'Senior Developer',
      initials: 'SL4',
      description: 'Ensuring quality and performance optimization',
    },
  ];

  const juniorLeads = [
    {
      name: 'Junior Lead 1',
      role: 'Full Stack Developer',
      initials: 'JL1',
      description: 'Contributing to core features and improvements',
    },
    {
      name: 'Junior Lead 2',
      role: 'Full Stack Developer',
      initials: 'JL2',
      description: 'Building seller dashboard and management tools',
    },
    {
      name: 'Junior Lead 3',
      role: 'Full Stack Developer',
      initials: 'JL3',
      description: 'Implementing notification and messaging systems',
    },
    {
      name: 'Junior Lead 4',
      role: 'Full Stack Developer',
      initials: 'JL4',
      description: 'Enhancing user experience and interface design',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-primary/5 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8 animate-slide-down">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/seller/home')}
            className="hover:bg-primary/10 rounded-lg transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
              About LocalHunt
            </h1>
            <p className="text-muted-foreground">Empowering Local Sellers to Thrive</p>
          </div>
        </div>

        {/* Welcome Section */}
        <Card className="mb-8 border-0 bg-gradient-to-r from-primary/15 via-primary/10 to-orange-500/5 animate-slide-up">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to LocalHunt for Sellers</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              LocalHunt is a revolutionary platform designed to connect local sellers with customers in their community. 
              Whether you&apos;re a small shop owner, artisan, or service provider, our platform empowers you to reach more customers, 
              manage your business efficiently, and grow your local presence.
            </p>
          </CardContent>
        </Card>

        {/* Why LocalHunt Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Why Choose LocalHunt for Your Business?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card 
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 bg-gradient-to-br from-card via-card/80 to-card/50 backdrop-blur-xl animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="p-3 bg-primary/20 rounded-xl w-fit mb-4 group-hover:bg-primary/30 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground mb-8">
            A passionate team dedicated to empowering local sellers and building the best platform for local commerce.
          </p>

          {/* Leadership */}
          <h3 className="text-2xl font-bold text-foreground mb-6">Leadership</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {teamLeaders.map((member, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <TeamMemberCard {...member} />
              </div>
            ))}
          </div>

          {/* Senior Developers */}
          <h3 className="text-2xl font-bold text-foreground mb-6">Senior Developers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {seniorLeaders.map((member, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 75}ms` }}>
                <TeamMemberCard {...member} />
              </div>
            ))}
          </div>

          {/* Junior Developers */}
          <h3 className="text-2xl font-bold text-foreground mb-6">Junior Developers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {juniorLeads.map((member, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 75}ms` }}>
                <TeamMemberCard {...member} />
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <Card className="border-0 bg-gradient-to-r from-primary/15 via-primary/10 to-blue-500/5 mb-8">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To empower local sellers with tools and resources they need to succeed in the digital marketplace. 
              We believe in supporting local communities and helping small businesses thrive by connecting them directly 
              with customers who value local, quality products and services.
            </p>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Grow Your Business?</h3>
          <Button
            onClick={() => router.push('/seller/home')}
            className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg"
            size="lg"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
