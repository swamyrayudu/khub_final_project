"use client";

import React, { Suspense } from "react";
import { LoadingPage } from "@/components/ui/loading-page";

interface SuspenseWrapperProps {
  children: React.ReactNode;
  loadingText?: string;
  fallback?: React.ReactNode;
}

export function SuspenseWrapper({
  children,
  loadingText = "Loading...",
  fallback,
}: SuspenseWrapperProps) {
  return (
    <Suspense fallback={fallback || <LoadingPage text={loadingText} />}>
      {children}
    </Suspense>
  );
}
