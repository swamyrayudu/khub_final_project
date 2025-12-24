'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import {
  MapPin,
  Package,
  Search,
  Heart,
  Filter,
  ExternalLink,
  LogIn,
  ShoppingBag,
} from 'lucide-react';
import { getAllSellerProducts } from '@/actions/productActions';
import { addToWishlist } from '@/actions/wishlist-actions';
import { logProductViewEvent, logWishlistEvent } from '@/actions/sellerEventNotifications';
import { toast } from 'react-toastify';
import { useWishlist } from '@/contexts/WishlistContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/loading-page';
import { Carousel } from '@/components/ui/carousel';

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
  created_at?: string | Date;
  updated_at?: string | Date;
  sellerId?: string;
  sellerName?: string;
  sellerShopName?: string;
  sellerAddress?: string;
  sellerCity?: string;
  sellerState?: string;
}

const PRODUCTS_PER_PAGE = 12; // Load 12 products at a time

export default function Products() {
  const router = useRouter();
  const { status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [locationFilter, setLocationFilter] = useState<'all' | 'city' | 'state'>('all');
  const [userCity, setUserCity] = useState<string | null>(null);
  const [userState, setUserState] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ id: string; name: string; email: string } | null>(null);
  const [carouselItems, setCarouselItems] = useState<Array<{ id: string; image: string; title: string; description: string }>>([]);
  const [displayedCount, setDisplayedCount] = useState(PRODUCTS_PER_PAGE);
  const { wishlistItems, addToWishlistState, isInWishlist } = useWishlist();

  // Fetch carousel items first (priority)
  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        // Cache carousel data for 30 minutes
        const cacheKey = 'carousel_items_cache';
        const cachedData = sessionStorage.getItem(cacheKey);
        
        if (cachedData) {
          try {
            const cachedItems = JSON.parse(cachedData);
            setCarouselItems(cachedItems);
            return;
          } catch {
            // Invalid cache, fetch fresh
          }
        }

        const response = await fetch('/api/carousel', {
          next: { revalidate: 1800 }, // Cache for 30 minutes
        });
        if (response.ok) {
          const data = await response.json();
          const activeItems = (data.items || []).filter((item: { isActive?: boolean }) => item.isActive !== false);
          setCarouselItems(activeItems);
          // Store in session cache
          sessionStorage.setItem(cacheKey, JSON.stringify(activeItems));
        }
      } catch (error) {
        console.error('Error fetching carousel items:', error);
      }
    };

    fetchCarousel();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      // Don't fetch products if user is not authenticated
      if (status === 'unauthenticated') {
        setLoading(false);
        return;
      }
      
      if (status === 'loading') {
        return;
      }

      setLoading(true);
      try {
        // Add delay to prioritize carousel loading
        await new Promise(resolve => setTimeout(resolve, 300));

        // Check cache first
        const cacheKey = 'products_cache';
        const cachedProducts = sessionStorage.getItem(cacheKey);
        
        if (cachedProducts) {
          try {
            const cached = JSON.parse(cachedProducts);
            setProducts(cached);
            setFilteredProducts(cached);
            setLoading(false);
          } catch {
            // Invalid cache, continue fetching
          }
        }

        // Fetch user profile to get location and user info
        const profileResponse = await fetch('/api/user/profile-status', {
          next: { revalidate: 3600 }, // Cache for 1 hour
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          
          setUserCity(profileData.user.city);
          setUserState(profileData.user.state);
          
          const userInfo = {
            id: profileData.user.id || profileData.user._id,
            name: profileData.user.name,
            email: profileData.user.email,
          };
          
          setUserData(userInfo);
        } else {
          console.error('❌ Profile API error:', profileResponse.status);
        }

        const result = await getAllSellerProducts();
        if (result.success) {
          const mappedProducts = result.products.map((p: Product) => p);
          // Filter out products that are already in wishlist
          const filteredMapped = mappedProducts.filter(
            (p: Product) => !wishlistItems.includes(p.id)
          );
          setProducts(filteredMapped);
          setFilteredProducts(filteredMapped);
          // Cache products
          sessionStorage.setItem(cacheKey, JSON.stringify(filteredMapped));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [wishlistItems, status]);

  // Update displayed products when filtered products change or displayed count changes
  useEffect(() => {
    setDisplayedProducts(filteredProducts.slice(0, displayedCount));
  }, [filteredProducts, displayedCount]);

  // Load more products when user scrolls near bottom
  useEffect(() => {
    const handleScroll = () => {
      // Check if user is near bottom of page
      if ((window.innerHeight + document.documentElement.scrollTop) >= document.documentElement.scrollHeight - 500) {
        setDisplayedCount(prev => {
          const newCount = prev + PRODUCTS_PER_PAGE;
          return newCount <= filteredProducts.length ? newCount : prev;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredProducts.length]);

  // Filter products based on search, category, and location
  useEffect(() => {
    let filtered = products;

    // Location-based filtering
    if (locationFilter === 'city' && userCity) {
      filtered = filtered.filter(
        (p) => p.sellerCity?.toLowerCase() === userCity.toLowerCase()
      );
    } else if (locationFilter === 'state' && userState) {
      filtered = filtered.filter(
        (p) => p.sellerState?.toLowerCase() === userState.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
    // Reset displayed count when filter changes
    setDisplayedCount(PRODUCTS_PER_PAGE);
  }, [searchQuery, selectedCategory, products, locationFilter, userCity, userState]);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const calculateDiscount = (price: number, offerPrice: number) => {
    if (!offerPrice || offerPrice >= price) return 0;
    return Math.round(((price - offerPrice) / price) * 100);
  };

  const handleOpenInGoogleMaps = async (product: Product) => {
    // Log the event to seller
    if (userData && product.sellerId) {
      try {
        await logProductViewEvent(
          userData.id,
          userData.name,
          product.sellerId,
          product.name
        );
      } catch (error) {
        console.error('Error logging view event:', error);
      }
    } else {
      console.warn('⚠️ Cannot log view event - userData or sellerId missing:', { userData, sellerId: product.sellerId });
    }

    // Try to open the stored Google Maps URL first
    if (product.googleMapsUrl && product.googleMapsUrl.trim() !== '') {
      window.open(product.googleMapsUrl, '_blank');
      return;
    }

    // Fallback: use coordinates if available
    if (product.latitude && product.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${product.latitude},${product.longitude}`;
      window.open(url, '_blank');
      return;
    }

    toast.error('Google Maps location not available');
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      const result = await addToWishlist(productId);
      
      if (result.success) {
        // Find the product to get seller info
        const product = products.find(p => p.id === productId);
        
        // Log the event to seller
        if (userData && product?.sellerId) {
          try {
            await logWishlistEvent(
              userData.id,
              userData.name,
              product.sellerId,
              product.name
            );
          } catch (error) {
            console.error('Error logging wishlist event:', error);
          }
        } else {
          console.warn('⚠️ Cannot log wishlist event - userData or sellerId missing:', { userData, sellerId: product?.sellerId });
        }
        
        toast.success(result.message);
        // Update context and remove from current list
        addToWishlistState(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
        setFilteredProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Carousel Section - Always shows at top */}
      <div className="w-full px-4 py-4 bg-white dark:bg-slate-950">
        <div className="container mx-auto max-w-7xl">
          {carouselItems.length > 0 ? (
            <Carousel
              items={carouselItems}
              autoPlay={true}
              interval={5000}
              showDots={true}
              showArrows={true}
            />
          ) : (
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Loading carousel...</p>
            </div>
          )}
        </div>
      </div>

      {/* Show login prompt if user is not authenticated */}
      {status === 'unauthenticated' ? (
        <div>
          {/* Header Section */}
          <div className="border-b bg-card">
            <div className="container mx-auto max-w-7xl px-4 py-8">
              <h1 className="text-3xl font-bold mb-2">Products</h1>
              <p className="text-muted-foreground">
                Discover products from local stores
              </p>
            </div>
          </div>

          {/* Login Required Message */}
          <div className="container mx-auto max-w-7xl px-4 py-16">
            <div className="max-w-md mx-auto">
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Login Required</h2>
                  <p className="text-muted-foreground mb-6">
                    Please log in to view and purchase products from our local stores
                  </p>
                  <Link href="/auth">
                    <Button size="lg" className="gap-2 cursor-pointer">
                      <LogIn className="w-4 h-4" />
                      Sign In to Continue
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Products section - only for authenticated users */}
      <div className="border-b bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Products</h1>
              <p className="text-muted-foreground mb-6">
                Discover products from local stores
              </p>
            </div>

          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Location Filter */}
          {userCity && userState && (
            <div className="mt-4">
              <span className="text-sm text-muted-foreground block mb-2">Show products from:</span>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Button
                  variant={locationFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLocationFilter('all')}
                  className="gap-1 whitespace-nowrap flex-shrink-0 dark:text-foreground dark:border-slate-700 dark:hover:bg-slate-900"
                >
                  <Package className="w-4 h-4" />
                  All Locations
                </Button>
                <Button
                  variant={locationFilter === 'city' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLocationFilter('city')}
                  className="gap-1 whitespace-nowrap flex-shrink-0 dark:text-foreground dark:border-slate-700 dark:hover:bg-slate-900"
                >
                  <MapPin className="w-4 h-4" />
                  My City ({userCity})
                </Button>
                <Button
                  variant={locationFilter === 'state' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLocationFilter('state')}
                  className="gap-1 whitespace-nowrap flex-shrink-0 dark:text-foreground dark:border-slate-700 dark:hover:bg-slate-900"
                >
                  <MapPin className="w-4 h-4" />
                  My State ({userState})
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="whitespace-nowrap flex-shrink-0 dark:text-foreground dark:hover:bg-slate-900"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Results Count and Filter Status */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            {locationFilter !== 'all' && (
              <span className="ml-2">
                • Filtered by {locationFilter === 'city' ? `${userCity} (City)` : `${userState} (State)`}
              </span>
            )}
          </p>
          {locationFilter !== 'all' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocationFilter('all')}
              className="text-xs"
            >
              Clear Filter
            </Button>
          )}
        </div>

        {/* Loading State */}
        {status === 'loading' ? (
          <LoadingSpinner text="Loading products..." />
        ) : loading && displayedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading products...</p>
          </div>
        ) : displayedProducts.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Package className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedProducts.map((product) => {
                const discount = calculateDiscount(product.price, product.offerPrice);
                const finalPrice = product.offerPrice > 0 ? product.offerPrice : product.price;
                const hasLocation = product.latitude && product.longitude;
                const hasGoogleMapsUrl = product.googleMapsUrl && product.googleMapsUrl.trim() !== '';
                const productInWishlist = isInWishlist(product.id);

                return (
                  <Card 
                    key={product.id} 
                    className="dark:bg-black bg-white cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => router.push(`/shop/products/${product.id}`)}
                  >
                    {/* Image Section */}
                    <div className="relative w-full h-48 bg-muted overflow-hidden rounded-t-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/shop/products/${product.id}`);
                      }}
                    >
                      {discount > 0 && (
                        <Badge className="absolute top-2 left-2 z-10 text-xs" variant="destructive">
                          -{discount}%
                        </Badge>
                      )}
                      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
                        {hasLocation && (
                          <Badge className="text-xs bg-blue-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            Location
                          </Badge>
                        )}
                        {/* City/State Badge */}
                        {userCity && product.sellerCity?.toLowerCase() === userCity.toLowerCase() && (
                          <Badge className="text-xs bg-green-600">
                            Your City
                          </Badge>
                        )}
                        {userState && product.sellerState?.toLowerCase() === userState.toLowerCase() && 
                         (!userCity || product.sellerCity?.toLowerCase() !== userCity.toLowerCase()) && (
                          <Badge className="text-xs bg-amber-600">
                            Your State
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-2 right-2 z-10 h-8 w-8 bg-background/80 hover:bg-background"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Image
                        src={product.images[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base line-clamp-2 font-semibold">
                        {product.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{product.brand}</span>
                      {product.brand && product.category && <span>•</span>}
                      <span>{product.category}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-2">
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    {/* Seller Info */}
                    {(product.sellerShopName || product.sellerCity) && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 p-2 bg-muted/30 rounded">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <div className="line-clamp-1">
                          {product.sellerShopName && (
                            <span className="font-medium text-foreground">
                              {product.sellerShopName}
                            </span>
                          )}
                          {product.sellerCity && (
                            <span className="ml-1">• {product.sellerCity}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Price Section */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-xl font-bold">₹{finalPrice.toLocaleString()}</span>
                      {discount > 0 && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    {product.quantity <= 5 && product.quantity > 0 && (
                      <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                        Only {product.quantity} left
                      </Badge>
                    )}
                    {product.quantity === 0 && (
                      <Badge variant="secondary" className="text-xs">
                        Out of Stock
                      </Badge>
                    )}
                  </CardContent>

                  <CardFooter className="flex flex-col gap-2 p-4 pt-0">
                    {/* Add to Wishlist Button */}
                    <Button
                      className="w-full h-9"
                      size="sm"
                      disabled={productInWishlist}
                      onClick={() => handleAddToWishlist(product.id)}
                      variant={productInWishlist ? "secondary" : "default"}
                    >
                      <Heart className={`w-4 h-4 mr-1.5 ${productInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                      {productInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                    </Button>

                    {/* Open in Google Maps (only if URL or coordinates exist) */}
                    {(hasGoogleMapsUrl || hasLocation) && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full h-9"
                        onClick={() => handleOpenInGoogleMaps(product)}
                      >
                        <ExternalLink className="w-4 h-4 mr-1.5" />
                        Open in Google Maps
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
            </div>

            {/* Loading indicator when more products available */}
            {displayedCount < filteredProducts.length && (
              <div className="flex justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-3 border-muted border-t-primary rounded-full animate-spin"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading more products... ({displayedCount} of {filteredProducts.length})
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
        </>
      )}
    </div>
  );
}
