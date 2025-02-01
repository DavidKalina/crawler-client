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
                  setCurrentPage(1); // Reset to first page on search
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
          <div className="space-y-2">
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={currentPage === page}
                      className="text-blue-500/50 bg-zinc-900 border-zinc-800 data-[active=true]:bg-blue-500/10 
                               data-[active=true]:text-blue-400 data-[active=true]:border-blue-500/20"
                    >
                      {page}
                    </PaginationLink>
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
                        ? "text-green-500 pointer-events-none opacity-50"
                        : "text-green-500"
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
