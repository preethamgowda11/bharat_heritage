import { getArtifactById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ArtifactDetailView } from '@/components/artifacts/ArtifactDetailView';

interface ArtifactDetailPageProps {
  params: { id: string };
}

export default async function ArtifactDetailPage({ params }: ArtifactDetailPageProps) {
  const artifact = getArtifactById(params.id);

  if (!artifact) {
    notFound();
  }

  return <ArtifactDetailView artifact={artifact} />;
}
