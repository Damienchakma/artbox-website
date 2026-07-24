'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Package, Download } from 'lucide-react';
import styles from './WishlistPage.module.css';

export default function WishlistPage() {
  const { wishlist, artworks, toggleWishlist, addToCart, setIsCartOpen } = useApp();

  const savedArtworks = artworks.filter((a) => wishlist.includes(a.id));

  return (
    <div className={styles.page}>
      <title>Saved Wishlist — ArtBox Marketplace</title>
      <meta name="description" content="Your saved artwork masterpieces and favorite curations." />

      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/marketplace" className={styles.backLink}>
            <ArrowLeft size={16} /> Back to Marketplace
          </Link>
          <div className={styles.titleRow}>
            <Heart size={28} className={styles.heartIcon} fill="var(--accent-primary)" />
            <h1 className={styles.title}>Your Saved Wishlist ({savedArtworks.length})</h1>
          </div>
        </div>

        {savedArtworks.length === 0 ? (
          <div className={styles.emptyCard}>
            <Heart size={48} className={styles.emptyIcon} />
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite artwork masterpieces from the marketplace to keep track of prices and editions.</p>
            <Link href="/marketplace" className={styles.shopBtn}>
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {savedArtworks.map((art) => (
              <div key={art.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img src={art.image} alt={art.title} className={styles.artImg} />
                  <button
                    onClick={() => toggleWishlist(art.id)}
                    className={styles.removeWishlistBtn}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className={styles.cardBody}>
                  <span className={styles.artist}>{art.artist}</span>
                  <h3 className={styles.artTitle}>{art.title}</h3>

                  <div className={styles.priceRow}>
                    <div>
                      <span className={styles.priceLabel}>Physical:</span>
                      <span className={styles.priceVal}>${art.pricePhysical?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className={styles.priceLabel}>Digital:</span>
                      <span className={styles.priceValDigital}>${art.priceDigital?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button
                      onClick={() => {
                        addToCart(art.id, 'physical');
                        setIsCartOpen(true);
                      }}
                      className={styles.addCartBtn}
                    >
                      <Package size={14} /> Add Physical
                    </button>

                    <button
                      onClick={() => {
                        addToCart(art.id, 'digital');
                        setIsCartOpen(true);
                      }}
                      className={styles.addDigitalBtn}
                    >
                      <Download size={14} /> Add Digital
                    </button>
                  </div>

                  <Link href={`/art/${art.id}`} className={styles.detailLink}>
                    View Artwork Details & Critiques &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
