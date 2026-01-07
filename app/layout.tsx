import type { Metadata } from 'next'
import StoreProvider from '@/lib/store/provider';
// @ts-ignore
import './globals.css'
import { Toaster } from '@/components/ui/sonner';
import ToastListener from './_comp/TosterListener';

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

          <Toaster  />
          <ToastListener />
        </StoreProvider>
      </body>
    </html>
  )
}
