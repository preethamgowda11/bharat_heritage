
'use client';

import Link from 'next/link';
import { Accessibility, Settings, LogOut, User, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { AccessibilityPanel } from './AccessibilityPanel';
import { SettingsPanel } from './SettingsPanel';
import { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


export function Header() {
  const [isAccessibilityOpen, setAccessibilityOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const { t } = useTranslation();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'Could not sign you out. Please try again.',
      });
    }
  };


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
            {!isUserLoading && (
              user ? (
                <>
                  <div className="flex items-center gap-2 border-r pr-2 mr-2">
                    <Gem className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold text-sm">0</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Logout"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  aria-label="Admin Login"
                >
                  <Link href="/login">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              )
            )}
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
