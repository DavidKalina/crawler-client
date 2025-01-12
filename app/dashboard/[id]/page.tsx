"use client";
import Dashboard from "@/components/Dashboard";
import { useParams } from "next/navigation";

const CrawlJobDashboard = () => {
  const searchParams = useParams();

  console.log("searchParams", searchParams);

  const crawlJobId = searchParams.id?.toString() ?? "";
  console.log(crawlJobId);

  return <Dashboard crawlJobId={crawlJobId} />;
};

export default CrawlJobDashboard;
