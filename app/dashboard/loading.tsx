import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="lg:col-span-1 space-y-6">
        {/* Skeleton for CrawlInitiator */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <Skeleton className="h-8 w-48 bg-zinc-800" />
          <div className="mt-4">
            <Skeleton className="h-10 w-full bg-zinc-800" />
          </div>
        </div>

        {/* Skeleton for QuotaDisplay */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <Skeleton className="h-6 w-32 bg-zinc-800" />
          <div className="mt-4">
            <Skeleton className="h-4 w-full bg-zinc-800" />
          </div>
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="space-y-6">
          {/* Status filter skeleton */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-[200px] bg-zinc-800" />
          </div>

          {/* Table skeleton */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 bg-zinc-900/90">
                  <TableHead className="text-zinc-100 font-medium w-[200px] bg-zinc-900/90">
                    Start URL
                  </TableHead>
                  <TableHead className="text-zinc-100 font-medium bg-zinc-900/90">Status</TableHead>
                  <TableHead className="text-zinc-100 font-medium bg-zinc-900/90">
                    Max Depth
                  </TableHead>
                  <TableHead className="text-zinc-100 font-medium bg-zinc-900/90">
                    Created At
                  </TableHead>
                  <TableHead className="text-zinc-100 font-medium bg-zinc-900/90">
                    Last Updated
                  </TableHead>
                  <TableHead className="text-zinc-100 font-medium bg-zinc-900/90">
                    Completed At
                  </TableHead>
                  <TableHead className="text-zinc-100 font-medium bg-zinc-900/90">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i} className="border-zinc-800 bg-zinc-900">
                    <TableCell className="p-4">
                      <Skeleton className="h-4 w-40 bg-zinc-800" />
                    </TableCell>
                    <TableCell className="p-4">
                      <Skeleton className="h-4 w-20 bg-zinc-800" />
                    </TableCell>
                    <TableCell className="p-4">
                      <Skeleton className="h-4 w-12 bg-zinc-800" />
                    </TableCell>
                    <TableCell className="p-4">
                      <Skeleton className="h-4 w-32 bg-zinc-800" />
                    </TableCell>
                    <TableCell className="p-4">
                      <Skeleton className="h-4 w-32 bg-zinc-800" />
                    </TableCell>
                    <TableCell className="p-4">
                      <Skeleton className="h-4 w-32 bg-zinc-800" />
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 bg-zinc-800 rounded-md" />
                        <Skeleton className="h-8 w-8 bg-zinc-800 rounded-md" />
                        <Skeleton className="h-8 w-8 bg-zinc-800 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-t border-zinc-800">
              <Skeleton className="h-4 w-48 bg-zinc-800" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20 bg-zinc-800" />
                <Skeleton className="h-9 w-20 bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
