
import type { Metadata } from 'next';
import { UserPreferencesProvider } from '@/context/UserPreferencesContext';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import './globals.css';
import { LowBandwidthIndicator } from '@/components/common/LowBandwidthIndicator';
import { FirebaseClientProvider } from '@/firebase';
import { Chatbot } from '@/components/chatbot/Chatbot';

export const metadata: Metadata = {
  title: 'Bharat Heritage',
  description:
    "Explore India's cultural heritage in augmented reality with Bharat Heritage. A web app for virtual tours of historical sites and artifacts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link 
          href="https://fonts.googleapis.com/css?family=Open+Dyslexic" 
          rel="stylesheet"
        />
        <script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
          async
        ></script>
        <link rel="stylesheet" href="/chatbot/chatbot-styles.css" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <FirebaseClientProvider>
          <UserPreferencesProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <LowBandwidthIndicator />
              <main className="flex-1">{children}</main>
              <Chatbot />
            </div>
            <Toaster />
          </UserPreferencesProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
