'use client';

import React, { use, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import StarRating from '@/components/StarRating/StarRating';
import RatingBreakdown from '@/components/RatingBreakdown/RatingBreakdown';
import ReviewCard from '@/components/ReviewCard/ReviewCard';
import RelatedArt from '@/components/RelatedArt/RelatedArt';
import ReviewForm from './ReviewForm';
import { MapPin, Calendar, Layers, Ruler, ArrowLeft, MessageSquare } from 'lucide-react';
import styles from './ArtDetailPage.module.css';

export default function ArtDetailPage({ params }) {
  const { id } = use(params);
  const {
    artworks,
    getArtById,
    getReviewsByArt,
    getAverageRating,
    getRatingDistribution,
    toggleLike,
  } = useApp();

  const art = getArtById(id);
  if (!art) notFound();

  const reviews = getReviewsByArt(id);
  const avgRating = getAverageRating(id);
  const { distribution, total } = getRatingDistribution(id);

  // Same-movement artworks for related section
  const relatedMovement = artworks.filter((a) => a.movement === art.movement && a.id !== id);

  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' | 'write'

  return (
    <div className={styles.page}>
      <title>{`${art.title} by ${art.artist} — Reviews & Rating`}</title>
      <meta name="description" content={`Read reviews and details for ${art.title} (${art.year}), a ${art.medium} masterpiece by ${art.artist}. Share your own critique and rating.`} />
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbInner}>
          <Link href="/gallery" className={styles.back}>
            <ArrowLeft size={16} />
            Back to Gallery
          </Link>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbCurrent}>{art.title}</span>
        </div>
      </div>

      <div className={styles.container}>
        {/* ── Two-column layout ── */}
        <div className={styles.layout}>
          {/* ── Left: Artwork display ── */}
          <aside className={styles.artworkPanel}>
            <div
              className={styles.artworkDisplay}
              style={{ background: art.gradient || 'linear-gradient(135deg, #1e1e24, #3a3a42)' }}
            >
              {art.image && (
                <img
                  src={art.image}
                  alt={art.title}
                  className={styles.artworkImg}
                />
              )}
              <div className={styles.artworkLabel}>
                <span className={styles.mediumTag}>{art.medium}</span>
              </div>
            </div>

            {/* Metadata cards */}
            <div className={styles.metaGrid}>
              <div className={styles.metaCard}>
                <Calendar size={16} className={styles.metaIcon} />
                <div>
                  <div className={styles.metaLabel}>Year</div>
                  <div className={styles.metaValue}>{art.year}</div>
                </div>
              </div>
              <div className={styles.metaCard}>
                <Layers size={16} className={styles.metaIcon} />
                <div>
                  <div className={styles.metaLabel}>Movement</div>
                  <div className={styles.metaValue}>{art.movement}</div>
                </div>
              </div>
              <div className={styles.metaCard}>
                <Ruler size={16} className={styles.metaIcon} />
                <div>
                  <div className={styles.metaLabel}>Dimensions</div>
                  <div className={styles.metaValue}>{art.dimensions}</div>
                </div>
              </div>
              <div className={styles.metaCard}>
                <MapPin size={16} className={styles.metaIcon} />
                <div>
                  <div className={styles.metaLabel}>Location</div>
                  <div className={styles.metaValue}>{art.museum}</div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {art.tags?.length > 0 && (
              <div className={styles.tags}>
                {art.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>#{tag}</span>
                ))}
              </div>
            )}
          </aside>

          {/* ── Right: Info + reviews ── */}
          <section className={styles.infoPanel}>
            {/* Header */}
            <div className={styles.artHeader}>
              <div className={styles.movement}>{art.movement}</div>
              <h1 className={styles.artTitle}>{art.title}</h1>
              <p className={styles.artist}>
                by{' '}
                <Link
                  href={`/artist/${art.artist.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '4px' }}
                >
                  <strong>{art.artist}</strong>
                </Link>
              </p>
            </div>

            {/* Rating summary */}
            <div className={styles.ratingSummary}>
              <div className={styles.ratingMain}>
                <span className={styles.ratingNumber}>
                  {avgRating > 0 ? avgRating.toFixed(1) : '—'}
                </span>
                <div className={styles.ratingDetails}>
                  <StarRating rating={avgRating} size="md" />
                  <span className={styles.reviewCount}>
                    <MessageSquare size={14} /> {total} {total === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              </div>
              <div className={styles.breakdown}>
                <RatingBreakdown distribution={distribution} total={total} />
              </div>
            </div>

            <hr className={styles.divider} />

            {/* Description */}
            <div className={styles.description}>
              <h2 className={styles.sectionLabel}>About This Work</h2>
              <p className={styles.descText}>{art.description}</p>
            </div>

            <hr className={styles.divider} />

            {/* Tab switcher */}
            <div className={styles.tabs}>
              <button
                id="tab-reviews"
                className={`${styles.tab} ${activeTab === 'reviews' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({reviews.length})
              </button>
              <button
                id="tab-write"
                className={`${styles.tab} ${activeTab === 'write' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('write')}
              >
                Write a Review
              </button>
            </div>

            {/* Reviews list */}
            {activeTab === 'reviews' && (
              <div className={styles.reviewsSection}>
                {reviews.length === 0 ? (
                  <div className={styles.noReviews}>
                    <span>🎨</span>
                    <p>No reviews yet. Be the first to share your thoughts!</p>
                    <button
                      className={styles.writeFirstBtn}
                      onClick={() => setActiveTab('write')}
                    >
                      Write the first review
                    </button>
                  </div>
                ) : (
                  <div className={styles.reviewsList}>
                    {reviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        onToggleLike={toggleLike}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Write review form */}
            {activeTab === 'write' && (
              <div className={styles.writeSection}>
                <ReviewForm artId={id} />
              </div>
            )}
          </section>
        </div>

        {/* Related artworks */}
        <RelatedArt
          artworks={relatedMovement}
          currentId={id}
          getAverageRating={getAverageRating}
        />
      </div>
    </div>
  );
}
