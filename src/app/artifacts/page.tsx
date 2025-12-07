'use client';

import Link from 'next/link';
import { getArtifacts } from '@/lib/data';
import { ArtifactCard } from '@/components/artifacts/ArtifactCard';
import { PageHeader } from '@/components/common/PageHeader';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ExploreArtifactsPage() {
  const artifacts = getArtifacts();
  const { t } = useTranslation();

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artifacts.map((artifact) => (
            <ArtifactCard key={artifact.id} artifact={artifact} />
          ))}
        </div>
      </div>
    </>
  );
}
