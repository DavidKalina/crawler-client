"use client";
import Dashboard from "@/components/Dashboard";
import { useParams } from "next/navigation";

const CrawlJobDashboard = () => {
  const searchParams = useParams();

  const crawlJobId = searchParams.id?.toString() ?? "";
  return <Dashboard crawlJobId={crawlJobId} />;
};

export default CrawlJobDashboard;
