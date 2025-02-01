/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { format } from "date-fns";
import { StatusIndicator } from "@/components/StatusIndicator";

interface CrawledPage {
  id: string;
  url: string;
  title: string | null;
  depth: number;
  processing_status: string;
  created_at: string;
}

interface CrawledPageItemProps {
  page: CrawledPage;
  onClick: (page: CrawledPage) => void;
}

const CrawledPageItem: React.FC<CrawledPageItemProps> = ({ page, onClick }) => {
  return (
    <div
      onClick={() => onClick(page)}
      className="p-3 rounded-lg border border-zinc-800 hover:bg-zinc-800/50 
                 transition-colors group cursor-pointer"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">Depth: {page.depth}</span>
            <StatusIndicator status={page.processing_status as any} />
          </div>
          <h4 className="text-zinc-100 text-sm font-medium truncate">{page.title || "Untitled"}</h4>
          <p className="text-xs text-zinc-500 truncate">{page.url}</p>
        </div>
        <div className="text-xs text-zinc-500 whitespace-nowrap">
          {format(new Date(page.created_at), "MMM d, yyyy HH:mm")}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CrawledPageItem);
