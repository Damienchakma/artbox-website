import './globals.css';
import Providers from './Providers';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ToastWrapper from './ToastWrapper';
import BackToTop from '@/components/BackToTop/BackToTop';
import AIChatWidget from '@/components/AIChatWidget/AIChatWidget';

export const metadata = {
  title: 'ArtBox — Art Review Platform',
  description:
    'Discover, review, and celebrate the world\'s greatest masterpieces. An art review platform where connoisseurs and curious minds meet.',
  keywords: 'art review, masterpieces, gallery, painting, art criticism',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main style={{ paddingTop: 'var(--navbar-height)' }}>
            {children}
          </main>
          <Footer />
          <ToastWrapper />
          <BackToTop />
          <AIChatWidget />
        </Providers>
      </body>
    </html>
  );
}
