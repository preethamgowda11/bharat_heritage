
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

  useEffect(() => {
    if (isUserLoading) {
      return; 
    }

    if (!user) {
      setIsAdmin(false);
      return;
    }

    user.getIdTokenResult()
      .then((idTokenResult) => {
        // Check for the 'admin' custom claim
        const userIsAdmin = idTokenResult.claims.admin === true;
        setIsAdmin(userIsAdmin);
      })
      .catch(() => {
        setIsAdmin(false);
      });
  }, [user, isUserLoading]);

  return { isAdmin, isLoading: isAdmin === null };
}
