import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { statusOptions } from "@/constants/statusOptions";
import { WebCrawlJob } from "@/types/jobTypes";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CrawlJobTableRow from "./CrawlJobTableRow";

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const CrawlJobsTable = ({
  initialJobs,
  initialTotal,
}: {
  initialJobs: WebCrawlJob[];
  initialTotal: number;
}) => {
  const router = useRouter();
  const [jobs, setJobs] = useState<WebCrawlJob[]>(initialJobs);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: initialTotal,
    totalPages: Math.ceil(initialTotal / 10),
  });

  const supabase = createClient();

  const fetchJobs = useCallback(
    async (page: number, status: string) => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/jobs?page=${page}&pageSize=${pagination.pageSize}&status=${status}`
        );
        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        setJobs(data.data);
        setPagination({
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          totalPages: data.totalPages,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    },
    [pagination.pageSize]
  );

  useEffect(() => {
    const channel = supabase
      .channel("web_crawl_jobs_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "web_crawl_jobs",
        },
        async () => {
          await fetchJobs(pagination.page, selectedStatus);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchJobs, pagination.page, selectedStatus, supabase]);

  const handlePageChange = (newPage: number) => {
    fetchJobs(newPage, selectedStatus);
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    fetchJobs(1, newStatus);
  };

  const handleRowClick = (jobId: string) => {
    router.push(`/dashboard/${jobId}`);
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-red-400">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div className="w-[200px]">
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800/50">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {statusOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 bg-zinc-900/90 hover:bg-zinc-900/90">
              <TableHead className="text-zinc-100 font-medium w-[200px] bg-zinc-900/90">
                Start URL
              </TableHead>
              <TableHead className="text-zinc-100 font-medium bg-zinc-900/90">Status</TableHead>
              <TableHead className="text-zinc-100 font-medium bg-zinc-900/90">Max Depth</TableHead>
              <TableHead className="text-zinc-100 font-medium bg-zinc-900/90">Created At</TableHead>
              <TableHead className="text-zinc-100 font-medium bg-zinc-900/90">
                Last Updated
              </TableHead>
              <TableHead className="text-zinc-100 font-medium bg-zinc-900/90">
                Completed At
              </TableHead>
              <TableHead className="text-zinc-100 font-medium bg-zinc-900/90">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <CrawlJobTableRow
                key={job.id}
                job={job}
                handleRowClick={handleRowClick}
                fetchJobs={fetchJobs}
                pagination={pagination}
                selectedStatus={selectedStatus}
              />
            ))}
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-zinc-100 border-zinc-800">
                  No jobs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-t border-zinc-800">
          <div className="text-sm text-zinc-100">
            Showing {jobs.length > 0 ? (pagination.page - 1) * pagination.pageSize + 1 : 0} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
            {pagination.total} results
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
              className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages || loading}
              className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrawlJobsTable;
