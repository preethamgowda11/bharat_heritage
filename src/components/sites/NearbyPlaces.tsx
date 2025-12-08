
// src/components/sites/NearbyPlaces.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { fetchNearbyPOIs, type POI } from '@/lib/places';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Building, Hotel, MapPin, Tent, Landmark, Mountain, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlaceSuggestionForm from '@/components/PlaceSuggestionForm';

interface NearbyPlacesProps {
  siteId: string;
  lat?: number;
  lon?: number;
  radius?: number;
}

const INITIAL_DISPLAY_COUNT = 3;

const getIconForTag = (tags: Record<string, string>) => {
    const tourism = tags.tourism;
    if (tourism === 'hotel') return <Hotel className="w-5 h-5 text-accent" />;
    if (tourism === 'guest_house' || tourism === 'hostel') return <Tent className="w-5 h-5 text-accent" />;
    if (tourism === 'apartment') return <Building className="w-5 h-5 text-accent" />;
    if (tourism === 'attraction' || tags.historic) return <Landmark className="w-5 h-5 text-accent" />;
    if (tourism === 'viewpoint') return <Eye className="w-5 h-5 text-accent" />;
    if (tags.natural === 'peak') return <Mountain className="w-5 h-5 text-accent" />;
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
        {poi.tags.tourism?.replace(/_/g, ' ') || poi.tags.amenity?.replace(/_/g, ' ') || poi.tags.historic?.replace(/_/g, ' ') || poi.tags.natural?.replace(/_/g, ' ') || 'Place'}
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


export default function NearbyPlaces({ siteId, lat, lon, radius = 5000 }: NearbyPlacesProps) {
  const [hotels, setHotels] = useState<POI[]>([]);
  const [tourist, setTourist] = useState<POI[]>([]);
  const [offbeat, setOffbeat] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllStays, setShowAllStays] = useState(false);
  const [showAllTourist, setShowAllTourist] = useState(false);
  const [showAllOffbeat, setShowAllOffbeat] = useState(false);

  useEffect(() => {
    if (!lat || !lon) {
        setLoading(false);
        return;
    };
    let mounted = true;
    setLoading(true);

    const fetchData = async () => {
      const allTags = [
        'tourism=hotel', 'tourism=guest_house', 'tourism=hostel', 'tourism=apartment', // Stays
        'tourism=attraction', 'tourism=museum', 'historic=yes', // Tourist
        'tourism=viewpoint', 'historic=ruins', 'natural=peak', 'historic=archaeological_site' // Offbeat
      ];
      
      const allPois = await fetchNearbyPOIs(lat, lon, radius, allTags);

      if (mounted) {
        const hotelTags = new Set(['hotel', 'guest_house', 'hostel', 'apartment']);
        const touristTags = new Set(['attraction', 'museum']);
        const offbeatTags = new Set(['viewpoint', 'ruins', 'peak', 'archaeological_site']);

        const staysData = allPois.filter(p => hotelTags.has(p.tags.tourism));
        const touristData = allPois.filter(p => touristTags.has(p.tags.tourism) || p.tags.historic === 'yes');
        const offbeatData = allPois.filter(p => offbeatTags.has(p.tags.tourism) || offbeatTags.has(p.tags.historic) || offbeatTags.has(p.tags.natural));

        setHotels(staysData);
        setTourist(touristData);
        setOffbeat(offbeatData);

        setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [lat, lon, radius]);

  const renderPoiList = (
    pois: POI[], 
    showAll: boolean, 
    toggleShowAll: () => void, 
    type: string
    ) => {
    const visiblePois = showAll ? pois : pois.slice(0, INITIAL_DISPLAY_COUNT);
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visiblePois.map((p) => <PoiCard key={p.id} poi={p} />)}
            </div>
            {pois.length > INITIAL_DISPLAY_COUNT && (
                <div className="text-center mt-6">
                    <Button variant="outline" onClick={toggleShowAll}>
                        {showAll ? `See Less ${type}` : `See All ${pois.length} ${type}`}
                    </Button>
                </div>
            )}
        </>
    )
  }

  if (!lat || !lon) return null;

  return (
    <section className="mb-12">
        <div className="flex justify-center items-center gap-4 mb-8 text-center">
            <h2 className="text-3xl font-headline">Nearby Stays & Places</h2>
            <PlaceSuggestionForm siteId={siteId} lat={lat} lon={lon} />
        </div>
        <Tabs defaultValue="stays" className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
                <TabsTrigger value="stays">Stays</TabsTrigger>
                <TabsTrigger value="offbeat">Offbeat Places</TabsTrigger>
                <TabsTrigger value="tourist">Tourist Spots</TabsTrigger>
            </TabsList>
            <TabsContent value="stays">
                {loading ? <LoadingSkeleton /> : (
                    hotels.length > 0 ? (
                        renderPoiList(hotels, showAllStays, () => setShowAllStays(prev => !prev), 'stays')
                    ) : <p className="text-center text-muted-foreground mt-8">No nearby stays found within {radius / 1000}km.</p>
                )}
            </TabsContent>
            <TabsContent value="offbeat">
                {loading ? <LoadingSkeleton /> : (
                    offbeat.length > 0 ? (
                        renderPoiList(offbeat, showAllOffbeat, () => setShowAllOffbeat(prev => !prev), 'places')
                    ) : <p className="text-center text-muted-foreground mt-8">No offbeat places found within {radius / 1000}km.</p>
                )}
            </TabsContent>
            <TabsContent value="tourist">
                {loading ? <LoadingSkeleton /> : (
                    tourist.length > 0 ? (
                        renderPoiList(tourist, showAllTourist, () => setShowAllTourist(prev => !prev), 'spots')
                    ) : <p className="text-center text-muted-foreground mt-8">No nearby tourist spots found within {radius / 1000}km.</p>
                )}
            </TabsContent>
        </Tabs>
    </section>
  );
}
