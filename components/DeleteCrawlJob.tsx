"use client";

import { deleteCrawlJob } from "@/app/actions/crawlJobs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const DeleteCrawlJobButton = ({
  crawlJobId,
  status,
  onDelete,
}: {
  crawlJobId: string;
  status: string;
  onDelete?: () => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const deleteCrawl = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      const response = await deleteCrawlJob(crawlJobId);

      if (!response.success) {
        throw new Error("Error deleting crawl job");
      }

      if (onDelete) {
        onDelete();
      }

      toast({
        title: "Delete Successful",
        description: "Successfully deleted crawl job",
        variant: "default",
      });
      router.refresh();
    } catch (error) {
      console.error("Error deleting crawl job:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  if (status === "running" || status === "pending") {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full bg-transparent border border-zinc-800 text-zinc-300 hover:text-red-400 hover:border-red-400/50 hover:bg-red-400/10 transition-all duration-200 overflow-hidden disabled:opacity-50"
          onClick={(e) => e.stopPropagation()}
          disabled={isLoading}
        >
          <Trash2
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
      </AlertDialogTrigger>
      <AlertDialogContent
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-zinc-800"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-zinc-100">Delete Crawl Job</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Are you sure you want to delete this crawl job? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => e.stopPropagation()}
            className="bg-transparent border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteCrawl}
            className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 relative overflow-hidden disabled:opacity-50"
            disabled={isLoading}
          >
            <span
              className={`transition-all duration-300 ${
                isLoading ? "opacity-0 scale-75" : "opacity-100 scale-100"
              }`}
            >
              Delete
            </span>
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                isLoading ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
            >
              <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            </div>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCrawlJobButton;
