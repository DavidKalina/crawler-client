"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Mail } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error" | null
  >(token ? "loading" : null);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const supabase = createClient();

  // Handle token verification
  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "signup",
        });

        if (error) throw error;

        setVerificationStatus("success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus("error");
        setError(error instanceof Error ? error.message : "Failed to verify email");
      }
    };

    verifyToken();
  }, [token, router, supabase.auth]);

  // Handle resend verification email
  const handleResendEmail = async () => {
    if (!email) return;

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
      setResendSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  // Show verification process if token is present
  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {verificationStatus === "loading" && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-center text-sm text-gray-600">Verifying your email...</p>
              </div>
            )}

            {verificationStatus === "success" && (
              <Alert>
                <AlertDescription>
                  Email verified successfully! Redirecting to dashboard...
                </AlertDescription>
              </Alert>
            )}

            {verificationStatus === "error" && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error || "Failed to verify email. Please try again."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show "Check your email" page if email is present
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
              <AlertDescription>Verification email has been resent!</AlertDescription>
            </Alert>
          )}

          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleResendEmail}
              disabled={resending || !email}
              className="mt-4"
            >
              {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Resend verification email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
