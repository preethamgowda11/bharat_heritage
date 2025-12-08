'use client';

import { useEffect } from 'react';
import { useAdmin } from '@/hooks/use-admin';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/common/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function AdminDashboardPage() {
  const { isAdmin, isLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    // This effect runs after rendering.
    // If loading is finished and the user is not an admin, then we redirect.
    if (!isLoading && !isAdmin) {
      router.push('/login');
    }
  }, [isLoading, isAdmin, router]);

  // While loading, or if the user is not an admin yet (and the redirect hasn't happened),
  // show the loading skeleton. This prevents showing the dashboard to non-admins.
  if (isLoading || !isAdmin) {
    return (
      <div className="container px-4 md:px-8 py-8">
        <PageHeader title="Admin Dashboard" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // IMPORTANT: Replace this with your actual Power BI public report URL
  const powerBiUrl = "https://app.powerbi.com/view?r=eyJrIjoiYOUR_REPORT_ID_HEREiLCJ0IjoiYOUR_TENANT_ID_HERE";

  return (
    <>
      <PageHeader title="Admin Dashboard" description="User activity and app analytics." />
      <main className="container px-4 md:px-8 pb-12">
        <div className="p-4 border-2 border-dashed rounded-lg">
          <iframe
            title="User Activity Dashboard"
            width="100%"
            height="800"
            src={powerBiUrl}
            frameBorder="0"
            allowFullScreen={true}
            style={{ minHeight: '80vh' }}
          ></iframe>
        </div>
         <Alert className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Note for Admin</AlertTitle>
          <AlertDescription>
            To see your data, please replace the placeholder Power BI URL in the code with your actual public report URL. You can find this in the file: src/app/admin/dashboard/page.tsx.
          </AlertDescription>
        </Alert>
      </main>
    </>
  );
}
