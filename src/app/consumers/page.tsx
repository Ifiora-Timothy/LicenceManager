"use client";
import { useState, useEffect, useRef } from 'react';
import { Consumer } from '@/types';
import PageWrapper from '@/components/PageWrapper';

export default function Consumers() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchConsumers();
  }, []);

  const fetchConsumers = async () => {
    try {
      const res = await fetch('/api/consumers', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch consumers');
      const data: Consumer[] = await res.json();
      setConsumers(data);
    } catch (err) {
      setError('Error fetching consumers. Please try again.');
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || undefined,
      country: formData.get('country') || undefined,
      accountNumber: formData.get('accountNumber'),
    };

    try {
      const res = await fetch('/api/consumers', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create consumer');
      }
      await fetchConsumers();
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (err: any) {
      setError(err.message || 'Error creating consumer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (consumerId: string, consumerName: string) => {
    if (!confirm(`Are you sure you want to delete the consumer "${consumerName}"? This action cannot be undone.`)) {
      return;
    }

    setError(null);
    setDeletingId(consumerId);

    try {
      const res = await fetch(`/api/consumers/${consumerId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete consumer');
      }

      setConsumers(consumers.filter(consumer => consumer._id !== consumerId));
      
    } catch (err: any) {
      setError(err.message || 'Error deleting consumer. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PageWrapper title="Customer Management">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Create Consumer Form */}
        <div className="card" style={{ maxWidth: '700px' }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#e5e5e5',
            marginBottom: '20px'
          }}>
            Create New Customer
          </h2>
          
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
          
          <form onSubmit={handleCreate} ref={formRef} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label htmlFor="name" style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  color: '#e5e5e5',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Customer Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter customer name"
                  required
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label htmlFor="email" style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  color: '#e5e5e5',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  required
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label htmlFor="accountNumber" style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  color: '#e5e5e5',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Account Number *
                </label>
                <input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  placeholder="Enter account number"
                  required
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label htmlFor="phone" style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  color: '#e5e5e5',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label htmlFor="country" style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  color: '#e5e5e5',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  placeholder="Enter country"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ 
                width: 'fit-content',
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create Customer'}
            </button>
          </form>
        </div>

        {/* Consumers Table */}
        <div className="card">
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#e5e5e5',
            marginBottom: '20px'
          }}>
            All Customers
          </h2>
          
          {consumers.length === 0 ? (
            <p style={{ color: '#a3a3a3' }}>
              No customers found.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Country</th>
                    <th>Account Number</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {consumers.map((consumer) => (
                    <tr key={consumer._id}>
                      <td style={{ fontWeight: '500' }}>{consumer.name}</td>
                      <td>{consumer.email}</td>
                      <td style={{ color: '#a3a3a3' }}>{consumer.phone || '—'}</td>
                      <td style={{ color: '#a3a3a3' }}>{consumer.country || '—'}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                        {consumer.accountNumber}
                      </td>
                      <td style={{ fontSize: '13px', color: '#737373' }}>
                        {consumer.createdAt ? new Date(consumer.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        {consumer._id && (
                          <button
                            onClick={() => handleDelete(consumer._id!, consumer.name)}
                            disabled={deletingId === consumer._id}
                            className="btn btn-danger"
                            style={{ 
                              fontSize: '12px', 
                              padding: '4px 8px',
                              opacity: deletingId === consumer._id ? 0.6 : 1,
                              cursor: deletingId === consumer._id ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {deletingId === consumer._id ? 'Deleting...' : 'Delete'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
