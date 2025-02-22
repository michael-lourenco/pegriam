import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { AuthProvider } from "./auth-provider";

import { Lilita_One } from 'next/font/google'

const lilitaOne = localFont({
  src: "./fonts/LilitaOne-Regular.ttf",
  weight: '100 900',
  variable: '--font-lilita-one', // Isso é importante para o Tailwind
})

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: "Pegriam ",
  description: "Histórias encantadas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lilitaOne.variable}`}>
      <body
        className={`${lilitaOne.variable} antialiased bg-slate-900 font-lilita-one text-shadow-outline text-center text-white text-balance`}
      >
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
