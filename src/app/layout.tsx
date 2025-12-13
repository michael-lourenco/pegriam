import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/presentation/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Contos de Pegriam',
  description: 'Sistema editorial avançado para Contos de Pegriam - O Bardo Multiversal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn(inter.className, "antialiased bg-background text-foreground")}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

