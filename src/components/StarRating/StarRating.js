'use client';

import React, { useState } from 'react';
import styles from './StarRating.module.css';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, onRate, size = 'md', showCount = false, count = 0 }) {
  const [hoverRating, setHoverRating] = useState(0);
  const interactive = typeof onRate === 'function';

  const handleMouseEnter = (index) => {
    if (interactive) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (interactive) setHoverRating(0);
  };

  const handleClick = (index) => {
    if (interactive) onRate(index);
  };

  const sizes = {
    sm: 14,
    md: 18,
    lg: 24
  };
  const starSize = sizes[size] || sizes.md;

  return (
    <div className={`${styles.container} ${interactive ? styles.interactive : ''}`} onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = (hoverRating || rating) >= index;
        return (
          <button
            key={index}
            type="button"
            className={`${styles.starBtn} ${isFilled ? styles.filled : styles.empty}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            disabled={!interactive}
            aria-label={`Rate ${index} stars`}
          >
            <Star size={starSize} fill={isFilled ? 'currentColor' : 'none'} strokeWidth={isFilled ? 0 : 2} />
          </button>
        );
      })}
      {showCount && <span className={styles.count}>({count})</span>}
    </div>
  );
}
