import { SessionProvider } from 'next-auth/react';
import localFont from 'next/font/local'
import type { Metadata } from "next";

import { Providers } from '@/components/ui/providers';
import { auth } from '@/auth';

import "./globals.css";
import Navbar from '@/components/ui/navbar';

const satoshi = localFont({
  src: '../public/fonts/Satoshi-Variable.ttf',
  display: 'swap',
  variable: '--font-satoshi',
});

export const metadata: Metadata = {
  title: "BodyOnline",
  description: "Aplicación Web Progresiva para realizar mediciones corporales, seguimientos de estado corporal, actualizar el estado de los individuos, gestionar ubicaciones, genéticas y operarios de su organización.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en" className={`${satoshi.className}`} suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />

          {/* no scrolling on mobile */}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              document.addEventListener('gesturestart', function(e) {
                e.preventDefault();
                document.body.style.zoom = 0.99;
              });
        
              document.addEventListener('gesturechange', function(e) {
                  e.preventDefault();
                  document.body.style.zoom = 0.99;
              });
        
              document.addEventListener('gestureend', function(e) {
                  e.preventDefault();
                  document.body.style.zoom = 0.99;
              });`,
            }}
          ></script>
        </head>

        <body className={`body`}>
          <Providers>
            <Navbar user={session?.user} />
            {children}
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
