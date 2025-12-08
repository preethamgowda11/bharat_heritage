
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser, initiateEmailSignIn, initiateAnonymousSignIn } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);
  

  if (isUserLoading || user) {
    return <div>Loading...</div>;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    
    onAuthStateChanged(auth, (user) => {
      if(user) {
        toast({
          title: 'Success',
          description: 'You have been signed in.',
        });
        router.push('/admin/dashboard');
        setIsSigningIn(false);
      }
    }, (error) => {
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: error.message || 'Could not sign in. Please check your credentials.',
        });
        setIsSigningIn(false);
    });

    initiateEmailSignIn(auth, email, password);
  };
  
  const handleAnonymousSignIn = () => {
    setIsSigningIn(true);
    onAuthStateChanged(auth, (user) => {
        if (user) {
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
