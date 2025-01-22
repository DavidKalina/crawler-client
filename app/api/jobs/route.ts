// app/api/jobs/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const status = searchParams.get("status");

  const supabase = await createClient();
  let query = supabase.from("web_crawl_jobs").select("*", { count: "exact" });

  // Apply status filter if provided
  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  // Get total count with filters
  const { count } = await query;

  // Get paginated data with filters
  let dataQuery = supabase
    .from("web_crawl_jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  // Apply status filter if provided
  if (status && status !== "all") {
    dataQuery = dataQuery.eq("status", status);
  }

  const { data, error } = await dataQuery;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    total: count,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  });
}
