import { Button } from "@/components/ui/button";
import { Clock, Play, CheckCircle2, XCircle } from "lucide-react";

interface QueueStatsButtonProps {
  label: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}

export const QueueStatsButton: React.FC<QueueStatsButtonProps> = ({
  label,
  count,
  isSelected,
  onClick,
}) => {
  const getStateIcon = (state: string) => {
    switch (state.toLowerCase()) {
      case "waiting":
        return <Clock className="h-3.5 w-3.5" />;
      case "active":
        return <Play className="h-3.5 w-3.5" />;
      case "completed":
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "failed":
        return <XCircle className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  const getStateColors = (state: string) => {
    if (isSelected) {
      switch (state.toLowerCase()) {
        case "waiting":
          return "bg-orange-500/5 border-orange-500/10 text-orange-400";
        case "active":
          return "bg-blue-500/5 border-blue-500/10 text-blue-400";
        case "completed":
          return "bg-emerald-500/5 border-emerald-500/10 text-emerald-400";
        case "failed":
          return "bg-red-500/5 border-red-500/10 text-red-400";
        default:
          return "bg-zinc-800/50 border-zinc-800 text-zinc-300";
      }
    }
    return "bg-transparent border-zinc-800/50 text-zinc-500 hover:bg-zinc-800/20 hover:border-zinc-700";
  };

  return (
    <Button
      variant="ghost"
      className={`w-full h-auto px-3 py-2 border flex flex-col items-center gap-1 rounded-md transition-all duration-200 ${getStateColors(
        label
      )}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-1.5">
        {getStateIcon(label)}
        <span className="capitalize text-xs font-medium">{label}</span>
      </div>
      <span className="text-sm font-medium">{count.toLocaleString()}</span>
    </Button>
  );
};
