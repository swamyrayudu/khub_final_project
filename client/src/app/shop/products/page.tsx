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
  LogIn,
  ShoppingBag,
} from 'lucide-react';
import { getAllSellerProducts } from '@/actions/productActions';
import { addToWishlist, removeFromWishlist } from '@/actions/wishlist-actions';
import { logProductViewEvent, logWishlistEvent } from '@/actions/sellerEventNotifications';
import { toast } from 'sonner';
import { useWishlist } from '@/contexts/WishlistContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/loading-page';
import { Carousel } from '@/components/ui/carousel';
import { getProductsRatings, ReviewStats } from '@/actions/reviewActions';
import { Slider } from '@/components/ui/slider';
import { Star } from 'lucide-react';

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
  const { addToWishlistState, removeFromWishlistState, isInWishlist } = useWishlist();
  
  // Enhanced filtering states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [stockStatus, setStockStatus] = useState<'all' | 'in-stock' | 'low-stock'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [productRatings, setProductRatings] = useState<Map<string, ReviewStats>>(new Map());

  // Fetch carousel items first (priority) with smart caching
  useEffect(() => {
    const CAROUSEL_CACHE_KEY = 'carousel_cache';
    const CAROUSEL_CACHE_DURATION = 30000; // 30 seconds cache

    const fetchCarousel = async (useCache = true) => {
      try {
        // Check cache first for instant display
        if (useCache) {
          const cached = sessionStorage.getItem(CAROUSEL_CACHE_KEY);
          if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            const isValid = Date.now() - timestamp < CAROUSEL_CACHE_DURATION;
            if (isValid && data.length > 0) {
              setCarouselItems(data);
              return;
            }
          }
        }

        const response = await fetch('/api/carousel', {
          cache: 'no-store',
        });
        if (response.ok) {
          const data = await response.json();
          const activeItems = (data.items || []).filter((item: { isActive?: boolean }) => item.isActive !== false);
          setCarouselItems(activeItems);
          // Cache carousel data
          sessionStorage.setItem(CAROUSEL_CACHE_KEY, JSON.stringify({
            data: activeItems,
            timestamp: Date.now()
          }));
        }
      } catch (error) {
        console.error('Error fetching carousel items:', error);
      }
    };

    fetchCarousel(true); // Use cache on initial load
    
    // Refresh carousel every 30 seconds (reduced from 10s for better performance)
    const interval = setInterval(() => fetchCarousel(false), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const PRODUCTS_CACHE_KEY = 'products_cache';
    const PROFILE_CACHE_KEY = 'user_profile_cache';
    const RATINGS_CACHE_KEY = 'products_ratings_cache';
    const CACHE_DURATION = 60000; // 1 minute cache

    async function fetchProducts() {
      // Don't fetch products if user is not authenticated
      if (status === 'unauthenticated') {
        setLoading(false);
        return;
      }
      
      if (status === 'loading') {
        return;
      }

      // Immediately load from cache for instant display
      let usedCache = false;
      try {
        const cachedProducts = sessionStorage.getItem(PRODUCTS_CACHE_KEY);
        const cachedProfile = sessionStorage.getItem(PROFILE_CACHE_KEY);
        const cachedRatings = sessionStorage.getItem(RATINGS_CACHE_KEY);
        
        if (cachedProducts && cachedProfile) {
          const productsData = JSON.parse(cachedProducts);
          const profileData = JSON.parse(cachedProfile);
          
          const productsValid = Date.now() - (productsData.timestamp || 0) < CACHE_DURATION;
          const profileValid = Date.now() - (profileData.timestamp || 0) < CACHE_DURATION;
          
          if (productsValid && productsData.data?.length > 0) {
            setProducts(productsData.data);
            setFilteredProducts(productsData.data);
            usedCache = true;
          }
          
          if (profileValid && profileData.user) {
            setUserCity(profileData.user.city);
            setUserState(profileData.user.state);
            setUserData(profileData.userInfo);
          }
          
          if (cachedRatings) {
            const ratingsData = JSON.parse(cachedRatings);
            if (Date.now() - (ratingsData.timestamp || 0) < CACHE_DURATION) {
              setProductRatings(new Map(Object.entries(ratingsData.data)));
            }
          }
          
          if (usedCache) {
            setLoading(false);
          }
        }
      } catch {
        // Invalid cache, continue fetching
      }

      // Fetch fresh data in background (or immediately if no cache)
      if (!usedCache) {
        setLoading(true);
      }

      try {
        // Fetch profile and products in parallel for faster loading
        const [profileResponse, productsResult] = await Promise.all([
          sessionStorage.getItem(PROFILE_CACHE_KEY) 
            ? Promise.resolve(null) 
            : fetch('/api/user/profile-status'),
          getAllSellerProducts()
        ]);

        // Handle profile response
        if (profileResponse?.ok) {
          const profileData = await profileResponse.json();
          setUserCity(profileData.user.city);
          setUserState(profileData.user.state);
          
          const userInfo = {
            id: profileData.user.id || profileData.user._id,
            name: profileData.user.name,
            email: profileData.user.email,
          };
          setUserData(userInfo);
          
          // Cache profile with timestamp
          sessionStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ 
            user: profileData.user, 
            userInfo,
            timestamp: Date.now() 
          }));
        }

        // Handle products
        if (productsResult.success) {
          const mappedProducts = productsResult.products.map((p: Product) => p);
          setProducts(mappedProducts);
          setFilteredProducts(mappedProducts);
          
          // Cache products with timestamp
          sessionStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify({
            data: mappedProducts,
            timestamp: Date.now()
          }));
          
          // Fetch ratings in background (don't block UI)
          const productIds = mappedProducts.map((p: Product) => p.id);
          getProductsRatings(productIds).then(ratings => {
            setProductRatings(ratings);
            // Cache ratings
            sessionStorage.setItem(RATINGS_CACHE_KEY, JSON.stringify({
              data: Object.fromEntries(ratings),
              timestamp: Date.now()
            }));
          });
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [status]);

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

  // Filter products based on search, category, location, price, rating, and stock
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

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Price range filter
    filtered = filtered.filter((p) => {
      const price = p.offerPrice > 0 ? p.offerPrice : p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter((p) => {
        const rating = productRatings.get(p.id);
        return rating && rating.averageRating >= minRating;
      });
    }

    // Stock status filter
    if (stockStatus === 'in-stock') {
      filtered = filtered.filter((p) => p.quantity > 5);
    } else if (stockStatus === 'low-stock') {
      filtered = filtered.filter((p) => p.quantity > 0 && p.quantity <= 5);
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low': {
          const priceA = a.offerPrice > 0 ? a.offerPrice : a.price;
          const priceB = b.offerPrice > 0 ? b.offerPrice : b.price;
          return priceA - priceB;
        }
        case 'price-high': {
          const priceA2 = a.offerPrice > 0 ? a.offerPrice : a.price;
          const priceB2 = b.offerPrice > 0 ? b.offerPrice : b.price;
          return priceB2 - priceA2;
        }
        case 'rating': {
          const ratingA = productRatings.get(a.id)?.averageRating || 0;
          const ratingB = productRatings.get(b.id)?.averageRating || 0;
          return ratingB - ratingA;
        }
        case 'newest':
        default: {
          const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
          const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
          return dateB - dateA;
        }
      }
    });

    setFilteredProducts(filtered);
    // Reset displayed count when filter changes
    setDisplayedCount(PRODUCTS_PER_PAGE);
  }, [searchQuery, selectedCategory, products, locationFilter, userCity, userState, priceRange, minRating, stockStatus, sortBy, productRatings]);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const calculateDiscount = (price: number, offerPrice: number) => {
    if (!offerPrice || offerPrice >= price) return 0;
    return Math.round(((price - offerPrice) / price) * 100);
  };

  const handleOpenInGoogleMaps = async (product: Product) => {
    // Check if product has location data
    if (!product.latitude && !product.longitude && (!product.googleMapsUrl || product.googleMapsUrl.trim() === '')) {
      toast.error('Location not available for this product');
      return;
    }

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

    // Redirect to internal map page with product ID
    router.push(`/shop/map?productId=${product.id}`);
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      const isCurrentlyInWishlist = isInWishlist(productId);
      
      // Update context immediately for fast response
      if (isCurrentlyInWishlist) {
        removeFromWishlistState(productId);
      } else {
        addToWishlistState(productId);
      }

      // Make the API call
      const result = isCurrentlyInWishlist 
        ? await removeFromWishlist(productId)
        : await addToWishlist(productId);
      
      if (result.success) {
        // Find the product to get seller info (only for add action)
        if (!isCurrentlyInWishlist) {
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
          }
        }
        
        toast.success(result.message);
      } else {
        // Revert the optimistic update if API fails
        if (isCurrentlyInWishlist) {
          addToWishlistState(productId);
        } else {
          removeFromWishlistState(productId);
        }
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
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
                  className="gap-1 whitespace-nowrap shrink-0 dark:text-foreground dark:border-slate-700 dark:hover:bg-slate-900"
                >
                  <Package className="w-4 h-4" />
                  All Locations
                </Button>
                <Button
                  variant={locationFilter === 'city' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLocationFilter('city')}
                  className="gap-1 whitespace-nowrap shrink-0 dark:text-foreground dark:border-slate-700 dark:hover:bg-slate-900"
                >
                  <MapPin className="w-4 h-4" />
                  My City ({userCity})
                </Button>
                <Button
                  variant={locationFilter === 'state' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLocationFilter('state')}
                  className="gap-1 whitespace-nowrap shrink-0 dark:text-foreground dark:border-slate-700 dark:hover:bg-slate-900"
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
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="whitespace-nowrap shrink-0 dark:text-foreground dark:hover:bg-slate-900"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Enhanced Filters and Sorting */}
        <div className="mb-6 space-y-4">
          {/* Toggle Filters Button */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 shrink-0"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'price-low' | 'price-high' | 'rating')}
                className="text-sm border rounded-md px-2 md:px-3 py-1.5 bg-background min-w-35"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 md:p-4 border rounded-lg bg-muted/30 max-w-full overflow-hidden">
              {/* Price Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <div className="space-y-2">
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    min={0}
                    max={100000}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Rating</label>
                <div className="flex gap-1 flex-wrap">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`flex items-center gap-1 px-2 md:px-3 py-1.5 rounded-md text-xs border transition-colors shrink-0 ${
                        minRating === rating
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted'
                      }`}
                    >
                      {rating === 0 ? 'All' : (
                        <>
                          {rating}
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Status</label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={stockStatus === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStockStatus('all')}
                    className="shrink-0"
                  >
                    All
                  </Button>
                  <Button
                    variant={stockStatus === 'in-stock' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStockStatus('in-stock')}
                    className="shrink-0"
                  >
                    In Stock
                  </Button>
                  <Button
                    variant={stockStatus === 'low-stock' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStockStatus('low-stock')}
                    className="shrink-0"
                  >
                    Low Stock
                  </Button>
                </div>
              </div>
            </div>
          )}
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 auto-rows-fr">
              {displayedProducts.map((product) => {
                const discount = calculateDiscount(product.price, product.offerPrice);
                const finalPrice = product.offerPrice > 0 ? product.offerPrice : product.price;
                const hasLocation = product.latitude && product.longitude;
                const hasGoogleMapsUrl = product.googleMapsUrl && product.googleMapsUrl.trim() !== '';
                const productInWishlist = isInWishlist(product.id);

                return (
                  <Card 
                    key={product.id} 
                    className="dark:bg-black bg-white cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] overflow-hidden flex flex-col h-full"
                    onClick={() => router.push(`/shop/products/${product.id}`)}
                  >
                    {/* Image Section */}
                    <div className="relative w-full aspect-4/3 md:aspect-video bg-muted overflow-hidden"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/shop/products/${product.id}`);
                      }}
                    >
                      {discount > 0 && (
                        <Badge className="absolute top-1 left-1 z-10 text-[10px] px-1.5 py-0.5 font-bold" variant="destructive">
                          -{discount}%
                        </Badge>
                      )}
                      <div className="absolute top-1 right-1 z-10 flex flex-col gap-0.5 items-end">
                        {hasLocation && (
                          <Badge className="text-[9px] bg-blue-600 px-1 py-0.5 hidden md:flex">
                            <MapPin className="w-2.5 h-2.5 mr-0.5" />
                            Location
                          </Badge>
                        )}
                        {/* City/State Badge */}
                        {userCity && product.sellerCity?.toLowerCase() === userCity.toLowerCase() && (
                          <Badge className="text-[9px] bg-green-600 px-1 py-0.5 hidden md:flex">
                            Your City
                          </Badge>
                        )}
                        {userState && product.sellerState?.toLowerCase() === userState.toLowerCase() && 
                         (!userCity || product.sellerCity?.toLowerCase() !== userCity.toLowerCase()) && (
                          <Badge className="text-[9px] bg-amber-600 px-1 py-0.5 hidden md:flex">
                            Your State
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-1 right-1 z-10 h-6 w-6 md:h-7 md:w-7 bg-background/80 hover:bg-background hidden md:flex"
                      >
                        <Heart className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      </Button>
                      <Image
                        src={product.images[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <CardHeader className="p-1.5 md:p-2.5 pb-0.5 md:pb-1">
                      <CardTitle className="text-[11px] md:text-sm line-clamp-2 font-semibold leading-tight min-h-7 md:min-h-9">
                        {product.name}
                      </CardTitle>
                      <div className="hidden md:flex items-center justify-between gap-1 mt-0.5">
                        <div className="flex items-center gap-1 text-[9px] text-muted-foreground line-clamp-1">
                          <span className="truncate">{product.brand}</span>
                        </div>
                      </div>
                    </CardHeader>

                  <CardContent className="p-1.5 md:p-2.5 pt-0 space-y-0.5 md:space-y-1 flex-1">
                    {/* Seller Info - Only on desktop */}
                    {(product.sellerShopName || product.sellerCity) && (
                      <div className="hidden md:flex items-center gap-1 text-[9px] text-muted-foreground p-1 bg-muted/30 rounded">
                        <MapPin className="w-2.5 h-2.5 shrink-0" />
                        <div className="line-clamp-1 text-[9px]">
                          {product.sellerShopName && (
                            <span className="font-medium text-foreground">
                              {product.sellerShopName}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Price Section */}
                    <div className="flex items-baseline gap-1 mt-auto">
                      <span className="text-xs md:text-base font-bold">₹{Math.round(finalPrice).toLocaleString()}</span>
                      {discount > 0 && (
                        <span className="text-[8px] md:text-[10px] text-muted-foreground line-through">
                          ₹{Math.round(product.price).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-1 p-1.5 md:p-2.5 pt-0">
                    {/* Add to Wishlist Button */}
                    <Button
                      className="w-full h-6 md:h-7 cursor-pointer text-[9px] md:text-xs font-medium"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWishlist(product.id);
                      }}
                      variant={productInWishlist ? "secondary" : "default"}
                    >
                      <Heart className={`w-3 h-3 mr-1 ${productInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                      <span className="hidden md:inline">{productInWishlist ? 'Saved' : 'Wishlist'}</span>
                      <span className="md:hidden">{productInWishlist ? 'Saved' : 'Wishlist'}</span>
                    </Button>

                    {/* View on Map (only if URL or coordinates exist) */}
                    {(hasGoogleMapsUrl || hasLocation) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-6 md:h-7 cursor-pointer text-[9px] md:text-xs font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenInGoogleMaps(product);
                        }}
                      >
                        <MapPin className="w-3 h-3 mr-0.5 md:mr-1" />
                        <span className="hidden md:inline">Location</span>
                        <span className="md:hidden">Map</span>
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
