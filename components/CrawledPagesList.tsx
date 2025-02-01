"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CrawledPageItem from "./CrawledPageItem";

interface CrawledPage {
  id: string;
  url: string;
  title: string | null;
  depth: number;
  processing_status: string;
  created_at: string;
}

interface CrawledPagesListProps {
  pages: CrawledPage[];
  loading: boolean;
  onPageClick: (page: CrawledPage) => void;
}

const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 5; // Maximum number of page buttons to show

const CrawledPagesList: React.FC<CrawledPagesListProps> = ({ pages, loading, onPageClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPages = pages.filter(
    (page) =>
      page.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPages.length / ITEMS_PER_PAGE);
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageEnd = pageStart + ITEMS_PER_PAGE;
  const currentPages = filteredPages.slice(pageStart, pageEnd);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("pages-list")?.scrollIntoView({ behavior: "smooth" });
  };

  // Generate the array of page numbers to display
  const getVisiblePages = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    let start = Math.max(2, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
    const end = Math.min(totalPages - 1, start + MAX_VISIBLE_PAGES - 2);

    // Adjust start if we're near the end
    if (end === totalPages - 1) {
      start = Math.max(2, end - (MAX_VISIBLE_PAGES - 2));
    }

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push("...");
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-zinc-100">Crawled Pages</CardTitle>
          <div className="w-full md:w-72">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-zinc-500" />
              </div>
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 h-9 bg-zinc-900 border-zinc-800 text-zinc-100 
                         focus-visible:ring-blue-400/20 focus-visible:border-blue-400/20"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4" id="pages-list">
          <div className="space-y-2 max-h-[800px] overflow-y-auto">
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-16 bg-zinc-800/50 rounded-lg animate-pulse" />
                ))
            ) : currentPages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-zinc-500">
                  {filteredPages.length === 0
                    ? "No pages found matching your search"
                    : "No pages crawled yet"}
                </p>
              </div>
            ) : (
              currentPages.map((page) => (
                <CrawledPageItem key={page.id} page={page} onClick={onPageClick} />
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={
                      currentPage === 1
                        ? "text-red-500 pointer-events-none opacity-50"
                        : "text-red-500"
                    }
                  />
                </PaginationItem>

                {getVisiblePages().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "..." ? (
                      <span className="px-4 text-zinc-500">...</span>
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page as number);
                        }}
                        isActive={currentPage === page}
                        className="text-blue-500 bg-zinc-900 border-zinc-800 data-[active=true]:bg-blue-500/10 
                                 data-[active=true]:text-blue-400 data-[active=true]:border-blue-500/20"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "text-emerald-500 pointer-events-none opacity-50"
                        : "text-emerald-500"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CrawledPagesList;
