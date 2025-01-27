"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import QuotaDisplay from "./QuotaDisplay";

interface QuotaInfo {
  monthly_quota: number;
  first_month_quota: number;
  pages_used: number;
}

const QuotaDisplayWrapper = () => {
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  // First effect to get the session
  useEffect(() => {
    async function getSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) {
        setUserId(user.id);
      }
    }

    getSession();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Second effect to get quota info once we have userId
  useEffect(() => {
    if (!userId) return;

    async function getQuotaInfo() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("monthly_quota, first_month_quota, pages_used")
          .eq("id", userId)
          .single();

        if (error) throw error;
        setQuotaInfo(data);
      } catch (error) {
        console.error("Error fetching quota info:", error);
        setQuotaInfo(null);
      }
    }

    getQuotaInfo();

    // Set up real-time subscription for profile changes
    const channel = supabase
      .channel(`profile:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          setQuotaInfo(payload.new as QuotaInfo);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  if (!userId) return <div>Please sign in to view your quota.</div>;
  if (!quotaInfo) return <div>Loading quota information...</div>;

  return (
    <QuotaDisplay
      monthlyQuota={quotaInfo.monthly_quota}
      firstMonthQuota={quotaInfo.first_month_quota}
      pagesUsed={quotaInfo.pages_used}
    />
  );
};

export default QuotaDisplayWrapper;
