"use client";

import { useState, useRef, useEffect } from "react";
import type { User } from "@/lib/types";

export interface ProfileMenuProps {
  user: User;
  onViewProfile?: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
}

export function ProfileMenu({ user, onViewProfile, onEditProfile, onLogout }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium text-black hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:inline">{user.name}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-black/10 bg-white shadow-lg dark:border-white/15 dark:bg-neutral-900">
          <div className="border-b border-black/10 px-4 py-3 dark:border-white/15">
            <p className="text-sm font-semibold text-black dark:text-white">{user.name}</p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">{user.email}</p>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              onViewProfile?.();
            }}
            className="block w-full px-4 py-2 text-left text-sm text-black hover:bg-neutral-50 dark:text-white dark:hover:bg-neutral-800"
          >
            My Profile
          </button>

          <button
            onClick={() => {
              onEditProfile();
              setIsOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-black hover:bg-neutral-50 dark:text-white dark:hover:bg-neutral-800"
          >
            Edit Profile
          </button>

          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="border-t border-black/10 block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:border-white/15 dark:text-red-400 dark:hover:bg-red-950"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
