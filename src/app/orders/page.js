'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Package, Download, MapPin, Truck, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import styles from './OrdersPage.module.css';

export default function OrdersPage() {
  const { orders } = useApp();

  return (
    <div className={styles.page}>
      <title>My Orders — ArtBox Marketplace</title>
      <meta name="description" content="View your past artwork purchases, delivery shipping status, and digital file downloads." />

      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Purchase History</span>
          <h1 className={styles.title}>Your Placed Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className={styles.emptyCard}>
            <Package size={48} className={styles.emptyIcon} />
            <h2>No orders found</h2>
            <p>You haven't placed any artwork orders yet.</p>
            <Link href="/marketplace" className={styles.shopBtn}>
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.orderId} className={styles.orderCard}>
                {/* Order Top Bar */}
                <div className={styles.orderHeader}>
                  <div className={styles.orderMeta}>
                    <span className={styles.orderId}>Order #{order.orderId}</span>
                    <span className={styles.orderDate}>Placed on {order.date}</span>
                  </div>

                  <div className={styles.orderRight}>
                    <span className={styles.statusBadge}>
                      {order.status === 'Delivered' ? (
                        <CheckCircle2 size={14} className={styles.successDot} />
                      ) : (
                        <Clock size={14} className={styles.processDot} />
                      )}
                      {order.status}
                    </span>
                    <span className={styles.orderTotal}>${order.totalAmount?.toLocaleString()} USD</span>
                  </div>
                </div>

                {/* Items */}
                <div className={styles.itemList}>
                  {order.items.map((item) => (
                    <div key={item.id} className={styles.itemRow}>
                      <img src={item.image} alt={item.title} className={styles.itemImg} />
                      <div className={styles.itemInfo}>
                        <h3 className={styles.itemTitle}>{item.title}</h3>
                        <p className={styles.itemArtist}>by {item.artist}</p>
                        <div className={styles.badgeGroup}>
                          {item.editionType === 'physical' ? (
                            <span className={styles.physicalTag}>
                              <Package size={12} /> Physical Original
                            </span>
                          ) : (
                            <span className={styles.digitalTag}>
                              <Download size={12} /> 8K Digital Master
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.itemRight}>
                        <span className={styles.itemPrice}>
                          Qty: {item.quantity} × ${item.price?.toLocaleString()}
                        </span>
                        {item.editionType === 'digital' && (
                          <button
                            onClick={() => alert(`Downloading high-resolution 8K Master file for ${item.title}...`)}
                            className={styles.downloadBtn}
                          >
                            <Download size={13} /> Download 8K Master
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery details footer if physical */}
                {order.shippingAddress && (
                  <div className={styles.orderFooter}>
                    <div className={styles.addressInfo}>
                      <MapPin size={15} className={styles.icon} />
                      <span>
                        Shipping to <strong>{order.shippingAddress.fullName}</strong> — {order.shippingAddress.streetAddress}, {order.shippingAddress.city}, {order.shippingAddress.country}
                      </span>
                    </div>

                    <div className={styles.trackingInfo}>
                      <Truck size={15} className={styles.icon} />
                      <span>Tracking ID: <strong>{order.trackingNumber}</strong> ({order.shippingMethod?.name})</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
