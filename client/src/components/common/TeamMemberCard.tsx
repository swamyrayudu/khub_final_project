'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Linkedin, Twitter } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  image?: string;
  email?: string;
  initials: string;
  description?: string;
}

export default function TeamMemberCard({ name, role, initials, email, description }: TeamMemberProps) {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 bg-gradient-to-br from-card via-card/80 to-card/50 backdrop-blur-xl">
      <CardContent className="p-6">
        {/* Avatar Frame */}
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-32">
            {/* Glassy Background Circle */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Avatar Circle */}
            <div className="relative w-full h-full bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 border-4 border-primary/20 group-hover:border-primary/40">
              <span className="text-4xl font-bold text-primary-foreground">
                {initials}
              </span>
            </div>

            {/* Decorative ring */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-primary via-transparent to-primary/50 bg-clip-border opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
          </div>
        </div>

        {/* Name and Role */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <Badge className="mt-2 bg-primary/20 text-primary border-primary/30 font-semibold">
            {role}
          </Badge>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-3">
            {description}
          </p>
        )}

        {/* Email */}
        {email && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            <Mail className="w-4 h-4" />
            {email}
          </div>
        )}

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
            <Linkedin className="w-4 h-4 text-primary" />
          </button>
          <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
            <Twitter className="w-4 h-4 text-primary" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
