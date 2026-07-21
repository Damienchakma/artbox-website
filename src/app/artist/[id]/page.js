'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { getArtistById } from '@/data/artists';
import ArtCard from '@/components/ArtCard/ArtCard';
import StarRating from '@/components/StarRating/StarRating';
import { CheckCircle2, Share2, Heart, ArrowLeft } from 'lucide-react';
import styles from './ArtistProfilePage.module.css';

export default function ArtistProfilePage({ params }) {
  const { id } = use(params);
  const artist = getArtistById(id);
  const { artworks, getAverageRating, addToast } = useApp();
  const [isFollowing, setIsFollowing] = useState(false);

  // Get artworks by this artist or matching movement
  const artistArtworks = artworks.filter(
    (a) =>
      a.artist.toLowerCase().includes(artist.name.toLowerCase()) ||
      artist.name.toLowerCase().includes(a.artist.toLowerCase())
  );
  
  // Fallback to related movement artworks if specific artist has few items
  const displayArtworks = artistArtworks.length > 0
    ? artistArtworks
    : artworks.slice(0, 6);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    addToast(isFollowing ? `Unfollowed ${artist.name}` : `Following ${artist.name}!`, "success");
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast("Profile link copied to clipboard!", "success");
    }
  };

  return (
    <div className={styles.page}>
      <title>{`${artist.name} — Artist Profile & Gallery | ArtBox`}</title>
      <meta name="description" content={`Explore the artist profile, bio, and masterpiece collection of ${artist.name}. Read reviews and ratings.`} />

      {/* Hero Banner */}
      <section className={styles.bannerSection}>
        <div className={styles.bannerBg}>
          <img src={artist.cover} alt={artist.name} className={styles.bannerImg} />
          <div className={styles.bannerOverlay} />
        </div>

        {/* Back Link */}
        <div className={styles.backWrapper}>
          <Link href="/gallery" className={styles.backBtn}>
            <ArrowLeft size={16} />
            Back to Gallery
          </Link>
        </div>

        {/* Profile Avatar & Identity */}
        <div className={styles.identityContainer}>
          <div className={styles.avatarRing}>
            <img src={artist.avatar} alt={artist.name} className={styles.avatarImg} />
          </div>
          <h1 className={styles.artistName}>{artist.name}</h1>
          <p className={styles.artistHandle}>{artist.handle}</p>
          {artist.verified && (
            <div className={styles.verifiedBadge}>
              <CheckCircle2 size={14} />
              <span>Verified Artist</span>
            </div>
          )}
        </div>
      </section>

      {/* Stats & Actions */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statValue}>{artist.followers}</span>
              <span className={styles.statLabel}>Followers</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statValue}>{displayArtworks.length}</span>
              <span className={styles.statLabel}>Artworks</span>
            </div>
            <div className={styles.statBox}>
              <div className={styles.ratingValRow}>
                <span className={styles.statValue}>{artist.avgRating}</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: "var(--accent-primary)", fontSize: "18px" }}>star</span>
              </div>
              <span className={styles.statLabel}>Avg Rating</span>
            </div>
          </div>

          <div className={styles.actionRow}>
            <button
              className={`${styles.followBtn} ${isFollowing ? styles.following : ''}`}
              onClick={handleFollow}
            >
              {isFollowing ? 'Following' : 'Follow Artist'}
            </button>
            <button className={styles.shareBtn} onClick={handleShare}>
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </section>

      {/* Bio & About Section */}
      <section className={styles.bioSection}>
        <div className={styles.bioContainer}>
          <h2 className={styles.aboutHeader}>
            <span className={styles.aboutLine} />
            About
          </h2>
          <p className={styles.bioText}>"{artist.bio}"</p>
          <div className={styles.tagList}>
            {artist.tags.map((tag) => (
              <span key={tag} className={styles.tagPill}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className={styles.gallerySection}>
        <div className={styles.galleryContainer}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Portfolio</span>
            <h2 className={styles.galleryTitle}>Featured Artworks ({displayArtworks.length})</h2>
          </div>

          <div className={styles.artGrid}>
            {displayArtworks.map((art) => (
              <div key={art.id} className={styles.artCardItem}>
                <ArtCard art={art} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
