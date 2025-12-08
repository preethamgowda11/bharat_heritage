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
  const tagClause = tags.map(t => `node[${t}](around:${radius},${lat},${lon});`).join('');
  const query = `[out:json][timeout:15];(${tagClause});out center;`;
  const url = 'https://overpass-api.de/api/interpreter';
  try {
    const res = await fetch(url, { method: 'POST', body: query });
    if (!res.ok) throw new Error('Overpass API error');
    const json = await res.json();
    return (json.elements || []).map((e: any) => ({
      id: e.id,
      name: e.tags?.name || e.tags?.['addr:housename'] || e.tags?.['name:en'] || 'Unknown',
      tags: e.tags || {},
      lat: e.lat || e.center?.lat,
      lon: e.lon || e.center?.lon,
    }));
  } catch (err) {
    console.error('fetchNearbyPOIs error:', err);
    return [];
  }
}
