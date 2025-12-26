"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Menu,
  LayoutDashboard,
  MessageSquare,
  PackagePlus,
  LogOut,
  Bell,
  Settings,
  Building2,
} from "lucide-react";

interface UserData {
  id: string;
  email: string;
  name: string;
  shopName?: string;
  role: string;
  status: string;
}

export default function SellerHeader() {
  const router = useRouter();
  const [shopName, setShopName] = useState("My Shop");
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      try {
        const user = JSON.parse(userDataString);
        setUserData(user);
        setShopName(user.shopName || "My Shop");
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/seller/auth/login");
  };

  return (
    <nav className="w-full border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left: App Name and Shop Name */}
        <div className="flex items-center gap-6">
          <a href="/seller/home" className="text-2xl font-bold tracking-wide bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-300">
            LocalHunt
          </a>
          {userData && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-transparent rounded-lg border border-primary/20">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {shopName}
              </span>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <a href="/seller/home">
            <Button variant="ghost" className="hover:bg-primary/10 transition-all duration-300">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </a>
          <a href="/seller/products">
            <Button variant="ghost" className="hover:bg-primary/10 transition-all duration-300">
              <PackagePlus className="h-4 w-4 mr-2" />
              Products
            </Button>
          </a>
          <a href="/seller/messages">
            <Button variant="ghost" className="hover:bg-primary/10 transition-all duration-300">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Button>
          </a>

          {/* Notifications Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/seller/notifications")}
            className="relative hover:bg-primary/10 transition-all duration-300"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full p-0 w-10 h-10 hover:bg-primary/10 transition-all duration-300">
                <Avatar>
                  <AvatarImage src="/profile.png" alt="Profile" />
                  <AvatarFallback>{userData?.name?.[0] || "S"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-border/50 bg-background/95 backdrop-blur-sm">
              <DropdownMenuItem className="text-sm font-semibold p-3 cursor-default">
                {userData?.name || "Seller"}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                onClick={() => router.push("/seller/profile")}
                className="flex items-center cursor-pointer hover:bg-primary/10 transition-all duration-300"
              >
                <Settings className="h-4 w-4 mr-2 text-primary" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/seller/notifications")}
                className="flex items-center cursor-pointer hover:bg-primary/10 transition-all duration-300"
              >
                <Bell className="h-4 w-4 mr-2 text-blue-500" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center cursor-pointer text-red-500 hover:bg-red-500/10 transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/seller/notifications")}
            className="relative hover:bg-primary/10 transition-all duration-300"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-border/50 bg-background/95 backdrop-blur-sm">
              <DropdownMenuItem>
                <a href="/seller/home" className="flex items-center w-full">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/seller/products" className="flex items-center w-full">
                  <PackagePlus className="h-4 w-4 mr-2" />
                  Products
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/seller/messages" className="flex items-center w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                onClick={() => router.push("/seller/profile")}
                className="flex items-center cursor-pointer hover:bg-primary/10 transition-all duration-300"
              >
                <Settings className="h-4 w-4 mr-2 text-primary" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/seller/notifications")}
                className="flex items-center cursor-pointer hover:bg-primary/10 transition-all duration-300"
              >
                <Bell className="h-4 w-4 mr-2 text-blue-500" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center cursor-pointer text-red-500 hover:bg-red-500/10 transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
