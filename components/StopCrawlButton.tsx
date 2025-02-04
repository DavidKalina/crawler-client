"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { stopCrawlJob } from "@/app/actions/crawlJobs";

const StopCrawlButton = ({
  crawlJobId,
  status,
  onStop,
}: {
  crawlJobId: string;
  status: string;
  onStop?: () => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const stopCrawl = async (e: React.MouseEvent) => {
    setIsLoading(true);

    e.stopPropagation();

    try {
      const { success } = await stopCrawlJob(crawlJobId);

      if (!success) {
        throw new Error("Error stopping crawl job");
      }

      if (onStop) {
        onStop();
      }

      // Refresh the page data
      router.refresh();
      toast({
        title: "Crawl Job Stopped",
        description: "Successfully stopped crawl job",
      });
    } catch (error) {
      console.log(error);
      // console.error("Error stopping crawl:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Only show the button for running or pending crawls
  if (status !== "running" && status !== "pending") {
    return null;
  }

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        stopCrawl(e);
      }}
      variant="ghost"
      size="icon"
      className="relative h-8 w-8 rounded-full bg-transparent border border-zinc-800 text-zinc-300 hover:text-red-400 hover:border-red-400/50 hover:bg-red-400/10 transition-all duration-200 disabled:opacity-50 overflow-hidden"
      disabled={isLoading}
    >
      <Square
        className={`h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          isLoading ? "opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
      />
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-300 ${
          isLoading ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <div className="w-full h-full rounded-full border-2 border-current border-t-transparent animate-spin" />
      </div>
    </Button>
  );
};

export default StopCrawlButton;
