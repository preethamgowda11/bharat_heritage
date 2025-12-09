
'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';

/**
 * A hook that ensures a user is always signed in, creating an anonymous
 * guest account if no user is present.
 */
export function useAnonymousSignIn() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    // Check if Firebase auth is loaded and if there's no user, and we're not already trying to sign in.
    if (!isUserLoading && !user && !isSigningIn) {
      setIsSigningIn(true);
      signInAnonymously(auth)
        .then(() => {
          console.log('Signed in anonymously.');
        })
        .catch((error) => {
          console.error('Anonymous sign-in failed:', error);
        })
        .finally(() => {
          setIsSigningIn(false);
        });
    }
  }, [user, isUserLoading, isSigningIn, auth]);
}
