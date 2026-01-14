"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function BookActions({
  onViewAction,
  onEditAction,
  onDeleteAction,
  isAuthor = true,
  isDeleting = false,
  className,
}: {
  onViewAction: () => void;
  onEditAction: () => void;
  onDeleteAction: () => void;
  isAuthor?: boolean;
  isDeleting?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        disabled={isDeleting}
        className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
      >
        {isDeleting ? "Deleting..." : "Actions"}
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-32 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900"
        >
          <button
            role="menuitem"
            className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
            onClick={() => {
              onViewAction();
              setOpen(false);
            }}
          >
            View
          </button>
          {isAuthor && (
            <>
              <button
                role="menuitem"
                className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
                onClick={() => {
                  onEditAction();
                  setOpen(false);
                }}
              >
                Edit
              </button>
              <button
                role="menuitem"
                disabled={isDeleting}
                className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30"
                onClick={() => {
                  onDeleteAction();
                  setOpen(false);
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
