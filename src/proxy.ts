import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

type UserRole = "admin" | "user";

type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};

const authRoutes = [
  "/login",
  "/register"
];

const commonProtectedRoutes: RouteConfig = {
  exact: ["/dashboard"],
  patterns: [/^\/dashboard($|\/)/], // Protect all dashboard routes
};

const adminProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/dashboard\/admin/], // Protect admin sub-routes
};

const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route: string) => route === pathname);
};

const isRouteMatches = (pathname: string, routes: RouteConfig): boolean => {
  if (routes.exact.includes(pathname)) {
    return true;
  }
  return routes.patterns.some((pattern: RegExp) => pattern.test(pathname));
};

const getRouteOwner = (
  pathname: string
): "admin" | "user" | "common" | "null" => {
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "admin";
  }
  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return "common";
  }
  return "null";
};

const getDefaultDashboardRoute = (role: UserRole): string => {
  if (role === "admin") {
    return "/dashboard/admin";
  }
  return "/dashboard";
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Get the session token using NextAuth (this contains your JWT tokens)
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  const isAuthenticated = !!token;
  const userRole = token?.role as UserRole || null;
  const hasAccessToken = !!token?.accessToken;

  console.log('🔐 Proxy - Path:', pathname);
  console.log('🔐 Proxy - Authenticated:', isAuthenticated);
  console.log('🔐 Proxy - User Role:', userRole);
  console.log('🔐 Proxy - Has Access Token:', hasAccessToken);

  // If user is on auth route but already logged in, redirect to dashboard
  if (isAuthRoute(pathname) && isAuthenticated && userRole) {
    console.log('🔐 Redirecting from auth route to dashboard');
    return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
  }

  // Check if route requires authentication
  const routeOwner = getRouteOwner(pathname);
  
  // If route is protected and user is not authenticated, redirect to login
  if (routeOwner !== "null" && !isAuthenticated) {
    console.log('🔐 Redirecting to login - not authenticated');
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin routes - if user is not admin, redirect to unauthorized
  if (routeOwner === "admin" && userRole !== "admin") {
    console.log('🔐 Redirecting - admin access required');
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Check if tokens are present for protected routes
  if (routeOwner !== "null" && isAuthenticated && !hasAccessToken) {
    console.log('🔐 No access token - redirecting to login');
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};