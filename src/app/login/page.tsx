
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser, initiateEmailSignIn, initiateAnonymousSignIn } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useAdmin } from '@/hooks/use-admin';

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
    // If auth state is resolved and user is confirmed admin, redirect from login page.
    if (!isUserLoading && !isAdminLoading && user && isAdmin) {
        router.push('/admin/dashboard');
    }
  }, [user, isUserLoading, isAdmin, isAdminLoading, router]);

  const handleSignIn = (e: React.FormEvent) => {
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

    const unsubscribe = onAuthStateChanged(auth, async (loggedInUser) => {
        if (loggedInUser) {
            unsubscribe(); // Clean up the listener immediately
            try {
                const idTokenResult = await loggedInUser.getIdTokenResult();
                const isUserAdmin = idTokenResult.claims.admin === true;

                toast({
                    title: 'Success',
                    description: 'You have been signed in.',
                });
                
                if (isUserAdmin) {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/'); // Redirect non-admins to home
                }
            } catch (error) {
                console.error("Error getting user claims:", error);
                toast({
                  variant: 'destructive',
                  title: 'Authentication Error',
                  description: 'Could not verify user role.',
                });
                router.push('/');
            } finally {
                setIsSigningIn(false);
            }
        }
    }, (error) => {
        // This handles errors during the sign-in process itself
        unsubscribe(); // Clean up on error
        toast({
            variant: 'destructive',
            title: 'Authentication Failed',
            description: error.message || 'Could not sign in. Please check your credentials.',
        });
        setIsSigningIn(false);
    });

    // Initiate the sign-in. The listener above will catch the result.
    initiateEmailSignIn(auth, email, password);
  };
  
  const handleAnonymousSignIn = () => {
    setIsSigningIn(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            unsubscribe();
            toast({
                title: 'Signed in as Guest',
                description: 'You are now signed in anonymously.',
            });
            router.push('/');
            setIsSigningIn(false);
        }
    });
    initiateAnonymousSignIn(auth);
  };

  // While checking the initial auth state, show a loading indicator.
  // The useEffect will handle redirection if the user is already logged in and an admin.
  if (isUserLoading || isAdminLoading || (user && isAdmin)) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

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
