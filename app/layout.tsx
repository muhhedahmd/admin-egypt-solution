import type { Metadata } from 'next'
import StoreProvider from '@/lib/store/provider';
// @ts-ignore
import './globals.css'
import { Toaster } from '@/components/ui/sonner';
import ToastListener from './_comp/TosterListener';
import { LanguageProvider } from '@/providers/lang';

export const metadata: Metadata = {
  title: 'Egypt Solutions - Admin Dashboard',
  description: 'Admin dashboard for managing Egypt Solutions website content, services, and analytics.',
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
            initialLang="en"
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
