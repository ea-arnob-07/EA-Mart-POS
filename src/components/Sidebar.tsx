'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Truck,
  ArrowLeftRight,
  Receipt,
  RotateCcw,
  Wallet,
  Users,
  Tag,
  BarChart3,
  ReceiptText,
  ShieldAlert,
  Settings,
  Monitor,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { hasPermission } from '@/lib/auth';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  module: string;
  highlight?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: 'Workspace',
    items: [{ name: 'Dashboard', href: '/', icon: LayoutDashboard, module: 'dashboard' }],
  },
  {
    title: 'Store operations',
    items: [
      { name: 'POS Checkout', href: '/pos', icon: ShoppingCart, module: 'pos', highlight: true },
      { name: 'Products & Barcodes', href: '/products', icon: Package, module: 'products' },
      { name: 'Inventory & Expiry', href: '/inventory', icon: Boxes, module: 'inventory' },
      { name: 'Purchasing & Receiving', href: '/purchasing', icon: Truck, module: 'purchasing' },
      { name: 'Stock Transfers', href: '/transfers', icon: ArrowLeftRight, module: 'inventory' },
      { name: 'Sales & Receipts', href: '/sales', icon: Receipt, module: 'sales' },
      { name: 'Returns & Refunds', href: '/returns', icon: RotateCcw, module: 'returns' },
      { name: 'Cash Register & Shifts', href: '/register', icon: Wallet, module: 'register' },
      { name: 'End of Day', href: '/end-of-day', icon: Wallet, module: 'end-of-day' },
    ],
  },
  {
    title: 'Business insights',
    items: [
      { name: 'Customers & Loyalty', href: '/customers', icon: Users, module: 'customers' },
      { name: 'Promotions & Coupons', href: '/promotions', icon: Tag, module: 'promotions' },
      { name: 'Reports & Analytics', href: '/reports', icon: BarChart3, module: 'reports' },
      { name: 'Store Expenses', href: '/expenses', icon: ReceiptText, module: 'expenses' },
      { name: 'Audit Logs', href: '/audit', icon: ShieldAlert, module: 'audit' },
      { name: 'Settings', href: '/settings', icon: Settings, module: 'settings' },
    ],
  },
];

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, store } = useApp();
  const userRole = user?.role || 'CASHIER';

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`ea-sidebar fixed inset-y-0 left-0 z-50 flex h-screen w-[278px] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-gradient-to-b from-[#09152f] via-[#10295b] to-[#08162f] text-slate-100 shadow-2xl transition-transform duration-300 md:relative md:z-auto md:translate-x-0 md:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-blue-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-[16px] font-extrabold leading-none tracking-tight text-white">EA Mart</h1>
              <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-300">Retail Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-4 mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.035] p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-slate-400">Current branch</span>
            <span className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 font-mono text-[9px] font-bold text-cyan-200">
              {store?.code || 'STR-01'}
            </span>
          </div>
          <p className="truncate text-xs font-bold text-white">{store?.name || 'Flagship Superstore'}</p>
          <div className="mt-2 flex items-center gap-1.5 text-[9px] font-medium text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
            Workspace connected
          </div>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter((item) => hasPermission(userRole, item.module));
            if (!visibleItems.length) return null;

            return (
              <section key={group.title}>
                <p className="mb-2 px-3 text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                  {group.title}
                </p>
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const isActive = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={onClose}
                        className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-[10px] font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-950/30'
                            : item.highlight
                              ? 'border border-cyan-300/15 bg-cyan-300/[0.07] text-cyan-100 hover:bg-emerald-400/[0.15]'
                              : 'text-slate-300 hover:bg-white/[0.075] hover:text-white'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <Icon className={`h-[17px] w-[17px] shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-200'}`} />
                          <span className="truncate">{item.name}</span>
                        </span>
                        {isActive && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/80" />}
                        {item.highlight && !isActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <a
            href="/pos/customer-display"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5 text-[10px] font-semibold text-slate-300 transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.08] hover:text-white"
          >
            <span className="flex items-center gap-3">
              <Monitor className="h-[17px] w-[17px] text-cyan-300" />
              Customer Display
            </span>
            <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[9px] text-slate-400">LIVE</span>
          </a>
        </nav>

        <div className="border-t border-white/10 bg-black/10 p-3.5">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.045] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-500 text-xs font-black text-white shadow-lg shadow-orange-950/20">
              {user?.fullName?.slice(0, 2).toUpperCase() || 'SA'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-bold text-white">{user?.fullName || 'Store Admin'}</p>
              <p className="mt-0.5 truncate text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                {user?.role?.replace(/_/g, ' ') || 'CASHIER'}
              </p>
            </div>
            <button
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              }}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-500/15 hover:text-rose-300"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-center text-[9px] font-medium tracking-wide text-slate-600">EA MART · SMARTER RETAIL MANAGEMENT</p>
        </div>
      </aside>
    </>
  );
}
