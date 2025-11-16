"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { mockApi } from "@/lib/mock-api"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Building2, Plus, Trash2 } from "lucide-react"

export default function OrganizationsPage() {
  const router = useRouter()
  const { organizations, setOrganizations, setCurrentOrganization, addOrganization, deleteOrganization } = useStore()
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newOrgName, setNewOrgName] = useState("")
  const [newOrgSlug, setNewOrgSlug] = useState("")
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadOrganizations()
  }, [])

  const loadOrganizations = async () => {
    try {
      setLoading(true)
      const orgs = await mockApi.getOrganizations()
      setOrganizations(orgs)
    } catch (error) {
      toast.error("Failed to load organizations")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrganization = async () => {
    if (!newOrgName.trim()) {
      toast.error("Organization name is required")
      return
    }

    try {
      setCreating(true)
      const slug = newOrgSlug || newOrgName.toLowerCase().replace(/\s+/g, "-")
      const newOrg = await mockApi.createOrganization({
        name: newOrgName,
        slug,
        ownerId: "1", // Mock user ID
      })
      addOrganization(newOrg)
      toast.success("Organization created successfully")
      setCreateDialogOpen(false)
      setNewOrgName("")
      setNewOrgSlug("")
    } catch (error) {
      toast.error("Failed to create organization")
    } finally {
      setCreating(false)
    }
  }

  const handleSelectOrganization = (org: any) => {
    setCurrentOrganization(org)
    router.push(`/dashboard/organizations/${org.id}/projects`)
  }

  const handleDeleteOrganization = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this organization?")) return

    try {
      await mockApi.deleteOrganization(id)
      deleteOrganization(id)
      toast.success("Organization deleted successfully")
    } catch (error) {
      toast.error("Failed to delete organization")
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground mt-2">Manage your organizations and workspaces</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Organization
        </Button>
      </div>

      {organizations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No organizations yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first organization to start managing projects and diagrams
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Organization
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <Card
              key={org.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleSelectOrganization(org)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{org.name}</CardTitle>
                      <CardDescription className="text-sm">@{org.slug}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteOrganization(org.id, e)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Created {new Date(org.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>Create a new organization to manage projects and teams</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                placeholder="Acme Inc."
                value={newOrgName}
                onChange={(e) => {
                  setNewOrgName(e.target.value)
                  if (!newOrgSlug) {
                    setNewOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-slug">Slug</Label>
              <Input
                id="org-slug"
                placeholder="acme-inc"
                value={newOrgSlug}
                onChange={(e) => setNewOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              />
              <p className="text-xs text-muted-foreground">Used in URLs and for identification</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrganization} disabled={creating}>
              {creating ? "Creating..." : "Create Organization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
