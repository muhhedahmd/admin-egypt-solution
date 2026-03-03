
import React, { } from 'react'
import { BreadcrumbHeader } from './breadCrumbDemo';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import { LanguageToggle } from './lang-selection';
import { Badge } from '@/components/ui/badge';

const AdminHeader = async () => {
  const _cookies = await cookies()

  return (
    <header className='w-full p-2  h-25 border-b border-border bg-sidebar shadow-b sticky top-0 z-50 ' >
      <div className='flex flex-col items-start justify-between px-4'>
        <div className='flex justify-between items-center gap-4  w-full'>
          <div className='flex-1 flex items-center gap-4'>

            <SidebarTrigger />
            <h2 className='text-primary font-semibold hover:text-secondary transition-colors cursor-pointer'>
              Admin
            </h2>
          </div>

          <LanguageToggle currentLang={_cookies.get("user_lang")?.value} />
        </div>
        <div className='w-full h-[.5px] m-2 bg-muted-foreground'/>
        <BreadcrumbHeader />



      </div>
    </header>
  )
}

export default AdminHeader