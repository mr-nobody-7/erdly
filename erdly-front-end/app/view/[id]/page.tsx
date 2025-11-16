"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ReactFlow, Background, Controls, MiniMap, ReactFlowProvider, Panel } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Button } from "@/components/ui/button"
import { ExternalLink, Lock } from "lucide-react"
import { mockApi } from "@/lib/mock-api"
import type { Diagram } from "@/lib/store"
import TableNode from "@/components/diagram/table-node"
import { Skeleton } from "@/components/ui/skeleton"

const nodeTypes = {
  table: TableNode,
}

function PublicDiagramViewerContent() {
  const params = useParams()
  const [diagram, setDiagram] = useState<Diagram | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPublicDiagram = async () => {
      try {
        const publicDiagram = await mockApi.getPublicDiagram(params.id as string)
        if (publicDiagram) {
          setDiagram(publicDiagram)
        } else {
          setError("This diagram is not publicly accessible or doesn't exist.")
        }
      } catch (err) {
        setError("Failed to load diagram. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadPublicDiagram()
  }, [params.id])

  if (loading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="border-b bg-background p-4">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading diagram...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !diagram) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">{error || "This diagram is not available."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b bg-background p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{diagram.name}</h1>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <Lock className="h-3 w-3" />
              Read-only
            </span>
          </div>
          {diagram.description && <p className="text-sm text-muted-foreground mt-1">{diagram.description}</p>}
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Create Your Own
          </a>
        </Button>
      </div>

      <div className="flex-1">
        <ReactFlow
          nodes={diagram.nodes}
          edges={diagram.edges}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={true}
          zoomOnScroll={true}
        >
          <Background />
          <Controls showInteractive={false} />
          <MiniMap />
          <Panel position="top-center" className="bg-yellow-100 dark:bg-yellow-900 px-4 py-2 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
              You're viewing a read-only version of this diagram
            </p>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  )
}

export default function PublicDiagramViewerPage() {
  return (
    <ReactFlowProvider>
      <PublicDiagramViewerContent />
    </ReactFlowProvider>
  )
}
