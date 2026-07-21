'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import staticArtists from '@/data/artists';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import styles from './ArtistsPage.module.css';

export default function ArtistsPage() {
  const { customArtists } = useApp();

  // Combine custom user artists and static catalog artists without duplicates
  const allArtists = [
    ...customArtists,
    ...staticArtists.filter((s) => !customArtists.some((c) => c.id === s.id)),
  ];

  return (
    <div className={styles.page}>
      <title>Explore Featured Artists — ArtBox</title>
      <meta name="description" content="Discover legendary master painters and contemporary artists on ArtBox. Browse profiles, bios, and masterpiece collections." />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.eyebrow}>The Creators</span>
          <h1 className={styles.title}>Featured Artists</h1>
          <p className={styles.subtitle}>
            Explore the masters who shaped visual history from Renaissance to Contemporary Noir Expressionism.
          </p>
          <div className={styles.headerCta}>
            <Link href="/signup" className={styles.joinBtn}>
              Join as Artist
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.artistGrid}>
          {allArtists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artist/${artist.id}`}
              className={styles.artistCard}
            >
              <div className={styles.cardCoverWrapper}>
                <img
                  src={artist.cover}
                  alt={artist.name}
                  className={styles.cardCover}
                  loading="lazy"
                />
                <div className={styles.cardOverlay} />
              </div>

              <div className={styles.cardBody}>
                <div className={styles.avatarRing}>
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className={styles.avatarImg}
                  />
                </div>

                <div className={styles.cardInfo}>
                  <div className={styles.nameRow}>
                    <h3 className={styles.artistName}>{artist.name}</h3>
                    {artist.verified && (
                      <CheckCircle2 size={16} className={styles.verifiedIcon} />
                    )}
                  </div>
                  <span className={styles.movementTag}>{artist.movement}</span>
                  <p className={styles.bioSnippet}>{artist.bio}</p>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.statItem}>
                    <span className={styles.statVal}>{artist.followers}</span>
                    <span className={styles.statLbl}>Followers</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statVal}>{artist.avgRating} ★</span>
                    <span className={styles.statLbl}>Rating</span>
                  </div>
                  <div className={styles.profileBtn}>
                    <span>View Profile</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
