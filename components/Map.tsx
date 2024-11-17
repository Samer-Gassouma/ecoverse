"use client"

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapProps {
  initialCoordinates?: [number, number];
  zoom?: number;
  onLocationSelect?: (coordinates: [number, number]) => void;
  className?: string;
  markers?: Array<{
    coordinates: [number, number];
    color?: string;
    popup?: string;
  }>;
}

export default function Map({
  initialCoordinates = [-74.5, 40], // Default coordinates
  zoom = 9,
  onLocationSelect,
  className = "w-full h-[400px]",
  markers = []
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCoordinates,
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add click handler if onLocationSelect is provided
    if (onLocationSelect) {
      map.current.on('click', (e) => {
        const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
        setSelectedLocation(coordinates);
        onLocationSelect(coordinates);

        // Clear existing markers
        const existingMarker = document.querySelector('.selected-location-marker');
        if (existingMarker) {
          existingMarker.remove();
        }

        // Add marker at clicked location
        new mapboxgl.Marker({ color: '#FF0000', className: 'selected-location-marker' })
          .setLngLat(coordinates)
          .addTo(map.current!);
      });
    }

    // Add markers if provided
    markers.forEach(marker => {
      const markerElement = new mapboxgl.Marker({
        color: marker.color || '#FF0000'
      })
        .setLngLat(marker.coordinates)
        .addTo(map.current!);

      if (marker.popup) {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(marker.popup);
        markerElement.setPopup(popup);
      }
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialCoordinates, zoom, onLocationSelect, markers]);

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      {selectedLocation && (
        <div className="mt-2 text-sm text-gray-500">
          Selected: {selectedLocation[1].toFixed(4)}, {selectedLocation[0].toFixed(4)}
        </div>
      )}
    </div>
  );
}