import { createClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";
  const type = requestUrl.searchParams.get("type");
  const token = requestUrl.searchParams.get("token");

  // Create server-side Supabase client
  const supabase = createClient();

  // Handle recovery flow with token
  if (type === "recovery" && token) {
    try {
      // Exchange the token for a session
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "recovery",
      });

      if (error) {
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, requestUrl)
        );
      }

      return NextResponse.redirect(new URL("/auth/reset-password", requestUrl));
    } catch (error) {
      console.error("Recovery flow error:", error);
      return NextResponse.redirect(new URL("/auth/login?error=Recovery failed", requestUrl));
    }
  }
  // Handle auth code exchange
  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        return NextResponse.redirect(
          new URL(`/auth/verify?error=${encodeURIComponent(error.message)}`, requestUrl)
        );
      }

      // Successful auth, redirect to the intended destination
      return NextResponse.redirect(new URL(next, requestUrl));
    } catch (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(
        new URL("/auth/login?error=Session exchange failed", requestUrl)
      );
    }
  }

  // Handle OAuth and email verification errors
  const errorDescription = requestUrl.searchParams.get("error_description");
  const error = requestUrl.searchParams.get("error");

  if (error || errorDescription) {
    const verifyUrl = new URL("/auth/verify", requestUrl);
    ["error", "error_description", "error_code"].forEach((param) => {
      const value = requestUrl.searchParams.get(param);
      if (value) verifyUrl.searchParams.set(param, value);
    });
    return NextResponse.redirect(verifyUrl);
  }

  // If no code or error, redirect to login
  return NextResponse.redirect(new URL("/auth/login?error=Invalid callback", requestUrl));
}
