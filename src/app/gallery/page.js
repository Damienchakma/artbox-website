'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import ArtCard from '@/components/ArtCard/ArtCard';
import SearchBar from '@/components/SearchBar/SearchBar';
import FilterPills from '@/components/FilterPills/FilterPills';
import styles from './GalleryPage.module.css';
import { SlidersHorizontal } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Most Reviewed', value: 'reviews' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Alphabetical', value: 'alpha' },
  { label: 'Newest First', value: 'year' },
];

export default function GalleryPage() {
  const { artworks, getAverageRating, getReviewsByArt } = useApp();
  const [query, setQuery] = useState('');
  const [movement, setMovement] = useState('');
  const [sort, setSort] = useState('reviews');

  const movements = useMemo(
    () => [...new Set(artworks.map((a) => a.movement))].sort(),
    [artworks]
  );

  const filtered = useMemo(() => {
    let list = artworks;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.artist.toLowerCase().includes(q) ||
          a.movement.toLowerCase().includes(q) ||
          a.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (movement) list = list.filter((a) => a.movement === movement);

    return [...list].sort((a, b) => {
      if (sort === 'alpha') return a.title.localeCompare(b.title);
      if (sort === 'year') return b.year - a.year;
      if (sort === 'rating') return getAverageRating(b.id) - getAverageRating(a.id);
      // reviews (default)
      return getReviewsByArt(b.id).length - getReviewsByArt(a.id).length;
    });
  }, [artworks, query, movement, sort, getAverageRating, getReviewsByArt]);

  return (
    <div className={styles.page}>
      <title>Explore Masterpieces — ArtBox Gallery</title>
      <meta name="description" content="Browse our extensive collection of history-defining artworks. Search by artist, title, or movement, and view user reviews." />
      {/* Page header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerText}>
            <div className={styles.eyebrow}>The Collection</div>
            <h1 className={styles.title}>Art Gallery</h1>
            <p className={styles.subtitle}>
              {artworks.length} iconic works spanning centuries of human creativity
            </p>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.toolbar}>
          <SearchBar value={query} onChange={setQuery} />
          <div className={styles.sortRow}>
            <SlidersHorizontal size={16} className={styles.sortIcon} />
            <select
              id="gallery-sort"
              className={styles.sortSelect}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort artworks"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.filterRow}>
          <FilterPills
            movements={movements}
            selected={movement}
            onSelect={setMovement}
          />
        </div>

        {/* Results count */}
        <div className={styles.resultsBar}>
          <span className={styles.resultCount}>
            {filtered.length === artworks.length
              ? `All ${filtered.length} artworks`
              : `${filtered.length} of ${artworks.length} artworks`}
          </span>
          {(query || movement) && (
            <button
              id="clear-filters"
              className={styles.clearFilters}
              onClick={() => { setQuery(''); setMovement(''); }}
            >
              Clear filters
            </button>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((art, i) => (
              <div key={art.id} style={{ animationDelay: `${i * 0.04}s` }}>
                <ArtCard
                  art={art}
                  averageRating={getAverageRating(art.id)}
                  reviewCount={getReviewsByArt(art.id).length}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🔍</span>
            <h3>No artworks found</h3>
            <p>Try adjusting your search or filters</p>
            <button
              className={styles.clearFilters}
              onClick={() => { setQuery(''); setMovement(''); }}
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
