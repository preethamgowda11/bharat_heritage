'use client';

import { PageHeader } from '@/components/common/PageHeader';
import { useTranslation } from '@/hooks/use-translation';
import { getLostSites } from '@/lib/data';
import { LostSiteCard } from '@/components/lost-india/LostSiteCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function HeritageAlertsPage() {
  const { t } = useTranslation();
  
  // Filter for only high-risk sites
  const highRiskSites = getLostSites().filter(site => site.threat_level === 'red');

  return (
    <>
      <PageHeader
        title="Heritage Alerts"
        description="Critically endangered sites requiring immediate attention."
      >
         <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back_to_home')}
          </Link>
        </Button>
      </PageHeader>
      <main className="container px-4 md:px-8 pb-12">
        <Alert variant="destructive" className="mb-8">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Danger Zone</AlertTitle>
            <AlertDescription>
                The following heritage sites have been identified as being at high risk. Your attention and responsible reporting can help in their preservation. The "Run Danger Check" feature (coming soon) will allow you to use your camera to analyze and report specific threats.
            </AlertDescription>
        </Alert>

        {highRiskSites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {highRiskSites.map((site) => (
                <LostSiteCard key={site.id} site={site} />
            ))}
            </div>
        ) : (
            <p className="text-center text-muted-foreground">No high-risk sites currently identified.</p>
        )}
      </main>
    </>
  );
}
