"use client";

import React from 'react';
import AdminHomeContent from '@/components/admin/AdminHomeContent';
import AdminProtection from '@/components/auth/AdminProtection';

export default function AdminDashboard() {
  return (
    <AdminProtection>
      <AdminHomeContent />
    </AdminProtection>
  );
}
