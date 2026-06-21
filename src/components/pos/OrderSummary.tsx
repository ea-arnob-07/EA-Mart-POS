'use client';

import {
  CheckCircle2,
  ChevronRight,
  CreditCard,
  PauseCircle,
  PlayCircle,
  ReceiptText,
  Tag,
  UserRound,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface Props {
  onOpenPayment: () => void;
  onOpenCustomer: () => void;
  onOpenHeld: () => void;
  onQuickCash: (amount: number) => void;
}

export default function OrderSummary({ onOpenPayment, onOpenCustomer, onOpenHeld, onQuickCash }: Props) {
  const {
    cart,
    customer,
    orderDiscount,
    couponCode,
    redeemedPoints,
    heldCarts,
    store,
    formatCurrency,
    holdCurrentCart,
  } = useApp();

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItemDiscounts = cart.reduce((sum, item) => sum + item.discount, 0);
  const loyaltyDiscount = redeemedPoints > 0 ? redeemedPoints / 100 : 0;
  const totalOrderDiscount = orderDiscount + loyaltyDiscount;
  const taxRate = store?.taxRateDefault || 15;
  const taxAmount = store?.taxInclusive
    ? Math.max(0, subtotal - subtotal / (1 + taxRate / 100))
    : Math.max(0, (subtotal * taxRate) / 100);
  const grandTotal = Math.max(0, store?.taxInclusive ? subtotal - totalOrderDiscount : subtotal - totalOrderDiscount + taxAmount);
  const isCartEmpty = cart.length === 0;
  const exact = Math.ceil(grandTotal * 100) / 100;
  const cash10 = Math.ceil(grandTotal / 10) * 10 || 10;
  const cash20 = Math.ceil(grandTotal / 20) * 20 || 20;
  const cash50 = Math.ceil(grandTotal / 50) * 50 || 50;

  return (
    <div className="pos-summary">
      <div className="pos-panel-head pos-summary-head">
        <div className="pos-panel-heading">
          <span className="pos-title-icon is-green"><ReceiptText className="h-4 w-4" /></span>
          <div>
            <h2>Order summary</h2>
            <p>Review the sale before payment.</p>
          </div>
        </div>
        <span className="pos-summary-secure"><CheckCircle2 className="h-3 w-3" /> Secure</span>
      </div>

      <div className="pos-summary-body">
        <button onClick={onOpenCustomer} className="pos-customer-select">
          <span className="pos-customer-avatar"><UserRound className="h-4 w-4" /></span>
          <span className="min-w-0 flex-1 text-left">
            <strong>{customer ? customer.name : 'Guest customer'}</strong>
            <small>{customer ? `${customer.loyaltyTier} member · ${customer.pointsBalance} points` : 'Assign a customer account (F2)'}</small>
          </span>
          <span className="pos-customer-action">{customer ? 'Change' : 'Add'} <ChevronRight className="h-3 w-3" /></span>
        </button>

        <div className="pos-sale-tools">
          <button onClick={() => holdCurrentCart()} disabled={isCartEmpty} className="pos-hold-sale">
            <PauseCircle className="h-3.5 w-3.5" /> Hold sale <kbd>F4</kbd>
          </button>
          <button onClick={onOpenHeld} disabled={heldCarts.length === 0} className="pos-recall-sale">
            <PlayCircle className="h-3.5 w-3.5" /> Held sales <span>{heldCarts.length}</span>
          </button>
        </div>

        <div className="pos-summary-lines">
          <div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
          {totalItemDiscounts > 0 && <div className="is-positive"><span>Item discounts</span><strong>-{formatCurrency(totalItemDiscounts)}</strong></div>}
          {orderDiscount > 0 && (
            <div className="is-positive">
              <span><Tag className="h-3 w-3" /> {couponCode ? `Promotion · ${couponCode}` : 'Order discount'}</span>
              <strong>-{formatCurrency(orderDiscount)}</strong>
            </div>
          )}
          {loyaltyDiscount > 0 && (
            <div className="is-positive">
              <span>Loyalty redemption · {redeemedPoints} pts</span>
              <strong>-{formatCurrency(loyaltyDiscount)}</strong>
            </div>
          )}
          <div className="pos-tax-line"><span>{store?.taxInclusive ? `VAT included (${taxRate}%)` : `VAT (${taxRate}%)`}</span><strong>{formatCurrency(taxAmount)}</strong></div>
        </div>
      </div>

      <div className="pos-summary-total">
        <div className="pos-total-label"><span>Total due</span><small>BDT · Tax {store?.taxInclusive ? 'inclusive' : 'exclusive'}</small></div>
        <strong>{formatCurrency(grandTotal)}</strong>
      </div>

      <div className="pos-summary-checkout">
        <div className="pos-quick-cash-label">Quick tender</div>
        <div className="pos-quick-cash-grid">
          <button onClick={() => onQuickCash(exact)} disabled={isCartEmpty}>Exact</button>
          <button onClick={() => onQuickCash(cash10)} disabled={isCartEmpty}>{formatCurrency(cash10)}</button>
          <button onClick={() => onQuickCash(cash20)} disabled={isCartEmpty}>{formatCurrency(cash20)}</button>
          <button onClick={() => onQuickCash(cash50)} disabled={isCartEmpty}>{formatCurrency(cash50)}</button>
        </div>
        <button onClick={onOpenPayment} disabled={isCartEmpty} className="pos-checkout-button">
          <CreditCard className="h-4 w-4" />
          <span>Continue to payment</span>
          <kbd>F5</kbd>
        </button>
        <p className="pos-checkout-note">Payment is processed securely through your active register.</p>
      </div>
    </div>
  );
}
