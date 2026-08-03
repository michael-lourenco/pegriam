import type { Metadata } from 'next';
import { Source_Sans_3, Merriweather } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/presentation/providers/AuthProvider';
import { ThemeProvider } from '@/presentation/components/shared/ThemeProvider';
import { Navigation } from '@/presentation/components/shared/Navigation';
import { Footer } from '@/presentation/components/shared/Footer';
import { Toaster } from '@/presentation/components/shared/Toaster';
import { APP_NAME, APP_DESCRIPTION, APP_URL } from '@/shared/constants';

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather',
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          sourceSans.variable,
          merriweather.variable,
          sourceSans.className,
          'antialiased bg-background text-foreground min-h-screen flex flex-col'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
