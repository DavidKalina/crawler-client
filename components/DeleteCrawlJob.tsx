import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { createClient } from "@/utils/supabase/client";

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
  const supabase = createClient();

  const deleteCrawl = async (e: React.MouseEvent) => {
    // Prevent event from bubbling up to the row
    e.stopPropagation();

    try {
      const { error } = await supabase.from("web_crawl_jobs").delete().eq("id", crawlJobId);

      if (error) {
        throw error;
      }

      if (onDelete) {
        onDelete();
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting crawl job:", error);
    }
  };

  // Don't show the delete button for running or pending crawls
  if (status === "running" || status === "pending") {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="flex items-center gap-2 bg-red-500"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Crawl Job</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this crawl job? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteCrawl}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCrawlJobButton;
