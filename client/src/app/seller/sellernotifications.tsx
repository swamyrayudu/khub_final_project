"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageSquare,
  Loader2,
  Star,
  Map,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserData {
  id: string;
  email: string;
  name: string;
  shopName?: string;
  role: string;
  status: string;
}

export default function SellerNotificationsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"messages" | "reviews" | "maps">(
    "messages"
  );

  const mockMessages = [
    {
      id: 1,
      customerName: "Raj Kumar",
      customerEmail: "raj@example.com",
      message: "Is this product available in blue color?",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      customerName: "Priya Singh",
      customerEmail: "priya@example.com",
      message: "What is the delivery time for this product?",
      time: "15 min ago",
      unread: true,
    },
    {
      id: 3,
      customerName: "Amit Patel",
      customerEmail: "amit@example.com",
      message: "Thank you for the quick delivery!",
      time: "1 hour ago",
      unread: false,
    },
  ];

  const mockReviews = [
    {
      id: 1,
      customerName: "Raj Kumar",
      productName: "Premium Headphones",
      rating: 5,
      comment: "Excellent quality and fast delivery!",
      time: "30 min ago",
    },
    {
      id: 2,
      customerName: "Priya Singh",
      productName: "Smart Watch",
      rating: 4,
      comment: "Good product, could be better packaging",
      time: "2 hours ago",
    },
    {
      id: 3,
      customerName: "Amit Patel",
      productName: "Wireless Charger",
      rating: 5,
      comment: "Amazing! Exactly what I needed",
      time: "1 day ago",
    },
  ];

  const mockMapsViews = [
    {
      id: 1,
      productName: "iPhone 12",
      views: 45,
      location: "Mumbai, India",
      time: "Last 24 hours",
    },
    {
      id: 2,
      productName: "Samsung Galaxy",
      views: 32,
      location: "Delhi, India",
      time: "Last 24 hours",
    },
    {
      id: 3,
      productName: "OnePlus 9",
      views: 28,
      location: "Bangalore, India",
      time: "Last 24 hours",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userDataString = localStorage.getItem("userData");

    if (!token || !userDataString) {
      router.push("/seller/auth/login");
      return;
    }

    try {
      const user = JSON.parse(userDataString);
      setUserData(user);
      setLoading(false);
    } catch (error) {
      console.error("Failed to parse user data:", error);
      router.push("/seller/auth/login");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center space-x-4 mb-8 animate-slide-down">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/seller/home")}
            className="hover:bg-primary/10 rounded-lg transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Notifications
            </h1>
            <p className="text-sm text-muted-foreground">
              Messages, Reviews & Location Views
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
          {[
            { id: "messages" as const, label: "Messages", icon: MessageSquare },
            { id: "reviews" as const, label: "Reviews", icon: Star },
            { id: "maps" as const, label: "Location Views", icon: Map },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-background/50 border border-border/50 text-muted-foreground hover:bg-background hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="space-y-4 animate-fade-in">
            {mockMessages.map((msg, index) => (
              <Card
                key={msg.id}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => router.push("/seller/messages")}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <MessageSquare className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                          {msg.customerName}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {msg.customerEmail}
                        </p>
                        <p className="text-sm text-foreground/80 line-clamp-2">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      {msg.unread && (
                        <Badge className="bg-red-500/80 text-white animate-pulse">
                          New
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-4 animate-fade-in">
            {mockReviews.map((review, index) => (
              <Card
                key={review.id}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                          {review.customerName}
                        </h3>
                        <div className="flex gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {review.productName}
                      </p>
                      <p className="text-sm text-foreground/80">
                        {review.comment}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-4 whitespace-nowrap">
                      {review.time}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Location Views Tab */}
        {activeTab === "maps" && (
          <div className="space-y-4 animate-fade-in">
            {mockMapsViews.map((view, index) => (
              <Card
                key={view.id}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Map className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                          {view.productName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          <span>{view.views} views</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-semibold text-foreground">
                        {view.location}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {view.time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-down {
          animation: slideDown 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
