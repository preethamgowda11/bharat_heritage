// src/app/360/[place]/page.tsx
import React, { Suspense } from 'react';
import Head from 'next/head';
import ThreeSixtyViewer from '@/components/common/ThreeSixtyViewer';
import path from 'path';
import fs from 'fs';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = { params: { place: string } };

type ImageMapping = {
  images: { slug: string; file: string; title?: string }[];
};

export default function Page({ params }: Props) {
  const place = params.place || '';
  const projectRoot = process.cwd();

  // load mapping
  const mappingPath = path.join(projectRoot, 'public', 'data', '360-images.json');
  let mapping: ImageMapping = { images: [] };
  if (fs.existsSync(mappingPath)) {
    try {
      mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8') || '{}');
    } catch (e) {
      mapping = { images: [] };
    }
  }

  // find mapping by slug (case-insensitive)
  const found = mapping.images.find(i => (i.slug || '').toLowerCase() === place.toLowerCase());
  const viewerUrl = found ? `/360-images/${found.file}` : null;

  const title = found?.title || place.replace(/-/g, ' ');

  return (
    <>
      <Head>
        <title>{title} - 360° View</title>
      </Head>
       <PageHeader
        title={`${title} - 360° View`}
      >
        <Button asChild variant="outline">
          <Link href={`/sites/${place}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Site Details
          </Link>
        </Button>
      </PageHeader>
      <main className="container px-4 md:px-8 pb-12">
        {viewerUrl ? (
            <Suspense fallback={<div className="text-center">Loading 360° View...</div>}>
              <ThreeSixtyViewer image={encodeURI(viewerUrl)} autoRotate height="70vh" autoRotateSpeed={0.12} />
            </Suspense>
        ) : (
          <div className="p-4 bg-muted text-muted-foreground rounded-lg">
            No 360° image found for <strong>{place}</strong>. Please upload the JPG to <code>public/360-images/</code> and add it to <code>public/data/360-images.json</code>.
          </div>
        )}
      </main>
    </>
  );
}
