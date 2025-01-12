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

type CrawlStats = {
  crawlId: string;
  stats: {
    total: number;
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  };
  isComplete: boolean;
};

type WebSocketMessage = {
  crawls: CrawlStats[];
  queueStats: {
    waitingCount: number;
    activeCount: number;
    completedCount: number;
    failedCount: number;
  };
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
  const [wsError, setWsError] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("WebSocket Connected");
      setIsConnected(true);
      setWsError("");
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);

        setJobs((prevJobs) => {
          const updatedJobs = [...prevJobs];

          data.crawls.forEach((crawlStats) => {
            const jobIndex = updatedJobs.findIndex((job) => job.id === crawlStats.crawlId);

            if (jobIndex !== -1) {
              updatedJobs[jobIndex] = {
                ...updatedJobs[jobIndex],
                status: crawlStats.isComplete
                  ? crawlStats.stats.failed > 0
                    ? "failed"
                    : "completed"
                  : crawlStats.stats.active > 0
                  ? "running"
                  : "pending",
                metadata: {
                  ...updatedJobs[jobIndex].metadata,
                  jobStats: crawlStats.stats,
                },
              };
            }
          });

          return updatedJobs;
        });
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
        setWsError("Error processing real-time updates");
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setWsError("Failed to connect to real-time updates");
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleRowClick = (jobId: string) => {
    router.push(`/dashboard/${jobId}`);
  };

  return (
    <div className="space-y-4">
      {wsError && (
        <Alert variant="destructive">
          <AlertDescription>{wsError}</AlertDescription>
        </Alert>
      )}

      {isConnected && (
        <Alert>
          <AlertDescription className="text-green-600">
            ⚡ Real-time updates enabled
          </AlertDescription>
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
