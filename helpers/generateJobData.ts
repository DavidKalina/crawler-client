import { v4 as uuidv4 } from "uuid"; // You'll need to install this package

// Types from your QueueMonitor component
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

interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

// Sample URLs for realistic-looking data
const sampleUrls = [
  "https://example.com/blog/post-1",
  "https://example.com/products/category-2",
  "https://example.com/users/profile",
  "https://example.com/services/web-development",
  "https://example.com/about/team",
  "https://example.com/contact",
  "https://example.com/blog/post-2",
  "https://example.com/products/category-1",
  "https://example.com/docs/getting-started",
  "https://example.com/api/v1/documentation",
];

// Generate a random job
const generateJob = (state?: JobState): Job => {
  const states: JobState[] = ["waiting", "active", "completed", "failed"];
  const randomState = state || states[Math.floor(Math.random() * states.length)];
  const maxDepth = Math.floor(Math.random() * 5) + 3; // Random depth between 3 and 7
  const currentDepth = Math.floor(Math.random() * maxDepth);

  // Generate timestamps
  const createdAt = new Date(Date.now() - Math.random() * 86400000 * 7); // Within last 7 days
  const updatedAt = new Date(
    createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime())
  );

  return {
    id: uuidv4(),
    state: randomState,
    data: {
      url: sampleUrls[Math.floor(Math.random() * sampleUrls.length)],
      currentDepth,
      maxDepth,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      priority: Math.floor(Math.random() * 5) + 1, // Priority 1-5
    },
  };
};

// Generate mock pagination info
const generatePaginationInfo = (page: number, totalPages: number): PaginationInfo => {
  return {
    hasNextPage: page < totalPages - 1,
    hasPreviousPage: page > 0,
    startCursor: `cursor_${page * 10}`,
    endCursor: `cursor_${(page + 1) * 10 - 1}`,
  };
};

// Generate a batch of jobs with specified counts
const generateJobsBatch = (
  waitingCount: number,
  activeCount: number,
  completedCount: number,
  failedCount: number
) => {
  const jobs: Job[] = [
    ...Array(waitingCount)
      .fill(null)
      .map(() => generateJob("waiting")),
    ...Array(activeCount)
      .fill(null)
      .map(() => generateJob("active")),
    ...Array(completedCount)
      .fill(null)
      .map(() => generateJob("completed")),
    ...Array(failedCount)
      .fill(null)
      .map(() => generateJob("failed")),
  ];

  const queueStats: QueueStats = {
    waitingCount,
    activeCount,
    completedCount,
    failedCount,
  };

  return { jobs, queueStats };
};

// Example usage:
const dummyData = {
  // Generate 30 total jobs with different states
  ...generateJobsBatch(8, 5, 12, 5),
  // Add pagination info (current page 0, total 3 pages)
  pagination: generatePaginationInfo(0, 3),
  isLoading: false,
  error: null,
};

export { generateJob, generateJobsBatch, generatePaginationInfo, dummyData };
