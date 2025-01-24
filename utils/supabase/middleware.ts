import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get the current path
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const isPublicPath =
    path.includes("/auth") ||
    path === "/" ||
    path.includes("/api/") ||
    path.includes("/_next/") ||
    path.includes("/static/");

  // Specific auth-related paths
  const isVerifyPath = path.includes("/auth/verify");
  const isLoginPath = path.includes("/auth/login");
  const isRegisterPath = path.includes("/auth/register");

  if (!user && !isPublicPath) {
    // No user and trying to access protected route - redirect to login
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    // User exists, handle various scenarios
    const email_confirmed = user.email_confirmed_at;

    // If email not confirmed and not on verification page, redirect to verify
    if (!email_confirmed && !isVerifyPath && !isPublicPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/verify";
      url.searchParams.set("email", user.email || "");
      return NextResponse.redirect(url);
    }

    // If verified and trying to access auth pages, redirect to dashboard
    if (email_confirmed && (isLoginPath || isRegisterPath || isVerifyPath)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
