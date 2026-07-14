'use client';

import { useState, useEffect, useRef } from 'react';
import ProductGrid from '@/components/pos/ProductGrid';
import CartTable from '@/components/pos/CartTable';
import OrderSummary from '@/components/pos/OrderSummary';
import PaymentModal from '@/components/pos/PaymentModal';
import ReceiptModal from '@/components/pos/ReceiptModal';
import CustomerSelectModal from '@/components/pos/CustomerSelectModal';
import CameraScannerModal from '@/components/pos/CameraScannerModal';
import HoldSalesModal from '@/components/pos/HoldSalesModal';
import { useApp } from '@/context/AppContext';
import type { SaleReceipt } from '@/lib/types';
import {
  Activity,
  Barcode,
  Keyboard,
  Store,
  UserRound,
  Volume2,
  VolumeX,
} from 'lucide-react';

export default function PosPage() {
  const { store, user, activeShift, addToCart, cart, holdCurrentCart } = useApp();
  const [showPayment, setShowPayment] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showHeld, setShowHeld] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<SaleReceipt | null>(null);
  const [quickCashAmount, setQuickCashAmount] = useState<number | null>(null);
  const [audioBeep, setAudioBeep] = useState(true);
  const [scanNotice, setScanNotice] = useState<string | null>(null);
  const barcodeBufferRef = useRef('');
  const lastKeyTimeRef = useRef(0);

  const playBeep = () => {
    if (!audioBeep || typeof window === 'undefined') return;
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1760, context.currentTime);
      gain.gain.setValueAtTime(0.1, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.08);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.08);
    } catch {}
  };

  const handleBarcodeScanned = async (code: string) => {
    if (!code) return;
    try {
      const response = await fetch(`/api/pos/barcode-lookup?barcode=${encodeURIComponent(code)}&storeId=${store?.id || ''}`);
      const data = await response.json();

      if (response.ok && data.found) {
        playBeep();
        addToCart(data.product, 1);
        setScanNotice(`Added to basket: ${data.product.name}`);
        setTimeout(() => setScanNotice(null), 2200);
      } else {
        setScanNotice(`Barcode not found: ${code}`);
        setTimeout(() => setScanNotice(null), 2800);
      }
    } catch {
      setScanNotice('Scanner could not reach the product service.');
      setTimeout(() => setScanNotice(null), 2800);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F1') {
        event.preventDefault();
        document.getElementById('pos-search-input')?.focus();
        return;
      }
      if (event.key === 'F2') {
        event.preventDefault();
        setShowCustomer(true);
        return;
      }
      if (event.key === 'F4') {
        event.preventDefault();
        holdCurrentCart();
        return;
      }
      if (event.key === 'F5') {
        event.preventDefault();
        if (cart.length > 0) setShowPayment(true);
        return;
      }
      if (event.key === 'Escape') {
        setShowPayment(false);
        setShowCustomer(false);
        setShowCamera(false);
        setShowHeld(false);
        return;
      }

      const now = Date.now();
      const delay = now - lastKeyTimeRef.current;
      lastKeyTimeRef.current = now;
      const target = event.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (event.key === 'Enter') {
        if (barcodeBufferRef.current.length >= 6) {
          event.preventDefault();
          const scannedCode = barcodeBufferRef.current;
          barcodeBufferRef.current = '';
          handleBarcodeScanned(scannedCode);
          return;
        }
        barcodeBufferRef.current = '';
        return;
      }

      if (event.key.length === 1) {
        if (delay > 80 && !isInput) barcodeBufferRef.current = '';
        barcodeBufferRef.current += event.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, store?.id, audioBeep]);

  const handleQuickCash = (amount: number) => {
    setQuickCashAmount(amount);
    setShowPayment(true);
  };

  return (
    <div className="pos-page select-none">
      {scanNotice && (
        <div className={`pos-scan-toast ${scanNotice.startsWith('Barcode') || scanNotice.startsWith('Scanner') ? 'is-error' : ''}`} role="status">
          <span className="pos-scan-toast-icon"><Barcode className="h-4 w-4" /></span>
          <span className="min-w-0 flex-1 truncate">{scanNotice}</span>
        </div>
      )}

      <div className="pos-toolbar">
        <div className="pos-toolbar-heading">
          <div className="pos-toolbar-mark"><Activity className="h-5 w-5" /></div>
          <div className="min-w-0">
            <p className="pos-eyebrow">EA MART / SALES TERMINAL</p>
            <h1>Point of Sale</h1>
            <p className="pos-toolbar-subtitle">A faster, clearer checkout experience.</p>
          </div>
        </div>

        <div className="pos-toolbar-meta">
          <div className={`pos-register-status ${activeShift ? 'is-open' : 'is-ready'}`}>
            <span className="pos-status-dot" />
            <span>{activeShift ? `Shift open · ${activeShift.register?.code || 'REG-01'}` : 'Register ready'}</span>
          </div>
          <div className="pos-toolbar-store">
            <Store className="h-3.5 w-3.5" />
            <span>{store?.name || 'Current store'}</span>
          </div>
          <div className="pos-toolbar-user">
            <UserRound className="h-3.5 w-3.5" />
            <span>{user?.fullName || 'Cashier'}</span>
          </div>
          <button onClick={() => setAudioBeep((value) => !value)} className="pos-sound-button" aria-label={audioBeep ? 'Mute scan sound' : 'Enable scan sound'}>
            {audioBeep ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span>{audioBeep ? 'Scan sound' : 'Muted'}</span>
          </button>
        </div>

        <div className="pos-shortcut-strip" aria-label="POS keyboard shortcuts">
          <span><kbd>F1</kbd> Search</span>
          <span><kbd>F2</kbd> Customer</span>
          <span><kbd>F4</kbd> Hold</span>
          <span><kbd>F5</kbd> Pay</span>
          <span className="pos-shortcut-icon"><Keyboard className="h-3.5 w-3.5" /></span>
        </div>
      </div>

      <div className="pos-workspace">
        <section className="pos-panel pos-catalog-panel" aria-label="Product catalogue">
          <ProductGrid onOpenScanner={() => setShowCamera(true)} />
        </section>
        <section className="pos-panel pos-cart-panel" aria-label="Shopping basket">
          <CartTable />
        </section>
        <section className="pos-panel pos-summary-panel" aria-label="Order summary">
          <OrderSummary
            onOpenPayment={() => {
              setQuickCashAmount(null);
              setShowPayment(true);
            }}
            onOpenCustomer={() => setShowCustomer(true)}
            onOpenHeld={() => setShowHeld(true)}
            onQuickCash={handleQuickCash}
          />
        </section>
      </div>

      {showPayment && (
        <PaymentModal
          initialCashPreset={quickCashAmount}
          onClose={() => setShowPayment(false)}
          onSuccess={(receipt) => {
            setShowPayment(false);
            setActiveReceipt(receipt);
          }}
        />
      )}

      {activeReceipt && <ReceiptModal receipt={activeReceipt} onClose={() => setActiveReceipt(null)} />}
      {showCustomer && <CustomerSelectModal onClose={() => setShowCustomer(false)} />}
      {showCamera && <CameraScannerModal onScan={handleBarcodeScanned} onClose={() => setShowCamera(false)} />}
      {showHeld && <HoldSalesModal onClose={() => setShowHeld(false)} />}
    </div>
  );
}
