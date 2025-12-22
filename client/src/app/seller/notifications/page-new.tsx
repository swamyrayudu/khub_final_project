"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageSquare,
  Loader2,
  Star,
  Map,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getAllSellerNotifications,
} from "@/actions/sellerNotifications";

interface UserData {
  id: string;
  email: string;
  name: string;
  shopName?: string;
  role: string;
  status: string;
}

interface CustomerMessage {
  id: string;
  customerName: string;
  customerEmail: string;
  productName?: string;
  message: string;
  time: string;
  unread: boolean;
  createdAt: Date;
}

interface ProductReview {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  comment: string;
  time: string;
  createdAt: Date;
}

interface ProductView {
  id: string;
  customerName: string;
  productName: string;
  time: string;
  createdAt: Date;
}

export default function SellerNotificationsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"messages" | "reviews" | "maps">(
    "messages"
  );

  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [views, setViews] = useState<ProductView[]>([]);

  // Fetch real data from server
  const fetchNotificationData = async (userId: string) => {
    try {
      const result = await getAllSellerNotifications(userId);
      
      if (result.success) {
        setMessages(result.messages || []);
        setReviews(result.reviews || []);
        setViews(result.views || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");

    if (userDataString) {
      try {
        const user = JSON.parse(userDataString);
        setUserData(user);
        
        // Fetch real data
        fetchNotificationData(user.id);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
    
    setLoading(false);
  }, [router]);

  // Set up auto-refresh every 30 seconds
  useEffect(() => {
    if (!userData?.id) return;

    const interval = setInterval(() => {
      fetchNotificationData(userData.id);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [userData?.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (userData?.id) {
      await fetchNotificationData(userData.id);
    }
    setRefreshing(false);
  };

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
        <div className="flex items-center justify-between mb-8 animate-slide-down">
          <div className="flex items-center space-x-4">
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

          {/* Refresh button */}
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="transition-all duration-300"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
          {[
            { id: "messages" as const, label: "Messages", icon: MessageSquare, count: messages.length },
            { id: "reviews" as const, label: "Reviews", icon: Star, count: reviews.length },
            { id: "maps" as const, label: "Location Views", icon: Map, count: views.length },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 relative ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-background/50 border border-border/50 text-muted-foreground hover:bg-background hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <Badge className="ml-1 bg-red-500/80 text-white text-xs">
                    {tab.count}
                  </Badge>
                )}
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
            {messages.length > 0 ? (
              messages.map((msg, index) => (
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
                          {msg.productName && (
                            <p className="text-xs text-primary/60 mb-1">
                              Product: {msg.productName}
                            </p>
                          )}
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
              ))
            ) : (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No messages yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-4 animate-fade-in">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
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
                            {[...Array(5 - review.rating)].map((_, i) => (
                              <Star
                                key={`empty-${i}`}
                                className="w-4 h-4 text-muted-foreground/30"
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
              ))
            ) : (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
                <CardContent className="p-12 text-center">
                  <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No reviews yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Location Views Tab */}
        {activeTab === "maps" && (
          <div className="space-y-4 animate-fade-in">
            {views.length > 0 ? (
              views.map((view, index) => (
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
                            {view.customerName}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            viewed <span className="font-medium text-foreground">&quot;{view.productName}&quot;</span> on Google Maps
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs text-muted-foreground">
                          {view.time}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
                <CardContent className="p-12 text-center">
                  <Map className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No location views yet</p>
                </CardContent>
              </Card>
            )}
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
