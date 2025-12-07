'use client';

import { getSites } from '@/lib/data';
import { SiteCard } from '@/components/sites/SiteCard';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function ExploreSitesPage() {
  const sites = getSites();
  const { t } = useTranslation();

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      </div>
    </>
  );
}
