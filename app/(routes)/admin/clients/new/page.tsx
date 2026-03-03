"use client"

import { ClientForm } from "@/components/admin/client-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/providers/lang"
import { tClientForm } from "@/i18n/client"

export default function NewClientPage() {
  const { currentLang, isRTL } = useLanguage()
  const lang = (currentLang || 'en').toLowerCase() as 'en' | 'ar'
  const t = tClientForm[lang] || tClientForm['en']

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/clients">
            {
              isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />
            }
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.buttons.add}</h1>
          <p className="text-muted-foreground">
            {currentLang === "AR"
              ? "أضف عميلًا جديدًا إلى محفظتك"
              : "Add a new client to your portfolio"}
          </p>
        </div>
      </div>

      <ClientForm />
    </div>
  )
}
