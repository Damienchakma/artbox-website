'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Upload, Sparkles, CheckCircle, ArrowRight, ArrowLeft, Image as ImageIcon, User, Palette, Mail, Lock } from 'lucide-react';
import styles from './SignupPage.module.css';

export default function SignupPage() {
  const router = useRouter();
  const { createArtistAccount, createUserAccount } = useApp();

  const [role, setRole] = useState(null); // null | 'artist' | 'user'
  const [step, setStep] = useState(0); // 0: Role, 1: Info, 2: Avatars, 3: Artwork, 4: Launching
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    email: '',
    password: '',
    movement: 'Contemporary Expressionism',
    bio: '',
    location: '',
    avatar: '',
    cover: '/images/hero-bg.jpg',
    // Artwork details
    artTitle: '',
    artMedium: 'Oil on Canvas',
    artYear: new Date().getFullYear(),
    artDimensions: '60 cm × 80 cm',
    artDescription: '',
    artImage: '/images/artworks/great-wave.jpg',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image Upload Handlers with File Reader Data URLs
  const handleImageUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData((prev) => ({
          ...prev,
          [field]: uploadEvent.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'user') {
      // User flow is just one step
      setStep(1);
    } else {
      setStep(1);
    }
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      createUserAccount({
        name: formData.name || 'ArtBox User',
        email: formData.email,
        password: formData.password,
      });
      router.push('/');
    }, 1200);
  };

  const handleArtistSubmit = (e) => {
    e.preventDefault();
    setStep(4);
    setIsSubmitting(true);

    setTimeout(() => {
      const artistData = {
        name: formData.name || 'New Creator',
        handle: formData.handle ? `@${formData.handle.replace('@', '')}` : `@${(formData.name || 'artist').toLowerCase().replace(/\s+/g, '_')}`,
        email: formData.email,
        movement: formData.movement,
        bio: formData.bio || 'Passionate artist sharing original masterworks on ArtBox.',
        location: formData.location || 'International Studio',
        avatar: formData.avatar,
        cover: formData.cover,
      };

      const artworkData = formData.artTitle
        ? {
            title: formData.artTitle,
            medium: formData.artMedium,
            dimensions: formData.artDimensions,
            year: formData.artYear,
            movement: formData.movement,
            description: formData.artDescription || 'An original masterpiece uploaded by the artist.',
            image: formData.artImage,
          }
        : null;

      const created = createArtistAccount(artistData, artworkData);
      router.push(`/artist/${created.id}`);
    }, 1800);
  };

  const title = role === 'user' ? 'Create Your Account' : role === 'artist' ? 'Join as Artist' : 'Join ArtBox';
  const subtitle = role === 'user'
    ? 'Create an account to browse, collect, review, and connect with artists.'
    : role === 'artist'
    ? 'Create your curated artist profile and showcase your masterworks to the ArtBox community.'
    : 'Choose how you want to experience ArtBox.';

  return (
    <div className={styles.page}>
      <title>{title} — ArtBox</title>

      <div className={styles.container}>
        <div className={styles.card}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.iconBadge}>
              <Sparkles size={22} className={styles.goldIcon} />
            </div>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>

            {/* Step Indicators (only for artist flow) */}
            {role === 'artist' && step > 0 && step < 4 && (
              <div className={styles.stepIndicator}>
                <div className={`${styles.stepDot} ${step >= 1 ? styles.activeDot : ''}`}>1</div>
                <div className={styles.stepLine} />
                <div className={`${styles.stepDot} ${step >= 2 ? styles.activeDot : ''}`}>2</div>
                <div className={styles.stepLine} />
                <div className={`${styles.stepDot} ${step >= 3 ? styles.activeDot : ''}`}>3</div>
              </div>
            )}
          </div>

          {/* Step 0: Role Selection */}
          {step === 0 && (
            <div className={styles.formStep}>
              <h2 className={styles.stepTitle}>I want to join as...</h2>
              <div className={styles.roleGrid}>
                <button
                  type="button"
                  className={styles.roleCard}
                  onClick={() => handleSelectRole('artist')}
                >
                  <div className={styles.roleIcon}>
                    <Palette size={32} />
                  </div>
                  <h3 className={styles.roleTitle}>Artist</h3>
                  <p className={styles.roleDesc}>
                    Showcase your portfolio, sell original & digital artwork, and connect with collectors.
                  </p>
                </button>

                <button
                  type="button"
                  className={styles.roleCard}
                  onClick={() => handleSelectRole('user')}
                >
                  <div className={styles.roleIcon}>
                    <User size={32} />
                  </div>
                  <h3 className={styles.roleTitle}>Art Enthusiast</h3>
                  <p className={styles.roleDesc}>
                    Browse the gallery, collect masterpieces, leave reviews, and chat with artists.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* User Flow: Single Step Signup */}
          {step === 1 && role === 'user' && (
            <form className={styles.formStep} onSubmit={handleUserSubmit}>
              <h2 className={styles.stepTitle}>Account Details</h2>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Jane Collector"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Mail size={14} /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Lock size={14} /> Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.btnRow}>
                <button type="button" className={styles.backStepBtn} onClick={() => { setRole(null); setStep(0); }}>
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button type="submit" className={styles.finishBtn} disabled={!formData.name || isSubmitting}>
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  <CheckCircle size={16} />
                </button>
              </div>
            </form>
          )}

          {/* Artist Flow: Step 1 — Artist Credentials */}
          {step === 1 && role === 'artist' && (
            <form className={styles.formStep} onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <h2 className={styles.stepTitle}>1. Artist Profile Information</h2>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name / Artist Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Julian Thorne"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.gridRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Username / Handle</label>
                  <input
                    type="text"
                    name="handle"
                    placeholder="e.g. julian_thorne"
                    value={formData.handle}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Primary Style / Movement</label>
                  <select
                    name="movement"
                    value={formData.movement}
                    onChange={handleChange}
                    className={styles.input}
                  >
                    <option value="Noir Expressionism">Noir Expressionism</option>
                    <option value="Impressionism">Impressionism</option>
                    <option value="Baroque">Baroque</option>
                    <option value="Surrealism">Surrealism</option>
                    <option value="Contemporary Realism">Contemporary Realism</option>
                    <option value="Abstract">Abstract</option>
                  </select>
                </div>
              </div>

              <div className={styles.gridRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="artist@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Artist Bio / Statement</label>
                <textarea
                  name="bio"
                  rows={3}
                  placeholder="Describe your artistic philosophy and vision..."
                  value={formData.bio}
                  onChange={handleChange}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.btnRow}>
                <button type="button" className={styles.backStepBtn} onClick={() => { setRole(null); setStep(0); }}>
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button type="submit" className={styles.nextBtn} disabled={!formData.name}>
                  Next: Profile Imagery
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Custom Avatar & Cover Image */}
          {step === 2 && (
            <form className={styles.formStep} onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
              <h2 className={styles.stepTitle}>2. Upload Profile & Banner Imagery</h2>

              <div className={styles.uploadBoxGroup}>
                {/* Profile Avatar */}
                <div className={styles.uploadItem}>
                  <label className={styles.label}>Profile Avatar Picture</label>
                  <div className={styles.previewAvatarRing}>
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Avatar Preview" className={styles.previewAvatarImg} />
                    ) : (
                      <div className={styles.previewAvatarImg} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.08)' }}>
                        <User size={40} style={{ opacity: 0.4, color: '#ccc' }} />
                      </div>
                    )}
                  </div>
                  <label className={styles.uploadFileBtn}>
                    <Upload size={14} />
                    Choose Custom Avatar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'avatar')}
                      className={styles.fileInput}
                    />
                  </label>
                </div>

                {/* Banner Cover */}
                <div className={styles.uploadItem}>
                  <label className={styles.label}>Gallery Banner Cover</label>
                  <div className={styles.previewCoverBox}>
                    <img src={formData.cover} alt="Cover Preview" className={styles.previewCoverImg} />
                  </div>
                  <label className={styles.uploadFileBtn}>
                    <Upload size={14} />
                    Choose Custom Banner
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'cover')}
                      className={styles.fileInput}
                    />
                  </label>
                </div>
              </div>

              <div className={styles.btnRow}>
                <button type="button" className={styles.backStepBtn} onClick={() => setStep(1)}>
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button type="submit" className={styles.nextBtn}>
                  Next: Add First Artwork
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: First Artwork Submission */}
          {step === 3 && (
            <form className={styles.formStep} onSubmit={handleArtistSubmit}>
              <h2 className={styles.stepTitle}>3. Submit Your First Masterpiece</h2>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Artwork Title *</label>
                <input
                  type="text"
                  name="artTitle"
                  required
                  placeholder="e.g. Midnight Symphony"
                  value={formData.artTitle}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.gridRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Medium</label>
                  <input
                    type="text"
                    name="artMedium"
                    placeholder="e.g. Oil on Linen"
                    value={formData.artMedium}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Year Created</label>
                  <input
                    type="number"
                    name="artYear"
                    value={formData.artYear}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Artwork Image File Upload */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Artwork Image File *</label>
                <div className={styles.artPreviewBox}>
                  <img src={formData.artImage} alt="Artwork Preview" className={styles.artPreviewImg} />
                </div>
                <label className={styles.uploadFileBtn}>
                  <ImageIcon size={14} />
                  Upload Painting File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'artImage')}
                    className={styles.fileInput}
                  />
                </label>
              </div>

              <div className={styles.btnRow}>
                <button type="button" className={styles.backStepBtn} onClick={() => setStep(2)}>
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button type="submit" className={styles.finishBtn} disabled={!formData.artTitle}>
                  Publish Profile & Artwork
                  <CheckCircle size={16} />
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Animated Launching Profile State (artist only) */}
          {step === 4 && (
            <div className={styles.launchingState}>
              <div className={styles.spinnerRing} />
              <h2 className={styles.launchingTitle}>Publishing Artist Profile...</h2>
              <p className={styles.launchingSub}>
                Archiving masterpiece imagery and issuing your Verified Artist badge.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
