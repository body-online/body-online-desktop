import { SessionProvider } from 'next-auth/react';
import localFont from 'next/font/local'
import type { Metadata } from "next";
import Script from 'next/script';

import { Providers } from '@/components/ui/providers';
import { auth } from '@/auth';

import "./globals.css";

const satoshi = localFont({
  src: '../public/fonts/Satoshi-Variable.ttf',
  display: 'swap',
  variable: '--font-satoshi',
});

export const metadata: Metadata = {
  title: "BodyOnline",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode; }>) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html lang="en" className={`${satoshi.className}`} suppressHydrationWarning>
        <head>
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

          {/* 
          // Twilio webchat testing
          <script defer src="https://twilio-webchat-production-ef30.up.railway.app/webchat.js"/> 
          */}
        </head>
        <body className={`body`}>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
