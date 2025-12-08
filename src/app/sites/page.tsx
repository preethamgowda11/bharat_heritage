
'use client';

import { getSites } from '@/lib/data';
import { SiteCard } from '@/components/sites/SiteCard';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Search, Mic, MicOff } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ExploreSitesPage() {
  const allSites = getSites();
  const { t, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');

  const { isListening, toggleListening } = useSpeechToText({
    onTranscript: (transcript) => {
      setSearchTerm(transcript);
    },
    language: language,
  });

  const states = ['all', ...Array.from(new Set(allSites.map((site) => site.state)))];

  const filteredSites = allSites.filter((site) => {
    const matchesSearch = site.title[language]
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesState =
      selectedState === 'all' ? true : site.state === selectedState;
    return matchesSearch && matchesState;
  });

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
          <div className="relative flex-grow items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search sites by voice or text..."
              className="w-full pl-10 pr-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={toggleListening}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isListening ? (
                <MicOff className="h-5 w-5 text-destructive" />
              ) : (
                <Mic className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
          </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      </div>
    </>
  );
}
