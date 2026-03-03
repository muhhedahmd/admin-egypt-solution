import type { Metadata } from 'next'
import StoreProvider from '@/lib/store/provider';
// @ts-ignore
import './globals.css'
import { Toaster } from '@/components/ui/sonner';
import ToastListener from './_comp/TosterListener';
import { LanguageProvider } from '@/providers/lang';

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
          <LanguageProvider 
          initialIsRTL={false}
          >


            {children}
          </LanguageProvider>

          <Toaster />
          <ToastListener />
        </StoreProvider>
      </body>
    </html>
  )
}
