"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import { getSellerProducts, deleteProduct } from "@/actions/productActions";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Package,
  Edit,
  Eye,
  Trash2,
  ShoppingBag,
  IndianRupee,
  Calendar,
  Hash,
  Box,
  Search,
  Grid3X3,
  List,
  Loader2,
  ArrowLeft,
  Home,
} from "lucide-react";

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

export default function ViewProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // ✅ Delete functionality states
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: '',
    productName: '',
    isDeleting: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await getSellerProducts();
      if (result.success) {
        setProducts(result.products);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle delete product
  const handleDeleteClick = (productId: string, productName: string) => {
    setDeleteModal({
      isOpen: true,
      productId,
      productName,
      isDeleting: false
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.productId) return;

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      const result = await deleteProduct(deleteModal.productId);
      
      if (result.success) {
        toast.success(result.message, {
          duration: 3000,
        });
        
        // Remove product from local state
        setProducts(prev => prev.filter(p => p.id !== deleteModal.productId));
        
        // Close modal
        setDeleteModal({
          isOpen: false,
          productId: '',
          productName: '',
          isDeleting: false
        });
      } else {
        toast.error(result.message, {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete product. Please try again.');
    } finally {
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      productId: '',
      productName: '',
      isDeleting: false
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map((p) => p.category))].filter(
    Boolean
  );

  const calculateDiscount = (price: number, offerPrice: number) => {
    if (offerPrice > 0 && offerPrice < price) {
      return Math.round(((price - offerPrice) / price) * 100);
    }
    return 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 py-3 sm:py-6 lg:py-10 px-3 sm:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 lg:w-10 lg:h-10 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Loading your products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 py-3 sm:py-6 lg:py-10 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Responsive */}
        <div className="mb-4 sm:mb-5 lg:mb-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-3 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/seller/home")}
              className="h-8 px-2 hover:bg-muted rounded-lg text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span className="font-medium">Back</span>
            </Button>

            <Button
              onClick={() => router.push("/seller/products/add")}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Product
            </Button>
          </div>

          {/* Mobile/Tablet Title with Icon */}
          <div className="flex items-center gap-3 mb-3 lg:hidden">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-card-foreground">
                Your Products
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage your inventory • {products.length} product{products.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/seller/home")}
                className="bg-card border-border hover:bg-muted/50 transition-colors duration-200 h-9 px-3 text-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Back to Home
              </Button>
              
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">
                  Your Products
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your inventory • {products.length} product
                  {products.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/seller/home")}
                className="bg-card border-border hover:bg-muted/50 transition-colors duration-200 h-9 w-9"
                title="Go to Dashboard"
              >
                <Home className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => router.push("/seller/products/add")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-5 text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Product
              </Button>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          /* Empty State */
          <div className="bg-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center shadow-xl border border-border backdrop-blur-sm">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Package className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-card-foreground mb-3 sm:mb-4">
              No Products Yet
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto px-4">
              Start building your inventory by adding your first product. You
              can upload images, set prices, and manage your catalog.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/seller/home")}
                className="bg-card border-border hover:bg-muted/50 w-full sm:w-auto h-10 sm:h-11 lg:h-12 text-sm sm:text-base"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                onClick={() => router.push("/seller/products/add")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto h-10 sm:h-11 lg:h-12 text-sm sm:text-base font-medium"
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Add Your First Product
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Filters and Search */}
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg border border-border backdrop-blur-sm mb-4 sm:mb-5">
              <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:gap-3">
                {/* Search */}
                <div className="relative flex-1 lg:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex-1 lg:flex-none lg:min-w-[160px] px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  {/* View Toggle */}
                  <div className="flex items-center gap-0.5 bg-background border border-border rounded-lg p-0.5">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="h-8 w-8 p-0"
                      title="Grid view"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-8 w-8 p-0"
                      title="List view"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {searchTerm && (
                <div className="mt-3 text-xs text-muted-foreground">
                  Showing {filteredProducts.length} result
                  {filteredProducts.length !== 1 ? "s" : ""} for &quot;{searchTerm}&quot;
                </div>
              )}
            </div>

            {/* Products Grid/List */}
            <div
              className={`grid gap-3 sm:gap-4 lg:gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product) => {
                const discount = calculateDiscount(
                  product.price,
                  product.offerPrice
                );

                return (
                  <Card
                    key={product.id}
                    className={`bg-card border-border shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden rounded-lg sm:rounded-xl group ${
                      viewMode === "list" ? "flex flex-col sm:flex-row" : ""
                    }`}
                  >
                    {/* Product Image */}
                    <div
                      className={`relative bg-muted ${
                        viewMode === "list"
                          ? "w-full sm:w-40 lg:w-52 flex-shrink-0 aspect-video sm:aspect-square"
                          : "aspect-square"
                      }`}
                    >
                      {product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes={
                            viewMode === "list"
                              ? "208px"
                              : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          }
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Package className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/50" />
                        </div>
                      )}

                      {/* Status Badge */}
                      <Badge
                        className={`absolute top-2 left-2 text-[10px] sm:text-xs font-medium px-2 py-0.5 shadow-sm ${
                          product.status === "active"
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-gray-500 hover:bg-gray-600 text-white"
                        }`}
                      >
                        {product.status}
                      </Badge>

                      {/* Discount Badge */}
                      {discount > 0 && (
                        <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 shadow-sm">
                          {discount}% OFF
                        </Badge>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-3 sm:p-4 flex-1 flex flex-col">
                      <div className="flex-1 space-y-2 sm:space-y-2.5">
                        {/* Product Name & Category */}
                        <div>
                          <h3 className="font-semibold text-card-foreground text-sm sm:text-base lg:text-lg line-clamp-2 mb-1">
                            {product.name}
                          </h3>
                          {product.category && (
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {product.category}
                            </p>
                          )}
                        </div>

                        {/* Description */}
                        {product.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        )}

                        {/* Pricing */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground">
                            <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>
                              {product.offerPrice > 0 &&
                              product.offerPrice < product.price
                                ? Math.round(product.offerPrice)
                                : Math.round(product.price)}
                            </span>
                          </div>
                          {product.offerPrice > 0 &&
                            product.offerPrice < product.price && (
                              <div className="flex items-center text-xs sm:text-sm text-muted-foreground line-through">
                                <IndianRupee className="w-3 h-3" />
                                <span>{Math.round(product.price)}</span>
                              </div>
                            )}
                        </div>

                        {/* Product Info Grid */}
                        <div className="grid grid-cols-2 gap-2 py-2 border-y border-border/50">
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                            <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">Qty: <span className="font-medium text-card-foreground">{product.quantity}</span></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                            <Box className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">SKU: <span className="font-medium text-card-foreground">{product.sku || "N/A"}</span></span>
                          </div>
                        </div>

                        {/* Tags */}
                        {product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {product.tags.slice(0, 3).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-[10px] sm:text-xs px-2 py-0.5 font-normal"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {product.tags.length > 3 && (
                              <Badge variant="secondary" className="text-[10px] sm:text-xs px-2 py-0.5 font-normal">
                                +{product.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Created Date */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">Added {formatDate(product.created_at || product.createdAt || '')}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-9 sm:h-10 text-xs sm:text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => router.push(`/seller/viewproducts/view/${product.id}`)}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
                          <span>View</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-9 sm:h-10 text-xs sm:text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() =>
                            router.push(`/seller/viewproducts/edit/${product.id}`)
                          }
                        >
                          <Edit className="w-3.5 h-3.5 mr-1.5" />
                          <span>Edit</span>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="h-9 sm:h-10 w-9 sm:w-10 p-0 hover:bg-destructive/90"
                          onClick={() => handleDeleteClick(product.id, product.name)}
                          disabled={deleteModal.isDeleting && deleteModal.productId === product.id}
                          title="Delete product"
                        >
                          {deleteModal.isDeleting && deleteModal.productId === product.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="bg-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-xl border border-border backdrop-blur-sm">
                <Search className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-card-foreground mb-2">
                  No products found
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </>
        )}

        {/* ✅ Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          productName={deleteModal.productName}
          isLoading={deleteModal.isDeleting}
        />
      </div>
    </div>
  );
}
