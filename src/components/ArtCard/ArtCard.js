'use client';

import React from 'react';
import Link from 'next/link';
import styles from './ArtCard.module.css';

export default function ArtCard({ art }) {
  if (!art) return null;

  const artistSlug = art.artist
    ? art.artist.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'alessandro-moretti';

  return (
    <div className={styles.card} id={`art-card-${art.id}`}>
      <Link href={`/art/${art.id}`} className={styles.imageWrapper}>
        {art.image ? (
          <img
            src={art.image}
            alt={art.title}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div
            className={styles.placeholder}
            style={{ background: art.gradient || 'linear-gradient(135deg, #1e1e24, #3a3a42)' }}
          />
        )}
      </Link>
      <div className={styles.metadata}>
        <h3 className={styles.title}>
          <Link href={`/art/${art.id}`} className={styles.titleLink}>
            {art.title}
          </Link>
        </h3>
        <p className={styles.artist}>
          <Link href={`/artist/${artistSlug}`} className={styles.artistLink}>
            {art.artist}
          </Link>
        </p>
      </div>
    </div>
  );
}
