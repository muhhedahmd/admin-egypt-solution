
"use client";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonLoaderProps {
  rows?: number;
}

export function TableSkeletonLoader({ rows = 8 }: TableSkeletonLoaderProps) {
  return (
    <Card className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>isActive</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Order</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className=" animate-wave  w-full h-20  object-cover" />
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className=" animate-wave h-5 w-32" />
                  <Skeleton className=" animate-wave h-4 w-48" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className=" animate-wave h-5 w-24 font-mono" />
              </TableCell>
              <TableCell>
                <Skeleton className=" animate-wave h-6 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className=" animate-wave h-6 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className=" animate-wave  h-5 w-8" />
              </TableCell>
              <TableCell>
                <Skeleton className=" animate-wave h-9 w-9 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export default TableSkeletonLoader;