'use client';

import React, { useEffect, useRef } from 'react';
import styles from './RatingBreakdown.module.css';

export default function RatingBreakdown({ distribution = {}, total = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ref.current?.querySelectorAll('[data-width]').forEach((bar) => {
            bar.style.width = bar.dataset.width;
          });
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.container} ref={ref}>
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[star] || 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={star} className={styles.row}>
            <span className={styles.label}>
              {star}★
            </span>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: 0 }}
                data-width={`${pct}%`}
              />
            </div>
            <span className={styles.count}>{count}</span>
          </div>
        );
      })}
    </div>
  );
}
