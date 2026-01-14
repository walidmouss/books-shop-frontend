"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export type SortOrder = "asc" | "desc";

export function BookFilters({
  initialSearch = "",
  initialSort = "asc",
  onChangeAction,
  className,
}: {
  initialSearch?: string;
  initialSort?: SortOrder;
  onChangeAction: (v: { search: string; sort: SortOrder }) => void;
  className?: string;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState<SortOrder>(initialSort);

  useEffect(() => {
    const id = setTimeout(() => onChangeAction({ search, sort }), 250);
    return () => clearTimeout(id);
  }, [search, sort, onChangeAction]);

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center", className)}>
      <div className="flex-1">
        <Input
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search by title"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-neutral-600 dark:text-neutral-300">
          Sort:
        </label>
        <select
          id="sort"
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOrder)}
          aria-label="Sort by title"
        >
          <option value="asc">Title (A–Z)</option>
          <option value="desc">Title (Z–A)</option>
        </select>
      </div>
    </div>
  );
}
