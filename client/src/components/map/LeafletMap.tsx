'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const UserIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const StoreIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export interface StoreLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  shopName?: string;
  productName?: string;
  price?: number;
  image?: string;
}

interface LeafletMapProps {
  stores: StoreLocation[];
  userLocation?: { lat: number; lng: number } | null;
  selectedStoreId?: string | null;
  onStoreSelect?: (store: StoreLocation) => void;
  showDirections?: boolean;
  height?: string;
}

export default function LeafletMap({
  stores,
  userLocation,
  selectedStoreId,
  onStoreSelect,
  showDirections = false,
  height = '500px',
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);
  const [isRoutingLoaded, setIsRoutingLoaded] = useState(false);

  // Load routing machine dynamically
  useEffect(() => {
    const loadRoutingMachine = async () => {
      if (typeof window !== 'undefined') {
        // @ts-expect-error - leaflet-routing-machine doesn't have proper types
        await import('leaflet-routing-machine');
        setIsRoutingLoaded(true);
      }
    };
    loadRoutingMachine();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Save current scroll position
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Default center (Tokyo, Japan - you can change this)
    const defaultCenter: L.LatLngExpression = userLocation
      ? [userLocation.lat, userLocation.lng]
      : [35.6762, 139.6503];

    mapRef.current = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: true,
      keyboard: false, // Prevent keyboard from scrolling page
      scrollWheelZoom: true,
      dragging: true,
      attributionControl: false, // Hide attribution control
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '', // Remove attribution text
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Restore scroll position after map init - multiple attempts for reliability
    requestAnimationFrame(() => {
      window.scrollTo(scrollX, scrollY);
    });
    
    setTimeout(() => {
      window.scrollTo(scrollX, scrollY);
    }, 0);
    
    setTimeout(() => {
      window.scrollTo(scrollX, scrollY);
    }, 100);

    return () => {
      // Clean up routing control first
      if (routingControlRef.current && mapRef.current) {
        try {
          mapRef.current.removeControl(routingControlRef.current);
        } catch (error) {
          console.warn('Error removing routing control on cleanup:', error);
        }
        routingControlRef.current = null;
      }
      
      // Then clean up the map
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    // Save current scroll position
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: UserIcon,
      })
        .addTo(mapRef.current)
        .bindPopup(`
          <div style="text-align: center; min-width: 120px;">
            <strong style="color: #3b82f6;">📍 My Location</strong>
            <p style="margin: 4px 0 0; font-size: 11px; color: #666;">
              ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}
            </p>
          </div>
        `)
        .bindTooltip('My Location', {
          permanent: true,
          direction: 'top',
          offset: [0, -40],
          className: 'user-location-tooltip',
        });
    }

    // Update map view without animation to prevent scroll issues
    mapRef.current.setView([userLocation.lat, userLocation.lng], 13, {
      animate: false,
      duration: 0,
    });

    // Restore scroll position - multiple attempts
    requestAnimationFrame(() => {
      window.scrollTo(scrollX, scrollY);
    });
    
    setTimeout(() => {
      window.scrollTo(scrollX, scrollY);
    }, 0);
  }, [userLocation]);

  // Add store markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    stores.forEach((store) => {
      if (!store.latitude || !store.longitude) return;

      const marker = L.marker([store.latitude, store.longitude], {
        icon: StoreIcon,
      }).addTo(mapRef.current!);

      const popupContent = `
        <div style="min-width: 200px;">
          ${store.image ? `<img src="${store.image}" alt="${store.name}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />` : ''}
          <h3 style="margin: 0 0 4px; font-weight: 600; font-size: 14px;">${store.shopName || store.name}</h3>
          <p style="margin: 0 0 4px; color: #666; font-size: 12px;">${store.productName || ''}</p>
          ${store.price ? `<p style="margin: 0 0 4px; color: #16a34a; font-weight: 700; font-size: 16px;">₹${store.price.toLocaleString()}</p>` : ''}
          ${store.address ? `<p style="margin: 0; color: #888; font-size: 11px;">${store.address}</p>` : ''}
          <button 
            onclick="window.dispatchEvent(new CustomEvent('getDirections', { detail: '${store.id}' }))"
            style="margin-top: 8px; width: 100%; padding: 8px 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500;"
          >
            🧭 Get Directions
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      
      // Add tooltip with product name
      marker.bindTooltip(store.productName || store.name, {
        permanent: false,
        direction: 'top',
        offset: [0, -40],
        className: 'store-tooltip',
      });

      marker.on('click', () => {
        onStoreSelect?.(store);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (stores.length > 0) {
      const scrollY = window.scrollY;
      const validStores = stores.filter((s) => s.latitude && s.longitude);
      if (validStores.length > 0) {
        const bounds = L.latLngBounds(
          validStores.map((s) => [s.latitude, s.longitude] as L.LatLngTuple)
        );
        if (userLocation) {
          bounds.extend([userLocation.lat, userLocation.lng]);
        }
        mapRef.current.fitBounds(bounds, { padding: [50, 50], animate: false });
        
        // Restore scroll position
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY);
        });
      }
    }
  }, [stores, onStoreSelect]);

  // Handle routing/directions
  useEffect(() => {
    if (!mapRef.current || !isRoutingLoaded || !showDirections || !userLocation) {
      // Clean up routing if conditions not met
      if (routingControlRef.current && mapRef.current) {
        try {
          mapRef.current.removeControl(routingControlRef.current);
        } catch (error) {
          console.warn('Error removing routing control:', error);
        }
        routingControlRef.current = null;
      }
      return;
    }

    const selectedStore = stores.find((s) => s.id === selectedStoreId);
    if (!selectedStore || !selectedStore.latitude || !selectedStore.longitude) {
      // Clean up routing if no selected store
      if (routingControlRef.current && mapRef.current) {
        try {
          mapRef.current.removeControl(routingControlRef.current);
        } catch (error) {
          console.warn('Error removing routing control:', error);
        }
        routingControlRef.current = null;
      }
      return;
    }

    // Remove existing routing control before creating new one
    if (routingControlRef.current && mapRef.current) {
      try {
        mapRef.current.removeControl(routingControlRef.current);
      } catch (error) {
        console.warn('Error removing routing control:', error);
      }
      routingControlRef.current = null;
    }

    // Add new routing control with comprehensive error handling
    try {
      const control = L.Routing.control({
        waypoints: [
          L.latLng(userLocation.lat, userLocation.lng),
          L.latLng(selectedStore.latitude, selectedStore.longitude),
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: false,
        addWaypoints: false,
        createMarker: function() { return false; },
        lineOptions: {
          styles: [{ color: '#3b82f6', weight: 4, opacity: 0.7 }],
          extendToWaypoints: true,
          missingRouteTolerance: 0,
        },
      });
      
      // Only add to map if map is still valid
      if (mapRef.current) {
        control.addTo(mapRef.current);
        routingControlRef.current = control;
      }
    } catch (error) {
      console.warn('Error creating routing control:', error);
      routingControlRef.current = null;
    }

    return () => {
      if (routingControlRef.current && mapRef.current) {
        try {
          mapRef.current.removeControl(routingControlRef.current);
        } catch (error) {
          console.warn('Error cleaning up routing control:', error);
        }
        routingControlRef.current = null;
      }
    };
  }, [showDirections, selectedStoreId, userLocation, stores, isRoutingLoaded]);

  // Listen for getDirections event from popup
  useEffect(() => {
    const handleGetDirections = (e: CustomEvent<string>) => {
      const store = stores.find((s) => s.id === e.detail);
      if (store) {
        onStoreSelect?.(store);
      }
    };

    window.addEventListener('getDirections', handleGetDirections as EventListener);
    return () => {
      window.removeEventListener('getDirections', handleGetDirections as EventListener);
    };
  }, [stores, onStoreSelect]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%', position: 'relative', zIndex: 1 }}
      className="rounded-lg overflow-hidden border border-border"
    />
  );
}
