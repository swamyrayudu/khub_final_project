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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
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

          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-primary/30 rounded-xl"
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
              className="bg-primary text-primary-foreground rounded-xl shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="mb-8 rounded-2xl">
          <Card className="border-border/50">
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
                  <div className="p-6 rounded-2xl">
                    <TrendingUp className="w-16 h-16 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div>
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Total Value
                    </p>
                    <p className="text-3xl font-bold text-foreground">
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
                  <div>
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <div>
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Products
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {productStats
                        ? productStats.totalProducts
                        : products.length}
                    </p>
                    <p className="text-xs flex items-center mt-2 font-semibold" style={{color: 'var(--green)'}}>
                      <CheckCircle className="w-3 h-3 mr-1" style={{color: 'var(--green)'}} />
                      {productStats ? productStats.activeProducts : 0} Active
                    </p>
                  </div>
                  <div>
                    <Package className="w-6 h-6" style={{color: 'var(--green)'}} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alert */}
          <div>
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Stock Status
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {productStats ? productStats.lowStock : 0}
                    </p>
                    <p className="text-xs flex items-center mt-2 font-semibold" style={{color: 'var(--orange)'}}>
                      <AlertCircle className="w-3 h-3 mr-1" style={{color: 'var(--orange)'}} />
                      Low Stock Items
                    </p>
                  </div>
                  <div>
                    <AlertCircle className="w-6 h-6" style={{color: 'var(--orange)'}} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Average Price */}
          <div>
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Avg. Price
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      ₹
                      {productStats
                        ? Math.round(productStats.averagePrice).toLocaleString()
                        : "0"}
                    </p>
                    <p className="text-xs flex items-center mt-2 font-semibold" style={{color: 'var(--purple)'}}>
                      <Award className="w-3 h-3 mr-1" style={{color: 'var(--purple)'}} />
                      {productStats ? productStats.productsWithOffers : 0} With
                      Offers
                    </p>
                  </div>
                  <div>
                    <Star className="w-6 h-6" style={{color: 'var(--purple)'}} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 rounded-2xl">
            <Card className="border-border/50">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigation(action.href)}
                      className="rounded-xl p-4 border border-primary/20 text-left cursor-pointer bg-card flex items-center justify-between"
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <div
                          className={`p-2.5 ${action.color} rounded-lg shadow-lg flex-shrink-0`}
                        >
                          <action.icon className="w-5 h-5" />
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground text-sm">
                            {action.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
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
          <div className="rounded-2xl">
            <Card className="border-border/50">
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
                    {recentProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-3 p-3 rounded-xl cursor-pointer"
                        onClick={() =>
                          router.push(`/seller/viewproducts/edit/${product.id}`)
                        }
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-primary/10">
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
                          <h4 className="font-semibold text-sm text-foreground truncate">
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

                        <Edit className="w-4 h-4 text-primary" />
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-primary/30 rounded-xl"
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
                      className="bg-primary text-primary-foreground w-full rounded-lg"
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
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 text-primary mr-2" />
                <span className="text-foreground" style={{background: 'none', transition: 'none', animation: 'none'}}>Activity Overview</span>
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
                    className="flex items-center space-x-4 p-4 rounded-xl border border-primary/10 cursor-pointer"
                  >
                    <div className="rounded-lg">
                      <Plus className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
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
      </div>

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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounceSubtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-bounce-subtle {
          animation: bounceSubtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
