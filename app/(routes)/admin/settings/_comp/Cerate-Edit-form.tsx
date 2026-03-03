"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Upload, X, Languages } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useCreateCompanyInfoMutation, useGetCompanyInfoQuery, useUpdateCompanyInfoMutation } from "@/lib/store/api/companyInfo";
import { toast } from "sonner";
import { useLanguage } from "@/providers/lang";
import { companyInfoTranslationsForm } from "@/i18n/companyinfo";



export default function CompanyInfoFormPage() {
  const router = useRouter();
  const params = useParams();
  const { currentLang: langFromContext } = useLanguage();
  const t = companyInfoTranslationsForm[langFromContext?.toLowerCase() as keyof typeof companyInfoTranslationsForm || "en"];
  
  const isEdit = !!params?.id;
  const companyId = params?.id as string;

  const { data, isLoading: isLoadingData } = useGetCompanyInfoQuery(undefined, {
    skip: !isEdit,
  });
  const [createCompanyInfo, { isLoading: isCreating }] = useCreateCompanyInfoMutation();
  const [updateCompanyInfo, { isLoading: isUpdating }] = useUpdateCompanyInfoMutation();

  // Separate state for active tab
  const [activeTab, setActiveTab] = useState<"EN" | "AR">("EN");
  
  // Separate translation data for each language
  const [translationData, setTranslationData] = useState({
    EN: {
      name: "",
      tagline: "",
      description: "",
      footerText: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    },
    AR: {
      name: "",
      tagline: "",
      description: "",
      footerText: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    },
  });

  // Non-translatable fields
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    github: "",
    youtube: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoState, setLogoState] = useState<"KEEP" | "REMOVE" | "UPDATE">("KEEP");

  useEffect(() => {
    if (isEdit && data?.data) {
      const info = data.data;
      
      // Set non-translatable fields
      setFormData({
        email: info.company.email || "",
        phone: info.company.phone || "",
        address: info.company.address || "",
        city: info.company.city || "",
        country: info.company.country || "",
        postalCode: info.company.postalCode || "",
        facebook: info.company.facebook || "",
        twitter: info.company.twitter || "",
        linkedin: info.company.linkedin || "",
        instagram: info.company.instagram || "",
        github: info.company.github || "",
        youtube: info.company.youtube || "",
      });

      // Set translations for each language
      const newTranslationData = { ...translationData };
      info.translation.forEach((trans) => {
        newTranslationData[trans.lang] = {
          name: trans.name || "",
          tagline: trans.tagline || "",
          description: trans.description || "",
          footerText: trans.footerText || "",
          metaTitle: trans.metaTitle || "",
          metaDescription: trans.metaDescription || "",
          metaKeywords: trans.metaKeywords || "",
        };
      });
      setTranslationData(newTranslationData);

      if (info.logo) {
        setLogoPreview(info.logo.url);
      }
    }
  }, [isEdit, data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTranslationChange = (lang: "EN" | "AR") => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTranslationData({
      ...translationData,
      [lang]: {
        ...translationData[lang],
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoState("UPDATE");
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoState("REMOVE");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      
      // Append non-translatable fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(key, value);
        }
      });

      // Append English translation fields with _en suffix
      Object.entries(translationData.EN).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(`${key}_en`, value);
        }
      });

      // Append Arabic translation fields with _ar suffix
      Object.entries(translationData.AR).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(`${key}_ar`, value);
        }
      });

      // Append logo if exists
      if (logoFile) {
        formDataToSend.append("logo", logoFile);
      }

      // Append logo state for updates
      if (isEdit) {
        formDataToSend.append("LogoState", logoState);
      }

      if (isEdit) {
        await updateCompanyInfo({ id: companyId, formData: formDataToSend }).unwrap();
        toast.success(t.successUpdate);
      } else {
        await createCompanyInfo(formDataToSend).unwrap();
        toast.success(t.successCreate);
      }
    } catch (error) {
      console.error("Error saving company info:", error);
      toast.error(t.error);
    }
  };

  const isLoading = isCreating || isUpdating || isLoadingData;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {isEdit ? t.editTitle : t.createTitle}
          </h2>
          <p className="text-muted-foreground">
            {isEdit ? t.editSubtitle : t.createSubtitle}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Language Tabs for Translatable Content */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t.basicInfo}</CardTitle>
                    <CardDescription>{t.basicInfoDesc}</CardDescription>
                  </div>
                  <Languages className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "EN" | "AR")}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="EN">{t.english}</TabsTrigger>
                    <TabsTrigger value="AR">{t.arabic}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="EN" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-en">{t.companyName} {t.required}</Label>
                      <Input
                        id="name-en"
                        name="name"
                        value={translationData.EN.name}
                        onChange={handleTranslationChange("EN")}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tagline-en">{t.tagline}</Label>
                      <Input
                        id="tagline-en"
                        name="tagline"
                        value={translationData.EN.tagline}
                        onChange={handleTranslationChange("EN")}
                        placeholder={t.taglinePlaceholder}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description-en">{t.description}</Label>
                      <Textarea
                        id="description-en"
                        name="description"
                        value={translationData.EN.description}
                        onChange={handleTranslationChange("EN")}
                        rows={4}
                        placeholder={t.descriptionPlaceholder}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="footerText-en">{t.footerText}</Label>
                      <Textarea
                        id="footerText-en"
                        name="footerText"
                        value={translationData.EN.footerText}
                        onChange={handleTranslationChange("EN")}
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="AR" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-ar">{t.companyName} {t.required}</Label>
                      <Input
                        id="name-ar"
                        name="name"
                        value={translationData.AR.name}
                        onChange={handleTranslationChange("AR")}
                        required
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tagline-ar">{t.tagline}</Label>
                      <Input
                        id="tagline-ar"
                        name="tagline"
                        value={translationData.AR.tagline}
                        onChange={handleTranslationChange("AR")}
                        placeholder={t.taglinePlaceholder}
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description-ar">{t.description}</Label>
                      <Textarea
                        id="description-ar"
                        name="description"
                        value={translationData.AR.description}
                        onChange={handleTranslationChange("AR")}
                        rows={4}
                        placeholder={t.descriptionPlaceholder}
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="footerText-ar">{t.footerText}</Label>
                      <Textarea
                        id="footerText-ar"
                        name="footerText"
                        value={translationData.AR.footerText}
                        onChange={handleTranslationChange("AR")}
                        rows={3}
                        dir="rtl"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t.contactInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t.email} {t.required}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t.phone}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="address">{t.address}</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t.city}</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">{t.country}</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">{t.postalCode}</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>{t.socialMedia}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      placeholder="https://twitter.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO - Language Specific */}
            <Card>
              <CardHeader>
                <CardTitle>{t.seo}</CardTitle>
                <CardDescription>{t.seoDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "EN" | "AR")}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="EN">{t.english}</TabsTrigger>
                    <TabsTrigger value="AR">{t.arabic}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="EN" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle-en">{t.metaTitle}</Label>
                      <Input
                        id="metaTitle-en"
                        name="metaTitle"
                        value={translationData.EN.metaTitle}
                        onChange={handleTranslationChange("EN")}
                        placeholder={t.metaTitlePlaceholder}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metaDescription-en">{t.metaDescription}</Label>
                      <Textarea
                        id="metaDescription-en"
                        name="metaDescription"
                        value={translationData.EN.metaDescription}
                        onChange={handleTranslationChange("EN")}
                        rows={3}
                        placeholder={t.metaDescriptionPlaceholder}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metaKeywords-en">{t.metaKeywords}</Label>
                      <Input
                        id="metaKeywords-en"
                        name="metaKeywords"
                        value={translationData.EN.metaKeywords}
                        onChange={handleTranslationChange("EN")}
                        placeholder={t.metaKeywordsPlaceholder}
                      />
                      <p className="text-xs text-muted-foreground">{t.metaKeywordsHelper}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="AR" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle-ar">{t.metaTitle}</Label>
                      <Input
                        id="metaTitle-ar"
                        name="metaTitle"
                        value={translationData.AR.metaTitle}
                        onChange={handleTranslationChange("AR")}
                        placeholder={t.metaTitlePlaceholder}
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metaDescription-ar">{t.metaDescription}</Label>
                      <Textarea
                        id="metaDescription-ar"
                        name="metaDescription"
                        value={translationData.AR.metaDescription}
                        onChange={handleTranslationChange("AR")}
                        rows={3}
                        placeholder={t.metaDescriptionPlaceholder}
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metaKeywords-ar">{t.metaKeywords}</Label>
                      <Input
                        id="metaKeywords-ar"
                        name="metaKeywords"
                        value={translationData.AR.metaKeywords}
                        onChange={handleTranslationChange("AR")}
                        placeholder={t.metaKeywordsPlaceholder}
                        dir="rtl"
                      />
                      <p className="text-xs text-muted-foreground">{t.metaKeywordsHelper}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Logo Upload */}
            <Card>
              <CardHeader>
                <CardTitle>{t.logo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {logoPreview ? (
                  <div className="relative">
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                      <Image
                        src={logoPreview}
                        alt="Logo preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={handleRemoveLogo}
                    >
                      <X className="mr-2 h-4 w-4" />
                      {t.removeLogo}
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <Label
                      htmlFor="logo-upload"
                      className="cursor-pointer text-sm text-blue-600 hover:underline"
                    >
                      {t.uploadLogo}
                    </Label>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {t.uploadHelper}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? t.saving : isEdit ? t.update : t.create}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.back()}
                >
                  {t.cancel}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}