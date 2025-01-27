import { WebCrawlJob } from "@/types/jobTypes";

export const getStatusColor = (status: WebCrawlJob["status"]) => {
  switch (status) {
    case "running":
      return "bg-blue-500";
    case "completed":
      return "bg-green-500";
    case "failed":
      return "bg-red-500";
    case "paused":
      return "bg-yellow-500";
    case "stopping":
      return "bg-orange-500";
    case "crawled":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};
