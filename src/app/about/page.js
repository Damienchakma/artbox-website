'use client';

import React from 'react';
import Link from 'next/link';
import styles from './AboutPage.module.css';
import { Palette, Compass, MessageSquare, Award } from 'lucide-react';

export default function AboutPage() {
  const steps = [
    {
      icon: <Compass size={32} />,
      title: 'Discover Art',
      desc: 'Explore our curated galleries featuring history-defining masterpieces across movements from Baroque to Surrealism.',
    },
    {
      icon: <MessageSquare size={32} />,
      title: 'Share Reviews',
      desc: 'Write descriptive and critical reviews, assign star ratings, and engage in thoughtful artistic discussion.',
    },
    {
      icon: <Award size={32} />,
      title: 'Build Community',
      desc: 'Connect with fellow art lovers, like reviews, and discover new interpretations of your favorite works.',
    },
  ];

  return (
    <div className={styles.page}>
      <title>About ArtBox — Democratizing Art Criticism</title>
      <meta name="description" content="Learn about our mission to bring subjective and critical art appreciation to everyone. Read how to browse, critique, and rate visual art." />
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.eyebrow}>Our Mission</div>
          <h1 className={styles.title}>About ArtBox</h1>
          <p className={styles.subtitle}>
            A space dedicated to the appreciation, discussion, and critique of visual masterpieces.
          </p>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.introSection}>
          <div className={styles.introText}>
            <h2>Democratizing Art Criticism</h2>
            <p>
              ArtBox is an art review platform inspired by cinematic and literary review sites. We believe that art appreciation shouldn't be locked behind academic jargon or gallery doors. Whether you are an art historian, a student, or someone who simply enjoys visiting museums, ArtBox is a dedicated home for your perspective.
            </p>
            <p>
              Every brushstroke tells a story, and every viewer brings their own background to that story. By cataloging the world's most iconic works and inviting community reviews, we aim to build the most comprehensive catalog of subjective human responses to art.
            </p>
          </div>
          <div className={styles.accentBox}>
            <Palette size={48} className={styles.accentIcon} />
            <h3 className={styles.accentTitle}>A Canvas for Your Voice</h3>
            <p className={styles.accentBody}>
              Every masterpiece is open to interpretation. Discover and review works, give ratings out of five stars, and write detailed reviews to catalog your emotional and critical reactions.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className={styles.howSection}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.stepGrid}>
            {steps.map((step, index) => (
              <div key={index} className={styles.stepCard}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaInner}>
            <h2>Ready to dive in?</h2>
            <p>Begin your journey through our galleries. Explore, rate, and review your first masterpiece today.</p>
            <div className={styles.ctaActions}>
              <Link href="/gallery" className={styles.primaryBtn} id="about-explore-btn">
                Browse Gallery
              </Link>
              <Link href="/" className={styles.secondaryBtn}>
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
