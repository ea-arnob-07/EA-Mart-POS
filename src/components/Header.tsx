'use client';

import React, { useState } from 'react';
import {
  Store as StoreIcon,
  UserRound,
  Bell,
  Keyboard,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Menu,
  ShieldCheck,
  Banknote,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, store, stores, activeShift, notifications, switchStore } = useApp();
  const [showStoreMenu, setShowStoreMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <header className="ea-header relative z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 shadow-[0_4px_20px_rgba(20,34,66,.035)] backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="relative min-w-0">
          <button
            onClick={() => setShowStoreMenu(!showStoreMenu)}
            className="flex max-w-[230px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/60 sm:max-w-[320px]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <StoreIcon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">Active branch</span>
              <span className="block truncate text-[10px] font-extrabold text-slate-800">{store?.name || 'Select Store'}</span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          </button>

          {showStoreMenu && (
            <div className="absolute left-0 top-full mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-900/10">
              <p className="px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Switch store branch</p>
              {stores.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    switchStore(item.id);
                    setShowStoreMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-blue-50 ${store?.id === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold">{item.name}</span>
                    <span className="mt-0.5 block font-mono text-[9px] text-slate-400">{item.code}</span>
                  </span>
                  {store?.id === item.id && <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={`hidden items-center gap-2 rounded-full border px-3 py-2 text-[9px] font-bold sm:flex ${activeShift ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
          <span className={`h-2 w-2 rounded-full ${activeShift ? 'animate-pulse bg-emerald-500' : 'bg-amber-500'}`} />
          {activeShift ? `Shift open · ${activeShift.register?.code || 'REG-01'}` : 'Register ready'}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
        <div className="hidden items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50/80 px-3 py-2 text-[9px] font-extrabold text-emerald-700 lg:flex">
          <Banknote className="h-3.5 w-3.5" />
          {'\u09F3'} BDT
        </div>

        <div className="hidden items-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50/80 px-3 py-2 text-[9px] font-extrabold uppercase tracking-wide text-indigo-700 sm:flex">
          <ShieldCheck className="h-3.5 w-3.5" />
          {user?.role?.replace(/_/g, ' ') || 'CASHIER'}
        </div>

        <button
          onClick={() => setShowShortcuts(true)}
          title="POS keyboard shortcuts"
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          <Keyboard className="h-4 w-4" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
          >
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-[min(330px,calc(100vw-28px))] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10">
              <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
                <p className="text-xs font-extrabold text-slate-800">Operational alerts</p>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700">{notifications.length} new</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-3 py-7 text-center">
                    <span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></span>
                    <p className="text-xs font-bold text-slate-700">You are all caught up</p>
                    <p className="mt-1 text-[9px] text-slate-400">No inventory or register alerts right now.</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-2.5 border-b border-slate-50 px-3 py-3 last:border-0">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><AlertTriangle className="h-3.5 w-3.5" /></span>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{notification.title}</p>
                        <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500">{notification.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-500 text-[10px] font-black text-white shadow-md shadow-orange-500/15 sm:flex">
          {user?.fullName?.slice(0, 2).toUpperCase() || <UserRound className="h-4 w-4" />}
        </div>
      </div>

      {showShortcuts && <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </header>
  );
}
