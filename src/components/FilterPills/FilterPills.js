'use client';

import React from 'react';
import styles from './FilterPills.module.css';

export default function FilterPills({ movements, selected, onSelect }) {
  const all = ['All', ...movements];
  return (
    <div className={styles.pills} role="group" aria-label="Filter by art movement">
      {all.map((m) => (
        <button
          key={m}
          id={`filter-${m.toLowerCase().replace(/\s+/g, '-')}`}
          className={`${styles.pill} ${(selected === m || (m === 'All' && !selected)) ? styles.active : ''}`}
          onClick={() => onSelect(m === 'All' ? '' : m)}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
