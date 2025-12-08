'use client';

import Link from 'next/link';
import { getArtifacts } from '@/lib/data';
import { ArtifactCard } from '@/components/artifacts/ArtifactCard';
import { PageHeader } from '@/components/common/PageHeader';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Mic, MicOff } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useSpeechToText } from '@/hooks/use-speech-to-text';

export default function ExploreArtifactsPage() {
  const allArtifacts = getArtifacts();
  const { t, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const { isListening, toggleListening } = useSpeechToText({
    onTranscript: (transcript) => {
      setSearchTerm(transcript);
    },
    language: language,
  });

  const filteredArtifacts = allArtifacts.filter((artifact) =>
    artifact.title[language]
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title={t('explore_historical_artifacts')}
        description={t('journey_through_time')}
      >
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back_to_home')}
          </Link>
        </Button>
      </PageHeader>
      <div className="container px-4 md:px-8 pb-12">
        <div className="mb-8 max-w-md">
            <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    type="search"
                    placeholder="Search artifacts by voice or text..."
                    className="w-full pl-10 pr-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={toggleListening}
                  aria-label={isListening ? "Stop listening" : "Start listening"}
                >
                  {isListening ? <MicOff className="h-5 w-5 text-destructive" /> : <Mic className="h-5 w-5 text-muted-foreground" />}
                </Button>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredArtifacts.map((artifact) => (
            <ArtifactCard key={artifact.id} artifact={artifact} />
          ))}
        </div>
      </div>
    </>
  );
}
