import React from "react";
import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";
import { useRouter } from "next/navigation";

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

  const stopCrawl = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click when clicking stop button

    try {
      const response = await fetch(`http://localhost:3000/api/queue/stop/${crawlJobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to stop crawl");
      }

      // Call the optional onStop callback
      if (onStop) {
        onStop();
      }

      // Refresh the page data
      router.refresh();
    } catch (error) {
      console.error("Error stopping crawl:", error);
    }
  };

  // Only show the button for running or pending crawls
  if (status !== "running" && status !== "pending") {
    return null;
  }

  return (
    <Button onClick={stopCrawl} className="flex items-center gap-2">
      <Square className="h-4 w-4" />
    </Button>
  );
};

export default StopCrawlButton;
