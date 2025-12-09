
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapView } from '@/components/common/MapView';

interface ScrapedArtifactCardProps {
  name: string;
  place: string;
  description: string;
  imageUrl?: string | null;
  coordinates?: {
    lat: number;
    lon: number;
  } | null;
}

export const ScrapedArtifactCard: React.FC<ScrapedArtifactCardProps> = ({ name, place, description, imageUrl, coordinates }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{place}</CardDescription>
      </CardHeader>
      <CardContent>
        {imageUrl && (
          <div className="relative h-64 w-full mb-4 rounded-md overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
          </div>
        )}
        <p className="text-muted-foreground">{description}</p>
        {coordinates && coordinates.lat && coordinates.lon && (
            <MapView lat={coordinates.lat} lon={coordinates.lon} title={name} />
        )}
      </CardContent>
    </Card>
  );
};
