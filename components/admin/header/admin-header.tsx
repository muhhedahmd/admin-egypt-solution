
import React from 'react'
import { BreadcrumbHeader } from './breadCrumbDemo';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import { LanguageToggle } from './lang-selection';
import { Badge } from '@/components/ui/badge';
import { Bell, Search } from 'lucide-react';

const AdminHeader = async () => {
  const _cookies = await cookies()

  return (
    <header className='w-full p-2 h-25 border-b border-border bg-sidebar shadow-b sticky top-0 z-50'>
      <div className='flex flex-col items-start justify-between px-4'>
        <div className='flex justify-between items-center gap-4 w-full'>
          <div className='flex-1 flex items-center gap-4'>
            <SidebarTrigger />
            <div className='flex items-center gap-3'>
              <h2 className='text-primary font-semibold hover:text-secondary transition-colors cursor-pointer'>
                Egypt Solutions
              </h2>
              <Badge variant="outline" className='text-[10px] px-1.5 py-0 border-amber-500/50 text-amber-600 dark:text-amber-400 bg-amber-500/10'>
                DEMO
              </Badge>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            {/* Notification Bell */}
            <button className='relative p-2 rounded-lg hover:bg-muted transition-colors'>
              <Bell className='h-4 w-4 text-muted-foreground' />
              <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
            </button>

            {/* Admin User */}
            <div className='hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50'>
              <div className='w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center'>
                <span className='text-xs font-bold text-primary'>A</span>
              </div>
              <div className='text-left'>
                <p className='text-xs font-medium leading-none'>Admin</p>
                <p className='text-[10px] text-muted-foreground leading-none mt-0.5'>admin@egyptsolutions.com</p>
              </div>
            </div>

            <LanguageToggle currentLang={_cookies.get("user_lang")?.value || "en"} />
          </div>
        </div>
        <div className='w-full h-[.5px] m-2 bg-muted-foreground' />
        <BreadcrumbHeader />
      </div>
    </header>
  )
}

export default AdminHeader