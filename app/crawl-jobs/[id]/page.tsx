"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Globe, Link2, AlertCircle, Clock } from "lucide-react";
import LoadingSplash from "@/components/LoadingComponent";
import { useParams } from "next/navigation";
import CrawledPagesList from "@/components/CrawledPagesList";
import { StatsCard } from "@/components/StatsCard";
import PageDetailsDialog from "@/components/PageDetailsDialog";

const CrawlJobDetailsPage = () => {
  const [stats, setStats] = useState({
    totalPages: 0,
    averageDepth: 0,
    failedPages: 0,
    processingTime: 0,
  });
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { id: jobId } = useParams();

  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from("crawled_pages")
          .select("*")
          .eq("crawl_job_id", jobId);

        if (error) throw error;

        if (data) {
          const avgDepth = data.reduce((acc, page) => acc + page.depth, 0) / data.length;
          const failed = data.filter((page) => page.processing_status === "failed").length;

          setStats({
            totalPages: data.length,
            averageDepth: Number(avgDepth.toFixed(1)),
            failedPages: failed,
            processingTime: 0, // Calculate from timestamps if needed
          });

          setPages(data);
        }
      } catch (error) {
        console.error("Error fetching crawl data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [jobId, supabase]);

  const handlePageClick = (page: any) => {
    setSelectedPage(page);
    setDialogOpen(true);
  };

  return (
    <>
      <LoadingSplash show={loading} />
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Pages"
              value={stats.totalPages}
              icon={Globe}
              description="Total pages crawled"
              loading={loading}
              variant="blue"
            />
            <StatsCard
              title="Average Depth"
              value={stats.averageDepth}
              icon={Link2}
              description="Average crawl depth"
              loading={loading}
              variant="purple"
            />
            <StatsCard
              title="Failed Pages"
              value={stats.failedPages}
              icon={AlertCircle}
              description="Pages that failed processing"
              loading={loading}
              variant="red"
            />
            <StatsCard
              title="Processing Time"
              value={`${stats.processingTime}s`}
              icon={Clock}
              description="Average processing time"
              loading={loading}
              variant="green"
            />
          </div>

          {/* Pages List */}
          <CrawledPagesList pages={pages} loading={loading} onPageClick={handlePageClick} />
        </div>
      </div>

      <PageDetailsDialog page={selectedPage} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default CrawlJobDetailsPage;
