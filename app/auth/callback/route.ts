import { NextRequest, NextResponse } from "next/server";

// app/auth/callback/route.ts
export async function GET(request: NextRequest) {
  // Log the raw request URL and hash
  console.log("Raw URL:", request.url);
  console.log("Raw Headers:", Object.fromEntries(request.headers.entries()));

  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  // If there's a hash in the URL, it might contain the token
  const urlHash = request.url.split("#")[1];
  console.log("URL Hash:", urlHash);

  if (token) {
    const verifyUrl = new URL("/auth/verify", request.url);
    verifyUrl.searchParams.set("token", token);
    return NextResponse.redirect(verifyUrl);
  }

  // Handle error cases
  const verifyUrl = new URL("/auth/verify", request.url);
  ["error", "error_description", "error_code"].forEach((param) => {
    const value = searchParams.get(param);
    if (value) verifyUrl.searchParams.set(param, value);
  });

  return NextResponse.redirect(verifyUrl);
}
