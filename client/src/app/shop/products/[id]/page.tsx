'use client';

import React, { useState, useEffect } from 'react';

import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import {
  ArrowLeft,
  MapPin,
  Heart,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Navigation,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-page';
import { addToWishlist } from '@/actions/wishlist-actions';
import { useWishlist } from '@/contexts/WishlistContext';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';

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
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  sellerId?: string;
  sellerName?: string;
  sellerShopName?: string;
  sellerAddress?: string;
  sellerCity?: string;
  sellerState?: string;
}

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const { isInWishlist } = useWishlist();
  
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) {
          toast.error('Product not found');
          router.push('/shop/products');
          return;
        }

        // Fetch product details from API or database
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          toast.error('Failed to load product');
          router.push('/shop/products');
          return;
        }

        const data = await response.json();
        setProduct(data.product);
        setInWishlist(isInWishlist(productId));

        // Fetch related products from the same category
        if (data.product?.category) {
          try {
            const relatedResponse = await fetch(`/api/products?category=${encodeURIComponent(data.product.category)}&limit=10`);
            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json();
              // Filter out the current product and limit to 8 products
              const filtered = (relatedData.products || [])
                .filter((p: Product) => p.id !== productId)
                .slice(0, 8);
              setRelatedProducts(filtered);
            }
          } catch (relatedError) {
            console.error('Error fetching related products:', relatedError);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
        router.push('/shop/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router, isInWishlist]);

  const handleAddToWishlist = async () => {
    if (status === 'unauthenticated') {
      toast.error('Please login to add to wishlist');
      router.push('/auth');
      return;
    }

    try {
      await addToWishlist(productId);
      setInWishlist(true);
      toast.success('Added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  const handleContact = () => {
    if (status === 'unauthenticated') {
      toast.error('Please login to contact seller');
      router.push('/auth');
      return;
    }
    router.push(`/shop/messages`);
  };

  const handleOpenInGoogleMaps = () => {
    // Redirect to internal map page
    if (product?.latitude && product?.longitude) {
      router.push(`/shop/map?productId=${product.id}`);
    } else if (product?.googleMapsUrl) {
      router.push(`/shop/map?productId=${product.id}`);
    } else {
      toast.error('Location not available for this product');
    }
  };

  const handleGetDirections = () => {
    if (product?.latitude && product?.longitude) {
      router.push(`/shop/map?productId=${product.id}`);
    } else if (product?.googleMapsUrl) {
      router.push(`/shop/map?productId=${product.id}`);
    } else {
      toast.error('Location not available for this product');
    }
  };

  const calculateDiscount = (originalPrice: number, offerPrice: number) => {
    if (offerPrice <= 0) return 0;
    return Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner text="Loading product details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/shop/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.offerPrice);
  const finalPrice = product.offerPrice > 0 ? product.offerPrice : product.price;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-accent"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1 line-clamp-1">{product.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Images Section */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-linear-to-br from-muted to-muted/50 rounded-xl overflow-hidden shadow-lg border border-border/50">
              <Image
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-3 py-1.5 shadow-lg">
                  -{discount}% OFF
                </Badge>
              )}
              {product.quantity <= 0 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-white mx-auto mb-2" />
                    <span className="text-white font-bold text-lg">Out of Stock</span>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      selectedImage === index 
                        ? 'border-primary shadow-md ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:col-span-6 space-y-6">
            {/* Title & Category */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {product.brand && (
                  <Badge variant="secondary" className="text-xs font-medium px-3 py-1">
                    {product.brand}
                  </Badge>
                )}
                {product.category && (
                  <Badge variant="outline" className="text-xs font-medium px-3 py-1">
                    {product.category}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">{product.name}</h1>
            </div>

            {/* Price Section */}
            <div className="bg-linear-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-xl p-6 border border-primary/10">
              <div className="space-y-3">
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className="text-4xl md:text-5xl font-bold text-foreground">
                    ₹{Math.round(finalPrice).toLocaleString('en-IN')}
                  </span>
                  {product.offerPrice > 0 && product.price > product.offerPrice && (
                    <span className="text-2xl text-muted-foreground line-through">
                      ₹{Math.round(product.price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1">
                      SAVE {discount}%
                    </Badge>
                    <span className="text-base font-semibold text-green-600">
                      You save ₹{Math.round(product.price - product.offerPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50">
              {product.quantity > 0 ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-sm font-semibold text-green-600">
                    In Stock • {product.quantity} {product.quantity === 1 ? 'item' : 'items'} available
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="text-sm font-semibold text-red-600">Currently Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="space-y-4 pb-6 border-b border-border">
              <h3 className="text-lg font-bold">Product Description</h3>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
              {/* Key Features - if description has multiple lines/points */}
              {product.description && product.description.includes('.') && (
                <div className="space-y-3 mt-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Key Highlights</h4>
                  <div className="grid gap-2">
                    {product.description.split(/[.•\n]/).filter(point => point.trim() && point.trim().length > 5).slice(0, 5).map((point, index) => (
                      <div key={index} className="flex gap-3 items-start bg-muted/20 p-3 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <p className="text-sm text-foreground leading-relaxed flex-1">{point.trim()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold">Product Specifications</h3>
              <div className="grid grid-cols-1 gap-3">
                {product.sku && (
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium text-muted-foreground">SKU</span>
                    <span className="text-sm font-semibold text-foreground">{product.sku}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium text-muted-foreground">Weight</span>
                    <span className="text-sm font-semibold text-foreground">{product.weight}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium text-muted-foreground">Dimensions</span>
                    <span className="text-sm font-semibold text-foreground">{product.dimensions}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleAddToWishlist}
                  variant={inWishlist ? 'default' : 'outline'}
                  size="lg"
                  className="h-12 gap-2 font-semibold text-base"
                  disabled={product.quantity <= 0}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                  {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
                <Button
                  onClick={handleContact}
                  size="lg"
                  className="h-12 gap-2 font-semibold text-base bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  disabled={product.quantity <= 0}
                >
                  <MessageSquare className="w-5 h-5" />
                  Contact Seller
                </Button>
              </div>
              
              {/* Location Button */}
              {(product.googleMapsUrl || (product.latitude && product.longitude)) && (
                <Button
                  onClick={handleOpenInGoogleMaps}
                  variant="outline"
                  size="lg"
                  className="w-full h-12 gap-2 font-semibold text-base border-primary/50 hover:bg-primary/10"
                >
                  <MapPin className="w-5 h-5 text-primary" />
                  View Store Location on Map
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Seller Information */}
        {(product.sellerShopName || product.sellerCity) && (
          <Card className="mb-10 overflow-hidden border-border/50 shadow-md">
            <CardHeader className="bg-linear-to-r from-muted/50 to-muted/30 border-b">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Seller Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.sellerShopName && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Shop Name</h4>
                    <p className="text-lg font-bold text-foreground">{product.sellerShopName}</p>
                  </div>
                )}
                {product.sellerAddress && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Address</h4>
                    <p className="text-base text-foreground">{product.sellerAddress}</p>
                  </div>
                )}
                {(product.sellerCity || product.sellerState) && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Location</h4>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <p className="text-base font-medium text-foreground">
                        {product.sellerCity}
                        {product.sellerCity && product.sellerState && ', '}
                        {product.sellerState}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {(product.googleMapsUrl || (product.latitude && product.longitude)) && (
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button
                    onClick={handleGetDirections}
                    className="flex-1 gap-2 h-11 font-semibold"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </Button>
                  <Button
                    onClick={handleOpenInGoogleMaps}
                    variant="outline"
                    className="flex-1 gap-2 h-11 font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    View on Google Maps
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Reviews Section */}
        {product.sellerId && (
          <ReviewsSection
            productId={product.id}
            sellerId={product.sellerId}
            productName={product.name}
          />
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Related Products</h2>
                <p className="text-sm text-muted-foreground mt-1">More products in {product.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={() => {
                    const container = document.getElementById('related-products-scroll');
                    if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={() => {
                    const container = document.getElementById('related-products-scroll');
                    if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div
              id="related-products-scroll"
              className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {relatedProducts.map((relatedProduct) => {
                const relatedDiscount = relatedProduct.offerPrice > 0 
                  ? Math.round(((relatedProduct.price - relatedProduct.offerPrice) / relatedProduct.price) * 100)
                  : 0;
                const relatedFinalPrice = relatedProduct.offerPrice > 0 ? relatedProduct.offerPrice : relatedProduct.price;

                return (
                  <Card
                    key={relatedProduct.id}
                    className="shrink-0 w-45 md:w-55 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] overflow-hidden snap-start"
                    onClick={() => router.push(`/shop/products/${relatedProduct.id}`)}
                  >
                    {/* Image */}
                    <div className="relative w-full aspect-square bg-muted overflow-hidden">
                      {relatedDiscount > 0 && (
                        <Badge className="absolute top-2 left-2 z-10 text-xs font-bold" variant="destructive">
                          -{relatedDiscount}%
                        </Badge>
                      )}
                      <Image
                        src={relatedProduct.images?.[0] || '/placeholder-product.jpg'}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <CardContent className="p-3">
                      {/* Product Name */}
                      <h3 className="text-sm font-medium line-clamp-2 mb-2 min-h-10">
                        {relatedProduct.name}
                      </h3>

                      {/* Brand */}
                      {relatedProduct.brand && (
                        <p className="text-xs text-muted-foreground mb-2 truncate">
                          {relatedProduct.brand}
                        </p>
                      )}

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-base md:text-lg font-bold">
                          ₹{Math.round(relatedFinalPrice).toLocaleString()}
                        </span>
                        {relatedDiscount > 0 && (
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{Math.round(relatedProduct.price).toLocaleString()}
                          </span>
                        )}
                      </div>
                      {relatedDiscount > 0 && (
                        <span className="text-xs text-green-600 font-medium">
                          {relatedDiscount}% off
                        </span>
                      )}

                      {/* Location */}
                      {relatedProduct.sellerCity && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{relatedProduct.sellerCity}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
