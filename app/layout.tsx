import type { Metadata } from "next";
import "./globals.css";

import localFont from 'next/font/local'
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
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
