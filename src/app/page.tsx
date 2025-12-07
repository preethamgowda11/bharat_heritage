'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Landmark, Gem } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useTranslation } from '@/hooks/use-translation';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');
  const { t } = useTranslation();

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl drop-shadow-lg">
          {t('home_title')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-slate-200 drop-shadow-md">
          {t('home_subtitle')}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/sites">
              <Landmark className="mr-2 h-5 w-5" />
              {t('explore_sites')}
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/artifacts">
              <Gem className="mr-2 h-5 w-5" />
              {t('discover_artifacts')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
