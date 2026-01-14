"use client";

import { useToast } from "@/lib/toast/ToastContext";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg opacity-100 ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
              : toast.type === "error"
                ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
                : "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
          }`}
        >
          <div className="flex-1">
            <p
              className={`text-sm font-semibold ${
                toast.type === "success"
                  ? "text-green-900 dark:text-green-100"
                  : toast.type === "error"
                    ? "text-red-900 dark:text-red-100"
                    : "text-blue-900 dark:text-blue-100"
              }`}
            >
              {toast.title}
            </p>
            {toast.description && (
              <p
                className={`text-xs mt-1 ${
                  toast.type === "success"
                    ? "text-green-800 dark:text-green-200"
                    : toast.type === "error"
                      ? "text-red-800 dark:text-red-200"
                      : "text-blue-800 dark:text-blue-200"
                }`}
              >
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
