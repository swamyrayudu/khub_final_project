"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import {
  Users,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  TrendingUp,
  Activity,
  Calendar,
  Store,
  Shield,
  Settings,
  Package,
  DollarSign,
  Target,
  Zap,
  Bell,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-page";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminStats {
  total_users: number;
  pending_approvals: number;
  total_products: number;
  total_revenue: number;
  active_sellers: number;
  total_sellers: number;
}

export default function AdminHomeContent() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Simulate fetching admin user from token or session
      const adminData = {
        id: "1",
        email: "admin@example.com",
        name: "Admin",
        role: "admin",
      };
      setAdminUser(adminData);

      // Fetch dashboard stats
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {
          total_users: 0,
          pending_approvals: 0,
          total_products: 0,
          total_revenue: 0,
          active_sellers: 0,
          total_sellers: 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAdminData();
    setRefreshing(false);
    toast.success("Dashboard refreshed!");
  };

  const quickActions = [
    {
      title: "View Sellers",
      description: "Manage and approve seller accounts",
      icon: Store,
      color: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
      href: "/admin/sellers",
      priority: "high",
    },
    {
      title: "Contacts",
      description: "View user contact requests and inquiries",
      icon: Users,
      color: "bg-purple-500/20 text-purple-600 dark:text-purple-400",
      href: "/admin/dashboard",
      priority: "high",
    },
    {
      title: "Analytics",
      description: "Track platform performance and insights",
      icon: BarChart3,
      color: "bg-green-500/20 text-green-600 dark:text-green-400",
      href: "/admin/analytics",
      priority: "high",
    },
    {
      title: "Notifications",
      description: "Manage system notifications",
      icon: Bell,
      color: "bg-pink-500/20 text-pink-600 dark:text-pink-400",
      href: "/admin/notificationadmin",
      priority: "medium",
    },
    {
      title: "Reports",
      description: "View disputes and issue reports",
      icon: AlertCircle,
      color: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
      href: "/admin/reports",
      priority: "medium",
    },
    {
      title: "Settings",
      description: "Configure platform settings",
      icon: Settings,
      color: "bg-gray-500/20 text-gray-600 dark:text-gray-400",
      href: "/admin/settings",
      priority: "low",
    },
  ];

  const recentActivities = [
    {
      title: "New seller registered",
      description: "John's Electronics Shop",
      icon: Store,
      time: "2 hours ago",
    },
    {
      title: "Seller approved",
      description: "Tech Store Pro",
      icon: CheckCircle,
      time: "4 hours ago",
    },
    {
      title: "New contact inquiry",
      description: "User needs assistance",
      icon: AlertCircle,
      time: "1 day ago",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex items-center justify-center">
        <LoadingSpinner text="Loading admin dashboard..." />
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-primary/5 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome back,{" "}
              <span className="font-semibold text-foreground">
                {adminUser.name}
              </span>{" "}
              👋
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4 md:mt-0 animate-slide-left">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-primary/30 hover:bg-primary/10 rounded-xl cursor-pointer"
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>

            <Button
              onClick={() => router.push("/admin/sellers")}
              className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-lg hover:shadow-primary/40 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <Users className="w-4 h-4 mr-2" />
              View Sellers
            </Button>
          </div>
        </div>

        {/* Welcome Banner */}
        <div
          className="mb-8 animate-slide-up glassy-card rounded-2xl p-1 cursor-pointer hover:shadow-lg transition-shadow"
          style={{ animationDelay: "100ms" }}
        >
          <Card className="border-0 bg-gradient-to-r from-primary/15 via-primary/10 to-orange-500/5 shadow-none">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3 gap-3">
                    <div className="p-3 bg-primary/20 rounded-xl">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-card-foreground">
                        Platform Dashboard
                      </h2>
                      <Badge className="mt-1 bg-primary/20 text-primary border-primary/30 font-semibold">
                        Admin Access
                      </Badge>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 text-lg">
                    {stats
                      ? `You're managing ${stats.total_sellers} sellers with ${stats.total_products} products`
                      : "Manage your platform efficiently"}
                  </p>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2 text-primary" />
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="hidden sm:flex items-center text-sm">
                      <Activity className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        System Active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex items-center justify-center">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-6 rounded-2xl">
                    <TrendingUp className="w-16 h-16 text-primary animate-bounce-subtle" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Sellers */}
          <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
            <Card className="hover:shadow-xl hover:border-primary/50 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50 hover:scale-105 transform cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Total Sellers
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {stats?.total_sellers || 0}
                    </p>
                    <p className="text-xs text-primary flex items-center mt-2 font-semibold">
                      <Target className="w-3 h-3 mr-1" />
                      Active Sellers
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl">
                    <Store className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Approvals */}
          <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Card className="hover:shadow-xl hover:border-orange-500/50 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50 hover:scale-105 transform cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Pending Approvals
                    </p>
                    <p className="text-3xl font-bold text-card-foreground">
                      {stats?.pending_approvals || 0}
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center mt-2 font-semibold">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Waiting Review
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-orange-500/30 to-orange-500/10 rounded-xl">
                    <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Total Products */}
          <div className="animate-slide-up" style={{ animationDelay: "250ms" }}>
            <Card className="hover:shadow-xl hover:border-green-500/50 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50 hover:scale-105 transform cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Total Products
                    </p>
                    <p className="text-3xl font-bold text-card-foreground">
                      {stats?.total_products || 0}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-2 font-semibold">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Listed Products
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-500/30 to-green-500/10 rounded-xl">
                    <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Total Revenue */}
          <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
            <Card className="hover:shadow-xl hover:border-purple-500/50 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50 hover:scale-105 transform cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Total Volume
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                      ₹{stats?.total_revenue ? (stats.total_revenue / 1000000).toFixed(1) : "0"}M
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center mt-2 font-semibold">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Platform Revenue
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500/30 to-purple-500/10 rounded-xl">
                    <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary hover:bg-primary/10 rounded-xl cursor-pointer"
              onClick={() => router.push("/admin/sellers")}
            >
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <div
                  key={index}
                  className="animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${350 + index * 50}ms` }}
                >
                  <Card
                    className="group hover:shadow-xl hover:border-primary/50 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50 hover:scale-105 transform overflow-hidden"
                    onClick={() => router.push(action.href)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <h3 className="font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Recent Activities
            </h2>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary hover:bg-primary/10 rounded-xl cursor-pointer"
            >
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div
                  key={index}
                  className="animate-slide-up"
                  style={{ animationDelay: `${650 + index * 50}ms` }}
                >
                  <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/20 rounded-xl">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-card-foreground">
                            {activity.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {activity.time}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
