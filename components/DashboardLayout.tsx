import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import CrawlInitiator from "./CrawlInitiator";

interface DashboardLayoutProps {
  children: React.ReactNode;
  crawlJobId?: string;
}

const DashboardLayout = ({ children, crawlJobId }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto space-y-6">
          {/* Header Section with Create Button */}
          <div className="border-b border-zinc-800 pb-4">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl font-semibold text-zinc-100">
                {crawlJobId ? "Crawl Job Details" : "Dashboard"}
              </h1>

              {!crawlJobId && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-green-500/10 border-green-500/20 text-green-400 
                               hover:bg-green-500/20 hover:text-green-300
                               focus-visible:ring-offset-zinc-900 focus-visible:ring-green-400/20"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Crawl
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg bg-zinc-950 border-zinc-800">
                    <DialogHeader>
                      <DialogTitle className="text-zinc-100">Create New Crawl</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <CrawlInitiator />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <p className="text-sm text-zinc-400">
              {crawlJobId
                ? "Monitor detailed statistics for this crawl job"
                : "Monitor your web crawling operations and manage resources"}
            </p>
          </div>

          {/* Main Content */}
          <div className="rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
