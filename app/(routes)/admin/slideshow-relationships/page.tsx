"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye, Layers, Monitor } from "lucide-react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Preview</h1>
          <p className="text-muted-foreground">
            Preview how your content appears on the live website
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-amber-500/50 text-amber-600 dark:text-amber-400 bg-amber-500/10"
        >
          DEMO
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Live Site Card */}
        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Website</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              View the live end-user landing page as visitors see it.
            </p>
            <Link
              href="https://end-user-landing-manager.vercel.app/en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              Open Live Site
              <ExternalLink className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Slideshows Card */}
        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Slideshows</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Manage and configure your slideshow content and relationships.
            </p>
            <Link
              href="/admin/slideshows"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              Manage Slideshows
              <ExternalLink className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Pages Preview Card */}
        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hero Sections</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Preview and edit hero sections displayed on the landing page.
            </p>
            <Link
              href="/admin/sections/hero"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              Edit Hero
              <ExternalLink className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;