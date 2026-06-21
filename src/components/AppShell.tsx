'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isCustomerDisplay = pathname === '/pos/customer-display';
  const isLogin = pathname === '/login';

  if (isCustomerDisplay) {
    return <main className="min-h-screen bg-slate-950 text-white">{children}</main>;
  }

  if (isLogin) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="app-shell flex h-screen w-screen overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="app-workspace flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="app-content flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
