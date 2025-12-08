// src/lib/places.ts
// Simple Overpass (OpenStreetMap) helpers to query nearby POIs.

export interface POI {
  id: number;
  name: string;
  tags: Record<string, string>;
  lat: number;
  lon: number;
}

export async function fetchNearbyPOIs(lat: number, lon: number, radius = 1000, tags: string[] = []): Promise<POI[]> {
  // tags: array of Overpass tag clauses, e.g. ["tourism=hotel","tourism=guest_house"]
  if (!lat || !lon) return [];
  
  const queryBody = tags.map(tag => {
    const parts = tag.split('=');
    const key = parts[0];
    const value = parts[1];
    
    if (value) {
      return `node["${key}"="${value}"](around:${radius},${lat},${lon});`;
    }
    return `node["${key}"](around:${radius},${lat},${lon});`;
  }).join('\n');

  const query = `
    [out:json][timeout:25];
    (
      ${queryBody}
    );
    out body;
    >;
    out skel qt;
  `;
  
  const url = 'https://overpass-api.de/api/interpreter';
  try {
    const res = await fetch(url, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}` 
    });
    if (!res.ok) {
        console.error("Overpass API response error:", res.status, res.statusText);
        const errorBody = await res.text();
        console.error("Overpass API error body:", errorBody);
        throw new Error('Overpass API error');
    }
    const json = await res.json();
    return (json.elements || []).map((e: any) => ({
      id: e.id,
      name: e.tags?.name || e.tags?.['addr:housename'] || e.tags?.['name:en'] || 'Unnamed Place',
      tags: e.tags || {},
      lat: e.lat,
      lon: e.lon,
    }));
  } catch (err) {
    console.error('fetchNearbyPOIs error:', err);
    return [];
  }
}
