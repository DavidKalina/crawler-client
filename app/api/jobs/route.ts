// app/api/jobs/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

// Input validation schema
const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status: z
    .enum(["all", "pending", "running", "paused", "stopping", "completed", "failed", "crawled"])
    .optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const validatedQuery = querySchema.parse({
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      status: searchParams.get("status"),
    });

    const { page, pageSize, status } = validatedQuery;

    const supabase = await createClient();

    // Get user session (even though middleware checks, double-check for safety)
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Build the base query
    let query = supabase
      .from("web_crawl_jobs")
      .select("*", { count: "exact" })
      .eq("user_id", session.user.id); // Ensure user only sees their jobs

    // Apply status filter if provided
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    // Get total count with filters
    const { count, error: countError } = await query;

    if (countError) {
      throw countError;
    }

    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Get paginated data with filters
    const { data, error: dataError } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (dataError) {
      throw dataError;
    }

    return NextResponse.json({
      data,
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
