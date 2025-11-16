"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { mockApi } from "@/lib/mock-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { FileText, Plus, Trash2, MoreVertical, ArrowLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ProjectDiagramsPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string

  const { diagrams, setDiagrams, addDiagram, deleteDiagram, currentProject, setCurrentProject } = useStore()
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newDiagramName, setNewDiagramName] = useState("")
  const [newDiagramDescription, setNewDiagramDescription] = useState("")
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadProjectAndDiagrams()
  }, [projectId])

  const loadProjectAndDiagrams = async () => {
    try {
      setLoading(true)
      const project = await mockApi.getProject(projectId)
      if (project) {
        setCurrentProject(project)
      }
      const diagramsList = await mockApi.getDiagrams(projectId)
      setDiagrams(diagramsList)
    } catch (error) {
      toast.error("Failed to load diagrams")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDiagram = async () => {
    if (!newDiagramName.trim()) {
      toast.error("Diagram name is required")
      return
    }

    try {
      setCreating(true)
      const newDiagram = await mockApi.createDiagram({
        name: newDiagramName,
        description: newDiagramDescription,
        projectId: projectId,
        ownerId: "1",
        nodes: [],
        edges: [],
      })
      addDiagram(newDiagram)
      toast.success("Diagram created successfully")
      router.push(`/dashboard/editor/${newDiagram.id}`)
    } catch (error) {
      toast.error("Failed to create diagram")
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteDiagram = async (id: string) => {
    if (!confirm("Are you sure you want to delete this diagram?")) return

    try {
      await mockApi.deleteDiagram(id)
      deleteDiagram(id)
      toast.success("Diagram deleted successfully")
    } catch (error) {
      toast.error("Failed to delete diagram")
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{currentProject?.name}</h1>
          <p className="text-muted-foreground mt-2">{currentProject?.description}</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Diagram
        </Button>
      </div>

      {diagrams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No diagrams yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first diagram to start designing your database schema
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Diagram
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {diagrams.map((diagram) => (
            <Card key={diagram.id} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{diagram.name}</CardTitle>
                      <CardDescription className="text-sm line-clamp-1">{diagram.description}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDeleteDiagram(diagram.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Updated {new Date(diagram.updatedAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/editor/${diagram.id}`} className="w-full">
                  <Button variant="outline" className="w-full bg-transparent">
                    Open Diagram
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Diagram</DialogTitle>
            <DialogDescription>Create a new ER diagram for your database schema</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="diagram-name">Diagram Name</Label>
              <Input
                id="diagram-name"
                placeholder="My Database Schema"
                value={newDiagramName}
                onChange={(e) => setNewDiagramName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateDiagram()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagram-description">Description (optional)</Label>
              <Textarea
                id="diagram-description"
                placeholder="Describe your diagram..."
                value={newDiagramDescription}
                onChange={(e) => setNewDiagramDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreateDiagram} disabled={creating || !newDiagramName.trim()}>
              {creating ? "Creating..." : "Create Diagram"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
