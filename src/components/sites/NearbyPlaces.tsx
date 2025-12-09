
// src/components/sites/NearbyPlaces.tsx
'use client';
import React, { useEffect, useState, useCallback } from 'react';
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

type PoiCategory = 'stays' | 'tourist' | 'offbeat';

const categoryTags: Record<PoiCategory, string[]> = {
  stays: ['tourism=hotel', 'tourism=guest_house', 'tourism=hostel', 'tourism=apartment'],
  tourist: ['tourism=attraction', 'tourism=museum', 'historic=yes'],
  offbeat: ['tourism=viewpoint', 'historic=ruins', 'natural=peak', 'historic=archaeological_site'],
};


export default function NearbyPlaces({ siteId, lat, lon, radius = 5000 }: NearbyPlacesProps) {
  const [data, setData] = useState<Record<PoiCategory, POI[]>>({
    stays: [],
    tourist: [],
    offbeat: [],
  });
  const [loading, setLoading] = useState<Record<PoiCategory, boolean>>({
    stays: true,
    tourist: false,
    offbeat: false,
  });
  const [error, setError] = useState<Record<PoiCategory, string | null>>({
    stays: null,
    tourist: null,
    offbeat: null,
  });

  const [showAll, setShowAll] = useState<Record<PoiCategory, boolean>>({
    stays: false,
    tourist: false,
    offbeat: false,
  });

  const fetchCategoryData = useCallback(async (category: PoiCategory) => {
    if (!lat || !lon) {
      setLoading(prev => ({...prev, [category]: false}));
      return;
    }

    setLoading(prev => ({...prev, [category]: true}));
    setError(prev => ({...prev, [category]: null}));

    try {
      const tagsToFetch = categoryTags[category];
      let allPois: POI[] = [];

      for (const tag of tagsToFetch) {
        // Fetch for each individual tag to avoid timeouts on complex queries
        const pois = await fetchNearbyPOIs(lat, lon, radius, [tag]);
        allPois.push(...pois);
      }
      
      // Remove duplicates by ID
      const uniquePois = Array.from(new Map(allPois.map(p => [p.id, p])).values());

      setData(prev => ({...prev, [category]: uniquePois}));
    } catch (e: any) {
      setError(prev => ({...prev, [category]: e.message || `Failed to fetch ${category}.`}));
    } finally {
      setLoading(prev => ({...prev, [category]: false}));
    }
  }, [lat, lon, radius]);

  // Fetch initial data for the default tab ('stays')
  useEffect(() => {
    fetchCategoryData('stays');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCategoryData]);


  const handleTabChange = (value: string) => {
    const category = value as PoiCategory;
    // Fetch data only if it hasn't been fetched before
    if (data[category].length === 0 && !error[category]) {
      fetchCategoryData(category);
    }
  };
  
  const renderPoiList = (
    pois: POI[], 
    category: PoiCategory
    ) => {

    const visiblePois = showAll[category] ? pois : pois.slice(0, INITIAL_DISPLAY_COUNT);

    if (loading[category]) {
      return <LoadingSkeleton />;
    }
    if (error[category]) {
      return <p className="text-center text-destructive mt-8">{error[category]}</p>;
    }
    if (pois.length === 0) {
      return <p className="text-center text-muted-foreground mt-8">No nearby {category.replace('_', ' ')} found within {radius / 1000}km.</p>;
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visiblePois.map((p) => <PoiCard key={p.id} poi={p} />)}
            </div>
            {pois.length > INITIAL_DISPLAY_COUNT && (
                <div className="text-center mt-6">
                    <Button variant="outline" onClick={() => setShowAll(prev => ({...prev, [category]: !prev[category]}))}>
                        {showAll[category] ? `See Less` : `See All ${pois.length} places`}
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
        <Tabs defaultValue="stays" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
                <TabsTrigger value="stays">Stays</TabsTrigger>
                <TabsTrigger value="offbeat">Offbeat Places</TabsTrigger>
                <TabsTrigger value="tourist">Tourist Spots</TabsTrigger>
            </TabsList>
            <TabsContent value="stays">
              {renderPoiList(data.stays, 'stays')}
            </TabsContent>
            <TabsContent value="offbeat">
              {renderPoiList(data.offbeat, 'offbeat')}
            </TabsContent>
            <TabsContent value="tourist">
              {renderPoiList(data.tourist, 'tourist')}
            </TabsContent>
        </Tabs>
    </section>
  );
}
