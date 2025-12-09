
'use client';

import Link from 'next/link';
import { Accessibility, Settings, LogOut, User, Gem, KeyRound } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
            <div className="flex items-center gap-2 border-r pr-2 mr-2">
              <Gem className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-sm">0</span>
            </div>

            {isUserLoading ? (
              <Skeleton className="h-8 w-20 rounded-md" />
            ) : user ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                        <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                   <DropdownMenuLabel>
                     <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                     {user.email && <p className="text-xs leading-none text-muted-foreground">{user.email}</p>}
                   </DropdownMenuLabel>
                   <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
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
