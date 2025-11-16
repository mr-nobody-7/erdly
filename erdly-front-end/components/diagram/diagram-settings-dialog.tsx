"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, ExternalLink } from "lucide-react"
import { mockApi } from "@/lib/mock-api"
import { toast } from "sonner"
import type { Diagram } from "@/lib/store"

interface DiagramSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  diagram: Diagram
  onUpdate: (diagram: Diagram) => void
}

export function DiagramSettingsDialog({ open, onOpenChange, diagram, onUpdate }: DiagramSettingsDialogProps) {
  const [isPublic, setIsPublic] = useState(diagram.isPublic || false)
  const [publicUrl, setPublicUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (diagram.publicId) {
      const url = `${window.location.origin}/view/${diagram.publicId}`
      setPublicUrl(url)
    }
  }, [diagram.publicId])

  const handleTogglePublic = async (checked: boolean) => {
    setLoading(true)
    try {
      const updatedDiagram = await mockApi.togglePublicSharing(diagram.id, checked)
      setIsPublic(checked)
      onUpdate(updatedDiagram)

      if (checked) {
        const url = `${window.location.origin}/view/${updatedDiagram.publicId}`
        setPublicUrl(url)
        toast.success("Diagram is now publicly accessible")
      } else {
        setPublicUrl("")
        toast.success("Public sharing disabled")
      }
    } catch (error) {
      toast.error("Failed to update sharing settings")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    toast.success("Link copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenPublicView = () => {
    window.open(publicUrl, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Diagram Settings</DialogTitle>
          <DialogDescription>Manage sharing and visibility settings for this diagram.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-sharing" className="text-base">
                Share Publicly
              </Label>
              <p className="text-sm text-muted-foreground">
                Anyone with the link can view this diagram in read-only mode
              </p>
            </div>
            <Switch id="public-sharing" checked={isPublic} onCheckedChange={handleTogglePublic} disabled={loading} />
          </div>

          {isPublic && publicUrl && (
            <div className="space-y-3 rounded-lg border p-4 bg-muted/50">
              <Label className="text-sm font-medium">Public Link</Label>
              <div className="flex gap-2">
                <Input value={publicUrl} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={handleCopyUrl} className="shrink-0 bg-transparent">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleOpenPublicView}
                  className="shrink-0 bg-transparent"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This link allows anyone to view your diagram without editing permissions.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
