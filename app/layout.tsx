import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
import StoreProvider from '@/lib/store/provider';
// @ts-ignore
import './globals.css'
import { Toaster } from '@/components/ui/sonner';
import ToastListener from './_comp/TosterListener';
// import { Toaster } from '@/components/ui/toaster';
// import ToastListener from './_comp/TosterListener';

// const _geist = Geist({ subsets: ["latin"] });
// const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Company name',
  description: 'admin panel',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <StoreProvider>

          {children}
   
              <Toaster richColors={false}  />
      <ToastListener  />
        </StoreProvider>
      </body>
    </html>
  )
}
