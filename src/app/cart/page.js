'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Package, Download, ShieldCheck, ArrowLeft } from 'lucide-react';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount } = useApp();

  const hasPhysicalItems = cart.some((i) => i.editionType === 'physical');

  return (
    <div className={styles.page}>
      <title>Shopping Cart — ArtBox Marketplace</title>
      <meta name="description" content="Review your selected original fine artworks and digital master licenses before proceeding to checkout." />

      <div className={styles.container}>
        {/* Top Header */}
        <div className={styles.header}>
          <Link href="/marketplace" className={styles.backLink}>
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
          <h1 className={styles.title}>Your Art Shopping Cart ({cartCount})</h1>
        </div>

        {cart.length === 0 ? (
          <div className={styles.emptyCard}>
            <div className={styles.emptyIcon}>🎨</div>
            <h2>Your cart is currently empty</h2>
            <p>Discover available physical original paintings and 8K digital master licenses in our marketplace.</p>
            <Link href="/marketplace" className={styles.browseBtn}>
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* Left: Items List */}
            <div className={styles.itemsColumn}>
              <div className={styles.itemsHeader}>
                <span>Artwork Item</span>
                <span>Quantity</span>
                <span>Subtotal</span>
              </div>

              <div className={styles.itemsList}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.itemRow}>
                    <div className={styles.itemMain}>
                      <img src={item.image} alt={item.title} className={styles.itemImg} />
                      <div className={styles.itemMeta}>
                        <h3 className={styles.itemTitle}>{item.title}</h3>
                        <span className={styles.itemArtist}>by {item.artist}</span>

                        <div className={styles.editionTag}>
                          {item.editionType === 'physical' ? (
                            <span className={styles.physicalBadge}>
                              <Package size={13} /> Physical Original Painting
                            </span>
                          ) : (
                            <span className={styles.digitalBadge}>
                              <Download size={13} /> 8K Digital Master License
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className={styles.qtyBox}>
                      <button
                        onClick={() => updateCartQty(item.id, -1)}
                        className={styles.qtyBtn}
                      >
                        <Minus size={14} />
                      </button>
                      <span className={styles.qtyVal}>{item.quantity}</span>
                      <button
                        onClick={() => updateCartQty(item.id, 1)}
                        className={styles.qtyBtn}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className={styles.priceColumn}>
                      <span className={styles.itemPrice}>
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={styles.removeBtn}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.itemsFooter}>
                <button onClick={clearCart} className={styles.clearBtn}>
                  Clear Shopping Cart
                </button>
              </div>
            </div>

            {/* Right: Order Summary Box */}
            <aside className={styles.summaryColumn}>
              <div className={styles.summaryCard}>
                <h3 className={styles.summaryTitle}>Order Summary</h3>

                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span className={styles.summaryValue}>${cartTotal.toLocaleString()} USD</span>
                </div>

                {hasPhysicalItems ? (
                  <div className={styles.summaryRow}>
                    <span>Estimated Shipping</span>
                    <span className={styles.summaryValue}>Calculated at checkout</span>
                  </div>
                ) : (
                  <div className={styles.summaryRow}>
                    <span>Digital Delivery</span>
                    <span className={styles.freeBadge}>FREE (Instant)</span>
                  </div>
                )}

                <div className={styles.divider} />

                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Estimated Total</span>
                  <span className={styles.totalValue}>${cartTotal.toLocaleString()} USD</span>
                </div>

                <Link href="/checkout" className={styles.checkoutBtn}>
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>

                <div className={styles.guaranteeBox}>
                  <ShieldCheck size={18} className={styles.shieldIcon} />
                  <div>
                    <strong>ArtBox Buyer Protection</strong>
                    <p>Includes Certificate of Authenticity & 30-day money back guarantee.</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
