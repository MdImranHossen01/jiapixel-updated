import { NextRequest, NextResponse } from 'next/server';

// This is required for dynamic routes in Next.js App Router
export async function generateStaticParams() {
  return [
    { slug: 'test' }
  ];
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  // Await the params
  const params = await context.params;
  const slug = params.slug;
  
  console.log('🔧 Debug route - Slug received:', slug);
  
  return NextResponse.json({
    message: 'Debug route working',
    slug: slug,
    decodedSlug: decodeURIComponent(slug)
  });
}