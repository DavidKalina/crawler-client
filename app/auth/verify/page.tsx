"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, AlertTriangle } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get all URL parameters that Supabase might send
  const email = searchParams.get("email");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");
  const type = searchParams.get("type");
  const token = searchParams.get("token");

  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  const supabase = createClient();

  // Handle verification
  useEffect(() => {
    // Check for error parameters first
    if (searchParams.get("error") || searchParams.get("error_code")) {
      setVerificationStatus("error");
      const errorDesc = searchParams.get("error_description");
      setError(
        errorDesc ? decodeURIComponent(errorDesc).replace(/\+/g, " ") : "Verification failed"
      );
      return;
    }

    // If there's a token in the URL, attempt verification
    if (token) {
      setVerificationStatus("loading");

      const verifyEmailWithSupabase = async () => {
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            email: email!,
            token: token,
            type: "signup",
          });

          console.log("DATA", data, "ERROR", error);

          if (error) throw error;

          setVerificationStatus("success");

          // Redirect to dashboard after successful verification
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } catch (error) {
          console.error("Verification error:", error);
          setVerificationStatus("error");
          setError(
            error instanceof Error
              ? error.message
              : "Failed to verify email. Please try again or contact support."
          );
        }
      };

      verifyEmailWithSupabase();
    }
  }, [type, token, email, errorCode, errorDescription, router, supabase.auth]);

  const handleResendEmail = async () => {
    if (!email || resendCount >= 3) return;

    setResending(true);
    setError(null);
    setResendSuccess(false);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        },
      });

      if (error) throw error;

      setResendCount((prev) => prev + 1);
      setResendSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to resend verification email. Please try again later."
      );
    } finally {
      setResending(false);
    }
  };

  // Error state view
  if (verificationStatus === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Verification Failed</CardTitle>
            <CardDescription className="text-center text-destructive">{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {email && (
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Would you like us to send another verification email to <strong>{email}</strong>?
                </p>
                <Button
                  variant="outline"
                  onClick={handleResendEmail}
                  disabled={resending || resendCount >= 3}
                >
                  {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {resendCount >= 3
                    ? "Maximum resend attempts reached"
                    : "Send new verification email"}
                </Button>
              </div>
            )}
            <div className="text-center mt-4">
              <Button
                variant="link"
                onClick={() => router.push("/login")}
                className="text-sm text-gray-500"
              >
                Return to login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verification in progress
  if (verificationStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-center text-sm text-gray-600">Verifying your email...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Email Verified</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Email verified successfully! Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default "Check your email" view
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent you a verification link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Mail className="h-12 w-12 text-primary" />
          </div>

          {email && (
            <p className="text-center text-sm text-gray-600">
              We've sent a verification email to <strong>{email}</strong>
            </p>
          )}

          <p className="text-center text-sm text-gray-600">
            Click the link in the email to verify your account. If you don't see the email, check
            your spam folder.
          </p>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resendSuccess && (
            <Alert>
              <AlertDescription>
                Verification email has been resent! Please check your inbox.
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleResendEmail}
              disabled={resending || !email || resendCount >= 3}
              className="mt-4"
            >
              {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {resendCount >= 3 ? "Maximum resend attempts reached" : "Resend verification email"}
            </Button>
            {resendCount > 0 && resendCount < 3 && (
              <p className="text-sm text-gray-500 mt-2">
                Resend attempts remaining: {3 - resendCount}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
