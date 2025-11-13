"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, LinkIcon } from "lucide-react"

interface Attachment {
  id: string
  name: string
  type: string
}

interface SlideShowAttachmentManagerProps {
  slideshowId: string
  slideshowTitle: string
  currentAttachments: Attachment[]
  availableItems: Attachment[]
  contentType: "service" | "project" | "team" | "client" | "testimonial"
}

export function SlideShowAttachmentManager({
  slideshowId,
  slideshowTitle,
  currentAttachments,
  availableItems,
  contentType,
}: SlideShowAttachmentManagerProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(currentAttachments.map((a) => a.id))
  const [isEditing, setIsEditing] = useState(false)

  const handleToggle = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleSave = () => {
    console.log("[v0] Saving attachments:", selectedItems)
    setIsEditing(false)
  }

  const unattachedItems = availableItems.filter((item) => !selectedItems.includes(item.id))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Slideshow Attachments
            </CardTitle>
            <CardDescription>Manage {contentType} attachments for this slideshow</CardDescription>
          </div>
          {!isEditing && (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            {/* Current Attachments */}
            <div>
              <h4 className="font-medium text-sm mb-3">Current Attachments ({selectedItems.length})</h4>
              <div className="space-y-2">
                {selectedItems.length > 0 ? (
                  selectedItems.map((itemId) => {
                    const item = availableItems.find((i) => i.id === itemId)
                    return (
                      <div key={itemId} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Checkbox checked={true} onChange={() => handleToggle(itemId)} />
                          <span className="text-sm font-medium">{item?.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggle(itemId)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No attachments</p>
                )}
              </div>
            </div>

            {/* Available Items */}
            {unattachedItems.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-3">Available {contentType}s</h4>
                <div className="space-y-2">
                  {unattachedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg">
                      <Checkbox checked={false} onChange={() => handleToggle(item.id)} id={`item-${item.id}`} />
                      <label htmlFor={`item-${item.id}`} className="text-sm cursor-pointer flex-1">
                        {item.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {currentAttachments.length > 0 ? (
              currentAttachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{attachment.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">ID: {attachment.id}</p>
                  </div>
                  <Badge variant="secondary">{contentType}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No attachments yet</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
