import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const DownloadCrawledPages = ({ crawlJobId = null }: { crawlJobId: string | null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const downloadPages = async () => {
    try {
      setIsLoading(true);
      const query = supabase
        .from("crawled_pages")
        .select("*")
        .order("created_at", { ascending: true });

      if (crawlJobId) {
        query.eq("crawl_job_id", crawlJobId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      const headers = [
        "id",
        "url",
        "title",
        "content_text",
        "depth",
        "created_at",
        "processing_status",
      ];

      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((header) => {
              const value = row[header]?.toString() || "";
              return value.includes(",") || value.includes("\n") || value.includes('"')
                ? `"${value.replace(/"/g, '""')}"`
                : value;
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `crawled-pages${crawlJobId ? `-${crawlJobId}` : ""}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error processing download:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        downloadPages();
      }}
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full bg-transparent border border-zinc-800 text-zinc-300 hover:text-blue-400 hover:border-blue-400/50 hover:bg-blue-400/10 transition-all duration-200 disabled:opacity-50"
      disabled={isLoading}
    >
      <Download className="h-4 w-4" />
    </Button>
  );
};

export default DownloadCrawledPages;
