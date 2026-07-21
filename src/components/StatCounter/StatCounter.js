'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './StatCounter.module.css';

function Counter({ target, suffix = '', decimals = 0, duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(parseFloat((eased * target).toFixed(decimals)));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, decimals]);

  return (
    <span ref={ref}>
      {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
      {suffix}
    </span>
  );
}

export default function StatCounter({ stats }) {
  const items = [
    { label: 'Artworks', value: stats?.totalArtworks || 12, suffix: '+', icon: '🖼️' },
    { label: 'Reviews Written', value: stats?.totalReviews || 36, suffix: '+', icon: '✍️' },
    { label: 'Avg Rating', value: stats?.avgRating || 4.6, suffix: '', decimals: 1, icon: '⭐' },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {items.map((item, i) => (
          <div key={item.label} className={styles.stat} style={{ animationDelay: `${i * 0.15}s` }}>
            <div className={styles.icon}>{item.icon}</div>
            <div className={styles.number}>
              <Counter target={item.value} suffix={item.suffix} decimals={item.decimals || 0} />
            </div>
            <div className={styles.label}>{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
