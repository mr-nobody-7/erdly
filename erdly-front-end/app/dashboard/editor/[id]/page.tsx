"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  BackgroundVariant,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import "../../react-flow-custom.css"
import { Button } from "@/components/ui/button"
import { ArrowLeft, History, Settings } from "lucide-react"
import { mockApi, type DiagramVersion } from "@/lib/mock-api"
import { useStore } from "@/lib/store"
import TableNode, { type TableField } from "@/components/diagram/table-node"
import { DiagramToolbar } from "@/components/diagram/diagram-toolbar"
import { TableEditorDialog } from "@/components/diagram/table-editor-dialog"
import { PresenceAvatars } from "@/components/diagram/presence-avatars"
import { VersionHistoryPanel } from "@/components/diagram/version-history-panel"
import { toPng } from "html-to-image"
import { DiagramSettingsDialog } from "@/components/diagram/diagram-settings-dialog"
import { toast } from "sonner"
import { validateSchema, generateTableName } from "@/lib/schemaUtils"
import { optimizeLayout } from "@/lib/aiHelper"

const nodeTypes = {
  table: TableNode,
}

function DiagramEditorContent() {
  const params = useParams()
  const router = useRouter()
  const { currentDiagram, setCurrentDiagram, updateDiagram, editor, user } = useStore()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loading, setLoading] = useState(true)
  const { zoomIn, zoomOut, fitView, getNodes, getEdges } = useReactFlow()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const [tableDialogOpen, setTableDialogOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<{ nodeId: string; tableName: string; fields: TableField[] } | null>(
    null,
  )
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)

  const attachCallbacksToNodes = useCallback(
    (nodesToUpdate: Node[]) => {
      return nodesToUpdate.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onEditTable: () => {
            setEditingTable({
              nodeId: node.id,
              tableName: node.data.label,
              fields: node.data.fields || [],
            })
            setTableDialogOpen(true)
          },
          onDeleteTable: () => {
            setNodes((nds) => nds.filter((n) => n.id !== node.id))
            setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id))
            editor.saveToHistory()
            toast.success("Table deleted")
          },
        },
      }))
    },
    [editor, setNodes, setEdges],
  )

  useEffect(() => {
    const loadDiagram = async () => {
      try {
        const diagram = await mockApi.getDiagram(params.id as string)

        if (!diagram) {
          setLoading(false)
          return
        }

        setCurrentDiagram(diagram)

        const nodesWithCallbacks = attachCallbacksToNodes(diagram.nodes || [])
        setNodes(nodesWithCallbacks)
        setEdges(diagram.edges || [])
        editor.loadDiagramData(nodesWithCallbacks, diagram.edges || [])
      } catch (error) {
        console.error("Failed to load diagram:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDiagram()
  }, [params.id, attachCallbacksToNodes])

  useEffect(() => {
    if (!currentDiagram || loading) return

    const autoSaveInterval = setInterval(async () => {
      try {
        const updatedDiagram = {
          ...currentDiagram,
          nodes,
          edges,
          updatedAt: new Date().toISOString(),
        }

        await mockApi.saveDiagram(updatedDiagram)
        updateDiagram(currentDiagram.id, {
          nodes,
          edges,
          updatedAt: updatedDiagram.updatedAt,
        })
      } catch (error) {
        console.error("Auto-save failed:", error)
      }
    }, 10000)

    return () => clearInterval(autoSaveInterval)
  }, [currentDiagram, nodes, edges, loading, updateDiagram])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
        const selectedNodes = getNodes().filter((n) => n.selected)
        const selectedEdges = getEdges().filter((e) => e.selected)

        if (selectedNodes.length > 0) {
          setNodes((nds) => nds.filter((n) => !n.selected))
          setEdges((eds) => eds.filter((e) => !selectedNodes.some((n) => n.id === e.source || n.id === e.target)))
          editor.saveToHistory()
          toast.success(`Deleted ${selectedNodes.length} table(s)`)
        } else if (selectedEdges.length > 0) {
          setEdges((eds) => eds.filter((e) => !e.selected))
          editor.saveToHistory()
          toast.success(`Deleted ${selectedEdges.length} relationship(s)`)
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        if (currentDiagram) {
          mockApi.saveDiagram({
            ...currentDiagram,
            nodes,
            edges,
            updatedAt: new Date().toISOString(),
          })
          toast.success("Diagram saved")
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        if (editor.canUndo()) {
          editor.undo()
          const state = useStore.getState().editor
          const nodesWithCallbacks = attachCallbacksToNodes(state.nodes)
          setNodes(nodesWithCallbacks)
          setEdges(state.edges)
        }
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault()
        if (editor.canRedo()) {
          editor.redo()
          const state = useStore.getState().editor
          const nodesWithCallbacks = attachCallbacksToNodes(state.nodes)
          setNodes(nodesWithCallbacks)
          setEdges(state.edges)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nodes, edges, editor, currentDiagram, getNodes, getEdges, attachCallbacksToNodes])

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = addEdge(
        {
          ...connection,
          type: "smoothstep",
          animated: true,
          data: { relationType: "1-n" },
          label: "1-n",
          labelStyle: { fontSize: 10, fontWeight: 600 },
          labelBgStyle: { fill: "hsl(var(--background))", opacity: 0.9 },
        },
        edges,
      )
      setEdges(newEdge)
      editor.saveToHistory()
      toast.success("Relationship created")
    },
    [edges, editor, setEdges],
  )

  const handleAddTable = useCallback(() => {
    const existingNames = nodes.map((n) => n.data.label)
    const newTableName = generateTableName(existingNames)
    const newNodeId = `table-${Date.now()}`

    const newNode = {
      id: newNodeId,
      type: "table",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: newTableName,
        fields: [],
        onEditTable: () => {
          const node = getNodes().find((n) => n.id === newNodeId)
          if (node) {
            setEditingTable({
              nodeId: newNodeId,
              tableName: node.data.label,
              fields: node.data.fields || [],
            })
            setTableDialogOpen(true)
          }
        },
        onDeleteTable: () => {
          setNodes((nds) => nds.filter((n) => n.id !== newNodeId))
          setEdges((eds) => eds.filter((e) => e.source !== newNodeId && e.target !== newNodeId))
          editor.saveToHistory()
          toast.success("Table deleted")
        },
      },
    }

    setNodes((nds) => [...nds, newNode])
    editor.saveToHistory()
    toast.success(`Added ${newTableName}`)
  }, [nodes, editor, getNodes, setNodes, setEdges])

  const handleAutoLayout = useCallback(async () => {
    toast.loading("Optimizing layout...")
    const optimizedNodes = await optimizeLayout(getNodes(), getEdges())
    const nodesWithCallbacks = attachCallbacksToNodes(optimizedNodes)
    setNodes(nodesWithCallbacks)
    editor.saveToHistory()
    toast.success("Layout optimized")
  }, [getNodes, getEdges, attachCallbacksToNodes, setNodes, editor])

  const handleResetDiagram = useCallback(() => {
    if (confirm("Are you sure you want to reset the diagram? This will remove all tables and relationships.")) {
      setNodes([])
      setEdges([])
      editor.saveToHistory()
      toast.success("Diagram reset")
    }
  }, [setNodes, setEdges, editor])

  const handleValidateSchema = useCallback(() => {
    const errors = validateSchema(getNodes(), getEdges())
    if (errors.length === 0) {
      toast.success("Schema is valid!")
    } else {
      const errorCount = errors.filter((e) => e.type === "error").length
      const warningCount = errors.filter((e) => e.type === "warning").length
      toast.warning(`Found ${errorCount} error(s) and ${warningCount} warning(s)`)
    }
  }, [getNodes, getEdges])

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading diagram...</p>
        </div>
      </div>
    )
  }

  if (!currentDiagram) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Diagram not found</h2>
          <p className="text-sm text-muted-foreground mb-4">The diagram you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="border-b bg-background p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{currentDiagram.name}</h1>
            <p className="text-sm text-muted-foreground">{currentDiagram.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PresenceAvatars />
          <Button variant="outline" size="sm" onClick={handleValidateSchema}>
            Validate Schema
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSettingsDialogOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" onClick={() => setVersionHistoryOpen(!versionHistoryOpen)}>
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>
      </div>

      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="transition-all duration-300"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(var(--muted-foreground) / 0.2)" />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(node) => {
              if (node.selected) return "hsl(var(--primary))"
              return "hsl(var(--muted))"
            }}
            maskColor="hsl(var(--background) / 0.8)"
            className="!absolute !bottom-4 !right-4 !border !border-border !rounded-lg !shadow-lg"
          />
          <Panel position="top-right">
            <DiagramToolbar
              onZoomIn={() => zoomIn()}
              onZoomOut={() => zoomOut()}
              onFitView={() => fitView()}
              onExportJSON={() => {
                const data = {
                  nodes: getNodes(),
                  edges: getEdges(),
                  diagram: currentDiagram,
                }
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `${currentDiagram?.name || "diagram"}.json`
                a.click()
                URL.revokeObjectURL(url)
                toast.success("Diagram exported as JSON")
              }}
              onExportImage={() => {
                if (reactFlowWrapper.current) {
                  toPng(reactFlowWrapper.current, {
                    filter: (node) => {
                      return (
                        !node.classList?.contains("react-flow__controls") &&
                        !node.classList?.contains("react-flow__minimap") &&
                        !node.classList?.contains("react-flow__panel")
                      )
                    },
                  })
                    .then((dataUrl) => {
                      const a = document.createElement("a")
                      a.href = dataUrl
                      a.download = `${currentDiagram?.name || "diagram"}.png`
                      a.click()
                      toast.success("Diagram exported as image")
                    })
                    .catch((error) => {
                      console.error("Failed to export image:", error)
                      toast.error("Failed to export image")
                    })
                }
              }}
              onUndo={() => {
                editor.undo()
                const state = useStore.getState().editor
                const nodesWithCallbacks = attachCallbacksToNodes(state.nodes)
                setNodes(nodesWithCallbacks)
                setEdges(state.edges)
              }}
              onRedo={() => {
                editor.redo()
                const state = useStore.getState().editor
                const nodesWithCallbacks = attachCallbacksToNodes(state.nodes)
                setNodes(nodesWithCallbacks)
                setEdges(state.edges)
              }}
              onAddTable={handleAddTable}
              onAutoLayout={handleAutoLayout}
              onReset={handleResetDiagram}
              canUndo={editor.canUndo()}
              canRedo={editor.canRedo()}
            />
          </Panel>
        </ReactFlow>

        <VersionHistoryPanel
          diagramId={params.id as string}
          onRestore={async (version: DiagramVersion) => {
            if (currentDiagram && user) {
              await mockApi.saveVersion({
                diagramId: currentDiagram.id,
                name: `Before restore - ${new Date().toLocaleString()}`,
                nodes,
                edges,
                createdBy: user.id,
              })
            }

            const nodesWithCallbacks = attachCallbacksToNodes(version.nodes)
            setNodes(nodesWithCallbacks)
            setEdges(version.edges)
            editor.loadDiagramData(nodesWithCallbacks, version.edges)

            if (currentDiagram) {
              await mockApi.saveDiagram({
                ...currentDiagram,
                nodes: version.nodes,
                edges: version.edges,
                updatedAt: new Date().toISOString(),
              })
              updateDiagram(currentDiagram.id, {
                nodes: version.nodes,
                edges: version.edges,
                updatedAt: new Date().toISOString(),
              })
            }

            setVersionHistoryOpen(false)
            toast.success("Version restored successfully")
          }}
          open={versionHistoryOpen}
          onOpenChange={setVersionHistoryOpen}
        />
      </div>

      <TableEditorDialog
        open={tableDialogOpen}
        onOpenChange={setTableDialogOpen}
        tableName={editingTable?.tableName || ""}
        fields={editingTable?.fields || []}
        onSave={(tableName: string, fields: TableField[]) => {
          if (!editingTable) return

          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === editingTable.nodeId) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    label: tableName,
                    fields: [...fields],
                  },
                }
              }
              return node
            }),
          )

          editor.setNodes(
            getNodes().map((node) => {
              if (node.id === editingTable.nodeId) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    label: tableName,
                    fields: [...fields],
                  },
                }
              }
              return node
            }),
          )

          editor.saveToHistory()
          setEditingTable(null)
          toast.success("Table updated successfully")
        }}
      />

      <DiagramSettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
        diagram={currentDiagram}
        onUpdate={(updatedDiagram: any) => {
          setCurrentDiagram(updatedDiagram)
          updateDiagram(updatedDiagram.id, updatedDiagram)
          toast.success("Settings updated successfully")
        }}
      />
    </div>
  )
}

export default function DiagramEditorPage() {
  return (
    <ReactFlowProvider>
      <DiagramEditorContent />
    </ReactFlowProvider>
  )
}
