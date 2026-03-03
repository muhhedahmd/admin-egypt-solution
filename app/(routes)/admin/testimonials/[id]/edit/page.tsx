"use client";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { Button } from "@/components/ui/button";
import { useGetTestimonialByIdQuery } from "@/lib/store/api/testimonials-api";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import ServiceNewLoader from "../../../services/_comp/service-new-loader";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers/lang";

export default function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const _params = use(params);
  const { isLoading, isError, data } = useGetTestimonialByIdQuery(_params.id);
  const { currentLang } = useLanguage();

  if (isLoading) return <ServiceNewLoader />;

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-full bg-destructive/10 p-6 mb-4 inline-block">
            <User className="h-12 w-12 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Testimonial Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The testimonial you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/admin/testimonials")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Testimonials
          </Button>
        </div>
      </div>
    );
  }

  const currentLanguage = data.data.translation?.find(
    (translation) =>
      translation?.lang?.toLocaleLowerCase() === currentLang?.toLowerCase(),
  ) || {
    clientName: "",
    clientPosition: "",
    clientCompany: "",
    content: "",
    lang: currentLang,
  };
  const mockTestimonial = {
    ...data?.data?.testimonial,
    ...currentLanguage,
    avatar: data?.data?.Avatar,
  };

  // const t = mockTestimonialFormI18n[currentLang?.toLowerCase() as 'en' | 'ar' || "en"]
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/testimonials">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Testimonial
          </h1>
          <p className="text-muted-foreground">
            Update testimonial information
          </p>
        </div>
      </div>

      <TestimonialForm initialData={mockTestimonial as any} />
    </div>
  );
}
