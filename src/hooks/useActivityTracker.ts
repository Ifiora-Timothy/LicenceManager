// hooks/useActivityTracker.ts
"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { LocalStorageManager } from '@/lib/localStorage';

export function useActivityTracker() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    let activityTimeout: NodeJS.Timeout;

    const updateActivity = () => {
      LocalStorageManager.updateLastActivity();
    };

    const resetTimeout = () => {
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(updateActivity, 30000); // Update every 30 seconds
    };

    // Track various user activities
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = () => {
      updateActivity();
      resetTimeout();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, activityHandler, true);
    });

    // Initial activity update
    updateActivity();
    resetTimeout();

    // Cleanup
    return () => {
      clearTimeout(activityTimeout);
      events.forEach(event => {
        document.removeEventListener(event, activityHandler, true);
      });
    };
  }, [session]);
}
