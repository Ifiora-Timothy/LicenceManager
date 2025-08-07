'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        const errorMessage = result.error === 'No user found with this email' 
          ? 'No account found with this email address'
          : result.error === 'Invalid password'
          ? 'Incorrect password'
          : result.error === 'Missing credentials'
          ? 'Please enter both email and password'
          : 'Login failed. Please check your credentials and try again.';
        
        setError(errorMessage);
      } else if (result?.ok) {
        router.push('/');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Connection error. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#0a0a0a',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#e5e5e5',
            marginBottom: '8px'
          }}>
            License Manager
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '14px' }}>
            Sign in to your account
          </p>
        </div>
        
        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label htmlFor="email" style={{ 
                display: 'block', 
                marginBottom: '6px', 
                color: '#e5e5e5',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{ width: '100%' }}
              />
            </div>
            
            <div>
              <label htmlFor="password" style={{ 
                display: 'block', 
                marginBottom: '6px', 
                color: '#e5e5e5',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ width: '100%' }}
              />
            </div>

            {error && (
              <div style={{ 
                padding: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '6px',
                color: '#ef4444',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ 
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div style={{ 
            marginTop: '24px', 
            textAlign: 'center',
            paddingTop: '20px',
            borderTop: '1px solid #262626'
          }}>
            <p style={{ color: '#a3a3a3', fontSize: '14px' }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                style={{ 
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}