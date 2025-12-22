'use client';

import React from 'react'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">LH</span>
              </div>
              <h3 className="text-2xl font-bold text-primary">
                LocalHunt
              </h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your ultimate marketplace connecting amazing products with passionate sellers. 
              Discover unique items and support local businesses.
            </p>
            <div className="flex space-x-3">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center cursor-pointer">
                <Facebook size={18} />
              </div>
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center cursor-pointer">
                <Twitter size={18} />
              </div>
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center cursor-pointer">
                <Instagram size={18} />
              </div>
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center cursor-pointer">
                <Linkedin size={18} />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group cursor-pointer">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Shop Products
                </span>
              </li>
              <li>
                <span className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group cursor-pointer">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Browse Stores
                </span>
              </li>
              <li>
                <span className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group cursor-pointer">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Become a Seller
                </span>
              </li>
              <li>
                <span className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group cursor-pointer">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  My Wishlist
                </span>
              </li>
              <li>
                <span className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group cursor-pointer">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Store Locator
                </span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group cursor-pointer">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Help Center
                </span>
              </li>
              <li>
                <span className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group cursor-pointer">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  About Us
                </span>
              </li>
              <li>
                <span className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group cursor-pointer">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Our Team
                </span>
              </li>
              <li>
                <span className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group cursor-pointer">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Contact Us
                </span>
              </li>
              <li>
                <span className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group cursor-pointer">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group cursor-pointer">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Privacy Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">Get In Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-muted-foreground">
                <MapPin size={18} className="mt-0.5 flex-shrink-0 text-primary" />
                <span>123 Market Street,<br />Your City, ST 12345</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail size={18} className="flex-shrink-0 text-primary" />
                <span className="hover:text-primary transition-colors cursor-pointer">
                  support@localhunt.com
                </span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone size={18} className="flex-shrink-0 text-primary" />
                <span className="hover:text-primary transition-colors cursor-pointer">
                  +1 (234) 567-890
                </span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Subscribe to our newsletter for exclusive deals and updates!
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} LocalHunt. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
              <span>by LocalHunt Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
