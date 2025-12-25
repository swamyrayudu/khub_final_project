"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
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
  ArrowRight,
  ShoppingBag,
  Star,
  Bell,
  Settings,
  MessageSquare,
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
import { LoadingSpinner } from "@/components/ui/loading-page";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner text="Loading your dashboard..." />
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              Dashboard
            </h1>
            <Button
              onClick={() => router.push("/seller/products/add")}
              size="default"
              className="shrink-0 text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 h-auto"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground truncate">
            Welcome back,{" "}
            <span className="font-semibold text-foreground">
              {userData.name}
            </span>{" "}
            👋
          </p>
        </div>

        {/* Welcome Banner */}
        <Card className="mb-4 sm:mb-6 lg:mb-8">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4 lg:gap-6">
              <div className="flex-1 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-2.5 bg-primary/10 rounded-lg sm:rounded-xl">
                    <Store className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-foreground">
                      {userData.shopName || "Your Store"}
                    </h2>
                    <Badge variant="secondary" className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs">
                      ✓ {userData.status}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                  {productStats
                    ? `You have ${productStats.totalProducts} amazing products in your inventory`
                    : "Start growing your business by adding products"}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <div className="flex items-center text-[10px] sm:text-xs lg:text-sm text-muted-foreground bg-muted px-2 sm:px-3 py-1 sm:py-1.5 rounded-md">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="sm:hidden">
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-[10px] sm:text-xs lg:text-sm bg-muted px-2 sm:px-3 py-1 sm:py-1.5 rounded-md">
                    <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 mr-1 sm:mr-2 text-green-600 dark:text-green-400" />
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Store Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex items-center justify-center">
                <div className="p-4 bg-primary/10 rounded-xl">
                  <TrendingUp className="w-12 h-12 text-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Total Value */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                    Total Value
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate">
                    ₹{productStats ? productStats.totalValue.toLocaleString() : "0"}
                  </p>
                </div>
                <div className="p-2 sm:p-2.5 bg-primary/10 rounded-lg flex-shrink-0">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <Target className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">Inventory Value</span>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                    Products
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                    {productStats ? productStats.totalProducts : products.length}
                  </p>
                </div>
                <div className="p-2 sm:p-2.5 bg-green-500/10 dark:bg-green-500/20 rounded-lg flex-shrink-0">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-2">
                <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{productStats ? productStats.activeProducts : 0} Active</span>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                    Stock Status
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                    {productStats ? productStats.lowStock : 0}
                  </p>
                </div>
                <div className="p-2 sm:p-2.5 bg-orange-500/10 dark:bg-orange-500/20 rounded-lg flex-shrink-0">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="flex items-center text-xs text-orange-600 dark:text-orange-400 mt-2">
                <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">Low Stock Items</span>
              </div>
            </CardContent>
          </Card>

          {/* Average Price */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                    Avg. Price
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate">
                    ₹{productStats ? Math.round(productStats.averagePrice).toLocaleString() : "0"}
                  </p>
                </div>
                <div className="p-2 sm:p-2.5 bg-primary/10 rounded-lg flex-shrink-0">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <Award className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{productStats ? productStats.productsWithOffers : 0} With Offers</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Manage your store efficiently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigation(action.href)}
                      className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-border bg-card text-left hover:bg-accent hover:border-accent-foreground/20 transition-colors"
                    >
                      <div className="flex items-center flex-1 min-w-0 gap-3">
                        <div className={`p-2 sm:p-2.5 ${action.color} rounded-lg flex-shrink-0`}>
                          <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm sm:text-base">
                            {action.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">
                            {action.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground ml-2 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Products */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2 sm:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Recent Products
                </CardTitle>
                {products.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/seller/viewproducts")}
                    className="text-xs text-primary"
                  >
                    View All
                  </Button>
                )}
              </div>
              <CardDescription className="text-xs sm:text-sm">
                Latest additions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentProducts.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {recentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg border border-border bg-card hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => router.push(`/seller/viewproducts/edit/${product.id}`)}
                    >
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
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
                            <Package className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-semibold text-primary">
                            ₹{product.offerPrice > 0 ? product.offerPrice : product.price}
                          </span>
                          <Badge variant="secondary" className="text-xs px-1.5 py-0">
                            {product.quantity} left
                          </Badge>
                        </div>
                      </div>

                      <Edit className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => router.push("/seller/products/add")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Product
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    No products yet
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
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

        {/* Alerts & Notifications */}
        {productStats && (productStats.outOfStock > 0 || productStats.lowStock > 0) && (
          <Card className="mb-6 sm:mb-8 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-orange-700 dark:text-orange-300">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                Attention Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {productStats.outOfStock > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 bg-destructive/10 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                    <span className="text-sm text-destructive font-medium">
                      {productStats.outOfStock} products are out of stock
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/seller/viewproducts")}
                    className="w-full sm:w-auto"
                  >
                    Manage Stock
                  </Button>
                </div>
              )}

              {productStats.lowStock > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 bg-orange-500/10 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    <span className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                      {productStats.lowStock} products have low stock (≤5 items)
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/seller/viewproducts")}
                    className="w-full sm:w-auto"
                  >
                    Restock Items
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Activity Overview
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                View Details
              </Button>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              Keep track of your store activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
                  >
                    <div className="p-2 bg-green-500/10 dark:bg-green-500/20 rounded-md flex-shrink-0">
                      <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        Added product: {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.created_at
                          ? new Date(product.created_at).toLocaleDateString()
                          : "Recently added"}
                      </p>
                    </div>
                    
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      New
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">No recent activity</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start by adding your first product to see activity here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
