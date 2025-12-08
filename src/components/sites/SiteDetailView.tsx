
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Site } from '@/types';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ArrowLeft, View, ImageIcon, Volume2, Play, Pause, XCircle, MessageSquareQuote } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { useTts } from '@/hooks/use-tts';
import { ModelViewer } from '@/components/common/ModelViewer';
import { BionicReading } from '@/components/common/BionicReading';
import { Separator } from '../ui/separator';
import NearbyPlaces from './NearbyPlaces';

interface SiteDetailViewProps {
  site: Site;
}

export function SiteDetailView({ site }: SiteDetailViewProps) {
  const { isLowBandwidth, isAudioOn } = useUserPreferences();
  const { t, language } = useTranslation();
  const { speak, stop, isSpeaking } = useTts();
  const [show3DModel, setShow3DModel] = useState(false);

  const title = site.title[language];
  const longDescription = site.longDescription[language];
  
  const modelUrl = isLowBandwidth ? site.lowPolyModelUrl : site.highPolyModelUrl;

  const coverImage = PlaceHolderImages.find(p => p.id === site.coverImageUrlId);
  const fallback360Image = PlaceHolderImages.find(p => p.id === site.fallback360UrlId);
  const arUrl = site.arLink || `/ar-viewer?model=${encodeURIComponent(modelUrl || '')}`;

  const handleReadDescription = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(longDescription, language);
    }
  };
  
  const handleToggle3DModel = () => {
    setShow3DModel(!show3DModel);
  };
  
  const threeSixtyUrl = `/360/${site.id}`;

  return (
    <div className="container max-w-5xl mx-auto p-4 md:p-8">
      <div className="detail-page-controls mb-6 flex justify-between items-center gap-2">
        <Button asChild variant="outline" size="sm">
            <Link href="/sites"><ArrowLeft className="mr-2 h-4 w-4" />{t('back_to_all_sites')}</Link>
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
          {(modelUrl || site.arLink) && (
            <Button asChild>
              <Link href={arUrl} target="_blank" rel="noopener noreferrer">
                <View className="mr-2 h-4 w-4" />
                {t('launch_ar')}
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8 shadow-lg bg-muted">
        {show3DModel && modelUrl ? (
          <ModelViewer src={modelUrl} alt={`3D model of ${title}`} posterId={site.coverImageUrlId} ar={false} />
        ) : (
          coverImage && (
            <Image 
              src={coverImage.imageUrl} 
              alt={`Cover image of ${title}`} 
              fill 
              className="object-cover" 
              data-ai-hint={coverImage.imageHint}
              priority
            />
          )
        )}
      </div>

      <div className="text-center my-6 flex justify-center gap-4">
        {modelUrl && (
          <Button variant="outline" onClick={handleToggle3DModel}>
            {show3DModel ? (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel View
              </>
            ) : (
              <>
                <View className="mr-2 h-4 w-4" />
                {t('show_3d_model')}
              </>
            )}
          </Button>
        )}
        {fallback360Image && (
          <Button asChild variant="outline">
              <Link href={threeSixtyUrl}>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  360 View
              </Link>
          </Button>
        )}
      </div>
      
      <header className="mb-6 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">{title}</h1>
      </header>
      
      <article className="prose prose-lg max-w-none mx-auto text-foreground/90 mb-6">
        <BionicReading text={longDescription} as="p" className="detail-description" />
      </article>

      {site.lat && site.lon && (
        <>
          <Separator className="my-12" />
          <NearbyPlaces lat={site.lat} lon={site.lon} radius={5000} />
        </>
      )}
      
      {site.artifacts.length > 0 && (
        <div className="mt-12">
            <h3 className="text-2xl font-headline mb-4 text-center">{t('related_artifacts')}</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {site.artifacts.map(artifact => (
                    <Link key={artifact.id} href={`/artifacts/${artifact.id}`} className="group block">
                        <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:border-primary">
                            <CardHeader className="p-0">
                                <div className="relative aspect-square">
                                    <Image 
                                        src={PlaceHolderImages.find(p => p.id === artifact.imageUrlId)?.imageUrl || ''} 
                                        alt={artifact.title.en}
                                        fill
                                        className="object-cover"
                                        sizes="50vw"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-3">
                                <p className="text-sm font-semibold truncate">{artifact.title[language]}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
             </div>
        </div>
      )}

      <Separator className="my-12" />

      <div className="text-center">
        <h3 className="text-xl font-headline mb-4">Share Your Thoughts</h3>
        <p className="text-muted-foreground mb-6">Your feedback helps us improve the experience.</p>
        <Button asChild size="lg">
          <Link href={`/feedback?item_id=${site.id}&item_title=${encodeURIComponent(title)}&item_type=site`}>
            <MessageSquareQuote className="mr-2 h-5 w-5" />
            Provide Feedback
          </Link>
        </Button>
      </div>
    </div>
  );
}
