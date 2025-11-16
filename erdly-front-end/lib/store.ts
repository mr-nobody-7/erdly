import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Node, Edge } from "@xyflow/react"

// Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  organizationId: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Diagram {
  id: string
  name: string
  description?: string
  projectId: string // Added projectId to link diagrams to projects
  createdAt: string
  updatedAt: string
  ownerId: string
  teamId?: string
  nodes: Node[]
  edges: Edge[]
  isPublic?: boolean
  publicId?: string
}

export interface Team {
  id: string
  name: string
  members: string[]
  ownerId: string
}

interface DiagramEditorState {
  nodes: Node[]
  edges: Edge[]
  history: { nodes: Node[]; edges: Edge[] }[]
  historyIndex: number
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  addNode: (node: Node) => void
  updateNode: (id: string, data: any) => void
  deleteNode: (id: string) => void
  addEdge: (edge: Edge) => void
  deleteEdge: (id: string) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  saveToHistory: () => void
  loadDiagramData: (nodes: Node[], edges: Edge[]) => void
}

interface AppState {
  // User state
  user: User | null
  setUser: (user: User | null) => void

  // Organizations state
  organizations: Organization[]
  currentOrganization: Organization | null
  setOrganizations: (organizations: Organization[]) => void
  setCurrentOrganization: (organization: Organization | null) => void
  addOrganization: (organization: Organization) => void
  updateOrganization: (id: string, updates: Partial<Organization>) => void
  deleteOrganization: (id: string) => void

  // Projects state
  projects: Project[]
  currentProject: Project | null
  setProjects: (projects: Project[]) => void
  setCurrentProject: (project: Project | null) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void

  // Diagrams state
  diagrams: Diagram[]
  currentDiagram: Diagram | null
  setDiagrams: (diagrams: Diagram[]) => void
  setCurrentDiagram: (diagram: Diagram | null) => void
  addDiagram: (diagram: Diagram) => void
  updateDiagram: (id: string, updates: Partial<Diagram>) => void
  deleteDiagram: (id: string) => void

  // Teams state
  teams: Team[]
  currentTeam: Team | null
  setTeams: (teams: Team[]) => void
  setCurrentTeam: (team: Team | null) => void

  // UI state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void

  // Diagram editor state
  editor: DiagramEditorState
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),

      // Organizations state
      organizations: [],
      currentOrganization: null,
      setOrganizations: (organizations) => set({ organizations }),
      setCurrentOrganization: (organization) => set({ currentOrganization: organization }),
      addOrganization: (organization) =>
        set((state) => ({
          organizations: [...state.organizations, organization],
        })),
      updateOrganization: (id, updates) =>
        set((state) => ({
          organizations: state.organizations.map((o) => (o.id === id ? { ...o, ...updates } : o)),
          currentOrganization:
            state.currentOrganization?.id === id
              ? { ...state.currentOrganization, ...updates }
              : state.currentOrganization,
        })),
      deleteOrganization: (id) =>
        set((state) => ({
          organizations: state.organizations.filter((o) => o.id !== id),
          currentOrganization: state.currentOrganization?.id === id ? null : state.currentOrganization,
        })),

      // Projects state
      projects: [],
      currentProject: null,
      setProjects: (projects) => set({ projects }),
      setCurrentProject: (project) => set({ currentProject: project }),
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
          currentProject:
            state.currentProject?.id === id ? { ...state.currentProject, ...updates } : state.currentProject,
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
        })),

      // Diagrams state
      diagrams: [],
      currentDiagram: null,
      setDiagrams: (diagrams) => set({ diagrams }),
      setCurrentDiagram: (diagram) => set({ currentDiagram: diagram }),
      addDiagram: (diagram) =>
        set((state) => ({
          diagrams: [...state.diagrams, diagram],
        })),
      updateDiagram: (id, updates) =>
        set((state) => ({
          diagrams: state.diagrams.map((d) => (d.id === id ? { ...d, ...updates } : d)),
          currentDiagram:
            state.currentDiagram?.id === id ? { ...state.currentDiagram, ...updates } : state.currentDiagram,
        })),
      deleteDiagram: (id) =>
        set((state) => ({
          diagrams: state.diagrams.filter((d) => d.id !== id),
          currentDiagram: state.currentDiagram?.id === id ? null : state.currentDiagram,
        })),

      // Teams state
      teams: [],
      currentTeam: null,
      setTeams: (teams) => set({ teams }),
      setCurrentTeam: (team) => set({ currentTeam: team }),

      // UI state
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      theme: "light",
      setTheme: (theme) => set({ theme }),

      // Diagram editor state management
      editor: {
        nodes: [],
        edges: [],
        history: [],
        historyIndex: -1,

        setNodes: (nodes) =>
          set((state) => ({
            editor: { ...state.editor, nodes },
          })),

        setEdges: (edges) =>
          set((state) => ({
            editor: { ...state.editor, edges },
          })),

        addNode: (node) =>
          set((state) => {
            const newNodes = [...state.editor.nodes, node]
            return {
              editor: { ...state.editor, nodes: newNodes },
            }
          }),

        updateNode: (id, data) =>
          set((state) => ({
            editor: {
              ...state.editor,
              nodes: state.editor.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)),
            },
          })),

        deleteNode: (id) =>
          set((state) => ({
            editor: {
              ...state.editor,
              nodes: state.editor.nodes.filter((n) => n.id !== id),
              edges: state.editor.edges.filter((e) => e.source !== id && e.target !== id),
            },
          })),

        addEdge: (edge) =>
          set((state) => ({
            editor: {
              ...state.editor,
              edges: [...state.editor.edges, edge],
            },
          })),

        deleteEdge: (id) =>
          set((state) => ({
            editor: {
              ...state.editor,
              edges: state.editor.edges.filter((e) => e.id !== id),
            },
          })),

        saveToHistory: () =>
          set((state) => {
            const newHistory = state.editor.history.slice(0, state.editor.historyIndex + 1)
            newHistory.push({
              nodes: state.editor.nodes,
              edges: state.editor.edges,
            })
            return {
              editor: {
                ...state.editor,
                history: newHistory,
                historyIndex: newHistory.length - 1,
              },
            }
          }),

        undo: () =>
          set((state) => {
            if (state.editor.historyIndex > 0) {
              const newIndex = state.editor.historyIndex - 1
              const snapshot = state.editor.history[newIndex]
              return {
                editor: {
                  ...state.editor,
                  nodes: snapshot.nodes,
                  edges: snapshot.edges,
                  historyIndex: newIndex,
                },
              }
            }
            return state
          }),

        redo: () =>
          set((state) => {
            if (state.editor.historyIndex < state.editor.history.length - 1) {
              const newIndex = state.editor.historyIndex + 1
              const snapshot = state.editor.history[newIndex]
              return {
                editor: {
                  ...state.editor,
                  nodes: snapshot.nodes,
                  edges: snapshot.edges,
                  historyIndex: newIndex,
                },
              }
            }
            return state
          }),

        canUndo: () => get().editor.historyIndex > 0,
        canRedo: () => get().editor.historyIndex < get().editor.history.length - 1,

        loadDiagramData: (nodes, edges) =>
          set((state) => ({
            editor: {
              ...state.editor,
              nodes,
              edges,
              history: [{ nodes, edges }],
              historyIndex: 0,
            },
          })),
      },
    }),
    {
      name: "erdly-storage",
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        organizations: state.organizations,
        currentOrganization: state.currentOrganization,
        projects: state.projects,
        currentProject: state.currentProject,
        diagrams: state.diagrams,
      }),
    },
  ),
)
