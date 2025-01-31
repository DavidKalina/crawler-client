import { WebCrawlJob } from "@/types/jobTypes";
import { Circle, CheckCircle2, XCircle, Pause, StopCircle, Cog } from "lucide-react";
import React from "react";

// Status color utility with more sophisticated colors
export const getStatusColor = (status: WebCrawlJob["status"]) => {
  switch (status) {
    case "running":
      return {
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        text: "text-blue-400",
        icon: <Cog className="w-3 h-3 2xl:w-3.5 2xl:h-3.5 animate-spin" />,
      };
    case "completed":
      return {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        text: "text-emerald-400",
        icon: <CheckCircle2 className="w-3 h-3 2xl:w-3.5 2xl:h-3.5" />,
      };
    case "failed":
      return {
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        text: "text-red-400",
        icon: <XCircle className="w-3 h-3 2xl:w-3.5 2xl:h-3.5" />,
      };
    case "paused":
      return {
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        text: "text-amber-400",
        icon: <Pause className="w-3 h-3 2xl:w-3.5 2xl:h-3.5" />,
      };
    case "stopping":
      return {
        bg: "bg-yellow-500/10", // Yellow indicates a transitional/warning state
        border: "border-yellow-500/20",
        text: "text-yellow-500",
        icon: <Pause className="w-3 h-3 2xl:w-3.5 2xl:h-3.5" />, // Pause icon better represents "stopping" action
      };
    case "stopped":
      return {
        bg: "bg-red-500/10", // Red indicates a terminal/complete stop
        border: "border-red-500/20",
        text: "text-red-500",
        icon: <StopCircle className="w-3 h-3 2xl:w-3.5 2xl:h-3.5" />, // Stop icon for final stopped state
      };
    case "crawled":
      return {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        text: "text-emerald-400",
        icon: <CheckCircle2 className="w-3 h-3 2xl:w-3.5 2xl:h-3.5" />,
      };
    default:
      return {
        bg: "bg-zinc-500/10",
        border: "border-zinc-500/20",
        text: "text-zinc-400",
        icon: <Circle className="w-3 h-3 2xl:w-3.5 2xl:h-3.5 animate-pulse" />,
      };
  }
};

// Status indicator component
export const StatusIndicator: React.FC<{ status: WebCrawlJob["status"] }> = ({ status }) => {
  const statusStyle = getStatusColor(status);

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
        ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}
        border text-sm font-medium
        transition-colors duration-200
      `}
    >
      {statusStyle.icon}
      <span className="capitalize text-sm 2xl:tex-base">{status}</span>
    </span>
  );
};
