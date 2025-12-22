'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, MapPin, Heart, Zap, Shield, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TeamMemberCard from '@/components/common/TeamMemberCard';

export default function ShopAboutPage() {
  const router = useRouter();

  const userBenefits = [
    {
      icon: Search,
      title: 'Discover Local Gems',
      description: 'Find unique products and services from local sellers in your area',
    },
    {
      icon: MapPin,
      title: 'Location-Based Search',
      description: 'Browse products by location and discover what\'s available near you',
    },
    {
      icon: Heart,
      title: 'Save Your Favorites',
      description: 'Create wishlists and save products you love for later',
    },
    {
      icon: Zap,
      title: 'Quick Communication',
      description: 'Message sellers directly to ask questions or negotiate',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Shop with confidence on our trusted platform',
    },
    {
      icon: Smile,
      title: 'Support Local',
      description: 'Make a difference by supporting local businesses and entrepreneurs',
    },
  ];

  const teamLeaders = [
    {
      name: 'Praveen',
      role: 'Co-ordinator',
      initials: 'PV',
      email: 'praveen@localhunt.com',
      description: 'Leading coordination and platform excellence',
    },
    {
      name: 'Mohan',
      role: 'Team Lead',
      initials: 'MH',
      email: 'mohan@localhunt.com',
      description: 'Driving innovation and user experience',
    },
  ];

  const seniorLeaders = [
    {
      name: 'Senior Lead 1',
      role: 'Senior Developer',
      initials: 'SL1',
      description: 'Building scalable platform architecture',
    },
    {
      name: 'Senior Lead 2',
      role: 'Senior Developer',
      initials: 'SL2',
      description: 'Managing data and infrastructure',
    },
    {
      name: 'Senior Lead 3',
      role: 'Senior Developer',
      initials: 'SL3',
      description: 'Creating intuitive user interfaces',
    },
    {
      name: 'Senior Lead 4',
      role: 'Senior Developer',
      initials: 'SL4',
      description: 'Optimizing performance and quality',
    },
  ];

  const juniorLeads = [
    {
      name: 'Junior Lead 1',
      role: 'Full Stack Developer',
      initials: 'JL1',
      description: 'Building shopping features and improvements',
    },
    {
      name: 'Junior Lead 2',
      role: 'Full Stack Developer',
      initials: 'JL2',
      description: 'Developing product discovery tools',
    },
    {
      name: 'Junior Lead 3',
      role: 'Full Stack Developer',
      initials: 'JL3',
      description: 'Enhancing user communication',
    },
    {
      name: 'Junior Lead 4',
      role: 'Full Stack Developer',
      initials: 'JL4',
      description: 'Improving shopping experience and design',
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
            onClick={() => router.push('/shop/products')}
            className="hover:bg-primary/10 rounded-lg transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
              About LocalHunt
            </h1>
            <p className="text-muted-foreground">Your Gateway to Local Shopping</p>
          </div>
        </div>

        {/* Welcome Section */}
        <Card className="mb-8 border-0 bg-gradient-to-r from-primary/15 via-primary/10 to-orange-500/5 animate-slide-up">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to LocalHunt</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              LocalHunt is a vibrant marketplace connecting you with amazing local sellers and products right in your community.
              Discover unique items, support local businesses, and enjoy a shopping experience that brings your neighborhood to life.
              From artisan crafts to fresh products, find it all on LocalHunt.
            </p>
          </CardContent>
        </Card>

        {/* Why LocalHunt Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Why Shop on LocalHunt?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userBenefits.map((benefit, index) => {
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
            Dedicated professionals passionate about connecting communities through local commerce.
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

        {/* Vision Section */}
        <Card className="border-0 bg-gradient-to-r from-primary/15 via-primary/10 to-blue-500/5 mb-8">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              We envision a world where local businesses thrive and communities are strengthened through direct connections
              between buyers and sellers. By bringing local commerce online, we&apos;re making it easier for you to discover,
              support, and celebrate the unique businesses in your neighborhood.
            </p>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Explore?</h3>
          <Button
            onClick={() => router.push('/shop/products')}
            className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg"
            size="lg"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
