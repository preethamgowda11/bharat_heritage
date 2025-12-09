
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let searchTerm = searchParams.get('searchTerm');
  let lang = searchParams.get('lang') || 'en';

  if (!searchTerm) {
    return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
  }

  try {
    // 1. Search for the most relevant Wikipedia page
    const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(searchTerm)}&origin=*`;
    const searchResponse = await fetch(searchUrl, { headers: { 'User-Agent': 'Heritage-Explorer/1.0 (contact@example.com)' } });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error(`Wikipedia search API error: ${searchResponse.status}`, errorText);
      return NextResponse.json({ error: `Failed to search on Wikipedia (${lang})` }, { status: searchResponse.status });
    }

    const searchData = await searchResponse.json();
    if (!searchData.query || !searchData.query.search || searchData.query.search.length === 0) {
      return NextResponse.json({ error: `No results found for "${searchTerm}" on Wikipedia (${lang}).` }, { status: 404 });
    }

    const pageTitle = searchData.query.search[0].title;
    const encodedPageTitle = encodeURIComponent(pageTitle);

    // 2. Fetch details for the best-matching page
    const wikiUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodedPageTitle}`;
    const wikimediaUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodedPageTitle}&prop=pageimages&piprop=thumbnail&pithumbsize=600`;
    const coordinatesUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&prop=coordinates&titles=${encodedPageTitle}&origin=*`;

    const [wikiResponse, wikimediaResponse, coordinatesResponse] = await Promise.all([
      fetch(wikiUrl, { headers: { 'User-Agent': 'Heritage-Explorer/1.0 (contact@example.com)' } }),
      fetch(wikimediaUrl, { headers: { 'User-Agent': 'Heritage-Explorer/1.0 (contact@example.com)' } }),
      fetch(coordinatesUrl, { headers: { 'User-Agent': 'Heritage-Explorer/1.0 (contact@example.com)' } })
    ]);

    const wikiData = await wikiResponse.json().catch(() => ({}));
    const wikimediaData = await wikimediaResponse.json().catch(() => ({}));
    const coordinatesData = await coordinatesResponse.json().catch(() => ({}));

    let imageUrl = null;
    if (wikimediaData.query && wikimediaData.query.pages) {
      const pages = wikimediaData.query.pages;
      const firstPageId = Object.keys(pages)[0];
      if (firstPageId && pages[firstPageId].thumbnail) {
        imageUrl = pages[firstPageId].thumbnail.source;
      }
    }

    let coordinates = null;
    if (coordinatesData.query && coordinatesData.query.pages) {
        const pageId = Object.keys(coordinatesData.query.pages)[0];
        const page = coordinatesData.query.pages[pageId];
        if (page && page.coordinates) {
            const { lat, lon } = page.coordinates[0];
            coordinates = { lat, lon };
        }
    }
    
    const name = wikiData.title || pageTitle;
    const description = wikiData.extract || 'No description available.';
    const place = wikiData.description || `Details from Wikipedia (${lang.toUpperCase()})`;

    return NextResponse.json({
      name,
      description,
      place,
      imageUrl,
      coordinates,
    });

  } catch (error) {
    console.error('API route error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to process the request', details: errorMessage }, { status: 500 });
  }
}
