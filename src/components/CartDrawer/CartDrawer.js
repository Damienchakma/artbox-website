'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Download, Package } from 'lucide-react';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateCartQty, cartTotal, cartCount } = useApp();

  if (!isCartOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setIsCartOpen(false)}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <ShoppingBag size={20} className={styles.cartIcon} />
            <h2>Your Art Cart ({cartCount})</h2>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎨</div>
            <h3>Your cart is empty</h3>
            <p>Explore our fine art marketplace for physical original paintings and digital master licenses.</p>
            <Link
              href="/marketplace"
              className={styles.exploreBtn}
              onClick={() => setIsCartOpen(false)}
            >
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.itemList}>
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImageWrapper}>
                    <img src={item.image} alt={item.title} className={styles.itemImage} />
                  </div>

                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <h4 className={styles.itemTitle}>{item.title}</h4>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className={styles.itemArtist}>by {item.artist}</p>

                    <div className={styles.badgeRow}>
                      {item.editionType === 'physical' ? (
                        <span className={styles.physicalBadge}>
                          <Package size={12} /> Physical Original
                        </span>
                      ) : (
                        <span className={styles.digitalBadge}>
                          <Download size={12} /> 8K Digital License
                        </span>
                      )}
                    </div>

                    <div className={styles.itemFooter}>
                      <div className={styles.qtyControls}>
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          className={styles.qtyBtn}
                        >
                          <Minus size={12} />
                        </button>
                        <span className={styles.qtyNum}>{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          className={styles.qtyBtn}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className={styles.itemPrice}>
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer / Summary */}
            <div className={styles.footer}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span className={styles.totalPrice}>${cartTotal.toLocaleString()} USD</span>
              </div>
              <p className={styles.shippingNotice}>
                <ShieldCheck size={14} /> Shipping & taxes calculated at checkout
              </p>

              <div className={styles.actionButtons}>
                <Link
                  href="/cart"
                  className={styles.viewCartBtn}
                  onClick={() => setIsCartOpen(false)}
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  className={styles.checkoutBtn}
                  onClick={() => setIsCartOpen(false)}
                >
                  Checkout <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
