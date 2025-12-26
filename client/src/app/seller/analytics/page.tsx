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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/50 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-slide-down">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/seller/home")}
              className="hover:bg-primary/10 rounded-lg transition-all duration-300 group h-9 w-9 p-0"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            </Button>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Track your store performance
              </p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="self-start sm:self-auto h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Products */}
          <Card className="border-border/50 bg-gradient-to-br from-blue-500/10 via-card to-card hover:shadow-lg transition-all duration-300 animate-slide-up shadow-md">
            <CardHeader className="pb-2 pt-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Total Products
                </CardTitle>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {analyticsData.totalProducts}
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                {analyticsData.recentProducts} added this month
              </p>
            </CardContent>
          </Card>

          {/* Active Products */}
          <Card className="border-border/50 bg-gradient-to-br from-green-500/10 via-card to-card hover:shadow-lg transition-all duration-300 animate-slide-up shadow-md" style={{ animationDelay: "50ms" }}>
            <CardHeader className="pb-2 pt-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Active Products
                </CardTitle>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {analyticsData.activeProducts}
              </div>
              <Progress value={activePercentage} className="mt-2 h-1.5" />
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                {activePercentage.toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          {/* Inventory Value */}
          <Card className="border-border/50 bg-gradient-to-br from-purple-500/10 via-card to-card hover:shadow-lg transition-all duration-300 animate-slide-up shadow-md" style={{ animationDelay: "100ms" }}>
            <CardHeader className="pb-2 pt-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Inventory Value
                </CardTitle>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                ₹{analyticsData.totalInventoryValue.toLocaleString()}
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                Total stock value
              </p>
            </CardContent>
          </Card>

          {/* Out of Stock */}
          <Card className="border-border/50 bg-gradient-to-br from-red-500/10 via-card to-card hover:shadow-lg transition-all duration-300 animate-slide-up shadow-md" style={{ animationDelay: "150ms" }}>
            <CardHeader className="pb-2 pt-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Out of Stock
                </CardTitle>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {analyticsData.outOfStock}
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                {((analyticsData.outOfStock / Math.max(analyticsData.totalProducts, 1)) * 100).toFixed(1)}% of inventory
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Price Range */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-slide-up shadow-md" style={{ animationDelay: "200ms" }}>
            <CardHeader className="pb-3 pt-4 px-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <CardTitle className="text-sm sm:text-base">Price Range</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              <div className="flex justify-between items-center p-2.5 bg-muted/50 rounded-lg">
                <span className="text-xs sm:text-sm text-muted-foreground">Average</span>
                <span className="text-sm sm:text-base font-bold">₹{analyticsData.averagePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-muted/50 rounded-lg">
                <span className="text-xs sm:text-sm text-muted-foreground">Minimum</span>
                <span className="text-sm sm:text-base font-bold text-green-600">₹{analyticsData.minPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-muted/50 rounded-lg">
                <span className="text-xs sm:text-sm text-muted-foreground">Maximum</span>
                <span className="text-sm sm:text-base font-bold text-blue-600">₹{analyticsData.maxPrice.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Stock Status */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-slide-up shadow-md" style={{ animationDelay: "250ms" }}>
            <CardHeader className="pb-3 pt-4 px-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                </div>
                <CardTitle className="text-sm sm:text-base">Stock Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">In Stock</span>
                  <span className="text-xs sm:text-sm font-medium">
                    {analyticsData.totalProducts - analyticsData.outOfStock}
                  </span>
                </div>
                <Progress value={stockPercentage} className="h-1.5 sm:h-2" />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="p-2.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Available</div>
                  <div className="text-base sm:text-lg font-bold text-green-600">
                    {analyticsData.totalProducts - analyticsData.outOfStock}
                  </div>
                </div>
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Empty</div>
                  <div className="text-base sm:text-lg font-bold text-red-600">
                    {analyticsData.outOfStock}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-slide-up shadow-md" style={{ animationDelay: "300ms" }}>
            <CardHeader className="pb-3 pt-4 px-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <CardTitle className="text-sm sm:text-base">Quick Stats</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              <div className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                  <span className="text-xs sm:text-sm">Unread Messages</span>
                </div>
                <Badge variant={analyticsData.unreadMessages > 0 ? "destructive" : "secondary"} className="text-xs">
                  {analyticsData.unreadMessages}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span className="text-xs sm:text-sm">New This Month</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {analyticsData.recentProducts}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
                  <span className="text-xs sm:text-sm">Categories</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {analyticsData.productsByCategory.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products by Category */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-slide-up shadow-md" style={{ animationDelay: "350ms" }}>
          <CardHeader className="pb-3 pt-4 px-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <PieChartIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base">Products by Category</CardTitle>
                <CardDescription className="text-xs">Distribution of your inventory</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {analyticsData.productsByCategory.length > 0 ? (
              <div className="space-y-3">
                {analyticsData.productsByCategory
                  .sort((a, b) => b.count - a.count)
                  .map((category, index) => {
                    const percentage = (category.count / analyticsData.totalProducts) * 100;
                    return (
                      <div key={index} className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium capitalize">
                            {category.category}
                          </span>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-xs text-muted-foreground">
                              {category.count} items
                            </span>
                            <Badge variant="outline" className="text-[10px] sm:text-xs h-5">
                              {percentage.toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-1.5 sm:h-2" />
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No category data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Trends */}
        {trendData.length > 0 && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-slide-up shadow-md" style={{ animationDelay: "400ms" }}>
            <CardHeader className="pb-3 pt-4 px-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm sm:text-base">Product Addition Trends</CardTitle>
                  <CardDescription className="text-xs">Last 6 months</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-2.5">
                {trendData.map((trend, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3">
                    <div className="min-w-[70px] sm:min-w-[80px] text-xs sm:text-sm font-medium">
                      {trend.month}
                    </div>
                    <div className="flex-1">
                      <Progress 
                        value={(trend.count / Math.max(...trendData.map(t => t.count))) * 100} 
                        className="h-5 sm:h-6" 
                      />
                    </div>
                    <div className="min-w-[35px] sm:min-w-[45px] text-right">
                      <Badge variant="secondary" className="text-xs h-5">{trend.count}</Badge>
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
