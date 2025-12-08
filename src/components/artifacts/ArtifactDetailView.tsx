
'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Artifact } from '@/types';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, View, MessageSquareQuote } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useTts } from '@/hooks/use-tts';
import { BionicReading } from '@/components/common/BionicReading';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Separator } from '../ui/separator';

interface ArtifactDetailViewProps {
  artifact: Artifact;
}

export function ArtifactDetailView({ artifact }: ArtifactDetailViewProps) {
  const { isLowBandwidth, isAudioOn } = useUserPreferences();
  const { t, language } = useTranslation();
  const { speak, stop, isSpeaking } = useTts();

  const title = artifact.title[language];
  const description = artifact.description[language];
  
  const modelUrl = isLowBandwidth ? artifact.lowPolyModelUrl || artifact.modelFileUrl : artifact.modelFileUrl;
  const image = PlaceHolderImages.find(p => p.id === artifact.imageUrlId);

  const handleReadDescription = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(description, language);
    }
  };
  
  const arUrl = artifact.arLink || `/ar-viewer?model=${encodeURIComponent(modelUrl || '')}`;

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-8">
      <div className="detail-page-controls mb-6 flex justify-between items-center gap-2">
        <Button asChild variant="outline" size="sm">
            <Link href="/artifacts"><ArrowLeft className="mr-2 h-4 w-4" />{t('back_to_all_artifacts')}</Link>
        </Button>
        <div className="flex items-center gap-2">
            <Button 
              id="read-description-btn" 
              variant="outline" 
              size="sm" 
              onClick={handleReadDescription} 
              aria-label={t('read_description_aloud')}
              disabled={!isAudioOn}
            >
              {isSpeaking ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isSpeaking ? 'Stop' : t('read_description_aloud')}
            </Button>
            {(modelUrl || artifact.arLink) && (
              <Button asChild>
                <Link href={arUrl} target="_blank" rel="noopener noreferrer">
                  <View className="mr-2 h-4 w-4" />
                  {t('launch_ar')}
                </Link>
              </Button>
            )}
        </div>
      </div>

      <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8 shadow-lg bg-muted">
        {image && (
          <Image 
            src={image.imageUrl} 
            alt={`Image of ${title}`} 
            fill 
            className="object-cover" 
            data-ai-hint={image.imageHint}
            priority
          />
        )}
      </div>

      <header className="mb-6 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">{title}</h1>
      </header>
      
      <article className="prose prose-lg max-w-none mx-auto text-foreground/90 mb-6">
        <BionicReading text={description} as="p" className="detail-description" />
      </article>

      <Separator className="my-12" />

      <div className="text-center">
        <h3 className="text-xl font-headline mb-4">Share Your Thoughts</h3>
        <p className="text-muted-foreground mb-6">Your feedback helps us improve the experience.</p>
        <Button asChild size="lg">
          <Link href={`/feedback?item_id=${artifact.id}&item_title=${encodeURIComponent(title)}&item_type=artifact`}>
            <MessageSquareQuote className="mr-2 h-5 w-5" />
            Provide Feedback
          </Link>
        </Button>
      </div>
    </div>
  );
}
