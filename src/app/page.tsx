"use client";
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { useEnhancedSession } from '@/hooks/useEnhancedSession';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import SessionInfo from '@/components/SessionInfo';

export default function Dashboard() {
  const { 
    session: sessionData, 
    status, 
    sessionMetadata, 
    clearStoredData 
  } = useEnhancedSession();
  const router = useRouter();

  // Track user activity
  useActivityTracker();

  useEffect(() => {
    if (status !== 'loading' && !sessionData) {
      router.push('/login');
    }
  }, [sessionData, status, router]);


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
            License Manager
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#a3a3a3', fontSize: '14px' }}>
              {sessionData?.user?.email}
              {sessionMetadata?.loginTime && (
                <div style={{ fontSize: '12px', marginTop: '2px' }}>
                  Logged in: {sessionMetadata.loginTime.toLocaleTimeString()}
                </div>
              )}
            </span>
            <button
              onClick={() => {
                clearStoredData(); // Clear localStorage before signing out
                signOut({ callbackUrl: '/login' });
              }}
              className="btn btn-danger"
              style={{ fontSize: '14px' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px',
          maxWidth: '800px'
        }}>
          <div className="card">
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#e5e5e5',
              marginBottom: '12px'
            }}>
              License Management
            </h2>
            <p style={{ 
              color: '#a3a3a3', 
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              View, create, and manage software licenses for your products.
            </p>
            <Link
              href="/licenses"
              className="btn btn-primary"
              style={{ 
                display: 'inline-block',
                textDecoration: 'none'
              }}
            >
              Manage Licenses
            </Link>
          </div>
          
          <div className="card">
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#e5e5e5',
              marginBottom: '12px'
            }}>
              Product Catalog
            </h2>
            <p style={{ 
              color: '#a3a3a3', 
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              Manage your software products and their configurations.
            </p>
            <Link
              href="/products"
              className="btn btn-success"
              style={{ 
                display: 'inline-block',
                textDecoration: 'none'
              }}
            >
              Manage Products
            </Link>
          </div>
          
          <div className="card">
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#e5e5e5',
              marginBottom: '12px'
            }}>
              Consumer Database
            </h2>
            <p style={{ 
              color: '#a3a3a3', 
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              Manage consumer accounts and their license assignments.
            </p>
            <Link
              href="/consumers"
              className="btn btn-secondary"
              style={{ 
                display: 'inline-block',
                textDecoration: 'none'
              }}
            >
              Manage Consumers
            </Link>
          </div>
          
          <div className="card">
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#e5e5e5',
              marginBottom: '12px'
            }}>
              License Lookup
            </h2>
            <p style={{ 
              color: '#a3a3a3', 
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              Quick license verification and status checking tool.
            </p>
            <Link
              href="/lookup"
              className="btn btn-primary"
              style={{ 
                display: 'inline-block',
                textDecoration: 'none'
              }}
            >
              Check Licenses
            </Link>
          </div>
        </div>
      </main>
      
      <SessionInfo />
    </div>
  );
}