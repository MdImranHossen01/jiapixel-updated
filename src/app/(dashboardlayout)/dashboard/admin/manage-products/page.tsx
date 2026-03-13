/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  featuredImage: string;
  category: string;
  price: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  createdAt: string;
}

export default function ManageProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?status=all');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setDeleteLoading(productId);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(product => product._id !== productId));
        alert('Product deleted successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setDeleteLoading(null);
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });

      if (response.ok) {
        setProducts(products.map(product =>
          product._id === productId ? { ...product, status: newStatus as any } : product
        ));
        alert(`Product ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product status:', error);
      alert('Failed to update product status');
    }
  };

  const toggleFeatured = async (productId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featured: !currentFeatured
        }),
      });

      if (response.ok) {
        setProducts(products.map(product =>
          product._id === productId ? { ...product, featured: !currentFeatured } : product
        ));
        alert(`Product ${!currentFeatured ? 'added to' : 'removed from'} featured successfully`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update featured status');
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Failed to update featured status');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Products</h1>
            <p className="text-muted-foreground mt-2">Manage your digital products and subscriptions</p>
          </div>
          <div className="h-10 w-32 bg-muted rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg shadow p-6 border animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-muted rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded w-24"></div>
                  <div className="h-8 bg-muted rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Products</h1>
          <p className="text-muted-foreground mt-2">Manage your digital products and subscriptions</p>
        </div>
        <Link
          href="/dashboard/admin/manage-products/create"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Create Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-card rounded-lg shadow p-12 text-center border">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Products Yet</h3>
          <p className="text-muted-foreground mb-6">Create your first digital product to get started</p>
          <Link
            href="/dashboard/admin/manage-products/create"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create Your First Product
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product._id} className="bg-card rounded-lg shadow p-6 border">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Product Image */}
                <div className="shrink-0">
                  <Image
                    src={product.featuredImage}
                    alt={product.title}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground truncate">
                      {product.title}
                    </h3>
                    {product.featured && (
                      <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'published'
                        ? 'bg-green-500 text-green-900'
                        : product.status === 'draft'
                          ? 'bg-gray-500 text-gray-900'
                          : 'bg-red-500 text-red-900'
                      }`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Category: {product.category}</span>
                    <span>•</span>
                    <span>Monthly: ${product.price.monthly}</span>
                    <span>•</span>
                    <span>Yearly: ${product.price.yearly}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <button
                    onClick={() => toggleFeatured(product._id, product.featured)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${product.featured
                        ? 'bg-yellow-500 text-yellow-900 hover:bg-yellow-600'
                        : 'bg-gray-500 text-gray-900 hover:bg-gray-600'
                      }`}
                  >
                    {product.featured ? 'Unfeature' : 'Feature'}
                  </button>

                  <button
                    onClick={() => toggleProductStatus(product._id, product.status)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${product.status === 'published'
                        ? 'bg-gray-500 text-gray-900 hover:bg-gray-600'
                        : 'bg-green-500 text-green-900 hover:bg-green-600'
                      }`}
                  >
                    {product.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>

                  <Link
                    href={`/dashboard/admin/manage-products/edit/${product.slug}`}
                    className="bg-blue-500 text-blue-900 px-3 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteProduct(product._id)}
                    disabled={deleteLoading === product._id}
                    className="bg-destructive text-destructive-foreground px-3 py-2 rounded text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
                  >
                    {deleteLoading === product._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}