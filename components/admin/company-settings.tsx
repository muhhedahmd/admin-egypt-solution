
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Youtube,
  Edit,
  
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGetCompanyInfoQuery } from "@/lib/store/api/companyInfo";

export default function CompanyInfoPage() {
  const router = useRouter();
  const { data, isLoading } = useGetCompanyInfoQuery();
  const companyInfo = data?.data;

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!companyInfo) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Company Info</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set up your company information to get started.
            </p>
            <Button onClick={() => router.push("/admin/settings/create")}>
              Create Company Info
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Company Information</h2>
          <p className="text-muted-foreground">View your company details and settings</p>
        </div>
        <Button onClick={() => router.push(`/admin/settings/${companyInfo.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Information
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                {companyInfo.logo && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                    <Image
                      src={companyInfo.logo.url}
                      alt={companyInfo.logo.alt || companyInfo.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{companyInfo.name}</h3>
                  {companyInfo.tagline && (
                    <p className="text-muted-foreground">{companyInfo.tagline}</p>
                  )}
                </div>
              </div>

              {companyInfo.description && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {companyInfo.description}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a href={`mailto:${companyInfo.email}`} className="text-sm text-blue-600 hover:underline">
                      {companyInfo.email}
                    </a>
                  </div>
                </div>

                {companyInfo.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <a href={`tel:${companyInfo.phone}`} className="text-sm text-blue-600 hover:underline">
                        {companyInfo.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {(companyInfo.address || companyInfo.city || companyInfo.country) && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium mb-1">Address</p>
                      <p className="text-sm text-muted-foreground">
                        {companyInfo.address && <>{companyInfo.address}<br /></>}
                        {companyInfo.city && <>{companyInfo.city}, </>}
                        {companyInfo.country}
                        {companyInfo.postalCode && <> {companyInfo.postalCode}</>}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* SEO Information */}
          {(companyInfo.metaTitle || companyInfo.metaDescription || companyInfo.metaKeywords) && (
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {companyInfo.metaTitle && (
                  <div>
                    <p className="text-sm font-medium mb-1">Meta Title</p>
                    <p className="text-sm text-muted-foreground">{companyInfo.metaTitle}</p>
                  </div>
                )}
                {companyInfo.metaDescription && (
                  <div>
                    <p className="text-sm font-medium mb-1">Meta Description</p>
                    <p className="text-sm text-muted-foreground">{companyInfo.metaDescription}</p>
                  </div>
                )}
                {companyInfo.metaKeywords && (
                  <div>
                    <p className="text-sm font-medium mb-1">Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {companyInfo.metaKeywords.split(',').map((keyword, i) => (
                        <Badge key={i} variant="secondary">{keyword.trim()}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {companyInfo.facebook && (
                <a href={companyInfo.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-blue-600 transition-colors">
                  <Facebook className="h-5 w-5" />
                  <span>Facebook</span>
                </a>
              )}
              {companyInfo.twitter && (
                <a href={companyInfo.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-blue-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span>Twitter</span>
                </a>
              )}
              {companyInfo.linkedin && (
                <a href={companyInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-blue-700 transition-colors">
                  <Linkedin className="h-5 w-5" />
                  <span>LinkedIn</span>
                </a>
              )}
              {companyInfo.instagram && (
                <a href={companyInfo.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-pink-600 transition-colors">
                  <Instagram className="h-5 w-5" />
                  <span>Instagram</span>
                </a>
              )}
              {companyInfo.github && (
                <a href={companyInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-gray-600 transition-colors">
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </a>
              )}
              {companyInfo.youtube && (
                <a href={companyInfo.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-red-600 transition-colors">
                  <Youtube className="h-5 w-5" />
                  <span>YouTube</span>
                </a>
              )}
              {!companyInfo.facebook && !companyInfo.twitter && !companyInfo.linkedin &&
                !companyInfo.instagram && !companyInfo.github && !companyInfo.youtube && (
                  <p className="text-sm text-muted-foreground">No social media links added</p>
                )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">
                  {new Date(companyInfo.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">
                  {new Date(companyInfo.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
