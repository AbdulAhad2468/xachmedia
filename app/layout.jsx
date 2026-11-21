import './globals.css';

export const metadata = {
  title: 'Xach Media | Be Seen. Be Remembered.',
  description: 'Social media management, standout reels, and a sharper online presence for the business you’re building. Meet your next creative partner: Xach Media.',
  icons: {
    icon: [{ url: '/favicon.svg?v=2', type: 'image/svg+xml', sizes: 'any' }, { url: '/favicon-32.png?v=2', type: 'image/png', sizes: '32x32' }],
    shortcut: '/favicon-32.png?v=2',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /></head><body>{children}</body></html>;
}
