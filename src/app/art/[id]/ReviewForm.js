'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import StarRating from '@/components/StarRating/StarRating';
import styles from './ReviewForm.module.css';

export default function ReviewForm({ artId }) {
  const { addReview } = useApp();
  const [form, setForm] = useState({ author: '', title: '', body: '', rating: 0 });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.rating) errs.rating = 'Please select a star rating';
    if (!form.title.trim()) errs.title = 'Review title is required';
    if (form.body.trim().length < 20) errs.body = 'Review must be at least 20 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    // Simulate async
    await new Promise((r) => setTimeout(r, 600));
    addReview(artId, {
      author: form.author.trim() || 'Anonymous',
      title: form.title.trim(),
      body: form.body.trim(),
      rating: form.rating,
    });
    setForm({ author: '', title: '', body: '', rating: 0 });
    setErrors({});
    setSubmitting(false);
  };

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.formTitle}>Write a Review</h3>
      <form id="review-form" onSubmit={handleSubmit} noValidate className={styles.form}>
        {/* Rating */}
        <div className={styles.field}>
          <label className={styles.label}>Your Rating <span className={styles.required}>*</span></label>
          <div className={styles.ratingRow}>
            <StarRating
              rating={form.rating}
              size="lg"
              onRate={(r) => {
                setForm((f) => ({ ...f, rating: r }));
                if (errors.rating) setErrors((prev) => ({ ...prev, rating: '' }));
              }}
            />
            {form.rating > 0 && (
              <span className={styles.ratingLabel}>
                {['', 'Poor', 'Fair', 'Good', 'Great', 'Masterpiece'][form.rating]}
              </span>
            )}
          </div>
          {errors.rating && <span className={styles.error}>{errors.rating}</span>}
        </div>

        {/* Author */}
        <div className={styles.field}>
          <label htmlFor="review-author" className={styles.label}>Your Name</label>
          <input
            id="review-author"
            type="text"
            className={styles.input}
            value={form.author}
            onChange={update('author')}
            placeholder="Anonymous"
            maxLength={60}
          />
        </div>

        {/* Title */}
        <div className={styles.field}>
          <label htmlFor="review-title" className={styles.label}>
            Review Title <span className={styles.required}>*</span>
          </label>
          <input
            id="review-title"
            type="text"
            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
            value={form.title}
            onChange={update('title')}
            placeholder="Summarize your thoughts in a headline…"
            maxLength={120}
          />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </div>

        {/* Body */}
        <div className={styles.field}>
          <label htmlFor="review-body" className={styles.label}>
            Your Review <span className={styles.required}>*</span>
          </label>
          <textarea
            id="review-body"
            className={`${styles.textarea} ${errors.body ? styles.inputError : ''}`}
            value={form.body}
            onChange={update('body')}
            placeholder="Share your thoughts, feelings, and analysis of this artwork…"
            rows={5}
            maxLength={2000}
          />
          <div className={styles.charCount}>
            <span className={form.body.length < 20 ? styles.charCountWarn : styles.charCountOk}>
              {form.body.length}
            </span>
            /2000 {form.body.length < 20 && `(${20 - form.body.length} more to go)`}
          </div>
          {errors.body && <span className={styles.error}>{errors.body}</span>}
        </div>

        <button
          id="submit-review"
          type="submit"
          className={`${styles.submitBtn} ${submitting ? styles.loading : ''}`}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className={styles.spinner} />
              Submitting…
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </div>
  );
}
