"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Save } from "lucide-react"

export function SiteSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
          <CardDescription>Configure your website's search engine optimization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-title">Site Title</Label>
            <Input id="site-title" defaultValue="Software Solutions Inc. - Web & Mobile Development" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-description">Meta Description</Label>
            <Textarea
              id="site-description"
              rows={3}
              defaultValue="Leading software development company specializing in custom web and mobile applications."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-keywords">Keywords</Label>
            <Input id="site-keywords" defaultValue="software development, web apps, mobile apps, consulting" />
          </div>

          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Site Features</CardTitle>
          <CardDescription>Enable or disable site features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Blog Comments</Label>
              <p className="text-sm text-muted-foreground">Allow visitors to comment on blog posts</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Contact Form</Label>
              <p className="text-sm text-muted-foreground">Enable the contact form on your website</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Newsletter Signup</Label>
              <p className="text-sm text-muted-foreground">Show newsletter subscription form</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Analytics Tracking</Label>
              <p className="text-sm text-muted-foreground">Enable page view tracking and analytics</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Mode</CardTitle>
          <CardDescription>Temporarily disable public access to your website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Show maintenance page to visitors</p>
            </div>
            <Switch />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenance-message">Maintenance Message</Label>
            <Textarea
              id="maintenance-message"
              rows={3}
              defaultValue="We're currently performing scheduled maintenance. We'll be back soon!"
            />
          </div>

          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
