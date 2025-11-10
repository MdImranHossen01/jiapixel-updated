import React from 'react';
import Link from 'next/link';
import connectDB from '@/lib/db';
import Service from '@/models/Project'; // Import Service model

async function getServices() {
  try {
    await connectDB();
    const services = await Service.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();

    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

const ServicesPage = async () => {
  const services = await getServices();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Services</h1>
          <p className="text-muted-foreground mt-2">
            Manage your service offerings
          </p>
        </div>
        <Link
          href="/dashboard/services/create"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Create New Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg border">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-foreground mb-4">
              No Services Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first service to start offering your expertise to clients.
            </p>
            <Link
              href="/dashboard/services/create"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Create Your First Service
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any) => (
            <div key={service._id} className="bg-card rounded-lg border p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {service.category}
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-foreground">
                    ${service.tiers?.starter?.price || 0}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {service.tiers?.starter?.deliveryDays || 3} days
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/services/${service.slug}`}
                    className="flex-1 text-center bg-secondary text-secondary-foreground py-2 px-4 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    href={`/dashboard/services/${service.slug}/edit`}
                    className="flex-1 text-center bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;