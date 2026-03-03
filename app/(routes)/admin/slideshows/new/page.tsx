"use client";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideshowForm } from "@/components/admin/slideshow-form";
import { useLanguage } from "@/providers/lang";
import { newSlideshowPageI18n } from "@/i18n/slideShow";
import { cn } from "@/lib/utils";

export default function NewSlideshowPage() {
  const { currentLang, isRTL, switchLanguage } = useLanguage();
  const t =
    newSlideshowPageI18n[(currentLang?.toLowerCase() as "en" | "ar") || "en"];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/slideshows">
            {isRTL ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}
          </Link>
        </Button>
        <div className="flex items-center justify-between md:flex-row flex-col  w-full  ">
          <div >
            <h1 className="text-3xl font-bold tracking-tight">
              {t.header.title}
            </h1>
            <p className="text-muted-foreground">{t.header.subtitle}</p>
          </div>
          <div
            className={cn(
              "border-orange-400 text-orange-400  text-sm p-2 rounded-md border flex items-center justify-start self-end gap-3   ",
              !isRTL && ""
            )}
          >
            <AlertCircle className="h-5 w-5 text-orange-400  text-md" />
            {isRTL
              ? " ستظهر هذه عرض شرائح في الصفحة العربية فقط."
              : "This slideshow will only appear on the english page.."}
            <Button
              variant={"secondary"}
              className="cursor-pointer"
              onClick={() => switchLanguage(currentLang === "EN" ? "AR" : "EN")}
            >
              {isRTL ? "تغير للانجليزية" : "Change to Arabic"}
            </Button>
          </div>
        </div>
      </div>

      <SlideshowForm />
    </div>
  );
}
