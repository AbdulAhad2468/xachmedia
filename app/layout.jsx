import './globals.css';

export const metadata = {
  metadataBase: new URL('https://www.xachmedia.com'),
  title: 'Xach Media | Turn attention into connection.',
  description: 'Turn attention into connection with Xach Media. Social media management, reels, creative direction, and online brand presence for the business you’re building.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Xach Media',
    title: 'Xach Media | Turn attention into connection.',
    description: 'A clear strategy. Creative with personality. Social media, reels, and an online presence that brings your brand closer to people.',
    images: [{ url: '/xach-purple-services-banner.png', width: 2172, height: 724, alt: 'Xach Media — social media management and creative direction' }],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [{ url: '/favicon.svg?v=2', type: 'image/svg+xml', sizes: 'any' }, { url: '/favicon-32.png?v=2', type: 'image/png', sizes: '32x32' }],
    shortcut: '/favicon-32.png?v=2',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /></head><body>{children}</body></html>;
}
