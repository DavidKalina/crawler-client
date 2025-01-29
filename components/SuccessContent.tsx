// app/checkout/success/SuccessContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, setLoading] = useState(true);
  const sessionId = searchParams.get("session_id");
  const supabase = createClient();

  useEffect(() => {
    async function updateQuota() {
      if (!sessionId) return;

      try {
        // Verify the payment was successful with your backend
        const response = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) throw new Error("Failed to verify payment");

        const { pages } = await response.json();

        // Update user's available pages in Supabase
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          await supabase.rpc("increment_available_pages", {
            page_count: pages,
          });
        }
      } catch (error) {
        console.error("Error updating quota:", error);
      } finally {
        setLoading(false);
      }
    }

    updateQuota();
  }, [sessionId, supabase]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-4">
      <Card className="bg-zinc-900 border-zinc-800 w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl text-white">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-300 text-center">Your pages have been added to your account.</p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
