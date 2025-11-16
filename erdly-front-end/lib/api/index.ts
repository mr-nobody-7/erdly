import { API_CONFIG } from "./config"
import { mockApi } from "../mock-api"
import { authService } from "./services/auth.service"
import { diagramService } from "./services/diagram.service"
import { organizationService } from "./services/organization.service"
import { projectService } from "./services/project.service"
import type { User, Diagram, Organization, Project } from "../store"
import type { SubscriptionPlan, TeamMember, DiagramVersion } from "../mock-api"

// Backend API adapter that matches mockApi interface
const backendApi = {
  // Auth
  login: async (email: string, password: string): Promise<User> => {
    const response = await authService.login({ email, password })
    return response.user
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    const response = await authService.register({ name, email, password })
    return response.user
  },

  logout: () => authService.logout(),

  // Organizations
  getOrganizations: () => organizationService.getAll(),
  getOrganization: (id: string) => organizationService.getById(id),
  createOrganization: (data: Omit<Organization, "id" | "createdAt" | "updatedAt">) => organizationService.create(data),
  updateOrganization: (id: string, updates: Partial<Organization>) => organizationService.update(id, updates),
  deleteOrganization: (id: string) => organizationService.delete(id),

  // Projects
  getProjects: (organizationId?: string) => projectService.getAll(organizationId),
  getProject: (id: string) => projectService.getById(id),
  createProject: (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => projectService.create(data),
  updateProject: (id: string, updates: Partial<Project>) => projectService.update(id, updates),
  deleteProject: (id: string) => projectService.delete(id),

  // Diagrams
  getDiagrams: (projectId?: string) => diagramService.getAll(projectId),
  fetchDiagrams: (projectId?: string) => diagramService.getAll(projectId),
  getDiagram: (id: string) => diagramService.getById(id),
  createDiagram: (data: Omit<Diagram, "id" | "createdAt" | "updatedAt">) => diagramService.create(data),
  saveDiagram: (diagram: Diagram) => diagramService.update(diagram.id, diagram),
  updateDiagram: (id: string, updates: Partial<Diagram>) => diagramService.update(id, updates),
  deleteDiagram: (id: string) => diagramService.delete(id),
  togglePublicSharing: (diagramId: string, isPublic: boolean) => diagramService.togglePublic(diagramId, isPublic),
  getPublicDiagram: (publicId: string) => diagramService.getPublic(publicId),

  // Delegate remaining methods to mockApi for now
  // These can be implemented as backend services are added
  getCollaborators: mockApi.getCollaborators,
  fetchUsers: mockApi.fetchUsers,
  inviteUser: mockApi.inviteUser,
  removeUser: mockApi.removeUser,
  updateUserRole: mockApi.updateUserRole,
  getTeams: mockApi.getTeams,
  getTeam: mockApi.getTeam,
  getSubscriptionPlan: mockApi.getSubscriptionPlan,
  getPlans: mockApi.getPlans,
  updateSubscription: mockApi.updateSubscription,
  cancelSubscription: mockApi.cancelSubscription,
  fetchVersions: mockApi.fetchVersions,
  saveVersion: mockApi.saveVersion,
  restoreVersion: mockApi.restoreVersion,
  deleteVersion: mockApi.deleteVersion,
  generateSQL: mockApi.generateSQL,
  generatePrisma: mockApi.generatePrisma,
  generateSequelize: mockApi.generateSequelize,
}

// Export the appropriate API based on configuration
export const api = API_CONFIG.MODE === "backend" ? backendApi : mockApi

// Re-export types
export type { SubscriptionPlan, TeamMember, DiagramVersion, Organization, Project }
