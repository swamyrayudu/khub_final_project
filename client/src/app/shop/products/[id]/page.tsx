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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
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
    if (product?.googleMapsUrl) {
      window.open(product.googleMapsUrl, '_blank');
    } else if (product?.latitude && product?.longitude) {
      const mapsUrl = `https://www.google.com/maps/?q=${product.latitude},${product.longitude}`;
      window.open(mapsUrl, '_blank');
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
      <div className="border-b bg-card/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1 line-clamp-1">{product.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-600 text-white">
                  -{discount}%
                </Badge>
              )}
              {product.quantity <= 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-primary' : 'border-border'
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
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                {product.brand && (
                  <Badge variant="secondary">{product.brand}</Badge>
                )}
                {product.category && (
                  <Badge variant="outline">{product.category}</Badge>
                )}
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-foreground">
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
                {product.offerPrice > 0 && product.price > product.offerPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <span className="text-lg font-semibold text-green-600">
                  You save ₹{(product.price - product.offerPrice).toLocaleString('en-IN')} ({discount}%)
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.quantity > 0 ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    In Stock ({product.quantity} available)
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-600">Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product Details</h3>
                <div className="space-y-3 text-sm">
                  {product.sku && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU:</span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">{product.weight}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span className="font-medium">{product.dimensions}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleAddToWishlist}
                variant={inWishlist ? 'default' : 'outline'}
                size="lg"
                className="flex-1 gap-2"
                disabled={product.quantity <= 0}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
              <Button
                onClick={handleContact}
                size="lg"
                className="flex-1 gap-2"
                disabled={product.quantity <= 0}
              >
                <MessageSquare className="w-5 h-5" />
                Contact Seller
              </Button>
            </div>
          </div>
        </div>

        {/* Seller Information */}
        {(product.sellerShopName || product.sellerCity) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.sellerShopName && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Shop Name</h4>
                  <p className="text-lg font-medium">{product.sellerShopName}</p>
                </div>
              )}
              {product.sellerAddress && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Address</h4>
                  <p className="text-base">{product.sellerAddress}</p>
                </div>
              )}
              {(product.sellerCity || product.sellerState) && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Location</h4>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <p className="text-base">
                      {product.sellerCity}
                      {product.sellerCity && product.sellerState && ', '}
                      {product.sellerState}
                    </p>
                  </div>
                </div>
              )}
              {(product.googleMapsUrl || (product.latitude && product.longitude)) && (
                <Button
                  onClick={handleOpenInGoogleMaps}
                  variant="outline"
                  className="w-full gap-2 mt-4"
                >
                  <MapPin className="w-4 h-4" />
                  View on Google Maps
                </Button>
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
      </div>
    </div>
  );
}
