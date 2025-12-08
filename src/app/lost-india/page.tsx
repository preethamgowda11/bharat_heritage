'use client';

import { PageHeader } from '@/components/common/PageHeader';
import { useTranslation } from '@/hooks/use-translation';
import { getLostSites } from '@/lib/data';
import { LostSiteCard } from '@/components/lost-india/LostSiteCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LostIndiaPage() {
  const { t } = useTranslation();
  const lostSites = getLostSites();

  return (
    <>
      <PageHeader
        title={t('lost_india_title')}
        description={t('lost_india_description')}
      >
         <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back_to_home')}
          </Link>
        </Button>
      </PageHeader>
      <main className="container px-4 md:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lostSites.map((site) => (
            <LostSiteCard key={site.id} site={site} />
          ))}
        </div>
      </main>
    </>
  );
}
