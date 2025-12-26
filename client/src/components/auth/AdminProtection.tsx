'use client';

import React from 'react';

interface AdminProtectionProps {
  children: React.ReactNode;
}

// Authentication is handled by middleware.ts
// This component is just a wrapper for consistent structure
export default function AdminProtection({ children }: AdminProtectionProps) {
  return <>{children}</>;
}
