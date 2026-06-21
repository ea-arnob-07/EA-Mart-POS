'use client';

import { useState, useEffect } from 'react';
import { Barcode, Camera, Check, Package, Plus, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface Props {
  onOpenScanner: () => void;
}

export default function ProductGrid({ onOpenScanner }: Props) {
  const { store, addToCart, formatCurrency } = useApp();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data.categories || []))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (searchQuery) params.set('q', searchQuery);
    if (store?.id) params.set('storeId', store.id);

    fetch(`/api/products?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [selectedCategory, searchQuery, store?.id]);

  const handleAdd = (product: any) => {
    if (Number(product.stock ?? 0) <= 0) return;
    addToCart(product, 1);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 850);
  };

  return (
    <div className="pos-catalog">
      <div className="pos-panel-head pos-catalog-head">
        <div className="pos-panel-heading">
          <span className="pos-title-icon is-blue"><Package className="h-4 w-4" /></span>
          <div>
            <h2>Product catalogue</h2>
            <p>Find an item or scan its barcode to add it.</p>
          </div>
        </div>

        <div className="pos-search-tools">
          <div className="pos-search-wrap">
            <Search className="pos-search-icon h-4 w-4" />
            <input
              id="pos-search-input"
              type="search"
              placeholder="Search name, SKU or barcode..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pos-search-input"
              aria-label="Search products"
            />
            <kbd>F1</kbd>
          </div>
          <button onClick={onOpenScanner} title="Open camera barcode scanner" className="pos-scan-button">
            <Camera className="h-4 w-4" />
            <span>Scan</span>
          </button>
        </div>

        <div className="pos-category-row" aria-label="Product categories">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`pos-category-pill ${selectedCategory === 'all' ? 'is-active' : ''}`}
          >
            All products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`pos-category-pill ${selectedCategory === category.id ? 'is-active' : ''}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pos-product-scroll">
        {loading ? (
          <div className="pos-products-grid">
            {Array.from({ length: 8 }).map((_, index) => <div key={index} className="pos-product-skeleton" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="pos-empty-state">
            <span className="pos-empty-icon"><Barcode className="h-7 w-7" /></span>
            <h3>No products found</h3>
            <p>Try another search term or choose a different department.</p>
          </div>
        ) : (
          <div className="pos-products-grid">
            {products.map((product, index) => {
              const stock = Number(product.stock || 0);
              const isOutOfStock = stock <= 0;
              const isLowStock = stock > 0 && stock <= Number(product.reorderPoint || 0);
              const justAdded = justAddedId === product.id;
              const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;

              return (
                <button
                  type="button"
                  key={product.id}
                  onClick={() => handleAdd(product)}
                  disabled={isOutOfStock}
                  className={`pos-product-card tone-${index % 4} ${isOutOfStock ? 'is-out-of-stock' : ''} ${justAdded ? 'is-added' : ''}`}
                >
                  <div className="pos-product-card-top">
                    <span className="pos-product-category">{categoryName || 'General'}</span>
                    <span className={`pos-stock-tag ${isOutOfStock ? 'is-out' : isLowStock ? 'is-low' : 'is-in'}`}>
                      <span className="pos-stock-dot" />
                      {isOutOfStock ? 'Out of stock' : `${stock} available`}
                    </span>
                  </div>

                  <span className="pos-product-art"><Package className="h-6 w-6" /></span>

                  <span className="pos-product-copy">
                    <strong>{product.name}</strong>
                    <small>{product.sku || product.barcode || 'Standard item'}</small>
                  </span>

                  <span className="pos-product-card-footer">
                    <span className="pos-product-price">
                      <small>Unit price / {product.unit || 'unit'}</small>
                      <strong>{formatCurrency(product.sellingPrice)}</strong>
                    </span>
                    <span className="pos-add-product" aria-hidden="true">
                      {justAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
