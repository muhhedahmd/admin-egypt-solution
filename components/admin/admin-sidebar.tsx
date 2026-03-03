"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  Users,
  UserCircle,
  MessageSquare,
  FileText,
  ImageIcon,
  Presentation,
  Mail,
  Star,
  Settings,
  DoorClosed,
  DoorOpen,
  RectangleEllipsisIcon,
  RectangleHorizontalIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/app/_comp/theme-toggle"
import { useLanguage } from "@/providers/lang"
import { sidebarTranslations, tGroupTitle } from "@/i18n/sideBar"
import { useEffect } from "react"
import { Spinner } from "../ui/spinner"
import axios from "axios"

// sidebar.i18n.ts



const menuItems = [

  {
    title: "Overview",
    items: [{ title: "Dashboard", icon: LayoutDashboard, href: "/admin" }],
  },
  {


    title: "Sections",
    items: [

      {
        title: "Hero", icon: RectangleHorizontalIcon, href: "/admin/sections/hero",
      }
    ]
  },
  {
    title: "Content",
    items: [
      { title: "Services", icon: Briefcase, href: "/admin/services" },
      { title: "Projects", icon: FolderKanban, href: "/admin/projects" },
      { title: "Slideshows", icon: Presentation, href: "/admin/slideshows" },
      // { title: "Blog Posts", icon: FileText, href: "/admin/blog" , disabled: true},
    ],
  },
  {
    title: "People",
    items: [
      { title: "Team Members", icon: Users, href: "/admin/team" },
      { title: "Clients", icon: UserCircle, href: "/admin/clients" },
      { title: "Testimonials", icon: MessageSquare, href: "/admin/testimonials" },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Contacts", icon: Mail, href: "/admin/contacts" },
      // { title: "Media Library", icon: ImageIcon, href: "/admin/media" },
      { title: "demo", icon: Presentation, href: "/admin/slideshow-relationships" },
      { title: "Settings", icon: Settings, href: "/admin/settings" },
    ],
  },
]


export function AdminSidebar() {
  const pathname = usePathname()
  const  router = useRouter()

  const { currentLang, isLoading,
    isRTL
  } = useLanguage();


  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : 'auto';
  }, [isLoading])

  if (isLoading) {
   return <div className='flex items-center justify-center h-screen w-screen z-10000 fixed top-0 left-0 bg-background' >
      <Spinner className='w-6 h-6' />
    </div>
  }
  const t = sidebarTranslations[currentLang?.toLowerCase() as 'en' | 'ar' || "en"]
  const tgroup = tGroupTitle[currentLang?.toLowerCase() as 'en' | 'ar' || "en"]

  const handleLogOut = async  () => {
    try {
      const res = await axios.post( process.env.NEXT_PUBLIC_BACKEND_URL_API! +  "/auth/logout" ,  {} , { 
        withCredentials: true
      })

      if(res.status === 200) {
           router.push('/')
      }

      
    } catch (error) {
      console.log(error)

      
    }

  }

  return (
    <Sidebar
      side={isRTL ? "right" : "left"}
      dir={isRTL ? "rtl" : "ltr"}>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Star className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">Software Company</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (

          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{tgroup[group?.title?.toLowerCase() as keyof typeof tgroup]}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, i) => {
                  const isActive = pathname === item.href
                  const itemKey = item.title.toLowerCase() as keyof typeof t
                  return (
                    <SidebarMenuItem
                      key={i}>
                      <SidebarMenuButton
                        asChild isActive={isActive}>
                        <Link href={item.href || ""}>
                          <item.icon className="h-4 w-4" />
                          <span >{t[itemKey] || item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t p-4 flex ">

        <Button 
        onClick={handleLogOut}
        variant="outline" size="sm" className="w-full bg-transparent">
          Sign Out
        </Button>
        <div className="border-border w-full p-4 border-2 rounded-md flex  justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-2 text-md [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4">
            Theme
          </span>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
