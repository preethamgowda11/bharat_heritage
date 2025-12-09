
'use client';

import { useState }from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.641-3.203-11.303-7.518l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.853 44 30.552 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);


export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleAdminSignIn = async (e: React.FormEvent) => {
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

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        toast({
            title: 'Signed In',
            description: 'Welcome! You have successfully signed in.',
        });
        router.push('/'); 
    } catch (error: any) {
        console.error("Google sign-in error:", error);
        toast({
            variant: 'destructive',
            title: 'Sign-in Failed',
            description: 'Could not sign you in with Google. Please try again.',
        });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or continue as an administrator.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <Button variant="outline" onClick={handleGoogleSignIn} disabled={isGoogleLoading || isLoading}>
              {isGoogleLoading ? 'Signing in...' : <><GoogleIcon /> Continue with Google</>}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or for admins
                </span>
              </div>
            </div>

            <form onSubmit={handleAdminSignIn} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
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
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
               <Button className="w-full" type="submit" disabled={isLoading || isGoogleLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In as Admin'}
                </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
             <Button variant="ghost" type="button" onClick={() => router.back()} disabled={isLoading || isGoogleLoading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </CardFooter>
      </Card>
    </div>
  );
}
