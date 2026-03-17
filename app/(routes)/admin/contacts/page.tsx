"use client"
import { ContactsTable } from "@/components/admin/contacts-table"
import { ContactsStats } from "@/components/admin/contacts-stats"
import { useLanguage } from "@/providers/lang"
import { tContacts } from "@/i18n/contacts"

export default function ContactsPage() {
  const { currentLang } = useLanguage();
  const t = tContacts[(currentLang?.toLowerCase() as "en" | "ar") || "en"];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <ContactsStats />
      <ContactsTable />
    </div>
  )
}
