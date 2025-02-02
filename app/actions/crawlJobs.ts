// app/actions/crawlJobs.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { WebCrawlJob } from "@/types/jobTypes";

// Input validation schemas
const jobIdSchema = z.string().uuid();

// Type for crawl stats from the database
interface CrawlStats {
  pagesCrawled: number;
  duration: string;
  errors: number;
  totalSize: string;
  avgTokens: number;
}

// Type for the return value of database operations
type ActionResult<T = void> = Promise<
  { success: true; data: T } | { success: false; error: string }
>;

export async function getCrawlJob(jobId: string): ActionResult<WebCrawlJob> {
  try {
    const validatedId = jobIdSchema.parse(jobId);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("web_crawl_jobs")
      .select("*")
      .eq("id", validatedId)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Job not found");

    return { success: true, data: data as WebCrawlJob };
  } catch (error) {
    console.error("Error fetching crawl job:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch crawl job",
    };
  }
}

export async function deleteCrawlJob(jobId: string): ActionResult {
  try {
    const validatedId = jobIdSchema.parse(jobId);
    const supabase = await createClient();

    // Get user session
    // Get user session
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify job belongs to user
    const { data: job } = await supabase
      .from("web_crawl_jobs")
      .select("user_id")
      .eq("id", validatedId)
      .single();

    if (!job || job.user_id !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase.from("web_crawl_jobs").delete().eq("id", validatedId);

    if (error) throw error;

    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error deleting crawl job:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete crawl job",
    };
  }
}

export async function stopCrawlJob(jobId: string): ActionResult {
  try {
    const validatedId = jobIdSchema.parse(jobId);
    const supabase = await createClient();

    // Get user session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get the session token
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return { success: false, error: "No valid session" };
    }

    // Verify job belongs to user
    const { data: job } = await supabase
      .from("web_crawl_jobs")
      .select("user_id, status")
      .eq("id", validatedId)
      .single();

    if (!job || job.user_id !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (job.status !== "running" && job.status !== "pending") {
      return { success: false, error: "Job is not running or pending" };
    }

    // Make the API request with the auth token
    const response = await fetch(`${process.env.BASE_URL}/api/crawl/${jobId}/stop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    console.log("RESPONSE", response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || errorData?.message || `Failed to stop crawl: ${response.statusText}`
      );
    }

    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch (error) {
    console.log("Error stopping crawl job:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to stop crawl job",
    };
  }
}
export async function getCrawlStats(jobId: string): ActionResult<CrawlStats> {
  try {
    const validatedId = jobIdSchema.parse(jobId);
    const supabase = await createClient();

    // Get user session
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase.rpc("get_crawl_stats", { job_id: validatedId });

    if (error) throw error;
    if (!data) throw new Error("Stats not found");

    return { success: true, data: data as CrawlStats };
  } catch (error) {
    console.error("Error fetching crawl stats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch crawl stats",
    };
  }
}
