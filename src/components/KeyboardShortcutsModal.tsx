'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { X, Keyboard } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const subscribeToMount = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function KeyboardShortcutsModal({ onClose }: Props) {
  const mounted = useSyncExternalStore(subscribeToMount, getClientSnapshot, getServerSnapshot);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const shortcuts = [
    { key: 'F1', description: 'Focus Product Search / Barcode Input' },
    { key: 'F2', description: 'Open Customer Lookup & Loyalty Modal' },
    { key: 'F3', description: 'Apply Order Discount or Coupon Code' },
    { key: 'F4', description: 'Hold Current Sale / Park Cart' },
    { key: 'F5', description: 'Open Payment Modal / Instant Tender' },
    { key: 'F6', description: 'Reprint / View Last Receipt' },
    { key: 'Esc', description: 'Close Modal / Clear Cart' },
    { key: 'Delete', description: 'Remove Selected Cart Item' },
    { key: 'Any Barcode', description: 'USB Laser Scanners automatically scan into cart without focusing input' },
  ];

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-labelledby="shortcuts-title" className="flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-200  flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-sky-50  text-sky-600">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 id="shortcuts-title" className="text-sm font-bold text-slate-800 ">Cashier Keyboard Shortcuts</h2>
              <p className="text-[10px] text-slate-500">High-speed supermarket register keys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600  p-1.5 rounded-lg hover:bg-slate-100 "
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="min-h-0 space-y-2.5 overflow-y-auto p-5">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100  bg-slate-50/50 "
            >
              <span className="text-xs text-slate-700  font-medium">{s.description}</span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-white  border border-slate-300  rounded-md shadow-xs text-slate-800  shrink-0 ml-3">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50  border-t border-slate-200  flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            Got It
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
