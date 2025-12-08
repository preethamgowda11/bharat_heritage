'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';

export function useAdmin() {
  const { user, isUserLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isUserLoading) {
      // Still waiting for the user object to be determined
      return;
    }

    if (!user) {
      // No user is logged in
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    // User is available, check for admin claim.
    // Force a token refresh to get the latest claims.
    user.getIdTokenResult(true).then((idTokenResult) => {
      const isAdminClaim = !!idTokenResult.claims.admin;
      setIsAdmin(isAdminClaim);
      setIsLoading(false);
    }).catch(error => {
      console.error("Error getting ID token result:", error);
      setIsAdmin(false);
      setIsLoading(false);
    });

  }, [user, isUserLoading]);

  return { isAdmin, isLoading };
}
