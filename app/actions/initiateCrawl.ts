"use server";

import { revalidatePath } from "next/cache";

export async function startCrawl(formData: {
  startUrl: string;
  maxDepth: number;
  allowedDomains?: string[];
}) {
  try {
    const response = await fetch("http://localhost:3000/api/crawl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startUrl: formData.startUrl,
        maxDepth: formData.maxDepth,
        allowedDomains: formData.allowedDomains,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to start crawl");
    }

    // Revalidate the dashboard page
    revalidatePath("/");
    // If you're using a different path, adjust accordingly

    return { success: true, jobId: data.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to start crawl",
    };
  }
}
