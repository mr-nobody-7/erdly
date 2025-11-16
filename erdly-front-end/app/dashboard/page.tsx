"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  FileText,
  Clock,
  Users,
  MoreVertical,
  Pencil,
  Trash2,
  ExternalLink,
  Building2,
  FolderKanban,
  ArrowRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { mockApi } from "@/lib/mock-api"
import { useStore } from "@/lib/store"
import { formatDistanceToNow } from "date-fns"
import type { Diagram } from "@/lib/store"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const router = useRouter()
  const { user, organizations, projects, diagrams, setDiagrams, addDiagram, updateDiagram, deleteDiagram } = useStore()
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  // Rename dialog state
  const [renameDialog, setRenameDialog] = useState<{ open: boolean; diagram: Diagram | null }>({
    open: false,
    diagram: null,
  })
  const [newName, setNewName] = useState("")
  const [renaming, setRenaming] = useState(false)

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; diagram: Diagram | null }>({
    open: false,
    diagram: null,
  })
  const [deleting, setDeleting] = useState(false)

  const [createDialog, setCreateDialog] = useState(false)
  const [newDiagramName, setNewDiagramName] = useState("")
  const [newDiagramDescription, setNewDiagramDescription] = useState("")

  useEffect(() => {
    const loadDiagrams = async () => {
      try {
        if (diagrams.length === 0) {
          const data = await mockApi.getDiagrams()
          setDiagrams(data)
        }
      } catch (error) {
        console.error("Failed to load diagrams:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDiagrams()
  }, [diagrams.length, setDiagrams])

  const handleNewDiagramClick = () => {
    setNewDiagramName("")
    setNewDiagramDescription("")
    setCreateDialog(true)
  }

  const handleCreateDiagram = async () => {
    if (!user || !newDiagramName.trim()) return

    setCreating(true)
    try {
      const newDiagram = await mockApi.createDiagram({
        name: newDiagramName.trim(),
        description: newDiagramDescription.trim(),
        ownerId: user.id,
        nodes: [],
        edges: [],
      })
      addDiagram(newDiagram)
      setCreateDialog(false)
      router.push(`/dashboard/editor/${newDiagram.id}`)
    } catch (error) {
      console.error("Failed to create diagram:", error)
    } finally {
      setCreating(false)
    }
  }

  const handleRenameClick = (diagram: Diagram) => {
    setNewName(diagram.name)
    setRenameDialog({ open: true, diagram })
  }

  const handleRename = async () => {
    if (!renameDialog.diagram || !newName.trim()) return

    setRenaming(true)
    try {
      await mockApi.updateDiagram(renameDialog.diagram.id, { name: newName.trim() })
      updateDiagram(renameDialog.diagram.id, { name: newName.trim() })
      setRenameDialog({ open: false, diagram: null })
    } catch (error) {
      console.error("Failed to rename diagram:", error)
    } finally {
      setRenaming(false)
    }
  }

  const handleDeleteClick = (diagram: Diagram) => {
    setDeleteDialog({ open: true, diagram })
  }

  const handleDelete = async () => {
    if (!deleteDialog.diagram) return

    setDeleting(true)
    try {
      await mockApi.deleteDiagram(deleteDialog.diagram.id)
      deleteDiagram(deleteDialog.diagram.id)
      setDeleteDialog({ open: false, diagram: null })
    } catch (error) {
      console.error("Failed to delete diagram:", error)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-16 rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your organizations, projects, and diagrams</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/dashboard/organizations")}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <CardDescription>Workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold">{organizations.length}</div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <CardDescription>Across all organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FolderKanban className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold">{projects.length}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Diagrams</CardTitle>
            <CardDescription>Total ERD diagrams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <FileText className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-3xl font-bold">{diagrams.length}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card
            className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
            onClick={() => router.push("/dashboard/organizations")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Manage Organizations
              </CardTitle>
              <CardDescription>View and manage your workspaces</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
            onClick={() => router.push("/dashboard/organizations")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Project
              </CardTitle>
              <CardDescription>Start a new project in an organization</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
            onClick={() => router.push("/dashboard/organizations")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Browse Diagrams
              </CardTitle>
              <CardDescription>View all your ERD diagrams</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      {diagrams.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Diagrams</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {diagrams.slice(0, 3).map((diagram) => {
              const project = projects.find((p) => p.id === diagram.projectId)
              const org = organizations.find((o) => o.id === project?.organizationId)

              return (
                <Card
                  key={diagram.id}
                  className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
                  onClick={() => router.push(`/dashboard/editor/${diagram.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 truncate">
                      <FileText className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{diagram.name}</span>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {org?.name} / {project?.name}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Diagrams List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">My Diagrams</h2>
        {diagrams.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No diagrams yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Get started by creating your first ERD diagram</p>
              <Button onClick={handleNewDiagramClick}>
                <Plus className="mr-2 h-4 w-4" />
                Create Diagram
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {diagrams.map((diagram) => (
              <Card key={diagram.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] h-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="flex items-center gap-2 truncate">
                        <FileText className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{diagram.name}</span>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {diagram.description || "No description"}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/editor/${diagram.id}`)}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRenameClick(diagram)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(diagram)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDistanceToNow(new Date(diagram.updatedAt), { addSuffix: true })}
                    </div>
                    {diagram.teamId && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Team
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Diagram</DialogTitle>
            <DialogDescription>
              Enter a name and description for your new ERD diagram. You can always change these later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="diagram-name">
                Diagram Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="diagram-name"
                value={newDiagramName}
                onChange={(e) => setNewDiagramName(e.target.value)}
                placeholder="e.g., E-commerce Database"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !creating && newDiagramName.trim()) {
                    handleCreateDiagram()
                  }
                }}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagram-description">Description (optional)</Label>
              <Textarea
                id="diagram-description"
                value={newDiagramDescription}
                onChange={(e) => setNewDiagramDescription(e.target.value)}
                placeholder="Describe what this diagram is for..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialog(false)} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreateDiagram} disabled={creating || !newDiagramName.trim()}>
              {creating ? "Creating..." : "Create Diagram"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialog.open} onOpenChange={(open) => setRenameDialog({ open, diagram: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Diagram</DialogTitle>
            <DialogDescription>Enter a new name for your diagram.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Diagram Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter diagram name"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !renaming) {
                    handleRename()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameDialog({ open: false, diagram: null })}
              disabled={renaming}
            >
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={renaming || !newName.trim()}>
              {renaming ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, diagram: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Diagram</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.diagram?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, diagram: null })}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
