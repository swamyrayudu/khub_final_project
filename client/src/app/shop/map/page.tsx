'use client';

import React from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { trackLocationView } from '@/actions/locationNotifications';

export default function MapRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  useEffect(() => {
    // Track location view if productId is present
    if (productId) {
      trackLocationView(productId).catch(error => {
        console.error('Failed to track location view:', error);
      });
    }

    // Redirect to products page since map functionality is disabled
    const redirectTimer = setTimeout(() => {
      router.push('/shop/products');
    }, 1000);

    return () => clearTimeout(redirectTimer);
  }, [router, productId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-muted-foreground">Map functionality is no longer available.</p>
      </div>
    </div>
  );
}
