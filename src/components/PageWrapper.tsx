'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  title: string;
}

export default function PageWrapper({ children, title }: PageWrapperProps) {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#0a0a0a'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!sessionData) {
    router.push('/login');
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      <header style={{ backgroundColor: '#171717', borderBottom: '1px solid #262626' }}>
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#e5e5e5',
            margin: 0
          }}>
            {title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#a3a3a3', fontSize: '14px' }}>
              {sessionData.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="btn btn-danger"
              style={{ fontSize: '14px' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
