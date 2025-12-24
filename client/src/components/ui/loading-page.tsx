"use client";

import React from "react";
import { LoaderThree } from "@/components/ui/loader";

export function LoadingPage({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center justify-center gap-4">
        <LoaderThree />
        {text && (
          <p className="text-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

export function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <LoaderThree />
      {text && (
        <p className="text-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {text}
        </p>
      )}
    </div>
  );
}

export function LoadingOverlay({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="rounded-lg bg-white p-8 dark:bg-neutral-950">
        <LoaderThree />
      </div>
    </div>
  );
}
