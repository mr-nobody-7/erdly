import { apiClient } from "../client"
import { API_ENDPOINTS } from "../config"
import type { Diagram } from "@/lib/store"

export const diagramService = {
  async getAll(projectId?: string): Promise<Diagram[]> {
    if (projectId) {
      return apiClient.get<Diagram[]>(API_ENDPOINTS.DIAGRAMS.BY_PROJECT(projectId))
    }
    return apiClient.get<Diagram[]>(API_ENDPOINTS.DIAGRAMS.LIST)
  },

  async getById(id: string): Promise<Diagram> {
    return apiClient.get<Diagram>(API_ENDPOINTS.DIAGRAMS.GET(id))
  },

  async create(data: Omit<Diagram, "id" | "createdAt" | "updatedAt">): Promise<Diagram> {
    return apiClient.post<Diagram>(API_ENDPOINTS.DIAGRAMS.CREATE, data)
  },

  async update(id: string, data: Partial<Diagram>): Promise<Diagram> {
    return apiClient.patch<Diagram>(API_ENDPOINTS.DIAGRAMS.UPDATE(id), data)
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.DIAGRAMS.DELETE(id))
  },

  async togglePublic(id: string, isPublic: boolean): Promise<Diagram> {
    return apiClient.patch<Diagram>(API_ENDPOINTS.DIAGRAMS.TOGGLE_PUBLIC(id), { isPublic })
  },

  async getPublic(publicId: string): Promise<Diagram> {
    return apiClient.get<Diagram>(API_ENDPOINTS.DIAGRAMS.PUBLIC(publicId))
  },
}
