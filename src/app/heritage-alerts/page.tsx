
'use client';

import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Camera, Plus } from 'lucide-react';
import Link from 'next/link';
import PlaceSuggestionForm from '@/components/PlaceSuggestionForm';


export default function HeritageAlertsPage() {
  return (
    <>
      <PageHeader
        title="Heritage Alerts"
        description="Help protect our cultural treasures. Report or scan for potential threats."
      >
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </PageHeader>
      <main className="container px-4 md:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-6 w-6 text-primary" />
                Contribute a Report
              </CardTitle>
              <CardDescription>
                Have you noticed a heritage site that seems neglected, damaged, or undocumented? Submit a report to bring it to our attention.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlaceSuggestionForm />
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-6 w-6 text-primary" />
                Scan for Danger
              </CardTitle>
              <CardDescription>
                Use your device's camera to run a real-time analysis on a structure to detect potential dangers like cracks or degradation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/danger-check">
                  Open Camera Scanner
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
