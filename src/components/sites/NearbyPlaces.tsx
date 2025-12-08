// src/components/sites/NearbyPlaces.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { fetchNearbyPOIs, type POI } from '@/lib/places';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Building, Hotel, MapPin, Tent, Landmark } from 'lucide-react';

interface NearbyPlacesProps {
  lat?: number;
  lon?: number;
  radius?: number;
}

const getIconForTag = (tags: Record<string, string>) => {
    const tourism = tags.tourism;
    if (tourism === 'hotel') return <Hotel className="w-5 h-5 text-accent" />;
    if (tourism === 'guest_house' || tourism === 'hostel') return <Tent className="w-5 h-5 text-accent" />;
    if (tourism === 'apartment') return <Building className="w-5 h-5 text-accent" />;
    if (tourism === 'attraction' || tags.historic) return <Landmark className="w-5 h-5 text-accent" />;
    return <MapPin className="w-5 h-5 text-accent" />;
}

const PoiCard: React.FC<{ poi: POI }> = ({ poi }) => (
  <Card>
    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <div className="p-2 bg-accent/20 rounded-md">
            {getIconForTag(poi.tags)}
        </div>
        <CardTitle className="text-base font-semibold line-clamp-1">{poi.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-sm text-muted-foreground capitalize">
        {poi.tags.tourism?.replace(/_/g, ' ') || poi.tags.amenity?.replace(/_/g, ' ') || poi.tags.historic || 'Place'}
      </div>
      {poi.lat && poi.lon && (
        <a 
            className="text-sm text-primary hover:underline mt-2 inline-block" 
            target="_blank" 
            rel="noreferrer" 
            href={`https://www.google.com/maps/search/?api=1&query=${poi.lat},${poi.lon}`}
        >
          Open in Maps
        </a>
      )}
    </CardContent>
  </Card>
);

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
            <Card key={i}>
                 <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <Skeleton className="w-10 h-10 rounded-md" />
                    <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent className='space-y-2'>
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                </CardContent>
            </Card>
        ))}
    </div>
);


export default function NearbyPlaces({ lat, lon, radius = 5000 }: NearbyPlacesProps) {
  const [hotels, setHotels] = useState<POI[]>([]);
  const [tourist, setTourist] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lat || !lon) {
        setLoading(false);
        return;
    };
    let mounted = true;
    setLoading(true);

    const fetchData = async () => {
      // Hotels, guesthouses, hostels, apartments
      const hotelTags = ['tourism=hotel', 'tourism=guest_house', 'tourism=hostel', 'tourism=apartment'];
      const hotelsRes = await fetchNearbyPOIs(lat, lon, radius, hotelTags);
      
      // Tourist attractions
      const touristTags = ['tourism=attraction', 'tourism=museum', 'historic'];
      const touristRes = await fetchNearbyPOIs(lat, lon, radius, touristTags);

      if (mounted) {
        setHotels(hotelsRes);
        setTourist(touristRes);
        setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [lat, lon, radius]);

  if (!lat || !lon) return null;

  return (
    <section className="mb-12">
        <h2 className="text-3xl font-headline text-center mb-8">Nearby Stays & Places</h2>
        <Tabs defaultValue="stays" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="stays">Stays</TabsTrigger>
                <TabsTrigger value="tourist">Tourist Spots</TabsTrigger>
            </TabsList>
            <TabsContent value="stays">
                {loading ? <LoadingSkeleton /> : (
                    hotels.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {hotels.map((p) => <PoiCard key={p.id} poi={p} />)}
                        </div>
                    ) : <p className="text-center text-muted-foreground mt-8">No nearby stays found within {radius / 1000}km.</p>
                )}
            </TabsContent>
            <TabsContent value="tourist">
                {loading ? <LoadingSkeleton /> : (
                    tourist.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tourist.map((p) => <PoiCard key={p.id} poi={p} />)}
                        </div>
                    ) : <p className="text-center text-muted-foreground mt-8">No nearby tourist spots found within {radius / 1000}km.</p>
                )}
            </TabsContent>
        </Tabs>
    </section>
  );
}
