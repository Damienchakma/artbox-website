'use client';

import React from 'react';
import Link from 'next/link';
import StarRating from '../StarRating/StarRating';
import styles from './RelatedArt.module.css';

export default function RelatedArt({ artworks = [], currentId, getAverageRating }) {
  const related = artworks
    .filter((a) => a.id !== currentId)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Related Works</h2>
      <div className={styles.grid}>
        {related.map((art) => {
          const avg = getAverageRating ? getAverageRating(art.id) : 0;
          return (
            <Link key={art.id} href={`/art/${art.id}`} className={styles.card}>
              <div
                className={styles.artwork}
                style={{ background: art.gradient || 'linear-gradient(135deg, #1e1e24, #3a3a42)' }}
              />
              <div className={styles.info}>
                <span className={styles.movement}>{art.movement}</span>
                <h4 className={styles.title}>{art.title}</h4>
                <p className={styles.artist}>{art.artist}</p>
                <StarRating rating={avg} size="sm" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
