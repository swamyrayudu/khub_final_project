"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getSellerProducts, getProductStats } from "@/actions/productActions";
import Image from "next/image";
import {
  Package,
  ShoppingCart,
  BarChart3,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Store,
  Activity,
  Calendar,
  Edit,
  AlertCircle,
  CheckCircle,
  Zap,
  Target,
  Award,
  Loader2,
  ArrowRight,
  ShoppingBag,
  Star,
  Bell,
  Settings,
  RefreshCw,
  MessageSquare,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  offerPrice: number;
  quantity: number;
  category: string;
  brand: string;
  sku: string;
  status: string;
  weight?: number;
  dimensions: string;
  tags: string[];
  images: string[];
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  outOfStock: number;
  lowStock: number;
  totalValue: number;
  averagePrice: number;
  productsWithOffers: number;
}

export default function SellerHomeContent() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productStats, setProductStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      fetchDashboardData();
    } catch (error) {
      console.error("Failed to parse user data:", error);
      router.push("/seller/auth/login");
    }
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch products and stats in parallel
      const [productsResult, statsResult] = await Promise.all([
        getSellerProducts(),
        getProductStats(),
      ]);

      if (productsResult.success) {
        setProducts(productsResult.products);
      }

      if (statsResult.success && statsResult.stats) {
        setProductStats(statsResult.stats);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success("Dashboard refreshed!");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const quickActions = [
    {
      title: "Add Product",
      description: "Add new products to your inventory and start selling",
      icon: Plus,
      color: "bg-primary/20 text-primary",
      href: "/seller/products/add",
      priority: "high",
    },
    {
      title: "View Products",
      description: "Manage your existing products and inventory",
      icon: Package,
      color: "bg-green-500/20 text-green-600 dark:text-green-400",
      href: "/seller/viewproducts",
      priority: "high",
    },
    {
      title: "Analytics",
      description: "Track your sales performance and insights",
      icon: BarChart3,
      color: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
      href: "/seller/analytics",
      priority: "medium",
    },
    {
      title: "Orders",
      description: "Process orders and manage fulfillment",
      icon: ShoppingCart,
      color: "bg-purple-500/20 text-purple-600 dark:text-purple-400",
      href: "/seller/orders",
      priority: "high",
    },
    {
      title: "Messages",
      description: "View and reply to customer inquiries",
      icon: MessageSquare,
      color: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400",
      href: "/seller/messages",
      priority: "high",
    },
    {
      title: "Support",
      description: "Manage customer relationships and support",
      icon: Users,
      color: "bg-pink-500/20 text-pink-600 dark:text-pink-400",
      href: "/seller/contect",
      priority: "medium",
    },
    {
      title: "Settings",
      description: "Configure your store and preferences",
      icon: Settings,
      color: "bg-gray-500/20 text-gray-600 dark:text-gray-400",
      href: "/seller/settings",
      priority: "low",
    },
  ];

  const recentProducts = products.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <Loader2 className="w-16 h-16 animate-spin text-primary absolute" />
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 absolute"></div>
          </div>
          <p className="text-muted-foreground font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-primary/5 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome back,{" "}
              <span className="font-semibold text-foreground">
                {userData.name}
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
              className="border-primary/30 hover:bg-primary/10 rounded-xl"
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>

            <Button
              onClick={() => router.push("/seller/products/add")}
              className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-lg hover:shadow-primary/40 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Welcome Banner */}
        <div
          className="mb-8 animate-slide-up glassy-card rounded-2xl p-1"
          style={{ animationDelay: "100ms" }}
        >
          <Card className="border-0 bg-gradient-to-r from-primary/15 via-primary/10 to-orange-500/5 shadow-none">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3 gap-3">
                    <div className="p-3 bg-primary/20 rounded-xl">
                      <Store className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-card-foreground">
                        {userData.shopName || "Your Store"}
                      </h2>
                      <Badge className="mt-1 bg-primary/20 text-primary border-primary/30 font-semibold">
                        {userData.status}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 text-lg">
                    {productStats
                      ? `You have ${productStats.totalProducts} amazing products in your inventory`
                      : "Start growing your business by adding products"}
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
                        Store Active
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
          {/* Total Revenue */}
          <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
            <Card className="hover:shadow-xl hover:border-primary/50 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50 hover:scale-105 transform">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Total Value
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      ₹
                      {productStats
                        ? productStats.totalValue.toLocaleString()
                        : "0"}
                    </p>
                    <p className="text-xs text-primary flex items-center mt-2 font-semibold">
                      <Target className="w-3 h-3 mr-1" />
                      Inventory Value
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Card className="hover:shadow-xl hover:border-green-500/50 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50 hover:scale-105 transform">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Products
                    </p>
                    <p className="text-3xl font-bold text-card-foreground">
                      {productStats
                        ? productStats.totalProducts
                        : products.length}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-2 font-semibold">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {productStats ? productStats.activeProducts : 0} Active
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-500/30 to-green-500/10 rounded-xl">
                    <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alert */}
          <div className="animate-slide-up" style={{ animationDelay: "250ms" }}>
            <Card className="hover:shadow-xl hover:border-orange-500/50 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50 hover:scale-105 transform">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Stock Status
                    </p>
                    <p className="text-3xl font-bold text-card-foreground">
                      {productStats ? productStats.lowStock : 0}
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center mt-2 font-semibold">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Low Stock Items
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-orange-500/30 to-orange-500/10 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Average Price */}
          <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
            <Card className="hover:shadow-xl hover:border-purple-500/50 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50 hover:scale-105 transform">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Avg. Price
                    </p>
                    <p className="text-3xl font-bold text-card-foreground">
                      ₹
                      {productStats
                        ? Math.round(productStats.averagePrice).toLocaleString()
                        : "0"}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center mt-2 font-semibold">
                      <Award className="w-3 h-3 mr-1" />
                      {productStats ? productStats.productsWithOffers : 0} With
                      Offers
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500/30 to-purple-500/10 rounded-xl">
                    <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div
            className="lg:col-span-2 animate-slide-up glassy-card rounded-2xl p-1"
            style={{ animationDelay: "350ms" }}
          >
            <Card className="border-0 shadow-none bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Zap className="w-6 h-6 text-primary mr-2" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Manage your store efficiently with these shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigation(action.href)}
                      style={{ animationDelay: `${index * 30}ms` }}
                      className="bg-background/50 hover:bg-primary/10 rounded-xl p-4 border border-primary/20 hover:border-primary/50 transition-all duration-300 text-left group transform hover:scale-105 animate-slide-up"
                    >
                      <div className="flex items-center mb-3">
                        <div
                          className={`p-2.5 ${action.color} rounded-lg group-hover:scale-120 transition-all duration-300 shadow-lg shadow-primary/20`}
                        >
                          <action.icon className="w-5 h-5" />
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="font-semibold text-card-foreground group-hover:text-primary transition-colors duration-200">
                            {action.title}
                          </h4>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {action.description}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Products */}
          <div
            className="animate-slide-up glassy-card rounded-2xl p-1"
            style={{ animationDelay: "400ms" }}
          >
            <Card className="border-0 shadow-none bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-xl">
                    <Package className="w-5 h-5 text-primary mr-2" />
                    Recent Products
                  </CardTitle>
                  {products.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/seller/viewproducts")}
                      className="hover:bg-primary/10 text-primary"
                    >
                      View All →
                    </Button>
                  )}
                </div>
                <CardDescription>Your latest additions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentProducts.length > 0 ? (
                  <div className="space-y-3">
                    {recentProducts.map((product, index) => (
                      <div
                        key={product.id}
                        style={{ animationDelay: `${index * 50}ms` }}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-primary/10 transition-all duration-300 cursor-pointer transform hover:scale-105 animate-fade-in group"
                        onClick={() =>
                          router.push(`/seller/viewproducts/edit/${product.id}`)
                        }
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                          {product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-primary" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-card-foreground truncate">
                            {product.name}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm font-bold text-primary">
                              ₹
                              {product.offerPrice > 0
                                ? product.offerPrice
                                : product.price}
                            </span>
                            <Badge
                              variant={
                                product.quantity > 5
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="text-xs bg-primary/20 text-primary border-0 font-semibold"
                            >
                              {product.quantity} left
                            </Badge>
                          </div>
                        </div>

                        <Edit className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-primary/30 hover:bg-primary/10 rounded-xl"
                      onClick={() => router.push("/seller/products/add")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Product
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 font-medium">
                      No products yet
                    </p>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground w-full rounded-lg hover:shadow-lg hover:shadow-primary/40"
                      onClick={() => router.push("/seller/products/add")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Product
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Alerts & Notifications */}
        {productStats &&
          (productStats.outOfStock > 0 || productStats.lowStock > 0) && (
            <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-700 dark:text-orange-300">
                  <Bell className="w-5 h-5 mr-2" />
                  Attention Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {productStats.outOfStock > 0 && (
                    <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                        <span className="text-red-700 dark:text-red-300">
                          {productStats.outOfStock} products are out of stock
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/seller/viewproducts")}
                      >
                        Manage Stock
                      </Button>
                    </div>
                  )}

                  {productStats.lowStock > 0 && (
                    <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                        <span className="text-yellow-700 dark:text-yellow-300">
                          {productStats.lowStock} products have low stock (≤5
                          items)
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/seller/viewproducts")}
                      >
                        Restock Items
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Recent Activity */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 text-primary mr-2" />
                Activity Overview
              </CardTitle>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>
            <CardDescription>
              Keep track of your store activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30"
                  >
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Plus className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        Added product: {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.created_at
                          ? new Date(product.created_at).toLocaleDateString()
                          : "Recently added"}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      New
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No recent activity</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start by adding your first product to see activity here
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity & Reviews Section */}
        <div
          className="mt-8 animate-slide-up glassy-card rounded-2xl p-1"
          style={{ animationDelay: "450ms" }}
        >
          <Card className="border-0 shadow-none bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-2xl">
                  <Activity className="w-6 h-6 text-primary mr-3" />
                  Recent Activity & Reviews
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:bg-primary/10"
                >
                  View All →
                </Button>
              </div>
              <CardDescription>
                Monitor customer interactions and store activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Feed */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center mb-4 animate-slide-left">
                    <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full mr-3"></div>
                    Store Activity
                  </h3>

                  {[
                    {
                      type: "sale",
                      message: "New order received",
                      time: "2 min ago",
                      icon: ShoppingCart,
                    },
                    {
                      type: "view",
                      message: "Product viewed 45 times",
                      time: "5 min ago",
                      icon: Eye,
                    },
                    {
                      type: "message",
                      message: "Customer inquiry received",
                      time: "12 min ago",
                      icon: MessageSquare,
                    },
                    {
                      type: "review",
                      message: "New 5-star review",
                      time: "1 hour ago",
                      icon: Star,
                    },
                    {
                      type: "stock",
                      message: "Low stock alert",
                      time: "2 hours ago",
                      icon: AlertCircle,
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      style={{ animationDelay: `${index * 80}ms` }}
                      className="activity-item flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-all duration-300 border border-primary/20 hover:border-primary/50 group transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 activity-badge-pulse group-hover:bg-primary/20 transition-all duration-300">
                        <activity.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                          {activity.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse group-hover:animate-pulse-glow"></div>
                    </div>
                  ))}
                </div>

                {/* Customer Reviews */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full mr-3"></div>
                    Customer Reviews
                  </h3>

                  {[
                    {
                      rating: 5,
                      name: "Raj Kumar",
                      product: "Premium Headphones",
                      comment: "Excellent quality and fast delivery!",
                      helpful: 24,
                    },
                    {
                      rating: 4,
                      name: "Priya Singh",
                      product: "Smart Watch",
                      comment: "Good product, could be better",
                      helpful: 12,
                    },
                    {
                      rating: 5,
                      name: "Amit Patel",
                      product: "Wireless Charger",
                      comment: "Amazing! Exactly what I needed",
                      helpful: 31,
                    },
                  ].map((review, index) => (
                    <div
                      key={index}
                      className="activity-item p-3 rounded-xl border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {review.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {review.product}
                          </p>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {review.comment}
                      </p>
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-primary hover:text-primary/80 font-semibold">
                          👍 Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
