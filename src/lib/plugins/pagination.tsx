/* eslint-disable react-refresh/only-export-components */
import { useState, cloneElement, isValidElement } from "react";
import type { Plugin } from "@/lib/types";
import { Button } from "@/components/ui/button";

/**
 * Pagination Plugin - adds pagination to StoreCollection
 *
 * Usage:
 * {
 *   type: "StoreCollection",
 *   store: "@store.computed.filteredProducts",
 *   plugins: ["pagination"],
 *   props: {
 *     pageSize: 12
 *   }
 * }
 */
export const paginationPlugin: Plugin = {
  name: "pagination",
  afterRender: (element, config) => {
    const { pageSize = 10 } = config.props || {};

    function PaginationWrapper({ children }: { children: React.ReactNode }) {
      const [page, setPage] = useState(1);

      // Clone element and inject pagination state
      const elementWithPagination = isValidElement(children)
        ? cloneElement(children, {
            _paginationState: { page, pageSize },
          } as any)
        : children;

      return (
        <div>
          {elementWithPagination}
          <PaginationControls
            page={page}
            pageSize={pageSize as number}
            onPageChange={setPage}
          />
        </div>
      );
    }

    return <PaginationWrapper>{element}</PaginationWrapper>;
  },
};

/**
 * Pagination controls UI
 */
function PaginationControls({
  page,
  // pageSize,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Previous
      </Button>
      <span className="text-sm">Page {page}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
