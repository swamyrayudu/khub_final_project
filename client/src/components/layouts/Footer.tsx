'use client';

import React from 'react'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground border-t border-border/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-base sm:text-lg">LH</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-primary">
                LocalHunt
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Connecting local businesses with their communities.
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted/50 hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors duration-200 group">
                <Facebook size={16} className="sm:w-[18px] sm:h-[18px] text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted/50 hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors duration-200 group">
                <Twitter size={16} className="sm:w-[18px] sm:h-[18px] text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted/50 hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors duration-200 group">
                <Instagram size={16} className="sm:w-[18px] sm:h-[18px] text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted/50 hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors duration-200 group">
                <Linkedin size={16} className="sm:w-[18px] sm:h-[18px] text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <h4 className="text-sm sm:text-base font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3.5">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-xs sm:text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Shop Products
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-xs sm:text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Browse Stores
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-xs sm:text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Become a Seller
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-xs sm:text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  My Wishlist
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-xs sm:text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Store Locator
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <h4 className="text-sm sm:text-base font-semibold text-foreground">Support</h4>
            <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3.5">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-xs sm:text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-xs sm:text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-xs sm:text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Our Team
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-xs sm:text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-xs sm:text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-xs sm:text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <h4 className="text-sm sm:text-base font-semibold text-foreground">Get In Touch</h4>
            <ul className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                <MapPin size={16} className="sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 text-primary" />
                <span className="leading-relaxed">123 Market Street,<br />Your City, ST 12345</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                <Mail size={16} className="sm:w-5 sm:h-5 flex-shrink-0 text-primary" />
                <a href="mailto:support@localhunt.com" className="hover:text-primary transition-colors break-all">
                  support@localhunt.com
                </a>
              </li>
              <li className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                <Phone size={16} className="sm:w-5 sm:h-5 flex-shrink-0 text-primary" />
                <a href="tel:+12345678900" className="hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} LocalHunt. All rights reserved.
            </p>
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
