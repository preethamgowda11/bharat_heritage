
'use client';

import { useState }from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Signed In',
        description: 'You have been successfully signed in as an administrator.',
      });
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error("Sign-in error:", error);
      toast({
        variant: 'destructive',
        title: 'Sign-in Failed',
        description: error.message || 'Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSignIn}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <KeyRound className="h-6 w-6" />
              Admin Login
            </CardTitle>
            <CardDescription>
              This login is for administrators only. Please enter your credentials to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button className="w-auto" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

    