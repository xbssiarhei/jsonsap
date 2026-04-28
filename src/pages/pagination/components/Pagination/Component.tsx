"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePaginationContext } from "@/pages/pagination/components/Pagination/Context";

declare module "@/lib/types" {
  export interface ComponentConfigType {
    PaginationControl: string;
  }
}

export function PaginationControl() {
  const { items, page, itemsPerPage, setPage, setItemsPerPage } =
    usePaginationContext();
  const pageSize = itemsPerPage;
  const TOTAL_ITEMS = items?.length ?? 100;

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Label className="whitespace-nowrap">Rows per page:</Label>
        <Select
          onValueChange={(rowsPerPage) => setItemsPerPage(+rowsPerPage)}
          value={pageSize.toString()}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap text-muted-foreground text-sm">
          {(page - 1) * itemsPerPage + 1}-{page * itemsPerPage} of {TOTAL_ITEMS}
        </span>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                aria-label="Go to previous page"
                disabled={page === 1}
                size="icon"
                variant="ghost"
                onClick={() => setPage(Math.max(1, page - 1))}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                aria-label="Go to next page"
                disabled={page * itemsPerPage >= TOTAL_ITEMS}
                size="icon"
                variant="ghost"
                onClick={() => setPage(page + 1)}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
