'use client';

import Link from 'next/link';
import { Accessibility, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { AccessibilityPanel } from './AccessibilityPanel';
import { SettingsPanel } from './SettingsPanel';
import { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';


export function Header() {
  const [isAccessibilityOpen, setAccessibilityOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="hidden font-bold sm:inline-block font-headline text-lg">
              {t('bharat_heritage')}
            </span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('accessibility')}
              onClick={() => setAccessibilityOpen(true)}
            >
              <Accessibility className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('settings')}
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <AccessibilityPanel open={isAccessibilityOpen} onOpenChange={setAccessibilityOpen} />
      <SettingsPanel open={isSettingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
