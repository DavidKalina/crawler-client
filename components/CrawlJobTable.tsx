/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/utils/supabase/client";

type CrawlJob = {
  id: string;
  start_url: string;
  max_depth: number;
  status: "pending" | "running" | "paused" | "stopping" | "completed" | "failed" | "crawled";
  created_at: string;
  completed_at: string | null;
  updated_at: string;
  metadata: Record<string, any>;
};

const getStatusColor = (status: CrawlJob["status"]) => {
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
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

const CrawlJobsTable = ({ initialJobs }: { initialJobs: CrawlJob[] }) => {
  const router = useRouter();
  const [jobs, setJobs] = useState<CrawlJob[]>(initialJobs);
  const [error, setError] = useState<string>("");

  const supabase = createClient();

  useEffect(() => {
    // Subscribe to changes in the web_crawl_jobs table
    const channel = supabase
      .channel("web_crawl_jobs_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "web_crawl_jobs",
        },
        (payload) => {
          console.log("Received database change:", payload);

          setJobs((currentJobs) => {
            switch (payload.eventType) {
              case "INSERT": {
                // Add new job to the beginning of the list
                const newJob = payload.new as CrawlJob;
                const exists = currentJobs.some((job) => job.id === newJob.id);
                if (exists) return currentJobs;
                return [newJob, ...currentJobs];
              }

              case "UPDATE": {
                // Update existing job
                const updatedJob = payload.new as CrawlJob;
                return currentJobs.map((job) =>
                  job.id === updatedJob.id ? { ...job, ...updatedJob } : job
                );
              }

              case "DELETE": {
                // Remove job if deleted
                const deletedId = payload.old.id;
                return currentJobs.filter((job) => job.id !== deletedId);
              }

              default:
                return currentJobs;
            }
          });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Successfully subscribed to database changes");
        }
        if (status === "CHANNEL_ERROR") {
          setError("Failed to connect to realtime updates");
        }
      });

    // Cleanup subscription
    return () => {
      console.log("Cleaning up Supabase subscription");
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRowClick = (jobId: string) => {
    router.push(`/dashboard/${jobId}`);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Start URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Max Depth</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Completed At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow
                key={job.id}
                onClick={() => handleRowClick(job.id)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell className="font-medium">
                  <span className="truncate block max-w-[200px]">{job.start_url}</span>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(job.status)} text-white`}>{job.status}</Badge>
                </TableCell>
                <TableCell>{job.max_depth}</TableCell>
                <TableCell>{format(new Date(job.created_at), "MMM d, yyyy HH:mm")}</TableCell>
                <TableCell>{format(new Date(job.updated_at), "MMM d, yyyy HH:mm")}</TableCell>
                <TableCell>
                  {job.completed_at ? format(new Date(job.completed_at), "MMM d, yyyy HH:mm") : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CrawlJobsTable;
