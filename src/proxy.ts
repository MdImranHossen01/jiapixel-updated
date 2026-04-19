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
  console.log(`🛡️ PROXY [Next.js 16]: Processing ${pathname}`);


  // Check if route requires authentication
  const routeOwner = getRouteOwner(pathname);

  // If route is not protected, proceed immediately WITHOUT calling getToken
  // This saves significant CPU for all public page visits (home, blogs, etc.)
  if (routeOwner === "null") {
    return NextResponse.next();
  }

  // Get the session token using NextAuth (this contains your JWT tokens)
  // Only fetched for protected routes
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  const isAuthenticated = !!token;
  const userRole = token?.role as UserRole || null;
  const hasAccessToken = !!token?.accessToken;

  // If route is protected and user is not authenticated, redirect to login
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin routes - if user is not admin, redirect to unauthorized
  if (routeOwner === "admin" && userRole !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Check if tokens are present for protected routes
  if (isAuthenticated && !hasAccessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only run proxy on dashboard routes where authentication is needed
    // This reduces unnecessary proxy calls for all public pages (home, blogs, portfolios, etc.)
    '/dashboard(.*)',

  ],
};