import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/db-utils';

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
  features: string[];
  status: string;
  featured: boolean;
}

export const metadata: Metadata = {
  title: 'Digital Products - Jiapixel',
  description: 'Discover our collection of digital products, SaaS solutions, and subscription services with flexible pricing plans.',
  keywords: 'digital products, SaaS, subscriptions, software, tools',
};

export default async function ProductsPage() {
  const products: Product[] = await getProducts();

  const calculateSavings = (monthly: number, yearly: number) => {
    const yearlyCostMonthly = yearly / 12;
    const savings = ((monthly - yearlyCostMonthly) / monthly) * 100;
    return Math.round(savings);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Digital Products
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover our collection of premium digital products, SaaS solutions, and tools
            designed to boost your productivity and grow your business.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">No Products Available</h3>
              <p className="text-muted-foreground">Check back later for new digital products.</p>
            </div>
          ) : (
            <>
              {/* Featured Products */}
              {products.filter(p => p.featured).length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Featured Products</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products
                      .filter(product => product.featured)
                      .map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          calculateSavings={calculateSavings}
                        />
                      ))
                    }
                  </div>
                </div>
              )}

              {/* All Products */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                  {products.filter(p => p.featured).length > 0 ? 'All Products' : 'Our Products'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      calculateSavings={calculateSavings}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, calculateSavings }: {
  product: Product;
  calculateSavings: (monthly: number, yearly: number) => number;
}) {
  const savings = calculateSavings(product.price.monthly, product.price.yearly);

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-48 bg-linear-to-br from-primary/20 to-secondary/20">
        <Image
          src={product.featuredImage}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-foreground line-clamp-2 flex-1">
            {product.title}
          </h3>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Pricing */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Monthly</span>
            <span className="text-lg font-bold text-foreground">
              ${product.price.monthly}
              <span className="text-sm text-muted-foreground font-normal">/mo</span>
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">3 Months</span>
            <span className="text-lg font-bold text-foreground">
              ${product.price.quarterly}
              <span className="text-sm text-muted-foreground font-normal">/3mo</span>
            </span>
          </div>

          <div className="flex justify-between items-center bg-primary/10 p-3 rounded-lg">
            <div>
              <span className="text-sm font-medium text-foreground">Yearly</span>
              {savings > 0 && (
                <div className="text-xs text-green-600 font-medium">
                  Save {savings}%
                </div>
              )}
            </div>
            <span className="text-xl font-bold text-primary">
              ${product.price.yearly}
              <span className="text-sm text-muted-foreground font-normal">/year</span>
            </span>
          </div>
        </div>

        {/* Features Preview */}
        {product.features && product.features.length > 0 && (
          <div className="mb-4">
            <ul className="space-y-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
              {product.features.length > 3 && (
                <li className="text-sm text-muted-foreground ml-3">
                  +{product.features.length - 3} more features
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <Link
          href={`/products/${product.slug}`}
          className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}