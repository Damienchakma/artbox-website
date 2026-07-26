'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Menu, X, User, PlusCircle, LogOut, ChevronDown, ShoppingBag, Heart, PackageCheck, Store } from 'lucide-react';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { currentUser, logout, cartCount, wishlistCount, setIsCartOpen } = useApp();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Marketplace', path: '/marketplace', isFeatured: true },
    { name: 'Explore', path: '/gallery' },
    { name: 'Artists', path: '/artists' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>ArtBox</span>
          </Link>

          <nav className={styles.desktopNav}>
            <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`${styles.navLink} ${pathname === link.path ? styles.active : ''} ${link.isFeatured ? styles.marketplaceLink : ''}`}
              >
                {link.isFeatured && <Store size={15} className={styles.navIcon} />}
                {link.name}
              </Link>
            ))}
          </nav>

          <div className={styles.rightActions}>
            {/* Wishlist Button — logged in only */}
            {currentUser && (
              <Link href="/wishlist" className={styles.iconBtn} title="Saved Wishlist">
                <Heart size={20} />
                {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
              </Link>
            )}

            {/* Cart Button — logged in only */}
            {currentUser && (
              <button
                onClick={() => setIsCartOpen(true)}
                className={styles.iconBtn}
                title="Shopping Cart"
                aria-label="Open Cart"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
              </button>
            )}

            <div className={styles.authGroup}>
              {currentUser ? (
                <div className={styles.userDropdownWrapper}>
                  <button
                    className={styles.userProfileTrigger}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className={styles.userAvatarImg}
                    />
                    <span className={styles.userName}>{currentUser.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className={styles.dropdownIcon} />
                  </button>

                  {isProfileMenuOpen && (
                    <div className={styles.dropdownMenu}>
                      {currentUser.role === 'artist' && (
                        <Link href={`/artist/${currentUser.id}`} className={styles.dropdownItem}>
                          <User size={15} />
                          My Artist Profile
                        </Link>
                      )}
                      <Link href="/orders" className={styles.dropdownItem}>
                        <PackageCheck size={15} />
                        My Orders
                      </Link>
                      {currentUser.role === 'user' && (
                        <Link href="/wishlist" className={styles.dropdownItem}>
                          <Heart size={15} />
                          My Wishlist
                        </Link>
                      )}
                      {currentUser.role === 'artist' && (
                        <Link href="/signup" className={styles.dropdownItem}>
                          <PlusCircle size={15} />
                          Submit New Artwork
                        </Link>
                      )}
                      <button onClick={logout} className={`${styles.dropdownItem} ${styles.logoutItem}`}>
                        <LogOut size={15} />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className={styles.loginBtn}>
                    Sign In
                  </Link>
                  <Link href="/signup" className={styles.signUpBtn}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className={styles.mobileNav}>
            <Link href="/" className={`${styles.mobileNavLink} ${pathname === '/' ? styles.active : ''}`}>
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`${styles.mobileNavLink} ${pathname === link.path ? styles.active : ''}`}
              >
                {link.name}
              </Link>
            ))}
            {currentUser && (
              <Link href="/wishlist" className={styles.mobileNavLink}>
                Wishlist ({wishlistCount})
              </Link>
            )}
            {currentUser && (
              <Link href="/orders" className={styles.mobileNavLink}>
                My Orders
              </Link>
            )}

            <div className={styles.mobileAuth}>
              {currentUser ? (
                <>
                  {currentUser.role === 'artist' && (
                    <Link href={`/artist/${currentUser.id}`} className={styles.mobileNavLink}>
                      My Artist Profile
                    </Link>
                  )}
                  {currentUser.role === 'user' && (
                    <Link href="/wishlist" className={styles.mobileNavLink}>
                      My Wishlist
                    </Link>
                  )}
                  <button onClick={logout} className={styles.loginBtn}>
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className={styles.loginBtn}>
                    Sign In
                  </Link>
                  <Link href="/signup" className={styles.signUpBtn}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />
    </>
  );
}

