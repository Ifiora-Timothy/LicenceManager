// components/SessionInfo.tsx
"use client";

import { useEnhancedSession } from '@/hooks/useEnhancedSession';

export default function SessionInfo() {
  const { session, sessionMetadata, userPreferences } = useEnhancedSession();

  if (!session) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#171717',
      border: '1px solid #262626',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '12px',
      color: '#a3a3a3',
      maxWidth: '250px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ fontWeight: '600', marginBottom: '8px', color: '#e5e5e5' }}>
        Session Info
      </div>
      <div>User: {session.user?.email}</div>
      {sessionMetadata?.loginTime && (
        <div>Login: {sessionMetadata.loginTime.toLocaleTimeString()}</div>
      )}
      {sessionMetadata?.lastActivity && (
        <div>Last Activity: {sessionMetadata.lastActivity.toLocaleTimeString()}</div>
      )}
      {userPreferences.rememberMe && (
        <div style={{ color: '#3b82f6' }}>✓ Email Remembered</div>
      )}
    </div>
  );
}
