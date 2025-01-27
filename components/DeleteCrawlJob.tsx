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

  if (status === "running" || status === "pending") {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-transparent border border-zinc-800 text-zinc-300 hover:text-red-400 hover:border-red-400/50 hover:bg-red-400/10 transition-all duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4" />
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
            className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCrawlJobButton;
