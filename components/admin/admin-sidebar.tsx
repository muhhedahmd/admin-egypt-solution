"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/app/_comp/theme-toggle"

const menuItems = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", icon: LayoutDashboard, href: "/admin" }],
  },
  {
    title: "Content",
    items: [
      { title: "Services", icon: Briefcase, href: "/admin/services" },
      { title: "Projects", icon: FolderKanban, href: "/admin/projects" },
      { title: "Slideshows", icon: Presentation, href: "/admin/slideshows" },
      { title: "Blog Posts", icon: FileText, href: "/admin/blog" },
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
      { title: "Media Library", icon: ImageIcon, href: "/admin/media" },
      { title: "Slideshow Relations", icon: Presentation, href: "/admin/slideshow-relationships" },
      { title: "Settings", icon: Settings, href: "/admin/settings" },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
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
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
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
     
        <Button variant="outline" size="sm" className="w-full bg-transparent">
          Sign Out
        </Button>
     <div className="border-border w-full p-4 border-2 rounded-md flex  justify-between items-center">
       <span className="text-muted-foreground flex items-center gap-2 text-md [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4">
        Theme
       </span>
        <ThemeToggle/>
     </div>
      </SidebarFooter>
    </Sidebar>
  )
}
