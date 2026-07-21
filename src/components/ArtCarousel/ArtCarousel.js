'use client';

import React from 'react';
import ArtCard from '../ArtCard/ArtCard';
import styles from './ArtCarousel.module.css';

export default function ArtCarousel({ artworks = [] }) {
  if (!artworks || artworks.length === 0) return null;

  // Duplicate items twice to create a seamless infinite loop animation
  const rollingItems = [...artworks, ...artworks, ...artworks];

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.marqueeTrack}>
        {rollingItems.map((art, index) => (
          <div key={`${art.id}-${index}`} className={styles.cardItem}>
            <ArtCard art={art} />
          </div>
        ))}
      </div>
    </div>
  );
}
