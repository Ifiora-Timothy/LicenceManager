'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Account created but login failed. Please try logging in manually.');
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('An unexpected error occurred');
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
            Create Account
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '14px' }}>
            Join License Manager
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                style={{ width: '100%' }}
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" style={{ 
                display: 'block', 
                marginBottom: '6px', 
                color: '#e5e5e5',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                minLength={6}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div style={{ 
            marginTop: '24px', 
            textAlign: 'center',
            paddingTop: '20px',
            borderTop: '1px solid #262626'
          }}>
            <p style={{ color: '#a3a3a3', fontSize: '14px' }}>
              Already have an account?{' '}
              <Link
                href="/login"
                style={{ 
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
