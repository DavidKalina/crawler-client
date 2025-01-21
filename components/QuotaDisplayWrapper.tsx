"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import QuotaDisplay from "./QuotaDisplay";

const QuotaDisplayWrapper = ({ userId }: { userId: string }) => {
  const [quotaInfo, setQuotaInfo] = useState<any | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getQuotaInfo() {
      const { data, error } = await supabase
        .from("profiles")
        .select("monthly_quota, first_month_quota, pages_used")
        .eq("id", userId)
        .single();

      if (error) {
        throw error;
      }

      setQuotaInfo(data);
    }

    getQuotaInfo();
  }, [userId]);
  // Your existing Supabase query

  return (
    <QuotaDisplay
      monthlyQuota={quotaInfo?.monthly_quota}
      firstMonthQuota={quotaInfo?.first_month_quota}
      pagesUsed={quotaInfo?.pages_used}
    />
  );
};

export default QuotaDisplayWrapper;
