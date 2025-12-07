import { getSiteById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { SiteDetailView } from '@/components/sites/SiteDetailView';

interface SiteDetailPageProps {
  params: { id: string };
}

export default async function SiteDetailPage({ params }: SiteDetailPageProps) {
  const site = getSiteById(params.id);

  if (!site) {
    notFound();
  }
  
  return <SiteDetailView site={site} />;
}
