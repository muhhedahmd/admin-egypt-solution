import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/admin/user-management"
import { SiteSettings } from "@/components/admin/site-settings"
import CompanyInfoPage from "@/components/admin/company-settings"

export default function SettingsPage() {
  return (
    <div className="p-0 space-y-0">
      <CompanyInfoPage />
  

      
    </div>
  )
}
