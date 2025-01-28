import React, { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

type UrlHistoryEntry = {
  url: string;
  allowedDomains: string;
  timestamp: number;
};

interface UrlHistoryProps {
  onSelect: (url: string, domains: string) => void;
}

const UrlHistory = ({ onSelect }: UrlHistoryProps) => {
  const [history, setHistory] = useState<UrlHistoryEntry[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("urlHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="relative w-full">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 py-1">
          {history.map((entry) => (
            <Badge
              key={entry.timestamp}
              variant="outline"
              className="shrink-0 cursor-pointer bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1.5 py-1.5"
              onClick={() => onSelect(entry.url, entry.allowedDomains)}
            >
              <Globe className="h-3 w-3 opacity-70" />
              <span className="max-w-[180px] truncate">{entry.url}</span>
            </Badge>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="flex h-0.5 translate-y-1.5" />
      </ScrollArea>
    </div>
  );
};

export default UrlHistory;
