"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, Zap, AlertCircle, ChevronRight, Gift, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Package {
  id: string;
  pages: number;
  price: number;
  popular: boolean;
  features: string[];
  icon: React.ElementType;
}

const packages: Package[] = [
  {
    id: "starter",
    pages: 10000,
    price: 19,
    popular: false,
    features: ["Pages never expire", "Basic crawling features", "Standard support"],
    icon: Package,
  },
  {
    id: "pro",
    pages: 50000,
    price: 79,
    popular: true,
    features: [
      "Pages never expire",
      "Priority processing",
      "Advanced crawling features",
      "API access",
    ],
    icon: Zap,
  },
  {
    id: "enterprise",
    pages: 200000,
    price: 249,
    popular: false,
    features: [
      "Pages never expire",
      "Custom extraction rules",
      "Dedicated support",
      "Advanced integrations",
    ],
    icon: Gift,
  },
];

export default function QuotaUpgradePage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [profile, setProfile] = useState<{ available_pages: number; pages_used: number } | null>(
    null
  );

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        router.push("/auth/login");
        return;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("available_pages, pages_used")
        .eq("id", session.user.id)
        .single();

      if (profileError) {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        return;
      }

      setProfile(data);
    }

    fetchProfile();
  }, [supabase, router, toast]);

  const handleUpgrade = async (pkg: Package) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            package: pkg,
            metadata: {
              page_count: pkg.pages,
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create checkout session");

      const { sessionUrl } = await response.json();
      window.open(sessionUrl, "_blank");
    } catch {
      setError("Failed to initiate purchase. Please try again.");
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center">
        <div className="animate-pulse text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="space-y-2 text-center">
          <div className="mx-auto p-2 rounded-full bg-blue-600 w-fit">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-white">Purchase Additional Pages</h1>
          <p className="text-base text-zinc-300">
            <span className="text-blue-300 font-medium">
              {profile.available_pages.toLocaleString()}
            </span>{" "}
            pages available
            <span className="mx-2">•</span>
            <span className="text-blue-300 font-medium">
              {profile.pages_used.toLocaleString()}
            </span>{" "}
            pages used
          </p>
        </div>

        {error && (
          <Alert className="bg-red-900 border-red-700 text-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            const pricePerPage = ((pkg.price / pkg.pages) * 1000).toFixed(2);

            return (
              <motion.div
                key={pkg.id}
                whileHover={{ translateY: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Card
                  className={`relative bg-zinc-900 border-zinc-800 shadow-xl
                    ${pkg.popular ? "border-blue-500" : "hover:border-zinc-700"}
                    transition-colors duration-200`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-xs font-medium px-3 py-1 rounded-full border border-blue-400 text-white">
                        BEST VALUE
                      </span>
                    </div>
                  )}

                  <CardHeader className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-blue-600">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-md font-medium text-white">
                          {pkg.pages.toLocaleString()} Pages
                        </CardTitle>
                        <CardDescription className="text-zinc-300">
                          ${pricePerPage} per 1k pages
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-white">${pkg.price}</span>
                      <span className="text-sm text-zinc-300 ml-2">one-time</span>
                    </div>

                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-zinc-200">
                          <ChevronRight className="h-3 w-3 text-blue-300 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => handleUpgrade(pkg)}
                      disabled={loading}
                      className={`w-full group
                        ${
                          pkg.popular
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
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center text-sm text-zinc-400">
          Need more pages or custom features?{" "}
          <button className="text-blue-300 hover:text-blue-200 transition-colors">
            Contact our sales team
          </button>
        </div>
      </div>
    </div>
  );
}
