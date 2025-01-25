import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const DownloadCrawledPages = ({ crawlJobId = null }: { crawlJobId: string | null }) => {
  const supabase = createClient();

  const downloadPages = async () => {
    try {
      // Build the query based on whether crawlJobId is provided
      const query = supabase
        .from("crawled_pages")
        .select("*")
        .order("created_at", { ascending: true });

      // Add crawlJobId filter if provided
      if (crawlJobId) {
        query.eq("crawl_job_id", crawlJobId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      // Convert data to CSV
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
              // Escape quotes and wrap in quotes if contains comma or newline
              return value.includes(",") || value.includes("\n") || value.includes('"')
                ? `"${value.replace(/"/g, '""')}"`
                : value;
            })
            .join(",")
        ),
      ].join("\n");

      // Create and trigger download
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
    }
  };

  return (
    <Button onClick={downloadPages} className="flex items-center gap-2">
      <Download className="h-4 w-4" />
    </Button>
  );
};

export default DownloadCrawledPages;
