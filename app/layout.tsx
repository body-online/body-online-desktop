import type { Metadata } from "next";
import "./globals.css";

import localFont from 'next/font/local'
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import Script from 'next/script';
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${satoshi.className} body`}>
          <Script
            id='disable-zoom'
            dangerouslySetInnerHTML={{
              __html: `document.addEventListener('gesturestart', function(e) {
                        e.preventDefault();
                        // special hack to prevent zoom-to-tabs gesture in safari
                        document.body.style.zoom = 0.99;
                      });

                      document.addEventListener('gesturechange', function(e) {
                        e.preventDefault();
                        // special hack to prevent zoom-to-tabs gesture in safari
                        document.body.style.zoom = 0.99;
                      });

                      document.addEventListener('gestureend', function(e) {
                        e.preventDefault();
                        // special hack to prevent zoom-to-tabs gesture in safari
                        document.body.style.zoom = 0.99;
                      });`,
            }}>
          </Script>
          {children}
          <Toaster
            position="bottom-right"
            reverseOrder={true}
            toastOptions={{
              className: 'bg-red-500 rounded-xl',
              duration: 5000,
            }} />
        </body>
      </html>
    </SessionProvider>
  );
}
