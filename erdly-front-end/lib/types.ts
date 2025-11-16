export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface OrganizationMember {
  id: string
  organizationId: string
  userId: string
  role: "owner" | "admin" | "member"
  joinedAt: string
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
  description: string
  projectId: string
  nodes: any[]
  edges: any[]
  isPublic: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface TableField {
  id: string
  name: string
  type: string
  isPrimaryKey: boolean
  isForeignKey: boolean
  isNullable: boolean
  defaultValue?: string
  references?: {
    table: string
    field: string
  }
}

export interface DiagramVersion {
  id: string
  diagramId: string
  version: number
  name: string
  nodes: any[]
  edges: any[]
  createdBy: string
  createdAt: string
}

export interface Plan {
  id: string
  name: string
  price: number
  interval: "month" | "year"
  features: string[]
  maxDiagrams: number
  maxProjects: number
  maxTeamMembers: number
}

export interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "editor" | "viewer"
  joinedAt: string
}
