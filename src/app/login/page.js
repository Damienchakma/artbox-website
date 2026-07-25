'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Sparkles, Mail, Lock, ArrowRight, User, Eye, EyeOff } from 'lucide-react';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useApp();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email.trim()) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const user = loginUser(form.email, form.password);
      setIsSubmitting(false);
      if (user) {
        router.push('/');
      }
    }, 800);
  };

  return (
    <div className={styles.page}>
      <title>Sign In — ArtBox</title>

      <div className={styles.container}>
        <div className={styles.card}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.iconBadge}>
              <Sparkles size={22} className={styles.goldIcon} />
            </div>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>
              Sign in to browse, collect, and connect with the ArtBox community.
            </p>
          </div>

          {/* Login Form */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Mail size={14} /> Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Lock size={14} /> Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!form.email.trim() || isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Divider */}
          <div className={styles.divider}>
            <span className={styles.dividerText}>or</span>
          </div>

          {/* Sign Up Link */}
          <div className={styles.signupSection}>
            <User size={16} className={styles.signupIcon} />
            <span className={styles.signupText}>Don&apos;t have an account?</span>
            <Link href="/signup" className={styles.signupLink}>
              Create one here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
