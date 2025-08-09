// hooks/useEnhancedSession.ts
"use client";

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { LocalStorageManager, UserPreferences } from '@/lib/localStorage';

export function useEnhancedSession() {
  const { data: session, status } = useSession();
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
  const [sessionMetadata, setSessionMetadata] = useState<{
    loginTime?: Date;
    lastActivity?: Date;
  } | null>(null);

  // Load preferences and metadata on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserPreferences(LocalStorageManager.getUserPreferences());
      setSessionMetadata(LocalStorageManager.getSessionMetadata());
    }
  }, []);

  // Save login time when session starts
  useEffect(() => {
    if (session && status === 'authenticated') {
      const metadata = LocalStorageManager.getSessionMetadata();
      if (!metadata?.loginTime) {
        LocalStorageManager.saveSessionMetadata({ 
          loginTime: new Date(),
          lastActivity: new Date()
        });
        setSessionMetadata(LocalStorageManager.getSessionMetadata());
      }
      
      // Update last activity
      LocalStorageManager.updateLastActivity();
    }
  }, [session, status]);

  // Update preferences
  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    LocalStorageManager.saveUserPreferences(newPrefs);
    setUserPreferences(LocalStorageManager.getUserPreferences());
  };

  // Clear all data on sign out
  const clearStoredData = () => {
    LocalStorageManager.clearAllData();
    setUserPreferences({});
    setSessionMetadata(null);
  };

  // Remember email for future logins
  const rememberEmail = (email: string) => {
    LocalStorageManager.rememberLoginEmail(email);
    setUserPreferences(LocalStorageManager.getUserPreferences());
  };

  // Get remembered email
  const getRememberedEmail = () => {
    return LocalStorageManager.getRememberedEmail();
  };

  return {
    session,
    status,
    userPreferences,
    sessionMetadata,
    updatePreferences,
    clearStoredData,
    rememberEmail,
    getRememberedEmail,
  };
}
