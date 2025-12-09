'use client';

import React from 'react';

type MapViewProps = {
  lat: number;
  lon: number;
  title: string;
};

export function MapView({ lat, lon, title }: MapViewProps) {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return null; // Don't render the map if coordinates are invalid
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lon}`;

  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-muted aspect-video">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={mapUrl}
        title={`Map of ${title}`}
        aria-label={`Map showing the location of ${title}`}
      ></iframe>
    </div>
  );
}
