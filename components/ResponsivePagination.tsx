"use client";

import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ResponsivePaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  getVisiblePages: () => unknown[];
}

const ResponsivePagination: React.FC<ResponsivePaginationProps> = ({
  currentPage,
  totalPages,
  handlePageChange,
  getVisiblePages,
}) => {
  const [isMobileView, setIsMobile] = useState(true);
  // Mobile breakpoint logic

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Using the same breakpoint as your Tailwind md: breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const renderPageNumbers = () => {
    if (!isMobileView) {
      // For desktop or when few pages, show all numbers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return getVisiblePages().map((page: any, index: number) => (
        <PaginationItem key={index} className="hidden sm:inline-flex">
          {page === "..." ? (
            <span className="px-4 text-zinc-500">...</span>
          ) : (
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(page);
              }}
              isActive={currentPage === page}
              className="text-blue-500 bg-zinc-900 border-zinc-800 
                       data-[active=true]:bg-blue-500/10 
                       data-[active=true]:text-blue-400 
                       data-[active=true]:border-blue-500/20"
            >
              {page}
            </PaginationLink>
          )}
        </PaginationItem>
      ));
    }

    // For mobile with many pages, show current page and total
    return (
      <PaginationItem className="flex items-center sm:hidden">
        <span className="text-sm text-zinc-500">
          Page {currentPage} of {totalPages}
        </span>
      </PaginationItem>
    );
  };

  return (
    <Pagination className="w-full">
      <PaginationContent className="flex items-center justify-between space-x-2">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) handlePageChange(currentPage - 1);
            }}
            className={`text-red-500 ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
          />
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) handlePageChange(currentPage + 1);
            }}
            className={`text-emerald-500 ${
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ResponsivePagination;
