'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapWithDirections } from '@/components/map';
import type { StoreLocation } from '@/components/map';
import { getAllSellerProducts } from '@/actions/productActions';
import { trackLocationView } from '@/actions/locationNotifications';
import { Loader2, MapPin } from 'lucide-react';

function MapContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Track location view if productId is present
    if (productId) {
      trackLocationView(productId).catch((error) => {
        console.error('Failed to track location view:', error);
      });
    }
  }, [productId]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const result = await getAllSellerProducts();

        if (result.success && result.products) {
          // Transform products to store locations
          const storeLocations: StoreLocation[] = result.products
            .filter((product) => product.latitude && product.longitude)
            .map((product) => ({
              id: product.id,
              name: product.name,
              latitude: product.latitude!,
              longitude: product.longitude!,
              address: [product.sellerAddress, product.sellerCity, product.sellerState]
                .filter(Boolean)
                .join(', '),
              shopName: product.sellerShopName,
              productName: product.name,
              price: product.offerPrice > 0 ? product.offerPrice : product.price,
              image: product.images?.[0],
            }));

          setStores(storeLocations);
        } else {
          setError('Failed to load store locations');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('An error occurred while loading stores');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading store locations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Store Locations & Directions
          </h1>
          <p className="text-muted-foreground mt-1">
            Find nearby stores and get directions to your favorite products
          </p>
        </div>

        <MapWithDirections
          stores={stores}
          initialSelectedId={productId || undefined}
          height="calc(100vh - 250px)"
        />

        {stores.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              <strong>{stores.length}</strong> store{stores.length !== 1 ? 's' : ''} with
              location data available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
