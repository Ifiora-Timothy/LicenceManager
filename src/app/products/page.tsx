"use client";
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import PageWrapper from '@/components/PageWrapper';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      setError('Error loading products.');
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create product');
      }
      setName('');
      setDescription('');
      fetchProducts();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper title="Product Management">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Create Product Form */}
        <div className="card" style={{ maxWidth: '500px' }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#e5e5e5',
            marginBottom: '20px'
          }}>
            Create New Product
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
          
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="name" style={{ 
                display: 'block', 
                marginBottom: '6px', 
                color: '#e5e5e5',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Product Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                required
                style={{ width: '100%' }}
              />
            </div>
            
            <div>
              <label htmlFor="description" style={{ 
                display: 'block', 
                marginBottom: '6px', 
                color: '#e5e5e5',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                style={{ 
                  width: '100%',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ 
                width: '100%',
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </button>
          </form>
        </div>

        {/* Products Table */}
        <div className="card">
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#e5e5e5',
            marginBottom: '20px'
          }}>
            All Products
          </h2>
          
          {products.length === 0 ? (
            <p style={{ color: '#a3a3a3' }}>
              No products found.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td style={{ fontWeight: '500' }}>{product.name}</td>
                      <td style={{ color: '#a3a3a3' }}>{product.description || 'No description'}</td>
                      <td style={{ fontSize: '13px', color: '#737373' }}>
                        {new Date(product.createdAt || '').toLocaleDateString()}
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
