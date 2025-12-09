
'use client';

import Link from 'next/link';
import { getSites } from '@/lib/data';
import { SiteCard } from '@/components/sites/SiteCard';
import { PageHeader } from '@/components/common/PageHeader';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Mic, MicOff, AlertTriangle } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { ScrapedArtifactCard } from '@/components/artifacts/ScrapedArtifactCard';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


type ScrapedData = {
  name: string;
  description: string;
  place: string;
  imageUrl: string | null;
  coordinates?: {
    lat: number;
    lon: number;
  };
} | null;

export default function ExploreSitesPage() {
  const allSites = getSites();
  const { t, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [scrapedData, setScrapedData] = useState<ScrapedData>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState('all');

  const { isListening, toggleListening } = useSpeechToText({
    onTranscript: (transcript) => {
      setSearchTerm(transcript);
      handleSearch(transcript);
    },
    language: language,
  });

  const handleSearch = useCallback(async (term: string) => {
    if (term.trim() === '') {
      setIsLoading(false);
      setScrapedData(null);
      setError(null);
      return;
    }

    console.log(`[SEARCH] Initiating search for: "${term}" in lang: ${language}`);
    setIsLoading(true);
    setScrapedData(null);
    setError(null);

    try {
      const fetchUrl = `/api/scrape?searchTerm=${encodeURIComponent(term)}&lang=${language}`;
      console.log(`[FETCH] Requesting URL: ${fetchUrl}`);

      const response = await fetch(fetchUrl);
      console.log(`[FETCH] Response status: ${response.status}`);

      const responseBody = await response.json();
      console.log('[FETCH] Parsed data:', responseBody);

      if (!response.ok) {
        console.error('[ERROR] API error response:', responseBody);
        throw new Error(responseBody.error || 'An unknown error occurred.');
      }
      
      setScrapedData(responseBody);

    } catch (err: any) {
      console.error('[ERROR] An exception occurred during fetch:', err);
      setError(err.message || 'Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('[SEARCH] Search process finished.');
    }
  }, [language]);


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };
  
  const states = ['all', ...Array.from(new Set(allSites.map((site) => site.state)))];

  const filteredSites = allSites.filter((site) => {
    const matchesSearch = searchTerm ? site.title[language]
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) : true;
    const matchesState =
      selectedState === 'all' ? true : site.state === selectedState;
    return matchesSearch && matchesState;
  });

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center">Loading...</p>;
    }

    if (error) {
      return (
        <Card className="mb-8 bg-destructive/10 border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 mr-3 text-destructive" />
              <p className="font-semibold text-destructive">{error}</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (scrapedData && searchTerm && filteredSites.length === 0) {
      return (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Web Result</h2>
          <ScrapedArtifactCard {...scrapedData} />
        </div>
      );
    }

    if (filteredSites.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      );
    }

    if (searchTerm && !isLoading) {
      return <p className="text-center text-muted-foreground">No results found.</p>;
    }

    // Default view when no search term
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allSites
          .filter(site => selectedState === 'all' || site.state === selectedState)
          .map((site) => (
            <SiteCard key={site.id} site={site} />
        ))}
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title={t('explore_heritage_sites')}
        description={t('discover_magnificent_sites')}
      >
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back_to_home')}
          </Link>
        </Button>
      </PageHeader>
      <div className="container px-4 md:px-8 pb-12">
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <form onSubmit={handleFormSubmit} className="relative flex-grow items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search sites by voice or text..."
              className="w-full pl-10 pr-20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleListening}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
              >
                {isListening ? <MicOff className="h-5 w-5 text-destructive" /> : <Mic className="h-5 w-5 text-muted-foreground" />}
              </Button>
              <Button type="submit" variant="ghost" size="icon" className="h-8 w-8" aria-label="Search">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-full md:w-[280px]">
              <SelectValue placeholder="Filter by state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.slice(1).map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {renderContent()}
      </div>
    </>
  );
}
