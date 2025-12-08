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
import { useAdmin } from '@/hooks/use-admin';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    // This effect handles what happens when auth state is resolved.
    // It's separate from the sign-in action itself.
    if (!isUserLoading && user) {
        router.push('/admin/dashboard');
    }
  }, [user, isUserLoading, router]);

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

    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
        // We only want to act when the user object becomes available AFTER sign-in.
        if (loggedInUser) {
            toast({
                title: 'Success',
                description: 'You have been signed in.',
            });
            // The useEffect above will handle the redirection.
            setIsSigningIn(false);
            unsubscribe(); // Clean up the listener
        }
    }, (error) => {
        // Handle auth errors during the sign-in process
        toast({
            variant: 'destructive',
            title: 'Authentication Failed',
            description: error.message || 'Could not sign in. Please check your credentials.',
        });
        setIsSigningIn(false);
        unsubscribe(); // Clean up on error too
    });

    // Initiate the sign-in. The listener above will catch the result.
    initiateEmailSignIn(auth, email, password);
  };
  
  const handleAnonymousSignIn = () => {
    setIsSigningIn(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            toast({
                title: 'Signed in as Guest',
                description: 'You are now signed in anonymously.',
            });
            router.push('/');
            setIsSigningIn(false);
            unsubscribe();
        }
    });
    initiateAnonymousSignIn(auth);
  };

  // While checking the initial auth state, show a loading indicator.
  // If the user is already logged in, the useEffect will redirect them,
  // so we can just show a loading screen to prevent the form from flashing.
  if (isUserLoading || user) {
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
