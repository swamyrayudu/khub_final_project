'use client';

import React from 'react';

// Authentication is handled by middleware.ts
// This HOC is kept for backward compatibility but doesn't perform auth checks
export function withAdminAuth<T extends object>(Component: React.ComponentType<T>) {
  return function ProtectedComponent(props: T) {
    return <Component {...props} />;
  };
}
