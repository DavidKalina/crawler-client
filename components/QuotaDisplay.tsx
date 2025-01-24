import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const QuotaDisplay = ({ monthlyQuota, firstMonthQuota, pagesUsed }: any) => {
  const effectiveQuota = firstMonthQuota ?? monthlyQuota;
  const remaining = effectiveQuota - pagesUsed;
  const usagePercentage = Math.min((pagesUsed / effectiveQuota) * 100, 100);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pages Quota</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Used</span>
          <span className="font-medium">{pagesUsed?.toLocaleString()} pages</span>
        </div>

        <Progress value={usagePercentage} className="h-2" />

        <div className="flex justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Remaining: </span>
            <span className="font-medium">{remaining?.toLocaleString()} pages</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total: </span>
            <span className="font-medium">{effectiveQuota?.toLocaleString()} pages</span>
          </div>
        </div>

        {firstMonthQuota && firstMonthQuota !== monthlyQuota && (
          <p className="text-xs text-muted-foreground mt-2">Special first month quota applied</p>
        )}
      </CardContent>
    </Card>
  );
};

export default QuotaDisplay;
