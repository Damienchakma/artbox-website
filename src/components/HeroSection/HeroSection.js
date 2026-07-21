'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className={styles.hero}>
      {/* Full bleed image background with overlay */}
      <div className={styles.bgWrapper}>
        <img
          src="/images/hero-bg.png"
          alt="Art Gallery Ambient Background"
          className={styles.bgImage}
        />
        <div className={styles.bgOverlay} />
      </div>

      {/* Editorial Content */}
      <div className={`${styles.content} ${mounted ? styles.visible : ''}`}>
        <h1 className={styles.headline}>ArtBox</h1>

        <p className={styles.subtitle}>
          The Digital Curator. A sanctuary for the world's most profound masterpieces,
          meticulously archived for the modern connoisseur.
        </p>

        <div className={styles.actions}>
          <Link href="/gallery" id="hero-explore-btn" className={styles.primaryBtn}>
            Explore Arts
          </Link>
          <Link href="/about" id="hero-review-btn" className={styles.secondaryBtn}>
            Join as Artist
          </Link>
        </div>
      </div>
    </section>
  );
}
