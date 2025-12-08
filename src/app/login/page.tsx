
'use client';

import { useState, useEffect } from 'react';
import { useAuth, initiateEmailSignIn, initiateAnonymousSignIn } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/firebase';
import { useAdmin } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    // This effect handles redirection for users who are ALREADY logged in
    // when they land on this page.
    if (!isUserLoading && !isAdminLoading && user) {
      if (isAdmin) {
        // If the user is an admin, they shouldn't be on the login page.
        router.replace('/admin/dashboard');
      } else {
        // If the user is logged in but not an admin, send them to the home page.
        router.replace('/');
      }
    }
  }, [user, isUserLoading, isAdmin, isAdminLoading, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        toast({
            variant: 'destructive',
            title: 'Missing Fields',
            description: 'Please enter both email and password.',
        });
        return;
    }
    setIsSigningIn(true);

    try {
      await initiateEmailSignIn(auth, email, password);
      // After initiating sign-in, the useEffect hook will detect the auth state change
      // and handle the redirection.
      toast({
          title: 'Success',
          description: 'You have been signed in. Redirecting...',
      });
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Authentication Failed',
            description: error.message || 'Could not sign in. Please check your credentials.',
        });
    } finally {
        setIsSigningIn(false);
    }
  };
  
  const handleAnonymousSignIn = async () => {
    setIsSigningIn(true);
    try {
        await initiateAnonymousSignIn(auth);
        toast({
            title: 'Signed in as Guest',
            description: 'You are now signed in anonymously.',
        });
        // The useEffect will redirect to '/' after the user state updates.
    } catch (error: any) {
         toast({
            variant: 'destructive',
            title: 'Guest Sign-In Failed',
            description: error.message || 'Could not sign in as guest.',
        });
    } finally {
        setIsSigningIn(false);
    }
  };

  // While checking the initial auth state, or if a user is already logged in and being redirected,
  // show a loading skeleton.
  if (isUserLoading || isAdminLoading || user) {
    return (
        <div className="container mx-auto flex items-center justify-center p-4" style={{ height: 'calc(100vh - 4rem)'}}>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
                <CardFooter>
                     <Skeleton className="h-10 w-full" />
                </CardFooter>
            </Card>
        </div>
    );
  }

  // If we reach this point, the user is not logged in, so we can show the form.
  return (
    <div className="container mx-auto flex items-center justify-center p-4" style={{ height: 'calc(100vh - 4rem)'}}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSigningIn}>
              {isSigningIn ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
                <Separator />
                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-2 text-sm text-muted-foreground">
                    OR
                </span>
            </div>
            <Button variant="outline" className="w-full" onClick={handleAnonymousSignIn} disabled={isSigningIn}>
                Sign in as Guest
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
