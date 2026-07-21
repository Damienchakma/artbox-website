'use client';

import React from 'react';
import styles from './ReviewCard.module.css';
import { Heart, ThumbsUp } from 'lucide-react';
import StarRating from '../StarRating/StarRating';

const COLORS = ['#d4af37', '#8b6914', '#5a5a66', '#a09b8c', '#6b8c8c', '#8c6b6b'];

function getColor(name) {
  if (!name) return COLORS[0];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return COLORS[sum % COLORS.length];
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name[0].toUpperCase();
}

export default function ReviewCard({ review, onToggleLike }) {
  if (!review) return null;

  const formattedDate = new Date(review.date + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className={`${styles.card} ${review.isNew ? styles.newCard : ''}`} id={`review-${review.id}`}>
      {review.isNew && <span className={styles.newBadge}>Just Posted</span>}

      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <div
            className={styles.avatar}
            style={{ backgroundColor: getColor(review.author) }}
          >
            {getInitials(review.author)}
          </div>
          <div>
            <div className={styles.author}>{review.author}</div>
            <div className={styles.date}>{formattedDate}</div>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      <div className={styles.body}>
        <h4 className={styles.title}>"{review.title}"</h4>
        <p className={styles.content}>{review.body}</p>
      </div>

      <div className={styles.footer}>
        <button
          id={`like-${review.id}`}
          className={`${styles.likeBtn} ${review.liked ? styles.liked : ''}`}
          onClick={() => onToggleLike && onToggleLike(review.id)}
          aria-label={review.liked ? 'Unlike review' : 'Like review'}
        >
          <Heart
            size={15}
            fill={review.liked ? 'currentColor' : 'none'}
            strokeWidth={review.liked ? 0 : 2}
          />
          <span>{review.likes || 0} {review.liked ? 'Liked' : 'Helpful'}</span>
        </button>
      </div>
    </article>
  );
}
