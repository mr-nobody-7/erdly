"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, X, RotateCcw, Clock } from "lucide-react"
import { mockApi, type DiagramVersion } from "@/lib/mock-api"
import { formatDistanceToNow } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface VersionHistoryPanelProps {
  diagramId: string
  onRestore: (version: DiagramVersion) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VersionHistoryPanel({ diagramId, onRestore, open, onOpenChange }: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<DiagramVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<DiagramVersion | null>(null)

  useEffect(() => {
    if (open) {
      loadVersions()
    }
  }, [open, diagramId])

  const loadVersions = async () => {
    setLoading(true)
    try {
      const data = await mockApi.fetchVersions(diagramId)
      setVersions(data)
    } catch (error) {
      console.error("Failed to load versions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestoreClick = (version: DiagramVersion) => {
    setSelectedVersion(version)
    setRestoreDialogOpen(true)
  }

  const handleConfirmRestore = () => {
    if (selectedVersion) {
      onRestore(selectedVersion)
      setRestoreDialogOpen(false)
      setSelectedVersion(null)
    }
  }

  if (!open) return null

  return (
    <>
      <div className="absolute right-0 top-0 bottom-0 w-80 bg-background border-l shadow-lg z-10 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            <h2 className="font-semibold">Version History</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              Loading versions...
            </div>
          ) : versions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No version history yet</p>
              <p className="text-sm mt-1">Versions are created automatically when you save</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {versions.map((version, index) => (
                <div key={version.id} className="p-3 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{version.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(version.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    {index !== 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestoreClick(version)}
                        className="shrink-0"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restore
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{version.nodes.length} tables</span>
                    <span>{version.edges.length} connections</span>
                  </div>
                  {index === 0 && (
                    <div className="mt-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Current</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Version?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your current diagram with the selected version. Your current work will be saved as a new
              version before restoring.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRestore}>Restore Version</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
