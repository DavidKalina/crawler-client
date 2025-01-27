"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Package {
  id: string;
  pages: number;
  price: number;
  popular: boolean;
  features: string[];
  icon: React.ElementType;
}

interface PurchaseButtonProps {
  packageDetails: Package;
}

export function PurchaseButton({ packageDetails }: PurchaseButtonProps) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package: packageDetails }),
      });

      if (!response.ok) throw new Error("Failed to create checkout session");

      const { sessionUrl } = await response.json();
      router.push(sessionUrl);
    } catch {
      toast({
        title: "Error",
        description: "Failed to initiate purchase. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePurchase}
      disabled={loading}
      className={`w-full group
        ${
          packageDetails.popular
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700"
        }
        transition-all duration-200 focus-visible:ring-offset-zinc-900
        focus-visible:ring-blue-400 disabled:opacity-50`}
    >
      {loading ? (
        "Processing..."
      ) : (
        <span className="flex items-center justify-center gap-2">
          Purchase Now
          <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </span>
      )}
    </Button>
  );
}
