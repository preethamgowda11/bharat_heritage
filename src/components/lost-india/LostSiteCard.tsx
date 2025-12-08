
'use client';

import type { LostSite } from '@/types';
import { useTranslation } from '@/hooks/use-translation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { AlertTriangle, Info, EyeOff } from 'lucide-react';

interface LostSiteCardProps {
  site: LostSite;
}

const categoryMap: Record<
  string,
  { label: string; className: string; icon: React.ReactNode }
> = {
  endangered: {
    label: 'Endangered',
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: <AlertTriangle className="h-3 w-3" />,
  },
  exaggerated_mythology: {
    label: 'Mythology',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <Info className="h-3 w-3" />,
  },
  forgotten_heritage: {
    label: 'Forgotten',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Info className="h-3 w-3" />,
  },
  hidden_heritage: {
    label: 'Hidden',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <EyeOff className="h-3 w-3" />,
  }
};

const threatLevelMap: Record<string, { className: string; label: string }> = {
    red: { className: 'bg-red-500', label: 'High' },
    yellow: { className: 'bg-yellow-400', label: 'Medium' },
    green: { className: 'bg-green-500', label: 'Low' },
}

export function LostSiteCard({ site }: LostSiteCardProps) {
  const { language, t } = useTranslation();
  const categoryInfo = categoryMap[site.category] || categoryMap.forgotten_heritage;
  const threat = threatLevelMap[site.threat_level];

  return (
    <Card className="flex flex-col overflow-hidden h-full transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl shadow-lg border-2 border-transparent hover:border-primary/50">
      <CardHeader className="p-0 relative">
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="outline" className={`gap-1.5 font-semibold text-xs ${categoryInfo.className}`}>
            {categoryInfo.icon}
            {categoryInfo.label}
          </Badge>
        </div>
        <div className="relative aspect-video">
          {site.image ? (
            <Image
              src={site.image}
              alt={`Image of ${site.title.en}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="bg-muted w-full h-full flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Image not found</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-start justify-between">
            <CardTitle className="font-headline text-xl mb-2">
                {site.title[language]}
            </CardTitle>
            {threat && (
                <div className="flex items-center gap-2 text-xs" title={`Threat Level: ${threat.label}`}>
                    <div className={`w-3 h-3 rounded-full ${threat.className}`}></div>
                    <span className="font-semibold text-muted-foreground">{threat.label}</span>
                </div>
            )}
        </div>
        <CardDescription>{site.description[language]}</CardDescription>
        
        {site.issues && (
            <div className="mt-4">
                <h4 className="font-bold text-sm text-foreground">Key Issues:</h4>
                <p className="text-sm text-muted-foreground">{site.issues[language]}</p>
            </div>
        )}

         {site.myth_vs_fact && (
            <div className="mt-4 space-y-2">
                <div>
                    <h4 className="font-bold text-sm text-foreground">Myth:</h4>
                    <p className="text-sm text-muted-foreground italic">"{site.myth_vs_fact.myth[language]}"</p>
                </div>
                 <div>
                    <h4 className="font-bold text-sm text-foreground">Fact:</h4>
                    <p className="text-sm text-muted-foreground">{site.myth_vs_fact.fact[language]}</p>
                </div>
            </div>
        )}

      </CardContent>
       <CardFooter className="p-4 pt-0 mt-auto">
            <button className="text-primary hover:underline text-sm font-semibold flex items-center gap-1">
                <Info className="w-4 h-4" />
                Learn More (Coming Soon)
            </button>
      </CardFooter>
    </Card>
  );
}
