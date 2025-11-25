import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    metadataBase: new URL('https://ecostreak.vercel.app'),
    title: 'EcoStreak - Gamified Environmental Education',
    description: 'Turn environmental learning into an addictive game. Earn points, compete, and save the planet!',
    keywords: 'environmental education, gamification, climate change, sustainability, India, Smart India Hackathon',
    authors: [{ name: 'EcoStreak Team' }],
    creator: 'EcoStreak',

    // Open Graph tags for social sharing
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://ecostreak.vercel.app',
        title: 'EcoStreak - Gamified Environmental Education',
        description: 'Turn environmental learning into an addictive game. Earn points, unlock badges, and save the planet!',
        siteName: 'EcoStreak',
        images: [
            {
                url: '/leaf-earth.svg',
                width: 1200,
                height: 630,
                alt: 'EcoStreak Logo',
            },
        ],
    },

    // Twitter Card tags
    twitter: {
        card: 'summary_large_image',
        title: 'EcoStreak - Gamified Environmental Education',
        description: 'Turn environmental learning into an addictive game. Earn points, compete, and save the planet!',
        images: ['/leaf-earth.svg'],
        creator: '@EcoStreak',
    },

    // Additional meta tags
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    // Verification tags (add your verification codes if needed)
    // verification: {
    //     google: 'your-google-verification-code',
    // },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/leaf-earth.svg" />
                <link rel="apple-touch-icon" href="/leaf-earth.svg" />
                <meta name="theme-color" content="#10b981" />
            </head>
            <body className={inter.className}>
                <ErrorBoundary>
                    <Providers>{children}</Providers>
                </ErrorBoundary>
            </body>
        </html>
    );
}
