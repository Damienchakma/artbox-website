'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Search, Heart, ShoppingBag, Filter, Check, ShieldCheck, Download, Package, ArrowUpDown } from 'lucide-react';
import styles from './Marketplace.module.css';

export default function MarketplacePage() {
  const { artworks, addToCart, toggleWishlist, isInWishlist } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all'); // 'all' | 'physical' | 'digital'
  const [selectedMovement, setSelectedMovement] = useState('all');
  const [priceRange, setPriceRange] = useState('all'); // 'all' | 'under2000' | '2000to3500' | 'above3500'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'title'

  // Extract unique movements
  const movements = useMemo(() => {
    const set = new Set(artworks.map((a) => a.movement));
    return Array.from(set);
  }, [artworks]);

  // Filter & Sort Logic
  const filteredArtworks = useMemo(() => {
    return artworks
      .filter((art) => {
        // Search filter
        const matchesSearch =
          art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.movement.toLowerCase().includes(searchQuery.toLowerCase());

        // Movement filter
        const matchesMovement = selectedMovement === 'all' || art.movement === selectedMovement;

        // Format filter
        let matchesFormat = true;
        if (selectedFormat === 'physical') matchesFormat = !!art.pricePhysical;
        if (selectedFormat === 'digital') matchesFormat = !!art.priceDigital;

        // Price range filter
        let matchesPrice = true;
        const p = art.pricePhysical || 0;
        if (priceRange === 'under2000') matchesPrice = p < 2000;
        if (priceRange === '2000to3500') matchesPrice = p >= 2000 && p <= 3500;
        if (priceRange === 'above3500') matchesPrice = p > 3500;

        return matchesSearch && matchesMovement && matchesFormat && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.pricePhysical || 0) - (b.pricePhysical || 0);
        if (sortBy === 'price-desc') return (b.pricePhysical || 0) - (a.pricePhysical || 0);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0; // 'featured' default
      });
  }, [artworks, searchQuery, selectedFormat, selectedMovement, priceRange, sortBy]);

  return (
    <div className={styles.page}>
      <title>ArtBox Marketplace — Fine Art Originals & Digital Editions</title>
      <meta
        name="description"
        content="Acquire museum-grade original canvas paintings or authentic 8K digital master licenses directly from renowned artists and curations."
      />

      {/* Hero Header */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <span className={styles.eyebrow}>The Art Marketplace</span>
          <h1 className={styles.heroTitle}>Acquire Iconic Masterpieces</h1>
          <p className={styles.heroSub}>
            Discover museum-grade physical original works shipped directly with white-glove security, or secure high-resolution 8K digital master licenses.
          </p>

          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <Package size={20} className={styles.statIcon} />
              <div>
                <strong>Physical Originals</strong>
                <span>White-Glove Insured Delivery</span>
              </div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <Download size={20} className={styles.statIcon} />
              <div>
                <strong>Digital Masters</strong>
                <span>Instant 8K Downloads & Provenance Token</span>
              </div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <ShieldCheck size={20} className={styles.statIcon} />
              <div>
                <strong>Authenticated</strong>
                <span>Includes Certificate of Authenticity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* Filter Controls Bar */}
        <div className={styles.filterBar}>
          {/* Search Box */}
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by title, artist, or movement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Format Tabs */}
          <div className={styles.formatTabs}>
            <button
              className={`${styles.formatTab} ${selectedFormat === 'all' ? styles.activeTab : ''}`}
              onClick={() => setSelectedFormat('all')}
            >
              All Formats
            </button>
            <button
              className={`${styles.formatTab} ${selectedFormat === 'physical' ? styles.activeTab : ''}`}
              onClick={() => setSelectedFormat('physical')}
            >
              <Package size={14} /> Physical Originals
            </button>
            <button
              className={`${styles.formatTab} ${selectedFormat === 'digital' ? styles.activeTab : ''}`}
              onClick={() => setSelectedFormat('digital')}
            >
              <Download size={14} /> Digital 8K
            </button>
          </div>

          {/* Dropdown Filters & Sorting */}
          <div className={styles.dropdownFilters}>
            <select
              value={selectedMovement}
              onChange={(e) => setSelectedMovement(e.target.value)}
              className={styles.selectFilter}
            >
              <option value="all">All Movements</option>
              {movements.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className={styles.selectFilter}
            >
              <option value="all">All Prices</option>
              <option value="under2000">Under $2,000</option>
              <option value="2000to3500">$2,000 - $3,500</option>
              <option value="above3500">Above $3,500</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.selectFilter}
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className={styles.resultsMeta}>
          <span>Showing {filteredArtworks.length} available artwork collections</span>
        </div>

        {/* Artworks Grid */}
        {filteredArtworks.length === 0 ? (
          <div className={styles.noResults}>
            <span>🎨</span>
            <h3>No artworks found matching your filter criteria.</h3>
            <p>Try clearing filters or searching for another artist or term.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFormat('all');
                setSelectedMovement('all');
                setPriceRange('all');
              }}
              className={styles.resetBtn}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={styles.artGrid}>
            {filteredArtworks.map((art) => {
              const inWishlist = isInWishlist(art.id);
              return (
                <div key={art.id} className={styles.artCard}>
                  <div className={styles.imageContainer}>
                    <img src={art.image} alt={art.title} className={styles.artImg} />

                    {/* Top action overlay buttons */}
                    <button
                      className={`${styles.wishlistBtn} ${inWishlist ? styles.wishlisted : ''}`}
                      onClick={() => toggleWishlist(art.id)}
                      title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart size={18} fill={inWishlist ? 'var(--accent-primary)' : 'none'} />
                    </button>

                    <div className={styles.movementBadge}>{art.movement}</div>
                  </div>

                  <div className={styles.cardContent}>
                    <div className={styles.titleRow}>
                      <span className={styles.artistName}>{art.artist}</span>
                      <h3 className={styles.artTitle}>{art.title}</h3>
                    </div>

                    {/* Dual Purchase Specs */}
                    <div className={styles.purchaseBox}>
                      {/* Physical Option */}
                      <div className={styles.optionRow}>
                        <div className={styles.optionMeta}>
                          <span className={styles.optionLabel}>
                            <Package size={14} /> Physical Original
                          </span>
                          <span className={styles.stockText}>
                            {art.physicalStock > 0 ? `${art.physicalStock} available` : 'In Vault'}
                          </span>
                        </div>
                        <div className={styles.optionPriceGroup}>
                          <span className={styles.priceTag}>
                            ${art.pricePhysical?.toLocaleString()}
                          </span>
                          <button
                            onClick={() => addToCart(art.id, 'physical')}
                            className={styles.addCartSmBtn}
                            title="Add Physical Original to Cart"
                          >
                            + Cart
                          </button>
                        </div>
                      </div>

                      <div className={styles.optionDivider} />

                      {/* Digital Option */}
                      <div className={styles.optionRow}>
                        <div className={styles.optionMeta}>
                          <span className={styles.optionLabel}>
                            <Download size={14} /> Digital 8K Master
                          </span>
                          <span className={styles.licenseText}>Instant License</span>
                        </div>
                        <div className={styles.optionPriceGroup}>
                          <span className={styles.priceTagDigital}>
                            ${art.priceDigital?.toLocaleString()}
                          </span>
                          <button
                            onClick={() => addToCart(art.id, 'digital')}
                            className={styles.addDigitalSmBtn}
                            title="Add Digital License to Cart"
                          >
                            + Cart
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <Link href={`/art/${art.id}`} className={styles.detailLink}>
                        View Details & Critiques &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
