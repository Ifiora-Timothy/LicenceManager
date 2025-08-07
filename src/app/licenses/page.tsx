"use client";
import { useState, useEffect, useRef } from "react";
import { License, Consumer } from "@/types";
import { Product } from "@/types";
import { Trash2, ArrowUp } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

export default function Licenses() {
  const formRef = useRef<HTMLFormElement>(null);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [licenseToDelete, setLicenseToDelete] = useState<License | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [licenseToUpgrade, setLicenseToUpgrade] = useState<License | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchConsumers();
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const res = await fetch("/api/licenses", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch licenses");
      const data: License[] = await res.json();
      setLicenses(data);
    } catch (err) {
      setError("Error fetching licenses. Please try again.");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Error fetching products. Please try again.");
    }
  };

  const fetchConsumers = async () => {
    try {
      const res = await fetch("/api/consumers", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch consumers");
      const data: Consumer[] = await res.json();
      setConsumers(data);
    } catch (err) {
      setError("Error fetching consumers. Please try again.");
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      productId: formData.get("productId"),
      consumerId: formData.get("consumerId"),
      licenseType: formData.get("licenseType"),
      expires: formData.get("expires") || undefined,
    };

    try {
      const res = await fetch("/api/licenses", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create license");
      }

      await fetchLicenses();
      formRef.current?.reset();
    } catch (err: any) {
      setError(err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpgrade = async (licenseId: string) => {
    try {
      const res = await fetch('/api/licenses', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseId, licenseType: 'full' }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to upgrade license');
      }
      await fetchLicenses();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteClick = (license: License) => {
    setLicenseToDelete(license);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!licenseToDelete) return;
    try {
      const res = await fetch("/api/licenses", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseId: licenseToDelete._id }),
      });
      if (!res.ok) throw new Error("Failed to delete license");
      await fetchLicenses();
    } catch (err: any) {
      setError(err?.message);
    } finally {
      setShowDeleteDialog(false);
      setLicenseToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setLicenseToDelete(null);
  };

  const handleUpgradeClick = (license: License) => {
    setLicenseToUpgrade(license);
    setShowUpgradeDialog(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!licenseToUpgrade) return;
    await handleUpgrade(licenseToUpgrade._id!);
    setShowUpgradeDialog(false);
    setLicenseToUpgrade(null);
  };

  const handleCancelUpgrade = () => {
    setShowUpgradeDialog(false);
    setLicenseToUpgrade(null);
  };

  const handleToggle = async (licenseId: string, active: boolean) => {
    try {
      const res = await fetch("/api/licenses/toggle", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseId, active }),
      });
      if (!res.ok) throw new Error("Failed to toggle license");
      await fetchLicenses();
    } catch (err) {
      setError("Error toggling license. Please try again.");
    }
  };

  return (
    <PageWrapper title="License Management">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Create License Form */}
        <div className="card" style={{ maxWidth: '500px' }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#e5e5e5',
            marginBottom: '20px'
          }}>
            Create New License
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
            <div>
              <label htmlFor="productId" style={{ 
                display: 'block', 
                marginBottom: '6px', 
                color: '#e5e5e5',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Product
              </label>
              <select
                id="productId"
                name="productId"
                required
                style={{ width: '100%' }}
              >
                <option value="" disabled>
                  {products.length ? "Select a product" : "Loading products..."}
                </option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="consumerId" style={{ 
                display: 'block', 
                marginBottom: '6px', 
                color: '#e5e5e5',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Consumer
              </label>
              <select
                id="consumerId"
                name="consumerId"
                required
                style={{ width: '100%' }}
              >
                <option value="" disabled>
                  {consumers.length ? "Select a consumer" : "Loading consumers..."}
                </option>
                {consumers.map((consumer) => (
                  <option key={consumer._id} value={consumer._id}>
                    {consumer.name} ({consumer.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="licenseType" style={{ 
                display: 'block', 
                marginBottom: '6px', 
                color: '#e5e5e5',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                License Type
              </label>
              <select
                id="licenseType"
                name="licenseType"
                style={{ width: '100%' }}
              >
                <option value="full">Full License</option>
                <option value="trial">Trial License</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="expires" style={{ 
                display: 'block', 
                marginBottom: '6px', 
                color: '#e5e5e5',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Expiration Date (Optional)
              </label>
              <input
                id="expires"
                name="expires"
                type="date"
                style={{ width: '100%' }}
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
              {isSubmitting ? "Creating..." : "Create License"}
            </button>
          </form>
        </div>

        {/* Licenses Table */}
        <div className="card">
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#e5e5e5',
            marginBottom: '20px'
          }}>
            All Licenses
          </h2>
          
          {licenses.length === 0 ? (
            <p style={{ color: '#a3a3a3' }}>
              No licenses found.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>License Key</th>
                    <th>Product</th>
                    <th>Consumer</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {licenses.map((license: any) => (
                    <tr key={license._id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                        {license.licenseKey}
                      </td>
                      <td>{license.product?.name || license.productId}</td>
                      <td>
                        {license.consumer ? (
                          <div>
                            <div>{license.consumer.name}</div>
                            <div style={{ fontSize: '12px', color: '#a3a3a3' }}>
                              {license.consumer.email}
                            </div>
                            <div style={{ fontSize: '12px', color: '#a3a3a3' }}>
                              Acc: {license.consumer.accountNumber}
                            </div>
                          </div>
                        ) : (
                          license.consumerId
                        )}
                      </td>
                      <td>
                        <span className={`badge ${license.licenseType === "full" ? "badge-primary" : "badge-warning"}`}>
                          {license.licenseType}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${license.active ? "badge-success" : "badge-danger"}`}>
                          {license.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            onClick={() => handleToggle(license._id!, !license.active)}
                            className="btn btn-secondary"
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                          >
                            {license.active ? "Deactivate" : "Activate"}
                          </button>
                          
                          {license.licenseType === 'trial' && (
                            <button
                              onClick={() => handleUpgradeClick(license)}
                              className="btn btn-success"
                              style={{ fontSize: '12px', padding: '4px 8px' }}
                              title="Upgrade to full license"
                            >
                              <ArrowUp style={{ width: '12px', height: '12px' }} />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDeleteClick(license)}
                            className="btn btn-danger"
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                            title="Delete license"
                          >
                            <Trash2 style={{ width: '12px', height: '12px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteDialog && (
          <div className="modal-backdrop">
            <div className="modal">
              <p style={{ marginBottom: '20px', color: '#e5e5e5' }}>
                Are you sure you want to permanently delete this license?
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={handleCancelDelete}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="btn btn-danger"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Confirmation Modal */}
        {showUpgradeDialog && (
          <div className="modal-backdrop">
            <div className="modal">
              <p style={{ marginBottom: '20px', color: '#e5e5e5' }}>
                Upgrading will grant permanent ownership of this license. Proceed?
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  onClick={handleCancelUpgrade} 
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmUpgrade} 
                  className="btn btn-success"
                >
                  Confirm Upgrade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
