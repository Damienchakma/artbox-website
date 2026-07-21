import React from 'react';
import Link from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoText}>ArtBox</span>
        </div>

        <nav className={styles.nav}>
          <a href="/about" className={styles.link}>About</a>
          <a href="/gallery" className={styles.link}>Browse</a>
          <a href="/gallery" className={styles.link}>Artists</a>
          <a href="/gallery" className={styles.link}>Genres</a>
          <a href="#" className={styles.link}>Admin Login</a>
        </nav>

        <div className={styles.socials}>
          <a href="#" aria-label="Website" className={styles.socialLink}>
            <span className="material-symbols-outlined">public</span>
          </a>
          <a href="#" aria-label="Instagram" className={styles.socialLink}>
            <span className="material-symbols-outlined">camera_alt</span>
          </a>
          <a href="#" aria-label="Contact" className={styles.socialLink}>
            <span className="material-symbols-outlined">alternate_email</span>
          </a>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2026 ArtBox. The Digital Curator. All rights reserved.
          </p>
          <div className={styles.metaLinks}>
            <a href="#" className={styles.metaLink}>Privacy Policy</a>
            <a href="#" className={styles.metaLink}>Terms of Service</a>
            <a href="#" className={styles.metaLink}>Cookie Policy</a>
            <a href="#" className={styles.metaLink}>Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
