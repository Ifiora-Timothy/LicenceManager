"use client";
import { useState } from 'react';

interface ConsumerData {
  consumer: {
    name: string;
    email: string;
    company?: string;
    accountNumber: string;
  };
  licenses: Array<{
    _id: string;
    licenseKey: string;
    product: {
      name: string;
      description?: string;
    };
    licenseType: string;
    expires?: string;
    active: boolean;
    createdAt: string;
  }>;
}

export default function ConsumerLookup() {
  const [consumerData, setConsumerData] = useState<ConsumerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleLookup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSearching(true);
    setConsumerData(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: formData.get('email'),
      accountNumber: formData.get('accountNumber'),
    };

    try {
      const res = await fetch('/api/consumers/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to find consumer');
      }
      
      const data = await res.json();
      setConsumerData(data);
    } catch (err: any) {
      setError(err.message || 'Error looking up consumer. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      <header style={{ backgroundColor: '#171717', borderBottom: '1px solid #262626' }}>
        <div className="container mx-auto px-6 py-6">
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#e5e5e5',
            margin: 0
          }}>
            License Lookup
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Search Form */}
          <div className="card" style={{ maxWidth: '500px' }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#e5e5e5',
              marginBottom: '12px'
            }}>
              Find Your Licenses
            </h2>
            <p style={{ 
              color: '#a3a3a3', 
              marginBottom: '20px',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              Enter either your email address or account number to view your licenses.
            </p>
            
            {error && (
              <div style={{ 
                padding: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '6px',
                color: '#ef4444',
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleLookup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                  placeholder="Enter your email address"
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ 
                textAlign: 'center', 
                color: '#737373',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                OR
              </div>
              
              <div>
                <label htmlFor="accountNumber" style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  color: '#e5e5e5',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Account Number
                </label>
                <input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  placeholder="Enter your account number"
                  style={{ width: '100%' }}
                />
              </div>
              
              <button
                type="submit"
                disabled={isSearching}
                className="btn btn-primary"
                style={{ 
                  width: '100%',
                  opacity: isSearching ? 0.6 : 1,
                  cursor: isSearching ? 'not-allowed' : 'pointer'
                }}
              >
                {isSearching ? 'Searching...' : 'Find My Licenses'}
              </button>
            </form>
          </div>

          {/* Results */}
          {consumerData && (
            <div className="card">
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#e5e5e5',
                marginBottom: '20px'
              }}>
                Your Account Information
              </h2>
              
              {/* Consumer Info */}
              <div style={{ 
                marginBottom: '24px', 
                padding: '16px',
                backgroundColor: '#262626',
                borderRadius: '6px',
                border: '1px solid #404040'
              }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#e5e5e5',
                  marginBottom: '12px'
                }}>
                  Account Details
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '12px',
                  fontSize: '14px'
                }}>
                  <div>
                    <span style={{ fontWeight: '500', color: '#a3a3a3' }}>Name:</span>
                    <span style={{ marginLeft: '8px', color: '#e5e5e5' }}>{consumerData.consumer.name}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '500', color: '#a3a3a3' }}>Email:</span>
                    <span style={{ marginLeft: '8px', color: '#e5e5e5' }}>{consumerData.consumer.email}</span>
                  </div>
                  {consumerData.consumer.company && (
                    <div>
                      <span style={{ fontWeight: '500', color: '#a3a3a3' }}>Company:</span>
                      <span style={{ marginLeft: '8px', color: '#e5e5e5' }}>{consumerData.consumer.company}</span>
                    </div>
                  )}
                  <div>
                    <span style={{ fontWeight: '500', color: '#a3a3a3' }}>Account Number:</span>
                    <span style={{ marginLeft: '8px', color: '#e5e5e5', fontFamily: 'monospace' }}>{consumerData.consumer.accountNumber}</span>
                  </div>
                </div>
              </div>

              {/* Licenses */}
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#e5e5e5',
                marginBottom: '16px'
              }}>
                Your Licenses ({consumerData.licenses.length})
              </h3>
              
              {consumerData.licenses.length === 0 ? (
                <p style={{ color: '#a3a3a3' }}>
                  No licenses found for your account.
                </p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>License Key</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Expires</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consumerData.licenses.map((license) => (
                        <tr key={license._id}>
                          <td>
                            <div>
                              <div style={{ fontWeight: '500' }}>{license.product.name}</div>
                              {license.product.description && (
                                <div style={{ fontSize: '12px', color: '#737373' }}>{license.product.description}</div>
                              )}
                            </div>
                          </td>
                          <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                            {license.licenseKey}
                          </td>
                          <td>
                            <span className={`badge ${license.licenseType === 'full' ? 'badge-primary' : 'badge-warning'}`}>
                              {license.licenseType}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${license.active ? 'badge-success' : 'badge-danger'}`}>
                              {license.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            {license.expires ? (
                              <span style={{
                                color: new Date(license.expires) < new Date() ? '#ef4444' : '#e5e5e5'
                              }}>
                                {new Date(license.expires).toLocaleDateString()}
                              </span>
                            ) : (
                              <span style={{ color: '#a3a3a3' }}>Never</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
