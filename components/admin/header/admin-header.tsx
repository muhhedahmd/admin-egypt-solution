"use client"

import React, { useMemo, useState } from 'react'

const AdminHeader = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleSearchToggle = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'm') {
            event.preventDefault();
            handleSearchToggle();
        }
    };

    return (
        <header className='h-16 w-full p-2 border-b border-border shadow-b sticky top-0 z-50 ' onKeyDown={handleKeyDown}>
            <div className='flex flex-col items-start justify-between'>
                <div className='flex justify-start items-center gap-4'>
                    <SidebarTrigger />
                    <h2 className='text-primary font-semibold hover:text-secondary transition-colors cursor-pointer'>
                        Admin
                    </h2>
                </div>

                <BreadcrumbDemo />

            </div>
        </header>
    )
}

export default AdminHeader

import Link from "next/link"
import { usePathname } from 'next/navigation'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { SidebarTrigger } from '@/components/ui/sidebar'

function BreadcrumbDemo() {
    const pathname = usePathname()
const pathSegments = useMemo(() => {
  return pathname.split('/').filter(segment => segment !== '')
}, [pathname])
  'use client'



return (
  <Breadcrumb className="text-gray-700">
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href="/">Home</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      {pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/')
        const isLast = index === pathSegments.length - 1
        return (
          <React.Fragment key={href}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={href} className="hover:text-blue-600 transition-colors">
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        )
      })}
    </BreadcrumbList>
  </Breadcrumb>
)
}

{/* <BreadcrumbSeparator /> */}
{/* <BreadcrumbItem>
    <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1">
            <BreadcrumbEllipsis className="size-4" />
            <span className="sr-only">Toggle menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
            <DropdownMenuItem>Documentation</DropdownMenuItem>
            <DropdownMenuItem>Themes</DropdownMenuItem>
            <DropdownMenuItem>GitHub</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</BreadcrumbItem> */}

