import React, { Dispatch, SetStateAction, useState, useCallback, useRef, useEffect } from "react";
import { StatusIndicator } from "@/components/StatusIndicator";
import {
  ExternalLink,
  FileText,
  Code,
  Search,
  ArrowUp,
  ArrowDown,
  X,
  ChevronLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

interface SearchMatch {
  index: number;
  text: string;
}

const MobilePageDetailsDialog = ({
  page,
  open,
  onOpenChange,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page: any;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) => {
  const [activeView, setActiveView] = useState<"content" | "raw">("content");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [matches, setMatches] = useState<SearchMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Measure container width
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth - 32); // Subtract padding
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [open]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

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
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/50 z-50 touch-none"
          />

          <motion.div
            ref={containerRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex flex-col bg-zinc-900 overflow-hidden touch-pan-y"
          >
            {/* Header */}
            <div className="flex-none border-b border-zinc-800">
              <div className="flex items-center justify-between p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => onOpenChange(false)}
                >
                  <ChevronLeft className="h-6 w-6 text-zinc-400" />
                </Button>
                <StatusIndicator status={page.processing_status} />
              </div>

              <div className="px-4 pb-4 space-y-2">
                <h3 className="text-lg font-medium text-zinc-100 leading-tight">
                  {page.title || "Untitled"}
                </h3>
                <a
                  href={page.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
                >
                  <span className="truncate max-w-[calc(100vw-4rem)]">{page.url}</span>
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-none p-4 space-x-2 border-b border-zinc-800">
              <Button
                variant={activeView === "content" ? "default" : "outline"}
                onClick={() => setActiveView("content")}
                className="w-full flex items-center justify-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Content
              </Button>
              <Button
                variant={activeView === "raw" ? "default" : "outline"}
                onClick={() => setActiveView("raw")}
                className="w-full flex items-center justify-center gap-2"
              >
                <Code className="h-4 w-4" />
                Raw Data
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {activeView === "content" ? (
                <div ref={contentRef} className="h-full overflow-y-auto px-4 py-6">
                  <div
                    className="prose prose-zinc prose-invert max-w-none"
                    style={{
                      width: containerWidth ? `${containerWidth}px` : "auto",
                      maxWidth: "100%",
                    }}
                  >
                    <div className="text-base leading-relaxed text-zinc-300 break-words">
                      {page.content_text || "No content available"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  {isSearching && (
                    <div className="flex-none p-4 space-y-3 bg-zinc-900 border-b border-zinc-800">
                      <div className="relative">
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
                          className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100"
                          autoFocus
                        />
                      </div>
                      <div className="flex items-center justify-between">
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
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button onClick={handleSearch} className="border-zinc-700 text-zinc-100">
                            Find ({matches.length})
                          </Button>
                          <Button variant="ghost" onClick={() => setIsSearching(false)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {!isSearching && (
                    <div className="flex-none p-4 bg-zinc-900 border-b border-zinc-800">
                      <Button
                        onClick={() => setIsSearching(true)}
                        variant="outline"
                        className="w-full border-zinc-700 text-zinc-400"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Search in raw data...
                      </Button>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-4">
                    <pre
                      className="text-sm text-zinc-100 bg-zinc-800/50 p-4 whitespace-pre-wrap break-words rounded-lg"
                      style={{
                        width: containerWidth ? `${containerWidth}px` : "auto",
                        maxWidth: "100%",
                      }}
                    >
                      {containerWidth
                        ? highlightText(JSON.stringify(page?.extracted_content, null, 2))
                        : null}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobilePageDetailsDialog;
