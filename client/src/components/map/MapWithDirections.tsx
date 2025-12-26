'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation, MapPin, Loader2, X, LocateFixed, Store, User, List, ChevronUp, ChevronDown } from 'lucide-react';
import type { StoreLocation } from './LeafletMap';

// Dynamically import the map component to avoid SSR issues
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full flex items-center justify-center bg-muted rounded-lg">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Loading map...</span>
    </div>
  ),
});

interface MapWithDirectionsProps {
  stores: StoreLocation[];
  initialSelectedId?: string;
  height?: string;
}

export default function MapWithDirections({
  stores,
  initialSelectedId,
  height = '500px',
}: MapWithDirectionsProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showMobileDirections, setShowMobileDirections] = useState(false);

  // Toggle directions panel visibility on mobile
  const toggleMobileDirections = useCallback(() => {
    setShowMobileDirections((prev) => !prev);
    // Toggle the CSS class on the routing container
    const routingContainer = document.querySelector('.leaflet-routing-container');
    if (routingContainer) {
      routingContainer.classList.toggle('show-directions');
    }
  }, []);

  // Get user's current location
  const getUserLocation = useCallback(() => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setLocationError(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, []);

  // Auto-get location on mount
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // Set initial selected store and auto-show directions
  useEffect(() => {
    if (initialSelectedId && stores.length > 0) {
      const store = stores.find((s) => s.id === initialSelectedId);
      if (store) {
        setSelectedStore(store);
        setShowDirections(true);
        
        // Scroll to map on mobile after a short delay
        setTimeout(() => {
          const mapElement = document.querySelector('.leaflet-container');
          if (mapElement && window.innerWidth < 768) {
            mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    }
  }, [initialSelectedId, stores]);

  const handleStoreSelect = (store: StoreLocation) => {
    setSelectedStore(store);
    setShowDirections(true);
  };

  const handleClearDirections = () => {
    setShowDirections(false);
    setSelectedStore(null);
    setShowMobileDirections(false);
    // Remove the show class from routing container
    const routingContainer = document.querySelector('.leaflet-routing-container');
    if (routingContainer) {
      routingContainer.classList.remove('show-directions');
    }
  };

  const handleOpenExternalNavigation = () => {
    if (!selectedStore || !userLocation) return;

    // Open Google Maps with directions
    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = `${selectedStore.latitude},${selectedStore.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={getUserLocation}
          disabled={isLocating}
        >
          {isLocating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <LocateFixed className="h-4 w-4 mr-2" />
          )}
          {isLocating ? 'Getting Location...' : 'Update My Location'}
        </Button>

        {showDirections && selectedStore && (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={handleOpenExternalNavigation}
              disabled={!userLocation}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Open in Google Maps
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClearDirections}>
              <X className="h-4 w-4 mr-2" />
              Clear Route
            </Button>
          </>
        )}
      </div>

      {/* Directions loading indicator */}
      {showDirections && selectedStore && !userLocation && (
        <div className="p-3 bg-primary/10 text-primary rounded-lg text-sm flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Getting your location to calculate directions...
        </div>
      )}

      {/* Directions ready indicator */}
      {showDirections && selectedStore && userLocation && (
        <div className="p-3 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-lg text-sm flex items-center gap-2">
          <Navigation className="h-4 w-4" />
          Showing directions to <strong>{selectedStore.shopName || selectedStore.name}</strong>
        </div>
      )}

      {/* Error message */}
      {locationError && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {locationError}
        </div>
      )}

      {/* Location Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* My Location Card */}
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-500 text-white">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  My Location
                  <Badge variant="secondary" className="text-xs">You</Badge>
                </h3>
                {userLocation ? (
                  <p className="text-xs text-muted-foreground">
                    {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">Location not available</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Store Card */}
        {selectedStore ? (
          <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-500 text-white">
                  <Store className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">
                    {selectedStore.shopName || 'Store'}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {selectedStore.productName || selectedStore.name}
                  </p>
                </div>
                {selectedStore.price && (
                  <Badge className="bg-green-600 hover:bg-green-700">
                    ₹{selectedStore.price.toLocaleString()}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted">
                  <Store className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-muted-foreground">Select a Store</h3>
                  <p className="text-xs text-muted-foreground">Click on a marker to select</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Store List */}
      {stores.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Available Stores ({stores.length})</h3>
          <div className="flex flex-wrap gap-2">
            {stores.map((store) => (
              <Button
                key={store.id}
                variant={selectedStore?.id === store.id ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={() => handleStoreSelect(store)}
              >
                <Store className="h-3 w-3" />
                <span className="truncate max-w-[150px]">{store.shopName || store.name}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      <LeafletMap
        stores={stores}
        userLocation={userLocation}
        selectedStoreId={selectedStore?.id}
        onStoreSelect={handleStoreSelect}
        showDirections={showDirections}
        height={height}
      />

      {/* Directions Toggle Button - Show when directions are active */}
      {showDirections && selectedStore && (
        <Button
          onClick={toggleMobileDirections}
          variant={showMobileDirections ? 'default' : 'outline'}
          className="w-full gap-2"
        >
          <List className="h-4 w-4" />
          {showMobileDirections ? 'Hide' : 'Show'} Turn-by-Turn Directions
          {showMobileDirections ? (
            <ChevronDown className="h-4 w-4 ml-auto" />
          ) : (
            <ChevronUp className="h-4 w-4 ml-auto" />
          )}
        </Button>
      )}

      {/* Selected store detailed info */}
      {selectedStore && (
        <Card className="border-primary/20">
          <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="text-lg flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              {selectedStore.shopName || 'Store Details'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Product</p>
                <p className="font-medium">{selectedStore.productName || selectedStore.name}</p>
              </div>
              {selectedStore.price && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Price</p>
                  <p className="text-xl font-bold text-green-600">
                    ₹{selectedStore.price.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            {selectedStore.address && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Address</p>
                <p className="text-sm flex items-start gap-1">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  {selectedStore.address}
                </p>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleOpenExternalNavigation}
                disabled={!userLocation}
                className="flex-1"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Navigate with Google Maps
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {stores.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No store locations available</p>
        </div>
      )}
    </div>
  );
}
