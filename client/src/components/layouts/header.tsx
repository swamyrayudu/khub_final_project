'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ModeToggle } from '../theme/toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useWishlist } from '@/contexts/WishlistContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Search,
  Heart,
  Menu,
  MapPin,
  Package,
  User,
  LogOut,
  Store,
  Bell,
  X,
  MessageSquare
} from 'lucide-react';

export default function ShopHeader() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('');
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/shop/products', label: 'Products', icon: Package },
    { href: '/shop/stores', label: 'Stores', icon: Store },
    { href: '/shop/map', label: 'Map', icon: MapPin },
  ];

  const userNavLinks = session?.user ? [
    ...navLinks,
    { href: '/shop/messages', label: 'Messages', icon: MessageSquare },
  ] : navLinks;

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl shadow-md border-b'
          : 'bg-background/95 backdrop-blur-sm border-b'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                  <Store className="w-5 h-5 text-primary-foreground transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-200">
                  LocalHunt
                </h1>
                <p className="text-[10px] font-medium text-muted-foreground -mt-0.5">
                  Discover Local Treasures
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {userNavLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onMouseEnter={() => setActiveNav(link.href)}
                  onMouseLeave={() => setActiveNav('')}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 relative overflow-hidden group transition-all duration-200 cursor-pointer ${
                      activeNav === link.href ? 'text-primary bg-primary/10' : 'text-foreground'
                    }`}
                  >
                    <link.icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                    <span className="font-medium">{link.label}</span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          {/* Search - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
              <Input
                type="search"
                placeholder="Search products, stores..."
                className="pl-10 pr-4 h-10 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </Button>

            {/* Mobile Theme Toggle */}
            <div className="lg:hidden">
              <ModeToggle />
            </div>

            {/* Wishlist */}
            <Link href="/shop/wishlist">
              <Button 
                variant="ghost" 
                size="icon"
                className="relative hidden sm:flex h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
              >
                <Heart className="w-5 h-5 transition-all duration-200 group-hover:scale-110 group-hover:fill-current" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center px-1 text-[10px] font-bold bg-primary text-primary-foreground border-2 border-background">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Notifications */}
            {session?.user && (
              <Link href="/shop/notifications">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative hidden sm:flex h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                >
                  <Bell className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />
                </Button>
              </Link>
            )}

            {/* Theme Toggle */}
            <div className="hidden sm:flex">
              <ModeToggle />
            </div>

            {/* User Menu */}
            {!mounted || status === 'loading' ? (
              <div className="w-9 h-9 rounded-full bg-muted animate-pulse ml-2" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ml-2 hover:ring-2 hover:ring-primary/20 transition-all duration-200"
                  >
                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                      <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  <DropdownMenuLabel className="pb-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground leading-none">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem asChild>
                    <Link href="/shop/profile" className="cursor-pointer group">
                      <User className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/shop/wishlist" className="cursor-pointer group">
                      <Heart className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      <span>Wishlist</span>
                      {wishlistCount > 0 && (
                        <Badge variant="secondary" className="ml-auto text-xs font-semibold">
                          {wishlistCount}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-destructive focus:text-destructive cursor-pointer group"
                  >
                    <LogOut className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button 
                  size="sm"
                  className="ml-2 rounded-full px-5 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            {mounted && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="lg:hidden h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="p-0 h-[40vh] max-h-[40vh]">
                  <SheetHeader className="px-6 py-4 border-b">
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col py-4">
                    <div className="px-3 space-y-1">
                      {userNavLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start gap-3 h-11 hover:bg-primary/10 hover:text-primary transition-colors duration-200 group"
                          >
                            <link.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                            <span className="font-medium">{link.label}</span>
                          </Button>
                        </Link>
                      ))}
                      <Link
                        href="/shop/wishlist"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start gap-3 h-11 hover:bg-primary/10 hover:text-primary transition-colors duration-200 group"
                        >
                          <Heart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                          <span className="font-medium">Wishlist</span>
                          {wishlistCount > 0 && (
                            <Badge variant="secondary" className="ml-auto text-xs font-semibold">
                              {wishlistCount}
                            </Badge>
                          )}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="lg:hidden pb-4 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, stores..."
                className="pl-10 pr-4 h-10 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
