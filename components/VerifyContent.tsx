"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, AlertTriangle } from "lucide-react";

export default function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  // Verification logic remains the same...
  useEffect(() => {
    if (searchParams.get("error") || searchParams.get("error_code")) {
      setVerificationStatus("error");
      const errorDesc = searchParams.get("error_description");
      setError(
        errorDesc ? decodeURIComponent(errorDesc).replace(/\+/g, " ") : "Verification failed"
      );
      return;
    }

    if (token) {
      setVerificationStatus("loading");

      const verifyEmailWithSupabase = async () => {
        try {
          const { error } = await supabase.auth.verifyOtp({
            email: email!,
            token: token,
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
          setError(
            error instanceof Error
              ? error.message
              : "Failed to verify email. Please try again or contact support."
          );
        }
      };

      verifyEmailWithSupabase();
    }
  }, [type, token, email, errorCode, errorDescription, router, supabase.auth, searchParams]);

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
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-2 rounded-full bg-red-500/10">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <CardTitle className="text-xl font-medium text-zinc-100 text-center">
              Verification Failed
            </CardTitle>
            <CardDescription className="text-red-400 text-center">{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {email && (
              <div className="text-center space-y-4">
                <p className="text-sm text-zinc-400">
                  Would you like us to send another verification email to{" "}
                  <strong className="text-zinc-300">{email}</strong>?
                </p>
                <Button
                  onClick={handleResendEmail}
                  disabled={resending || resendCount >= 3}
                  className="bg-blue-500/10 border border-blue-500/20 text-blue-400 
                           hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-200"
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
                className="text-zinc-400 hover:text-zinc-300"
              >
                Return to login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (verificationStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-zinc-100 text-center">
              Email Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <p className="text-center text-sm text-zinc-400">Verifying your email...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-zinc-100 text-center">
              Email Verified
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto p-2 rounded-full bg-blue-500/10 w-fit">
            <Mail className="h-6 w-6 text-blue-400" />
          </div>
          <CardTitle className="text-xl font-medium text-zinc-100">Check Your Email</CardTitle>
          <CardDescription className="text-zinc-400">
            We&apos;ve sent you a verification link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {email && (
            <p className="text-center text-sm text-zinc-400">
              We&apos;ve sent a verification email to{" "}
              <strong className="text-zinc-300">{email}</strong>
            </p>
          )}

          <p className="text-center text-sm text-zinc-400">
            Click the link in the email to verify your account. If you don&apos;t see the email,
            check your spam folder.
          </p>

          {error && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resendSuccess && (
            <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
              <AlertDescription>
                Verification email has been resent! Please check your inbox.
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center">
            <Button
              onClick={handleResendEmail}
              disabled={resending || !email || resendCount >= 3}
              className="mt-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 
                       hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {resendCount >= 3 ? "Maximum resend attempts reached" : "Resend verification email"}
            </Button>
            {resendCount > 0 && resendCount < 3 && (
              <p className="text-sm text-zinc-500 mt-2">
                Resend attempts remaining: {3 - resendCount}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
