'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import HeroSection from '@/components/HeroSection/HeroSection';
import ArtCarousel from '@/components/ArtCarousel/ArtCarousel';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { artworks, getAverageRating, getReviewsByArt } = useApp();

  // Trending / Featured artworks
  const trending = artworks.filter((a) => a.featured);

  // Genre definitions with guaranteed local artwork images
  const genres = [
    {
      name: "Impressionism",
      image: "/images/artworks/water-lilies.jpg"
    },
    {
      name: "Baroque",
      image: "/images/artworks/girl-pearl-earring.jpg"
    },
    {
      name: "Renaissance",
      image: "/images/artworks/birth-of-venus.jpg"
    },
    {
      name: "Surrealism",
      image: "/images/artworks/persistence-of-memory.jpg"
    },
    {
      name: "Abstract",
      image: "/images/artworks/great-wave.jpg"
    },
    {
      name: "Modern",
      image: "/images/artworks/nighthawks.jpg"
    }
  ];

  // Recently reviewed artworks
  const recentlyReviewed = artworks.slice(0, 4);

  return (
    <>
      <title>ArtBox — Where Art Meets Conversation</title>
      <meta name="description" content="Discover, rate, and review the world's most iconic artworks. Engage in visual critique and celebrate artistic masterpieces." />
      
      <HeroSection />

      {/* Trending Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.trendingHeader}>
            <h2 className={styles.trendingTitle}>Trending this week</h2>
            <div className={styles.trendingLine} />
          </div>
          <ArtCarousel artworks={trending} />
        </div>
      </section>

      {/* Art Marketplace Showcase */}
      <section className={styles.marketplaceShowcaseSection}>
        <div className={styles.container}>
          <div className={styles.marketHeader}>
            <div>
              <span className={styles.eyebrow}>Art Marketplace</span>
              <h2 className={styles.sectionTitle}>Acquire Fine Art & Digital Editions</h2>
              <p className={styles.marketSub}>
                Collect museum-grade physical original canvases shipped directly to your gallery or instant 8K digital master licenses.
              </p>
            </div>
            <Link href="/marketplace" className={styles.visitMarketplaceBtn}>
              Visit Marketplace &rarr;
            </Link>
          </div>

          <div className={styles.marketGrid}>
            {artworks.slice(0, 3).map((art) => (
              <div key={art.id} className={styles.marketCard}>
                <div className={styles.marketImageWrapper}>
                  <img src={art.image} alt={art.title} className={styles.marketImage} />
                  <div className={styles.marketTagRow}>
                    <span className={styles.physicalPill}>Original Canvas: ${art.pricePhysical?.toLocaleString()}</span>
                    <span className={styles.digitalPill}>Digital 8K: ${art.priceDigital?.toLocaleString()}</span>
                  </div>
                </div>

                <div className={styles.marketCardBody}>
                  <div className={styles.marketCardMeta}>
                    <span className={styles.marketArtist}>{art.artist}</span>
                    <h3 className={styles.marketArtTitle}>{art.title}</h3>
                  </div>

                  <div className={styles.marketCardActions}>
                    <Link href={`/art/${art.id}`} className={styles.detailsBtn}>
                      View Artwork Details
                    </Link>
                    <Link href={`/art/${art.id}`} className={styles.buyNowBtn}>
                      Buy Art
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Genre Grid */}

      <section className={styles.genreSection}>
        <div className={styles.container}>
          <div className={styles.centerHeader}>
            <span className={styles.eyebrow}>Categories</span>
            <h2 className={styles.sectionTitle}>Browse by Genre</h2>
          </div>
          <div className={styles.genreGrid}>
            {genres.map((genre) => (
              <Link href="/gallery" key={genre.name} className={styles.genreTile}>
                <img
                  src={genre.image}
                  alt={genre.name}
                  className={styles.genreImage}
                  loading="lazy"
                />
                <div className={styles.genreOverlay}>
                  <span className={styles.genreName}>{genre.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Artist Spotlight */}
      <section className={styles.spotlightSection}>
        {/* Blurred background image */}
        <div className={styles.spotlightBg}>
          <img
            src="/images/artworks/wanderer-above-fog.jpg"
            alt="Spotlight Background"
            className={styles.spotlightBgImage}
          />
        </div>

        <div className={styles.spotlightContainer}>
          <div className={styles.spotlightImageCol}>
            <div className={styles.spotlightBorder}>
              <img
                src="/images/artworks/wanderer-above-fog.jpg"
                alt="Alessandro Moretti"
                className={styles.spotlightImage}
              />
            </div>
          </div>
          <div className={styles.spotlightInfoCol}>
            <span className={styles.spotlightEyebrow}>Artist Spotlight</span>
            <h2 className={styles.spotlightArtistName}>Alessandro Moretti</h2>
            <p className={styles.spotlightBio}>
              A master of contemporary light theory, Moretti bridges the gap between classical chiaroscuro and digital abstraction. His latest collection explores the tactile nature of light in silent spaces.
            </p>
            <Link href="/artist/alessandro-moretti" className={styles.spotlightBtn}>
              View Artist Profile
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Reviewed Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.recentlyHeader}>
            <h2 className={styles.recentlyTitle}>Recently reviewed</h2>
            <Link href="/gallery" className={styles.browseAllLink}>
              Browse all archives
            </Link>
          </div>

          <div className={styles.recentGrid}>
            {recentlyReviewed.map((art) => {
              const reviews = getReviewsByArt(art.id);
              const rating = getAverageRating(art.id) || 4; // Fallback to 4 stars if no reviews
              const latestReview = reviews[0]?.body || `An absolute masterpiece that defines the ${art.movement} movement.`;
              const author = reviews[0]?.author || "Elena R.";

              return (
                <div key={art.id} className={styles.recentCard}>
                  <Link href={`/art/${art.id}`} className={styles.recentImageLink}>
                    <div className={styles.recentImageWrapper}>
                      <img
                        src={art.image}
                        alt={art.title}
                        className={styles.recentImage}
                        loading="lazy"
                      />
                    </div>
                  </Link>
                  <div className={styles.recentMeta}>
                    <div className={styles.recentLeft}>
                      <h4 className={styles.recentArtTitle}>{art.title}</h4>
                      <p className={styles.recentCritique}>Critique by {author}</p>
                    </div>
                    <div className={styles.recentStars}>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined"
                          style={{
                            fontVariationSettings: "'FILL' " + (i < Math.round(rating) ? "1" : "0"),
                            color: "var(--accent-primary)",
                            fontSize: "16px"
                          }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
