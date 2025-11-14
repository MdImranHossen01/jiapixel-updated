/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';

interface Tier {
  _id?: string;
  title: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: {
    [key: string]: boolean;
  };
}

interface Service {
  _id: string;
  title: string;
  tiers?: {
    [key: string]: Tier;
  };
}

interface PricingComponentProps {
  service?: Service;
}

const PricingComponent = ({ service }: PricingComponentProps) => {
  // If service prop is provided, use that service's tiers
  // Otherwise, fall back to fetching all services (for backward compatibility)
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(!service);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (service) {
      // If service is provided via props, we don't need to fetch
      setLoading(false);
      return;
    }

    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        
        if (data.success) {
          setServices(data.services);
        } else {
          setError('Failed to fetch services');
        }
      } catch (err: any) {
        setError('Error fetching data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [service]);

  if (loading) {
    return (
      <div className="max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="text-center">
          <h2 className="text-lg font-medium text-foreground">Error</h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Transform the data to get pricing tiers
  const allTiers: any[] = [];
  
  if (service) {
    // Use the provided service's tiers
    if (service.tiers) {
      Object.entries(service.tiers).forEach(([tierType, tierData]) => {
        allTiers.push({
          ...tierData,
          tierType,
          serviceTitle: service.title,
          serviceId: service._id
        });
      });
    }
  } else {
    // Use fetched services (for backward compatibility)
    services.forEach(serviceItem => {
      if (serviceItem.tiers) {
        Object.entries(serviceItem.tiers).forEach(([tierType, tierData]) => {
          allTiers.push({
            ...tierData,
            tierType,
            serviceTitle: serviceItem.title,
            serviceId: serviceItem._id
          });
        });
      }
    });
  }

  if (allTiers.length === 0) {
    return null; // Don't render anything if no tiers available
  }

  return (
    <div id='pricing' className="max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="grid grid-cols-1 gap-2  sm:items-stretch md:grid-cols-3">
        {allTiers.map((tier, index) => (
          <div key={tier._id || `${tier.serviceId}-${tier.tierType}-${index}`} className="divide-y divide-border rounded-2xl border border-border shadow-xs">
            <div className="p-6 sm:px-8">
              <h2 className="text-lg font-medium text-foreground">
                {tier.title}
            
              </h2>

              <p className="mt-2 text-pretty text-muted-foreground">
                {tier.description}
              </p>

              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-foreground sm:text-4xl"> ${tier.price} </strong>

                <span className="text-sm font-medium text-muted-foreground">/year</span>
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:mt-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {tier.deliveryDays} days delivery
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {tier.revisions} revisions
                </div>
              </div>

              <a className="mt-4 block rounded-sm border border-primary bg-primary px-12 py-3 text-center text-sm font-medium text-primary-foreground hover:bg-transparent hover:text-primary sm:mt-6" href="#">
                Get Started
              </a>
            </div>

            <div className="p-6 sm:px-8">
              <p className="text-lg font-medium text-foreground sm:text-xl">What&apos;s included:</p>

              <ul className="mt-2 space-y-2 sm:mt-4">
                {Object.entries(tier.features).map(([featureName, isIncluded]) => (
                  <li key={featureName} className="flex items-center gap-1">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth="1.5" 
                      stroke="currentColor" 
                      className={`size-5 ${isIncluded ? 'text-primary' : 'text-destructive'}`}
                    >
                      {isIncluded ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      )}
                    </svg>

                    <span className="text-muted-foreground"> {featureName} </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingComponent;