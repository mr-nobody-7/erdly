import type { User, Diagram, Team } from "./store"

export interface SubscriptionPlan {
  id: string
  name: "free" | "pro" | "enterprise"
  price: number
  interval: "month" | "year"
  features: string[]
  maxDiagrams: number
  maxTeamMembers: number
  status: "active" | "canceled" | "past_due"
  currentPeriodEnd: string
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

export interface TeamMember extends User {
  role: "owner" | "editor" | "viewer"
  joinedAt: string
}

export interface DiagramVersion {
  id: string
  diagramId: string
  name: string
  timestamp: string
  nodes: any[]
  edges: any[]
  createdBy: string
}

const STORAGE_KEYS = {
  DIAGRAMS: "erdly-mock-diagrams",
  USERS: "erdly-mock-users",
  TEAMS: "erdly-mock-teams",
  SUBSCRIPTION: "erdly-mock-subscription",
  VERSIONS: "erdly-mock-versions",
  ORGANIZATIONS: "erdly-mock-organizations",
  PROJECTS: "erdly-mock-projects",
}

const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error)
    return defaultValue
  }
}

const saveToStorage = <T,>(key: string, value: T): void => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error)
  }
}

const defaultMockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg?height=40&width=40",
}

const defaultMockDiagrams: Diagram[] = [
  {
    id: "1",
    name: "E-commerce Database",
    description: "Main database schema for the e-commerce platform",
    projectId: "proj-1",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    ownerId: "1",
    nodes: [],
    edges: [],
  },
  {
    id: "2",
    name: "User Management System",
    description: "Authentication and user profile management",
    projectId: "proj-1",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    ownerId: "1",
    teamId: "1",
    nodes: [],
    edges: [],
  },
  {
    id: "3",
    name: "Analytics Dashboard",
    description: "Data warehouse schema for analytics",
    projectId: "proj-2",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    ownerId: "1",
    nodes: [],
    edges: [],
  },
]

const defaultMockUsers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "owner",
    joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    name: "Sarah Smith",
    email: "sarah@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "editor",
    joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "viewer",
    joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "viewer",
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const defaultMockOrganizations: Organization[] = [
  {
    id: "org-1",
    name: "My Organization",
    slug: "my-organization",
    ownerId: "1",
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const defaultMockProjects: Project[] = [
  {
    id: "proj-1",
    name: "E-commerce Platform",
    description: "Main e-commerce application database schemas",
    organizationId: "org-1",
    createdBy: "1",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "proj-2",
    name: "Analytics System",
    description: "Data warehouse and analytics schemas",
    organizationId: "org-1",
    createdBy: "1",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const defaultMockTeams: Team[] = [
  {
    id: "1",
    name: "Engineering Team",
    members: ["1", "2", "3", "4"],
    ownerId: "1",
  },
]

const defaultSubscription: SubscriptionPlan = {
  id: "sub_1",
  name: "pro",
  price: 29,
  interval: "month",
  features: [
    "Unlimited diagrams",
    "Up to 10 team members",
    "Real-time collaboration",
    "Export to PNG/SVG/JSON",
    "Version history",
    "Priority support",
  ],
  maxDiagrams: -1,
  maxTeamMembers: 10,
  status: "active",
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockApi = {
  login: async (email: string, password: string): Promise<User> => {
    await delay(800)
    if (email && password) {
      return defaultMockUser
    }
    throw new Error("Invalid credentials")
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    await delay(800)

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      avatar: `/placeholder.svg?height=40&width=40&query=${name}`,
    }

    // Create default organization for new user
    const defaultOrg: Organization = {
      id: `org-${Math.random().toString(36).substr(2, 9)}`,
      name: `${name}'s Organization`,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      ownerId: newUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Create default project
    const defaultProject: Project = {
      id: `proj-${Math.random().toString(36).substr(2, 9)}`,
      name: "My First Project",
      description: "Get started with your first ER diagrams",
      organizationId: defaultOrg.id,
      createdBy: newUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Save to localStorage
    const existingOrgs = getFromStorage(STORAGE_KEYS.ORGANIZATIONS, defaultMockOrganizations)
    const existingProjects = getFromStorage(STORAGE_KEYS.PROJECTS, defaultMockProjects)

    saveToStorage(STORAGE_KEYS.ORGANIZATIONS, [...existingOrgs, defaultOrg])
    saveToStorage(STORAGE_KEYS.PROJECTS, [...existingProjects, defaultProject])

    return newUser
  },

  logout: async (): Promise<void> => {
    await delay(300)
  },

  getDiagrams: async (projectId?: string): Promise<Diagram[]> => {
    await delay(300)
    const diagrams = getFromStorage(STORAGE_KEYS.DIAGRAMS, defaultMockDiagrams)
    return projectId ? diagrams.filter((d) => d.projectId === projectId) : diagrams
  },

  fetchDiagrams: async (projectId?: string): Promise<Diagram[]> => {
    await delay(500)
    const diagrams = getFromStorage(STORAGE_KEYS.DIAGRAMS, defaultMockDiagrams)
    return projectId ? diagrams.filter((d) => d.projectId === projectId) : diagrams
  },

  getDiagram: async (id: string): Promise<Diagram | null> => {
    await delay(400)
    const diagrams = getFromStorage(STORAGE_KEYS.DIAGRAMS, defaultMockDiagrams)
    return diagrams.find((d) => d.id === id) || null
  },

  saveDiagram: async (diagram: Diagram): Promise<Diagram> => {
    await delay(600)
    const diagrams = getFromStorage(STORAGE_KEYS.DIAGRAMS, defaultMockDiagrams)

    const existingIndex = diagrams.findIndex((d) => d.id === diagram.id)
    const updatedDiagram = {
      ...diagram,
      updatedAt: new Date().toISOString(),
    }

    let newDiagrams: Diagram[]
    if (existingIndex >= 0) {
      newDiagrams = diagrams.map((d, i) => (i === existingIndex ? updatedDiagram : d))
    } else {
      const newDiagram = {
        ...updatedDiagram,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      }
      newDiagrams = [...diagrams, newDiagram]
    }

    saveToStorage(STORAGE_KEYS.DIAGRAMS, newDiagrams)
    return updatedDiagram
  },

  createDiagram: async (diagram: Omit<Diagram, "id" | "createdAt" | "updatedAt">): Promise<Diagram> => {
    await delay(600)
    const diagrams = getFromStorage(STORAGE_KEYS.DIAGRAMS, defaultMockDiagrams)

    const newDiagram: Diagram = {
      ...diagram,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const newDiagrams = [...diagrams, newDiagram]
    saveToStorage(STORAGE_KEYS.DIAGRAMS, newDiagrams)
    return newDiagram
  },

  updateDiagram: async (id: string, updates: Partial<Diagram>): Promise<Diagram> => {
    await delay(500)
    const diagrams = getFromStorage(STORAGE_KEYS.DIAGRAMS, defaultMockDiagrams)
    const diagram = diagrams.find((d) => d.id === id)

    if (!diagram) throw new Error("Diagram not found")

    const updatedDiagram = {
      ...diagram,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    const newDiagrams = diagrams.map((d) => (d.id === id ? updatedDiagram : d))
    saveToStorage(STORAGE_KEYS.DIAGRAMS, newDiagrams)
    return updatedDiagram
  },

  deleteDiagram: async (id: string): Promise<void> => {
    await delay(400)
    const diagrams = getFromStorage(STORAGE_KEYS.DIAGRAMS, defaultMockDiagrams)
    const newDiagrams = diagrams.filter((d) => d.id !== id)
    saveToStorage(STORAGE_KEYS.DIAGRAMS, newDiagrams)
  },

  getCollaborators: async (diagramId: string): Promise<TeamMember[]> => {
    await delay(300)
    const diagrams = getFromStorage(STORAGE_KEYS.DIAGRAMS, defaultMockDiagrams)
    const diagram = diagrams.find((d) => d.id === diagramId)

    if (!diagram) return []

    // If diagram has a teamId, return team members
    if (diagram.teamId) {
      const users = getFromStorage(STORAGE_KEYS.USERS, defaultMockUsers)
      const teams = getFromStorage(STORAGE_KEYS.TEAMS, defaultMockTeams)
      const team = teams.find((t) => t.id === diagram.teamId)

      if (team) {
        return users.filter((u) => team.members.includes(u.id))
      }
    }

    // Otherwise, return just the owner
    const users = getFromStorage(STORAGE_KEYS.USERS, defaultMockUsers)
    const owner = users.find((u) => u.id === diagram.ownerId)
    return owner ? [owner] : []
  },

  fetchUsers: async (teamId?: string): Promise<TeamMember[]> => {
    await delay(500)
    const users = getFromStorage(STORAGE_KEYS.USERS, defaultMockUsers)

    if (teamId) {
      const teams = getFromStorage(STORAGE_KEYS.TEAMS, defaultMockTeams)
      const team = teams.find((t) => t.id === teamId)
      if (team) {
        return users.filter((u) => team.members.includes(u.id))
      }
    }

    return users
  },

  inviteUser: async (email: string, role: "editor" | "viewer" = "viewer"): Promise<TeamMember> => {
    await delay(800)
    const users = getFromStorage(STORAGE_KEYS.USERS, defaultMockUsers)

    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      throw new Error("User already exists in the team")
    }

    const newUser: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0],
      email,
      avatar: `/placeholder.svg?height=40&width=40&query=${email}`,
      role,
      joinedAt: new Date().toISOString(),
    }

    const newUsers = [...users, newUser]
    saveToStorage(STORAGE_KEYS.USERS, newUsers)

    const teams = getFromStorage(STORAGE_KEYS.TEAMS, defaultMockTeams)
    if (teams.length > 0) {
      const updatedTeams = teams.map((t, i) => (i === 0 ? { ...t, members: [...t.members, newUser.id] } : t))
      saveToStorage(STORAGE_KEYS.TEAMS, updatedTeams)
    }

    return newUser
  },

  removeUser: async (userId: string): Promise<void> => {
    await delay(500)
    const users = getFromStorage(STORAGE_KEYS.USERS, defaultMockUsers)
    const newUsers = users.filter((u) => u.id !== userId)
    saveToStorage(STORAGE_KEYS.USERS, newUsers)

    const teams = getFromStorage(STORAGE_KEYS.TEAMS, defaultMockTeams)
    const updatedTeams = teams.map((t) => ({
      ...t,
      members: t.members.filter((m) => m !== userId),
    }))
    saveToStorage(STORAGE_KEYS.TEAMS, updatedTeams)
  },

  updateUserRole: async (userId: string, role: "editor" | "viewer"): Promise<TeamMember> => {
    await delay(500)
    const users = getFromStorage(STORAGE_KEYS.USERS, defaultMockUsers)
    const user = users.find((u) => u.id === userId)

    if (!user) throw new Error("User not found")
    if (user.role === "owner") throw new Error("Cannot change owner role")

    const updatedUser = { ...user, role }
    const newUsers = users.map((u) => (u.id === userId ? updatedUser : u))
    saveToStorage(STORAGE_KEYS.USERS, newUsers)
    return updatedUser
  },

  getTeams: async (): Promise<Team[]> => {
    await delay(500)
    return getFromStorage(STORAGE_KEYS.TEAMS, defaultMockTeams)
  },

  getTeam: async (id: string): Promise<Team | null> => {
    await delay(400)
    const teams = getFromStorage(STORAGE_KEYS.TEAMS, defaultMockTeams)
    return teams.find((t) => t.id === id) || null
  },

  getSubscriptionPlan: async (): Promise<SubscriptionPlan> => {
    await delay(600)
    return getFromStorage(STORAGE_KEYS.SUBSCRIPTION, defaultSubscription)
  },

  getPlans: async (): Promise<SubscriptionPlan[]> => {
    await delay(300)
    return [
      {
        id: "plan_free",
        name: "free" as const,
        price: 0,
        interval: "month" as const,
        features: ["Up to 3 diagrams", "1 team member", "Basic export"],
        maxDiagrams: 3,
        maxTeamMembers: 1,
        status: "active" as const,
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "plan_pro",
        name: "pro" as const,
        price: 29,
        interval: "month" as const,
        features: [
          "Unlimited diagrams",
          "Up to 10 team members",
          "Real-time collaboration",
          "Export to PNG/SVG/JSON",
          "Version history",
          "Priority support",
        ],
        maxDiagrams: -1,
        maxTeamMembers: 10,
        status: "active" as const,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "plan_enterprise",
        name: "enterprise" as const,
        price: 99,
        interval: "month" as const,
        features: [
          "Everything in Pro",
          "Unlimited team members",
          "Advanced security",
          "SSO integration",
          "Custom integrations",
          "Dedicated support",
          "SLA guarantee",
        ],
        maxDiagrams: -1,
        maxTeamMembers: -1,
        status: "active" as const,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
  },

  updateSubscription: async (planName: "free" | "pro" | "enterprise"): Promise<SubscriptionPlan> => {
    await delay(800)

    const plans = {
      free: {
        id: "sub_free",
        name: "free" as const,
        price: 0,
        interval: "month" as const,
        features: ["Up to 3 diagrams", "1 team member", "Basic export"],
        maxDiagrams: 3,
        maxTeamMembers: 1,
        status: "active" as const,
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
      pro: {
        id: "sub_pro",
        name: "pro" as const,
        price: 29,
        interval: "month" as const,
        features: [
          "Unlimited diagrams",
          "Up to 10 team members",
          "Real-time collaboration",
          "Export to PNG/SVG/JSON",
          "Version history",
          "Priority support",
        ],
        maxDiagrams: -1,
        maxTeamMembers: 10,
        status: "active" as const,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      enterprise: {
        id: "sub_enterprise",
        name: "enterprise" as const,
        price: 99,
        interval: "month" as const,
        features: [
          "Everything in Pro",
          "Unlimited team members",
          "Advanced security",
          "SSO integration",
          "Custom integrations",
          "Dedicated support",
          "SLA guarantee",
        ],
        maxDiagrams: -1,
        maxTeamMembers: -1,
        status: "active" as const,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    }

    const newSubscription = plans[planName]
    saveToStorage(STORAGE_KEYS.SUBSCRIPTION, newSubscription)
    return newSubscription
  },

  cancelSubscription: async (): Promise<SubscriptionPlan> => {
    await delay(600)
    const subscription = getFromStorage(STORAGE_KEYS.SUBSCRIPTION, defaultSubscription)
    const canceledSubscription = {
      ...subscription,
      status: "canceled" as const,
    }
    saveToStorage(STORAGE_KEYS.SUBSCRIPTION, canceledSubscription)
    return canceledSubscription
  },

  fetchVersions: async (diagramId: string): Promise<DiagramVersion[]> => {
    await delay(500)
    const allVersions = getFromStorage<DiagramVersion[]>(STORAGE_KEYS.VERSIONS, [])
    return allVersions
      .filter((v) => v.diagramId === diagramId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  },

  saveVersion: async (version: Omit<DiagramVersion, "id" | "timestamp">): Promise<DiagramVersion> => {
    await delay(400)
    const allVersions = getFromStorage<DiagramVersion[]>(STORAGE_KEYS.VERSIONS, [])

    const newVersion: DiagramVersion = {
      ...version,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    }

    const newVersions = [newVersion, ...allVersions]
    // Keep only last 20 versions per diagram
    const versionsForDiagram = newVersions.filter((v) => v.diagramId === version.diagramId)
    const otherVersions = newVersions.filter((v) => v.diagramId !== version.diagramId)
    const limitedVersions = [...versionsForDiagram.slice(0, 20), ...otherVersions]

    saveToStorage(STORAGE_KEYS.VERSIONS, limitedVersions)
    return newVersion
  },

  restoreVersion: async (versionId: string): Promise<DiagramVersion | null> => {
    await delay(400)
    const allVersions = getFromStorage<DiagramVersion[]>(STORAGE_KEYS.VERSIONS, [])
    return allVersions.find((v) => v.id === versionId) || null
  },

  deleteVersion: async (versionId: string): Promise<void> => {
    await delay(300)
    const allVersions = getFromStorage<DiagramVersion[]>(STORAGE_KEYS.VERSIONS, [])
    const newVersions = allVersions.filter((v) => v.id !== versionId)
    saveToStorage(STORAGE_KEYS.VERSIONS, newVersions)
  },

  togglePublicSharing: async (diagramId: string, isPublic: boolean): Promise<Diagram> => {
    await delay(500)
    const diagrams = getFromStorage(STORAGE_KEYS.DIAGRAMS, defaultMockDiagrams)
    const diagram = diagrams.find((d) => d.id === diagramId)

    if (!diagram) throw new Error("Diagram not found")

    const publicId = isPublic ? `pub_${Math.random().toString(36).substr(2, 12)}` : undefined

    const updatedDiagram = {
      ...diagram,
      isPublic,
      publicId,
      updatedAt: new Date().toISOString(),
    }

    const newDiagrams = diagrams.map((d) => (d.id === diagramId ? updatedDiagram : d))
    saveToStorage(STORAGE_KEYS.DIAGRAMS, newDiagrams)
    return updatedDiagram
  },

  getPublicDiagram: async (publicId: string): Promise<Diagram | null> => {
    await delay(400)
    const diagrams = getFromStorage(STORAGE_KEYS.DIAGRAMS, defaultMockDiagrams)
    const diagram = diagrams.find((d) => d.publicId === publicId && d.isPublic)
    return diagram || null
  },

  getOrganizations: async (): Promise<Organization[]> => {
    await delay(400)
    return getFromStorage(STORAGE_KEYS.ORGANIZATIONS, defaultMockOrganizations)
  },

  getOrganization: async (id: string): Promise<Organization | null> => {
    await delay(300)
    const orgs = getFromStorage(STORAGE_KEYS.ORGANIZATIONS, defaultMockOrganizations)
    return orgs.find((o) => o.id === id) || null
  },

  createOrganization: async (data: Omit<Organization, "id" | "createdAt" | "updatedAt">): Promise<Organization> => {
    await delay(600)
    const orgs = getFromStorage(STORAGE_KEYS.ORGANIZATIONS, defaultMockOrganizations)

    const newOrg: Organization = {
      ...data,
      id: `org-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveToStorage(STORAGE_KEYS.ORGANIZATIONS, [...orgs, newOrg])
    return newOrg
  },

  updateOrganization: async (id: string, updates: Partial<Organization>): Promise<Organization> => {
    await delay(500)
    const orgs = getFromStorage(STORAGE_KEYS.ORGANIZATIONS, defaultMockOrganizations)
    const org = orgs.find((o) => o.id === id)

    if (!org) throw new Error("Organization not found")

    const updatedOrg = {
      ...org,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    saveToStorage(
      STORAGE_KEYS.ORGANIZATIONS,
      orgs.map((o) => (o.id === id ? updatedOrg : o)),
    )
    return updatedOrg
  },

  deleteOrganization: async (id: string): Promise<void> => {
    await delay(400)
    const orgs = getFromStorage(STORAGE_KEYS.ORGANIZATIONS, defaultMockOrganizations)
    saveToStorage(
      STORAGE_KEYS.ORGANIZATIONS,
      orgs.filter((o) => o.id !== id),
    )
  },

  getProjects: async (organizationId?: string): Promise<Project[]> => {
    await delay(400)
    const projects = getFromStorage(STORAGE_KEYS.PROJECTS, defaultMockProjects)
    return organizationId ? projects.filter((p) => p.organizationId === organizationId) : projects
  },

  getProject: async (id: string): Promise<Project | null> => {
    await delay(300)
    const projects = getFromStorage(STORAGE_KEYS.PROJECTS, defaultMockProjects)
    return projects.find((p) => p.id === id) || null
  },

  createProject: async (data: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> => {
    await delay(600)
    const projects = getFromStorage(STORAGE_KEYS.PROJECTS, defaultMockProjects)

    const newProject: Project = {
      ...data,
      id: `proj-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveToStorage(STORAGE_KEYS.PROJECTS, [...projects, newProject])
    return newProject
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    await delay(500)
    const projects = getFromStorage(STORAGE_KEYS.PROJECTS, defaultMockProjects)
    const project = projects.find((p) => p.id === id)

    if (!project) throw new Error("Project not found")

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    saveToStorage(
      STORAGE_KEYS.PROJECTS,
      projects.map((p) => (p.id === id ? updatedProject : p)),
    )
    return updatedProject
  },

  deleteProject: async (id: string): Promise<void> => {
    await delay(400)
    const projects = getFromStorage(STORAGE_KEYS.PROJECTS, defaultMockProjects)
    saveToStorage(
      STORAGE_KEYS.PROJECTS,
      projects.filter((p) => p.id !== id),
    )
  },

  generateSQL: async (nodes: any[], edges: any[]): Promise<string> => {
    await delay(800)

    let sql = "-- Generated SQL Schema\n\n"

    // Generate CREATE TABLE statements
    nodes.forEach((node) => {
      const tableName = node.data.label || "untitled_table"
      const fields = node.data.fields || []

      sql += `CREATE TABLE ${tableName} (\n`

      const fieldDefinitions = fields.map((field: any) => {
        let def = `  ${field.name} ${field.type.toUpperCase()}`
        if (field.isPrimaryKey) def += " PRIMARY KEY"
        if (!field.isNullable) def += " NOT NULL"
        if (field.defaultValue) def += ` DEFAULT ${field.defaultValue}`
        return def
      })

      sql += fieldDefinitions.join(",\n")
      sql += "\n);\n\n"
    })

    // Generate foreign key constraints
    edges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source)
      const targetNode = nodes.find((n) => n.id === edge.target)

      if (sourceNode && targetNode) {
        const sourceTable = sourceNode.data.label
        const targetTable = targetNode.data.label
        sql += `ALTER TABLE ${sourceTable} ADD CONSTRAINT fk_${sourceTable}_${targetTable}\n`
        sql += `  FOREIGN KEY (${targetTable}_id) REFERENCES ${targetTable}(id);\n\n`
      }
    })

    return sql
  },

  generatePrisma: async (nodes: any[], edges: any[]): Promise<string> => {
    await delay(800)

    let prisma = "// Generated Prisma Schema\n\n"
    prisma += 'datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n'
    prisma += 'generator client {\n  provider = "prisma-client-js"\n}\n\n'

    nodes.forEach((node) => {
      const modelName = (node.data.label || "UntitledModel").replace(/\s+/g, "")
      const fields = node.data.fields || []

      prisma += `model ${modelName} {\n`

      fields.forEach((field: any) => {
        let fieldDef = `  ${field.name} ${field.type}`
        if (field.isPrimaryKey) fieldDef += ' @id @default(auto()) @map("id")'
        if (!field.isNullable && !field.isPrimaryKey) fieldDef += ""
        if (field.isNullable) fieldDef += "?"
        prisma += fieldDef + "\n"
      })

      // Add relations based on edges
      const relatedEdges = edges.filter((e: any) => e.source === node.id || e.target === node.id)
      relatedEdges.forEach((edge: any) => {
        const relatedNode = nodes.find((n) => n.id === (edge.source === node.id ? edge.target : edge.source))
        if (relatedNode) {
          const relatedModel = (relatedNode.data.label || "Related").replace(/\s+/g, "")
          prisma += `  ${relatedModel.toLowerCase()} ${relatedModel}?\n`
        }
      })

      prisma += "}\n\n"
    })

    return prisma
  },

  generateSequelize: async (nodes: any[], edges: any[]): Promise<string> => {
    await delay(800)

    let sequelize = "// Generated Sequelize Models\n\n"
    sequelize += "const { DataTypes } = require('sequelize');\n\n"

    nodes.forEach((node) => {
      const modelName = (node.data.label || "UntitledModel").replace(/\s+/g, "")
      const fields = node.data.fields || []

      sequelize += `const ${modelName} = sequelize.define('${modelName}', {\n`

      fields.forEach((field: any, index: number) => {
        const typeMap: Record<string, string> = {
          string: "DataTypes.STRING",
          text: "DataTypes.TEXT",
          integer: "DataTypes.INTEGER",
          bigint: "DataTypes.BIGINT",
          float: "DataTypes.FLOAT",
          boolean: "DataTypes.BOOLEAN",
          date: "DataTypes.DATE",
          datetime: "DataTypes.DATE",
          timestamp: "DataTypes.DATE",
        }

        sequelize += `  ${field.name}: {\n`
        sequelize += `    type: ${typeMap[field.type.toLowerCase()] || "DataTypes.STRING"},\n`
        if (field.isPrimaryKey) sequelize += "    primaryKey: true,\n    autoIncrement: true,\n"
        sequelize += `    allowNull: ${field.isNullable},\n`
        if (field.defaultValue) sequelize += `    defaultValue: ${field.defaultValue},\n`
        sequelize += `  }${index < fields.length - 1 ? "," : ""}\n`
      })

      sequelize += "});\n\n"
    })

    // Add associations
    sequelize += "// Associations\n"
    edges.forEach((edge: any) => {
      const sourceNode = nodes.find((n) => n.id === edge.source)
      const targetNode = nodes.find((n) => n.id === edge.target)

      if (sourceNode && targetNode) {
        const sourceModel = (sourceNode.data.label || "Source").replace(/\s+/g, "")
        const targetModel = (targetNode.data.label || "Target").replace(/\s+/g, "")
        sequelize += `${sourceModel}.belongsTo(${targetModel});\n`
        sequelize += `${targetModel}.hasMany(${sourceModel});\n`
      }
    })

    sequelize += "\nmodule.exports = { "
    sequelize += nodes.map((n) => (n.data.label || "Model").replace(/\s+/g, "")).join(", ")
    sequelize += " };\n"

    return sequelize
  },
}
