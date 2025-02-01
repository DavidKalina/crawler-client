"use client";

import React, { Dispatch, SetStateAction, useState, useCallback, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Code, FileText, Search, ArrowUp, ArrowDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchMatch {
  index: number;
  text: string;
}

const PageDetailsDialog = ({
  page,
  open,
  onOpenChange,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page: any;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [matches, setMatches] = useState<SearchMatch[]>([]);
  const preRef = useRef<HTMLPreElement>(null);

  const findMatches = useCallback((text: string, searchTerm: string) => {
    if (!searchTerm) return [];
    const matches: SearchMatch[] = [];
    let index = text.toLowerCase().indexOf(searchTerm.toLowerCase());

    while (index !== -1) {
      matches.push({
        index,
        text: text.slice(index, index + searchTerm.length),
      });
      index = text.toLowerCase().indexOf(searchTerm.toLowerCase(), index + 1);
    }
    return matches;
  }, []);

  const handleSearch = useCallback(() => {
    if (!page?.extracted_content) return;

    const text = JSON.stringify(page?.extracted_content, null, 2);
    const newMatches = findMatches(text, searchTerm);
    setMatches(newMatches);
    setCurrentMatchIndex(0);
  }, [page?.extracted_content, searchTerm, findMatches]);

  const scrollToMatch = useCallback(
    (index: number) => {
      if (!preRef.current || matches.length === 0) return;

      const pre = preRef.current;
      const text = pre.textContent || "";
      const matchIndex = matches[index].index;

      const temp = document.createElement("span");
      const textUntilMatch = text.substring(0, matchIndex);
      temp.style.whiteSpace = "pre-wrap";
      temp.textContent = textUntilMatch;
      document.body.appendChild(temp);

      const lineHeight = parseInt(window.getComputedStyle(pre).lineHeight);
      const totalLines = temp.offsetHeight / lineHeight;
      document.body.removeChild(temp);

      const scrollPosition = totalLines * lineHeight;
      pre.parentElement?.scrollTo({
        top: scrollPosition - lineHeight * 2,
        behavior: "smooth",
      });
    },
    [matches]
  );

  useEffect(() => {
    if (matches.length > 0) {
      scrollToMatch(currentMatchIndex);
    }
  }, [currentMatchIndex, matches, scrollToMatch]);

  const highlightText = (text: string) => {
    if (!searchTerm || matches.length === 0) return text;

    const parts = [];
    let lastIndex = 0;

    matches.forEach((match, idx) => {
      parts.push(text.slice(lastIndex, match.index));
      parts.push(
        <mark
          key={match.index}
          className={`${
            idx === currentMatchIndex ? "bg-blue-500/50 text-white" : "bg-yellow-500/30 text-white"
          }`}
        >
          {match.text}
        </mark>
      );

      lastIndex = match.index + match.text.length;
    });

    parts.push(text.slice(lastIndex));
    return <>{parts}</>;
  };

  const navigateMatches = (direction: "next" | "prev") => {
    if (matches.length === 0) return;

    setCurrentMatchIndex((current) => {
      if (direction === "next") {
        return current === matches.length - 1 ? 0 : current + 1;
      } else {
        return current === 0 ? matches.length - 1 : current - 1;
      }
    });
  };

  if (!page) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full md:max-w-2xl bg-zinc-900 border-zinc-800 p-0 h-full md:h-auto">
        <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-3.5 w-3.5 text-blue-400" />
              <DialogTitle className="text-sm font-medium text-zinc-100">Page Details</DialogTitle>
            </div>
            <div className="flex items-center space-x-3">
              <StatusIndicator status={page.processing_status} />
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-base md:text-lg font-medium text-zinc-100 truncate">
              {page.title || "Untitled"}
            </h3>
            <a
              href={page.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs md:text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1.5 w-fit transition-colors truncate"
            >
              {page.url}
              <ExternalLink className="h-3 w-3 md:h-3.5 md:w-3.5 flex-shrink-0" />
            </a>
          </div>
        </DialogHeader>

        <Tabs defaultValue="content" className="p-4 md:p-6">
          <TabsList className="w-full md:w-auto bg-zinc-800/50 border border-zinc-800">
            <TabsTrigger
              value="content"
              className="flex-1 md:flex-none data-[state=active]:bg-zinc-900 data-[state=active]:text-blue-400 text-zinc-400"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Content
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="flex-1 md:flex-none data-[state=active]:bg-zinc-900 data-[state=active]:text-blue-400 text-zinc-400"
            >
              <Code className="h-3.5 w-3.5 mr-1.5" />
              Raw Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-3 md:p-4 space-y-4">
                <div className="prose prose-zinc prose-invert max-w-none">
                  <div className="text-xs md:text-sm text-zinc-300">
                    {page.content_text || "No content available"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="mt-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-3 md:p-4 space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                        if (e.key === "Enter" && e.shiftKey) navigateMatches("prev");
                        else if (e.key === "Enter") navigateMatches("next");
                      }}
                      placeholder="Search in raw data..."
                      className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 text-sm"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => navigateMatches("prev")}
                      disabled={matches.length === 0}
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-zinc-700"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => navigateMatches("next")}
                      disabled={matches.length === 0}
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-zinc-700"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleSearch}
                      className="text-blue-500 border-zinc-700 text-zinc-100 whitespace-nowrap"
                    >
                      Find ({matches.length})
                    </Button>
                  </div>
                </div>

                <div className="h-64 md:h-96 rounded-lg border border-zinc-800">
                  <div className="h-full overflow-auto">
                    <pre
                      ref={preRef}
                      className="text-xs md:text-sm text-zinc-100 bg-zinc-800/50 p-3 md:p-4 whitespace-pre-wrap break-all"
                    >
                      {highlightText(JSON.stringify(page.extracted_content, null, 2))}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PageDetailsDialog;
