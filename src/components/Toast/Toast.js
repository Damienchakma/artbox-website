'use client';

import React from 'react';
import styles from './Toast.module.css';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ICONS = {
  success: <CheckCircle size={20} />,
  error: <AlertCircle size={20} />,
  info: <Info size={20} />,
};

export default function Toast({ toasts = [], onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className={styles.toastRegion}
      role="alert"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className={`${styles.toast} ${styles[toast.type || 'info']}`}
        >
          <div className={styles.icon}>
            {ICONS[toast.type] || ICONS.info}
          </div>
          <div className={styles.message}>{toast.message}</div>
          <button
            className={styles.closeBtn}
            onClick={() => onRemove && onRemove(toast.id)}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
