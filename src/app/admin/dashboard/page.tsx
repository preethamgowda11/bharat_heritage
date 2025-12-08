
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAdmin } from '@/hooks/use-admin';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const { isAdmin, isLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and user is not an admin, redirect to login.
    // This is the primary guard for this route.
    if (!isLoading && !isAdmin) {
      router.replace('/login');
    }
  }, [isAdmin, isLoading, router]);

  // Show a loading skeleton ONLY while the admin check is in progress.
  if (isLoading) {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <PageHeader title="Admin Dashboard" />
            <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
  }

  // If the checks are complete and the user IS an admin, render the dashboard.
  // The useEffect above handles redirecting non-admins, so we can be sure
  // that if we reach this point, the user is authorized.
  if (isAdmin) {
    return (
        <div className="container mx-auto p-4 md:p-8">
        <PageHeader title="Admin Dashboard" description="Tracking user activity across the application."/>
        <Card>
            <CardHeader>
                <CardTitle>Power BI Report</CardTitle>
                <CardDescription>
                    This is the embedded dashboard for user analytics. 
                    Replace the `src` of the iframe with your actual Power BI embed URL.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <iframe 
                    title="Power BI Dashboard"
                    width="100%"
                    height="600"
                    src="https://app.powerbi.com/view?r=eyJrIjoiN2YyNDIyYTQtYmY5ZS00ZDIzLWI3ZGMtODU4ZGE3MmZlZjkxIiwidCI6IjcwNjNhOTg4LTM3ZTAtNDU3ZS04OWJmLTIzNGI5NTQ5Y2I4MSJ9" 
                    frameBorder="0"
                    allowFullScreen={true}
                    className="border rounded-md"
                ></iframe>
            </CardContent>
        </Card>
        </div>
    );
  }

  // If not loading and not admin, this state is brief before redirection.
  // Returning null is cleaner than showing any content.
  return null;
}
