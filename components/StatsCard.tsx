import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  loading?: boolean;
  error?: Error;
  variant?: "blue" | "green" | "yellow" | "red" | "purple";
}

const variantStyles = {
  blue: {
    iconBackground: "bg-blue-500/10",
    iconColor: "text-blue-400",
    hoverBg: "hover:bg-blue-500/5",
  },
  green: {
    iconBackground: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    hoverBg: "hover:bg-emerald-500/5",
  },
  yellow: {
    iconBackground: "bg-yellow-500/10",
    iconColor: "text-yellow-400",
    hoverBg: "hover:bg-yellow-500/5",
  },
  red: {
    iconBackground: "bg-red-500/10",
    iconColor: "text-red-400",
    hoverBg: "hover:bg-red-500/5",
  },
  purple: {
    iconBackground: "bg-purple-500/10",
    iconColor: "text-purple-400",
    hoverBg: "hover:bg-purple-500/5",
  },
} as const;

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  loading,
  error,
  variant = "blue",
}: StatsCardProps) => {
  const styles = variantStyles[variant];

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
    <Card className={`bg-zinc-900 border-zinc-800 transition-colors ${styles.hoverBg}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-300">{title}</CardTitle>
        <div className={`p-1.5 rounded-full ${styles.iconBackground}`}>
          <Icon className={`h-4 w-4 ${styles.iconColor}`} />
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
            <div className="text-xl font-medium text-zinc-100">{value}</div>
            <p className="text-xs text-zinc-500 mt-1">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
