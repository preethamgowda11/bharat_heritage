
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';

interface AdminHookResult {
  isAdmin: boolean | null;
  isLoading: boolean;
}

export function useAdmin(): AdminHookResult {
  const { user, isUserLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Start loading whenever the user state changes or is loading
    setIsLoading(true);

    if (isUserLoading) {
      // Don't do anything until the initial user state is resolved.
      return;
    }

    if (!user) {
      // If there is no user, they are definitely not an admin.
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    // Force a token refresh to get the latest claims, as they might be stale
    // immediately after login.
    user.getIdTokenResult(true)
      .then((idTokenResult) => {
        const userIsAdmin = idTokenResult.claims.admin === true;
        setIsAdmin(userIsAdmin);
      })
      .catch((error) => {
        console.error("Error fetching admin token:", error);
        setIsAdmin(false);
      })
      .finally(() => {
        // The check is complete, regardless of the outcome.
        setIsLoading(false);
      });
      
  }, [user, isUserLoading]);

  return { isAdmin, isLoading };
}
