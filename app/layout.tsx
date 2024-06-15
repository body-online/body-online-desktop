import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import localFont from 'next/font/local'
import type { Metadata } from "next";
import { auth } from '@/auth';
import "./globals.css";
import StatusProvider from './context/status-context';

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
      <StatusProvider>
        <html lang="en">
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
          </head>

          <body className={`${satoshi.className} body`}>
            {children}
            <Toaster
              position="bottom-right"
              reverseOrder={true}
              toastOptions={{ duration: 5000 }}
            />
          </body>
        </html>
      </StatusProvider>
    </SessionProvider>
  );
}
