import { apiClient } from "../client"
import { API_ENDPOINTS } from "../config"
import type { Project } from "@/lib/store"

export const projectService = {
  async getAll(organizationId?: string): Promise<Project[]> {
    if (organizationId) {
      return apiClient.get<Project[]>(API_ENDPOINTS.PROJECTS.BY_ORG(organizationId))
    }
    return apiClient.get<Project[]>(API_ENDPOINTS.PROJECTS.LIST)
  },

  async getById(id: string): Promise<Project> {
    return apiClient.get<Project>(API_ENDPOINTS.PROJECTS.GET(id))
  },

  async create(data: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    return apiClient.post<Project>(API_ENDPOINTS.PROJECTS.CREATE, data)
  },

  async update(id: string, data: Partial<Project>): Promise<Project> {
    return apiClient.patch<Project>(API_ENDPOINTS.PROJECTS.UPDATE(id), data)
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.PROJECTS.DELETE(id))
  },
}
