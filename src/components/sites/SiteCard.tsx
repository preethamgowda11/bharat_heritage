import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, View } from 'lucide-react';
import type { Site } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useTranslation } from '@/hooks/use-translation';


interface SiteCardProps {
  site: Site;
}

export function SiteCard({ site }: SiteCardProps) {
  const { t, language } = useTranslation();
  const thumbnail = PlaceHolderImages.find(p => p.id === site.thumbnailUrlId);

  return (
    <Card className="flex flex-col overflow-hidden h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3]">
          {thumbnail && (
            <Image
              src={thumbnail.imageUrl}
              alt={`Thumbnail for ${site.title.en}`}
              fill
              className="object-cover"
              data-ai-hint={thumbnail.imageHint}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl mb-2">{site.title[language]}</CardTitle>
        <CardDescription>{site.shortDescription[language]}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href={`/sites/${site.id}`}>
            {t('details')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
