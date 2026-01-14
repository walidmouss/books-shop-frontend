"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export type SortOrder = "asc" | "desc";

const CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Programming",
  "Science",
  "History",
  "Databases",
  "Dystopian",
];

export function BookFilters({
  initialSearch = "",
  initialSort = "asc",
  initialCategory = "",
  initialMinPrice = 0,
  initialMaxPrice = 1000,
  onChangeAction,
  className,
}: {
  initialSearch?: string;
  initialSort?: SortOrder;
  initialCategory?: string;
  initialMinPrice?: number;
  initialMaxPrice?: number;
  onChangeAction: (v: {
    search: string;
    sort: SortOrder;
    category: string;
    minPrice: number;
    maxPrice: number;
  }) => void;
  className?: string;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState<SortOrder>(initialSort);
  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  useEffect(() => {
    const id = setTimeout(
      () => onChangeAction({ search, sort, category, minPrice, maxPrice }),
      250,
    );
    return () => clearTimeout(id);
  }, [search, sort, category, minPrice, maxPrice, onChangeAction]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* First row: Search and Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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

      {/* Second row: Category and Price Range */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <select
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="minPrice" className="text-sm text-neutral-600 dark:text-neutral-300">
            Price:
          </label>
          <input
            id="minPrice"
            type="number"
            min="0"
            max="1000"
            value={minPrice}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setMinPrice(isNaN(val) ? 0 : val);
            }}
            className="w-16 rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            aria-label="Minimum price"
            placeholder="Min"
          />
          <span className="text-neutral-600 dark:text-neutral-300">-</span>
          <input
            id="maxPrice"
            type="number"
            min="0"
            max="1000"
            value={maxPrice}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setMaxPrice(isNaN(val) ? 1000 : val);
            }}
            className="w-16 rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            aria-label="Maximum price"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
}
