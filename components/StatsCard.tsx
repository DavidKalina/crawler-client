import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  loading?: boolean;
  error?: Error;
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  loading,
  error,
}: StatsCardProps) => {
  if (error) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-300">{title}</CardTitle>
          <div className="p-1.5 rounded-full bg-red-500/10">
            <Icon className="h-4 w-4 text-red-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-400">Error loading data</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 transition-colors hover:bg-zinc-900/80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-300">{title}</CardTitle>
        <div className="p-1.5 rounded-full bg-blue-500/10">
          <Icon className="h-4 w-4 text-blue-400" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 w-16 bg-zinc-800 animate-pulse rounded" />
            <div className="h-4 w-24 bg-zinc-800 animate-pulse rounded" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-medium text-zinc-100">{value}</div>
            <p className="text-xs text-zinc-500 mt-1">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
