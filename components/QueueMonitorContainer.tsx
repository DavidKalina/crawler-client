"use client";

import { useState, useEffect, useCallback } from "react";
import QueueMonitor from "./QueueMonitor";

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

const fetchQueueStatus = async () => {
  const response = await fetch("http://localhost:3000/api/queue/status");
  if (!response.ok) {
    throw new Error("Failed to fetch queue status");
  }
  return response.json();
};

const setupWebSocket = (onUpdate: (data: any) => void): WebSocket => {
  const ws = new WebSocket("ws://localhost:3000/ws");

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onUpdate(data);
  };

  return ws;
};

const QueueContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [queueStats, setQueueStats] = useState<QueueStats>({
    waitingCount: 0,
    activeCount: 0,
    completedCount: 0,
    failedCount: 0,
  });

  // Remove isLoading from dependencies
  const loadQueueStatus = useCallback(async () => {
    // Skip if already loading
    if (isLoading) return;

    setIsLoading(true);
    try {
      const data = await fetchQueueStatus();
      setJobs(data.jobs);
      setQueueStats(data.queueStats);
    } catch (err) {
      console.error("Failed to load queue status:", err);
      setError(err instanceof Error ? err.message : "Failed to load queue status");
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies

  // WebSocket update handler - memoize to prevent recreating on every render
  const handleWebSocketUpdate = useCallback((data: any) => {
    setQueueStats(data.queueStats);
    setJobs((prevJobs) => {
      const updatedJobs = [...prevJobs];
      data.jobs.forEach((updatedJob: Job) => {
        const index = updatedJobs.findIndex((job) => job.id === updatedJob.id);
        if (index !== -1) {
          updatedJobs[index] = updatedJob;
        }
      });
      return updatedJobs;
    });
  }, []);

  // Setup polling and WebSocket
  useEffect(() => {
    // Initial load
    loadQueueStatus();

    // Setup polling
    const pollInterval = setInterval(loadQueueStatus, 10000);

    // Setup WebSocket
    const ws = setupWebSocket(handleWebSocketUpdate);

    return () => {
      clearInterval(pollInterval);
      ws.close();
    };
  }, [loadQueueStatus, handleWebSocketUpdate]);

  // Separate refresh handler
  const handleRefresh = useCallback(() => {
    loadQueueStatus();
  }, [loadQueueStatus]);

  return (
    <div className="container mx-auto p-4">
      <QueueMonitor
        queueStats={queueStats}
        jobs={jobs}
        isLoading={isLoading}
        error={error}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default QueueContainer;
