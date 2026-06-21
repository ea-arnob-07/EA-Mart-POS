'use client';

import { useState } from 'react';
import { Minus, Package, Plus, ShoppingBag, Tag, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function CartTable() {
  const {
    cart,
    updateCartQty,
    setCartItemQty,
    removeFromCart,
    setCartItemDiscount,
    clearCart,
    formatCurrency,
  } = useApp();
  const [editingDiscountId, setEditingDiscountId] = useState<string | null>(null);
  const [discountVal, setDiscountVal] = useState('');
  const totalUnits = cart.reduce((total, item) => total + item.quantity, 0);

  const handleApplyDiscount = (productId: string) => {
    setCartItemDiscount(productId, Number.parseFloat(discountVal) || 0);
    setEditingDiscountId(null);
    setDiscountVal('');
  };

  return (
    <div className="pos-cart">
      <div className="pos-panel-head pos-cart-head">
        <div className="pos-panel-heading">
          <span className="pos-title-icon is-violet"><ShoppingBag className="h-4 w-4" /></span>
          <div>
            <h2>Current basket</h2>
            <p>{totalUnits} units across {cart.length} {cart.length === 1 ? 'line' : 'lines'}</p>
          </div>
        </div>
        <button onClick={clearCart} disabled={cart.length === 0} className="pos-clear-cart">
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="pos-empty-state pos-empty-cart">
          <span className="pos-empty-icon"><ShoppingBag className="h-7 w-7" /></span>
          <h3>Your basket is empty</h3>
          <p>Select products from the catalogue or scan a barcode to start a sale.</p>
          <div className="pos-empty-tip"><Package className="h-3.5 w-3.5" /> Items will appear here as you add them.</div>
        </div>
      ) : (
        <div className="pos-cart-items">
          {cart.map((item) => (
            <article key={item.productId} className="pos-cart-item">
              <div className="pos-cart-item-main">
                <span className="pos-cart-item-icon"><Package className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <h3>{item.name}</h3>
                  <p>{item.sku || item.barcode || 'Standard item'} <span>·</span> {formatCurrency(item.unitPrice)} / {item.unit}</p>
                  {item.discount > 0 && <span className="pos-line-discount">Discount applied: -{formatCurrency(item.discount)}</span>}
                </div>
                <div className="pos-cart-item-total">
                  <strong>{formatCurrency(item.subtotal)}</strong>
                  <button
                    onClick={() => {
                      setEditingDiscountId(item.productId);
                      setDiscountVal(String(item.discount || ''));
                    }}
                    className="pos-line-discount-trigger"
                  >
                    <Tag className="h-3 w-3" /> Discount
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="pos-remove-item" title="Remove item" aria-label={`Remove ${item.name}`}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="pos-cart-item-controls">
                {editingDiscountId === item.productId ? (
                  <div className="pos-discount-editor">
                    <label>Line discount ({'\u09F3'})</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={discountVal}
                      onChange={(event) => setDiscountVal(event.target.value)}
                      placeholder="0.00"
                    />
                    <button onClick={() => handleApplyDiscount(item.productId)}>Save</button>
                    <button onClick={() => setEditingDiscountId(null)} className="is-cancel">Cancel</button>
                  </div>
                ) : (
                  <div className="pos-quantity-control">
                    <button onClick={() => updateCartQty(item.productId, -1)} aria-label={`Decrease ${item.name} quantity`}><Minus className="h-3.5 w-3.5" /></button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) => setCartItemQty(item.productId, Number.parseInt(event.target.value, 10) || 0)}
                      aria-label={`${item.name} quantity`}
                    />
                    <button onClick={() => updateCartQty(item.productId, 1)} aria-label={`Increase ${item.name} quantity`}><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                )}
                <span className="pos-unit-total">{formatCurrency(item.unitPrice)} each</span>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="pos-cart-footer">
        <span>Basket updates automatically</span>
        <span>{totalUnits} total units</span>
      </div>
    </div>
  );
}
