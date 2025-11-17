/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Service {
  _id: string;
  title: string;
  slug: string;
  category: string;
  images: string[];
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isIndexedInGoogle: boolean; // ← ADD THIS
  tiers: {
    starter?: { price: number; deliveryDays: number };
    standard?: { price: number; deliveryDays: number };
    advanced?: { price: number; deliveryDays: number };
  };
  author: string;
  requirements: string[];
  searchTags: string[];
  maxProjects: number;
  createdAt: string;
}

const ManageServicesPage = () => {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services?limit=50');
      const data = await response.json();
      
      if (response.ok) {
        setServices(data.services || []);
      } else {
        console.error('Failed to fetch services:', data.error);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId: string, serviceSlug: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(serviceId);
    
    try {
      const response = await fetch(`/api/services/${serviceSlug}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setServices(services.filter(s => s._id !== serviceId));
      } else {
        const data = await response.json();
        alert(`Failed to delete service: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleStatusChange = async (serviceId: string, serviceSlug: string, newStatus: string) => {
    setUpdateLoading(serviceId);
    
    try {
      const response = await fetch(`/api/services/${serviceSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setServices(services.map(s => 
          s._id === serviceId ? { ...s, status: newStatus as any } : s
        ));
      } else {
        const data = await response.json();
        alert(`Failed to update status: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdateLoading(null);
    }
  };

  const handleFeaturedToggle = async (serviceId: string, serviceSlug: string, isFeatured: boolean) => {
    setUpdateLoading(serviceId);
    
    try {
      const response = await fetch(`/api/services/${serviceSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isFeatured: !isFeatured })
      });

      if (response.ok) {
        setServices(services.map(s => 
          s._id === serviceId ? { ...s, isFeatured: !isFeatured } : s
        ));
      } else {
        const data = await response.json();
        alert(`Failed to update featured status: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Failed to update featured status');
    } finally {
      setUpdateLoading(null);
    }
  };

  // ADD THIS NEW FUNCTION
  const handleGoogleIndexToggle = async (serviceId: string, serviceSlug: string, isIndexedInGoogle: boolean) => {
    setUpdateLoading(serviceId);
    
    try {
      const response = await fetch(`/api/services/${serviceSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isIndexedInGoogle: !isIndexedInGoogle })
      });

      if (response.ok) {
        setServices(services.map(s => 
          s._id === serviceId ? { ...s, isIndexedInGoogle: !isIndexedInGoogle } : s
        ));
      } else {
        const data = await response.json();
        alert(`Failed to update Google indexing status: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating Google indexing status:', error);
      alert('Failed to update Google indexing status');
    } finally {
      setUpdateLoading(null);
    }
  };

  const getTierPrices = (service: Service) => {
    const tiers = service.tiers || {};
    const prices = Object.values(tiers).map((tier: any) => tier.price || 0).filter(price => price > 0);
    
    if (prices.length === 0) return 'Free';
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) {
      return `$${minPrice}`;
    }
    return `$${minPrice} - $${maxPrice}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Service Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage your service offerings and packages
            </p>
          </div>
          <div className="bg-primary/50 text-primary-foreground px-6 py-3 rounded-lg font-medium animate-pulse">
            Create New Service
          </div>
        </div>
        <div className="text-center py-16">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Service Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your service offerings and packages
          </p>
        </div>
        <Link
          href="/dashboard/admin/manage-services/create"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Create New Service
        </Link>
      </div>

      {/* Stats - UPDATED WITH GOOGLE INDEXED COUNT */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="text-2xl font-bold text-foreground">
            {services.length}
          </div>
          <div className="text-muted-foreground">Total Services</div>
        </div>
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="text-2xl font-bold text-foreground">
            {services.filter(s => s.status === 'published').length}
          </div>
          <div className="text-muted-foreground">Published</div>
        </div>
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="text-2xl font-bold text-foreground">
            {services.filter(s => s.isFeatured).length}
          </div>
          <div className="text-muted-foreground">Featured</div>
        </div>
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="text-2xl font-bold text-foreground">
            {services.filter(s => s.status === 'draft').length}
          </div>
          <div className="text-muted-foreground">Draft</div>
        </div>
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="text-2xl font-bold text-foreground">
            {services.filter(s => s.isIndexedInGoogle).length}
          </div>
          <div className="text-muted-foreground">Google Indexed</div>
        </div>
      </div>
      
      {/* Services List */}
      {services.length === 0 ? (
        <div className="bg-card rounded-lg shadow p-8 border text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">No Services Yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first service to start offering your expertise to clients.
            </p>
            <Link
              href="/dashboard/admin/manage-services/create"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Create Your First Service
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-card-foreground">
              Your Services ({services.length})
            </h2>
          </div>
          
          <div className="grid gap-6">
            {services.map((service) => (
              <ServiceCard 
                key={service._id} 
                service={service}
                onStatusChange={handleStatusChange}
                onFeaturedToggle={handleFeaturedToggle}
                onGoogleIndexToggle={handleGoogleIndexToggle} // ← ADD THIS
                onDelete={handleDelete}
                updateLoading={updateLoading}
                deleteLoading={deleteLoading}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Service Card Component - UPDATED WITH GOOGLE INDEXING TOGGLE
function ServiceCard({ 
  service, 
  onStatusChange, 
  onFeaturedToggle, 
  onGoogleIndexToggle, // ← ADD THIS PROP
  onDelete,
  updateLoading,
  deleteLoading 
}: { 
  service: Service;
  onStatusChange: (id: string, slug: string, status: string) => void;
  onFeaturedToggle: (id: string, slug: string, isFeatured: boolean) => void;
  onGoogleIndexToggle: (id: string, slug: string, isIndexedInGoogle: boolean) => void; // ← ADD THIS
  onDelete: (id: string, slug: string) => void;
  updateLoading: string | null;
  deleteLoading: string | null;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTierPrices = (service: Service) => {
    const tiers = service.tiers || {};
    const prices = Object.values(tiers).map((tier: any) => tier.price || 0).filter(price => price > 0);
    
    if (prices.length === 0) return 'Free';
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) {
      return `$${minPrice}`;
    }
    return `$${minPrice} - $${maxPrice}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100', label: 'Draft' },
      published: { color: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100', label: 'Published' },
      archived: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100', label: 'Archived' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-card rounded-lg shadow border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            {service.images && service.images.length > 0 && (
              <div className="flex-shrink-0">
                <img
                  src={service.images[0]}
                  alt={service.title}
                  className="w-16 h-16 rounded-lg object-cover border"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {service.category}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {getStatusBadge(service.status)}
        </div>
      </div>
      
      {/* Service Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-card-foreground">Pricing</p>
          <p className="text-lg font-bold text-primary">{getTierPrices(service)}</p>
          <p className="text-xs text-muted-foreground">
            {Object.keys(service.tiers || {}).length} tier(s)
          </p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-card-foreground">Delivery</p>
          <p className="text-sm text-card-foreground">
            {service.tiers?.starter?.deliveryDays || 3} days
          </p>
          <p className="text-xs text-muted-foreground">Starter package</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-card-foreground">Author</p>
          <p className="text-sm text-card-foreground">{service.author}</p>
          <p className="text-xs text-muted-foreground">
            {service.isFeatured && '⭐ Featured'}
            {service.isIndexedInGoogle && ' • 🌐 Google Indexed'}
          </p>
        </div>
      </div>
      
      {/* Status and Featured Controls - UPDATED WITH GOOGLE INDEXING */}
      <div className="flex flex-wrap items-center gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-card-foreground">Status:</span>
          <select
            value={service.status}
            onChange={(e) => onStatusChange(service._id, service.slug, e.target.value)}
            disabled={updateLoading === service._id}
            className="text-sm border border-border rounded px-2 py-1 bg-background text-foreground disabled:opacity-50"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-card-foreground">Featured:</span>
          <button
            onClick={() => onFeaturedToggle(service._id, service.slug, service.isFeatured)}
            disabled={updateLoading === service._id}
            className={`w-12 h-6 rounded-full transition-colors relative disabled:opacity-50 ${
              service.isFeatured ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                service.isFeatured ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Google Indexing Toggle ← ADD THIS */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-card-foreground">Google Indexed:</span>
          <button
            onClick={() => onGoogleIndexToggle(service._id, service.slug, service.isIndexedInGoogle)}
            disabled={updateLoading === service._id}
            className={`w-12 h-6 rounded-full transition-colors relative disabled:opacity-50 ${
              service.isIndexedInGoogle ? 'bg-green-600' : 'bg-muted'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                service.isIndexedInGoogle ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>
      
      {/* Requirements Preview */}
      {service.requirements && service.requirements.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-card-foreground mb-2">Requirements</p>
          <div className="flex flex-wrap gap-1">
            {service.requirements.slice(0, 3).map((req: string, index: number) => (
              <span
                key={index}
                className="inline-block bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
              >
                {req}
              </span>
            ))}
            {service.requirements.length > 3 && (
              <span className="inline-block bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                +{service.requirements.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Search Tags */}
      {service.searchTags && service.searchTags.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-card-foreground mb-2">Tags</p>
          <div className="flex flex-wrap gap-1">
            {service.searchTags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-2 py-1 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>Slug: {service.slug}</span>
          <span>•</span>
          <span>Created: {formatDate(service.createdAt)}</span>
          <span>•</span>
          <span>Max Projects: {service.maxProjects}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link
            href={`/services/${service.slug}`}
            target="_blank"
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            View
          </Link>
          <span className="text-border">|</span>
          <Link
            href={`/dashboard/admin/manage-services/edit/${service.slug}`}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit
          </Link>
          <span className="text-border">|</span>
          <button 
            onClick={() => onDelete(service._id, service.slug)}
            disabled={deleteLoading === service._id}
            className="text-sm text-destructive hover:text-destructive/80 font-medium disabled:opacity-50"
          >
            {deleteLoading === service._id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageServicesPage;