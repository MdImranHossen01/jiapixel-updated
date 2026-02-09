/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ServicesClient from './ServicesClient';

interface Service {
  _id: string;
  title: string;
  slug: string;
  category: string;
  images: string[];
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isIndexedInGoogle: boolean;
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

      {/* Services List / Table */}
      <div className="bg-background rounded-lg shadow overflow-hidden">
        <ServicesClient data={services} />
      </div>
    </div>
  );
};

export default ManageServicesPage;