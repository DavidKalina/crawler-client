import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get the current path and search params
  const path = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  const isVerificationFlow =
    path === "/auth/verify" &&
    (searchParams.has("token") ||
      searchParams.has("error") ||
      searchParams.has("type") ||
      searchParams.has("error_code") ||
      searchParams.has("handled"));

  const isResetPasswordPath = path.includes("/auth/reset-password");

  // Special handling for auth callback and verification flow
  if (path === "/auth/callback" || isVerificationFlow || searchParams.get("type") === "recovery") {
    return response;
  }
  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public paths that don't require authentication
  const isPublicPath =
    path.includes("/auth") ||
    path.includes("/api/") ||
    path.includes("/_next/") ||
    path.includes("/static/") ||
    isResetPasswordPath; // Add this

  if (path === "/") {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const url = request.nextUrl.clone();
    url.pathname = user ? "/dashboard" : "/auth/login";
    return NextResponse.redirect(url);
  }

  // Specific auth-related paths
  const isVerifyPath = path.includes("/auth/verify");
  const isLoginPath = path.includes("/auth/login");
  const isRegisterPath = path.includes("/auth/register");

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    // User exists, handle various scenarios
    const email_confirmed = user.email_confirmed_at;

    // If email not confirmed and not on verification page, redirect to verify
    if (!email_confirmed && !isVerifyPath && !isPublicPath && !isResetPasswordPath) {
      // Add reset password check
      const url = request.nextUrl.clone();
      url.pathname = "/auth/verify";
      url.searchParams.set("email", user.email || "");
      return NextResponse.redirect(url);
    }

    // If verified and trying to access auth pages, redirect to dashboard
    // But don't redirect if we're processing a verification or reset password
    if (
      email_confirmed &&
      (isLoginPath || isRegisterPath || (isVerifyPath && !isVerificationFlow)) &&
      !isResetPasswordPath // Add this condition
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
