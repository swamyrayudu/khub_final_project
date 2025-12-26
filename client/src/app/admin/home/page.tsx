'use client';

import React from 'react';

// Authentication is handled by middleware.ts
export default function AdminHomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b px-6 py-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome, Admin</p>
      </header>
      
      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4">🎉 Admin Access Granted!</h2>
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-800 dark:text-green-300">
            ✅ <strong>Role:</strong> Administrator<br/>
            ✅ <strong>Security:</strong> Protected by middleware authentication
          </p>
        </div>
      </main>
    </div>
  );
}
