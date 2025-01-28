// app/actions/initiateCrawl.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function startCrawl(formData: {
  startUrl: string;
  maxDepth: number;
  allowedDomains?: string[];
}) {
  try {
    // Get the user session
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to start a crawl",
      };
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      return {
        success: false,
        error: "Failed to get authentication token",
      };
    }

    const response = await fetch("http://localhost:3000/api/crawl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        startUrl: formData.startUrl,
        maxDepth: formData.maxDepth,
        allowedDomains: formData.allowedDomains,
        userId: user.id, // Pass the user ID to your API
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to start crawl");
    }

    // Revalidate the dashboard page
    revalidatePath("/dashboard");

    return { success: true, jobId: data.id };
  } catch (error) {
    console.error("Crawl error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to start crawl",
    };
  }
}
