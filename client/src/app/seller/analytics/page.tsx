"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import {
  ArrowLeft,
  Loader2,
  Package,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  BarChart3,
  PieChart as PieChartIcon,
  AlertTriangle,
  MessageSquare,
  Calendar,
  Activity,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getSellerAnalytics, getSellerProductTrends } from "@/actions/sellerAnalyticsActions";

interface AnalyticsData {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  totalInventoryValue: number;
  productsByCategory: Array<{ category: string; count: number }>;
  recentProducts: number;
  unreadMessages: number;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
}

interface TrendData {
  month: string;
  count: number;
}

export default function SellerAnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [sellerId, setSellerId] = useState<string>("");

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      try {
        const user = JSON.parse(userDataString);
        setSellerId(user.id);
        fetchAnalytics(user.id);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        toast.error("Failed to load user data");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = async (id: string) => {
    try {
      const [analyticsResult, trendsResult] = await Promise.all([
        getSellerAnalytics(id),
        getSellerProductTrends(id),
      ]);

      if (analyticsResult.success && analyticsResult.data) {
        setAnalyticsData(analyticsResult.data);
      } else {
        toast.error("Failed to load analytics data");
      }

      if (trendsResult.success) {
        setTrendData(trendsResult.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (sellerId) {
      setRefreshing(true);
      fetchAnalytics(sellerId);
      toast.info("Refreshing analytics...");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
            <CardDescription>Unable to load analytics data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/seller/home")} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activePercentage = analyticsData.totalProducts > 0
    ? (analyticsData.activeProducts / analyticsData.totalProducts) * 100
    : 0;

  const stockPercentage = analyticsData.totalProducts > 0
    ? ((analyticsData.totalProducts - analyticsData.outOfStock) / analyticsData.totalProducts) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-down">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/seller/home")}
              className="hover:bg-primary/10 rounded-lg transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Track your store performance and insights
              </p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Total Products */}
          <Card className="border-border/50 bg-gradient-to-br from-blue-500/10 via-card to-card hover:shadow-lg transition-all duration-300 animate-slide-up">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Products
                </CardTitle>
                <Package className="w-5 h-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                {analyticsData.totalProducts}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analyticsData.recentProducts} added this month
              </p>
            </CardContent>
          </Card>

          {/* Active Products */}
          <Card className="border-border/50 bg-gradient-to-br from-green-500/10 via-card to-card hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: "50ms" }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Products
                </CardTitle>
                <Activity className="w-5 h-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                {analyticsData.activeProducts}
              </div>
              <Progress value={activePercentage} className="mt-2 h-1.5" />
              <p className="text-xs text-muted-foreground mt-1">
                {activePercentage.toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          {/* Inventory Value */}
          <Card className="border-border/50 bg-gradient-to-br from-purple-500/10 via-card to-card hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Inventory Value
                </CardTitle>
                <DollarSign className="w-5 h-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                ₹{analyticsData.totalInventoryValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total stock value
              </p>
            </CardContent>
          </Card>

          {/* Out of Stock */}
          <Card className="border-border/50 bg-gradient-to-br from-red-500/10 via-card to-card hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: "150ms" }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Out of Stock
                </CardTitle>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                {analyticsData.outOfStock}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {((analyticsData.outOfStock / Math.max(analyticsData.totalProducts, 1)) * 100).toFixed(1)}% of inventory
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Price Range */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <CardTitle className="text-base md:text-lg">Price Range</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Average</span>
                <span className="text-base md:text-lg font-bold">₹{analyticsData.averagePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Minimum</span>
                <span className="text-base md:text-lg font-bold text-green-600">₹{analyticsData.minPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Maximum</span>
                <span className="text-base md:text-lg font-bold text-blue-600">₹{analyticsData.maxPrice.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Stock Status */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: "250ms" }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <CardTitle className="text-base md:text-lg">Stock Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">In Stock</span>
                  <span className="text-sm font-medium">
                    {analyticsData.totalProducts - analyticsData.outOfStock}
                  </span>
                </div>
                <Progress value={stockPercentage} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="text-xs text-muted-foreground">Available</div>
                  <div className="text-lg md:text-xl font-bold text-green-600">
                    {analyticsData.totalProducts - analyticsData.outOfStock}
                  </div>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="text-xs text-muted-foreground">Empty</div>
                  <div className="text-lg md:text-xl font-bold text-red-600">
                    {analyticsData.outOfStock}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <CardTitle className="text-base md:text-lg">Quick Stats</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Unread Messages</span>
                </div>
                <Badge variant={analyticsData.unreadMessages > 0 ? "destructive" : "secondary"}>
                  {analyticsData.unreadMessages}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span className="text-sm">New This Month</span>
                </div>
                <Badge variant="secondary">
                  {analyticsData.recentProducts}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">Categories</span>
                </div>
                <Badge variant="secondary">
                  {analyticsData.productsByCategory.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products by Category */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: "350ms" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-base md:text-lg">Products by Category</CardTitle>
                <CardDescription className="text-xs md:text-sm">Distribution of your inventory</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {analyticsData.productsByCategory.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.productsByCategory
                  .sort((a, b) => b.count - a.count)
                  .map((category, index) => {
                    const percentage = (category.count / analyticsData.totalProducts) * 100;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">
                            {category.category}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {category.count} items
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {percentage.toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No category data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Trends */}
        {trendData.length > 0 && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: "400ms" }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="text-base md:text-lg">Product Addition Trends</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Last 6 months</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trendData.map((trend, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="min-w-[80px] md:min-w-[100px] text-sm font-medium">
                      {trend.month}
                    </div>
                    <div className="flex-1">
                      <Progress 
                        value={(trend.count / Math.max(...trendData.map(t => t.count))) * 100} 
                        className="h-6 md:h-8" 
                      />
                    </div>
                    <div className="min-w-[40px] md:min-w-[60px] text-right">
                      <Badge variant="secondary">{trend.count}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-down {
          animation: slideDown 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
