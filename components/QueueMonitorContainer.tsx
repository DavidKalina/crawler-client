/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// Types
type JobState = "waiting" | "active" | "completed" | "failed";

interface Job {
  id: string;
  state: JobState;
  data: {
    url: string;
    currentDepth: number;
    maxDepth: number;
    createdAt?: string;
    updatedAt?: string;
    priority?: number;
  };
}

interface QueueStats {
  waitingCount: number;
  activeCount: number;
  completedCount: number;
  failedCount: number;
}

import { useState, useEffect } from "react";
import QueueMonitor from "./QueueMonitor";

// Types remain the same...

const fetchQueueStatus = async (cursor: string | null, pageSize: number) => {
  const params = new URLSearchParams({
    pageSize: pageSize.toString(),
    ...(cursor && { cursor }),
  });

  const response = await fetch(`http://localhost:3000/api/queue/status?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch queue status");
  }
  return response.json();
};

// Optional: WebSocket setup for real-time updates
const setupWebSocket = (onUpdate: (data: any) => void): WebSocket => {
  const ws = new WebSocket(
    `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws`
  ) as WebSocket;

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onUpdate(data);
  };

  return ws;
};

const QueueContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [queueStats, setQueueStats] = useState<QueueStats>({
    waitingCount: 0,
    activeCount: 0,
    completedCount: 0,
    failedCount: 0,
  });
  const [pagination, setPagination] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: "",
    endCursor: "",
  });

  const PAGE_SIZE = 100;

  // Setup polling interval
  useEffect(() => {
    const loadQueueStatus = async () => {
      try {
        const data = await fetchQueueStatus(currentCursor, PAGE_SIZE);
        setJobs(data.jobs);
        setQueueStats(data.queueStats);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load queue status");
      }
    };

    // Initial load
    loadQueueStatus();

    // Setup polling
    const pollInterval = setInterval(loadQueueStatus, 5000); // Poll every 5 seconds

    // Optional: Setup WebSocket
    const ws = setupWebSocket((data) => {
      // Handle real-time updates
      setJobs((prev) => {
        // Update only changed jobs
        const updatedJobs = [...prev];
        data.jobs.forEach((updatedJob: Job) => {
          const index = updatedJobs.findIndex((job) => job.id === updatedJob.id);
          if (index !== -1) {
            updatedJobs[index] = updatedJob;
          }
        });
        return updatedJobs;
      });
      setQueueStats(data.queueStats);
    });

    // Cleanup
    return () => {
      clearInterval(pollInterval);
      ws.close();
    };
  }, [currentCursor]);

  const handleNextPage = () => {
    setCurrentCursor(pagination.endCursor);
  };

  const handlePreviousPage = () => {
    const previousCursor = Number(pagination.startCursor) - PAGE_SIZE;
    setCurrentCursor(previousCursor > 0 ? previousCursor.toString() : null);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await fetchQueueStatus(currentCursor, PAGE_SIZE);
      setJobs(data.jobs);
      setQueueStats(data.queueStats);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh queue status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <QueueMonitor
        queueStats={queueStats}
        jobs={jobs}
        pagination={pagination}
        isLoading={isLoading}
        error={error}
        pageSize={PAGE_SIZE}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default QueueContainer;
