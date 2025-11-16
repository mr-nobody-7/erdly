import { apiClient } from "../client"
import { API_ENDPOINTS } from "../config"
import type { Organization } from "@/lib/store"

export const organizationService = {
  async getAll(): Promise<Organization[]> {
    return apiClient.get<Organization[]>(API_ENDPOINTS.ORGANIZATIONS.LIST)
  },

  async getById(id: string): Promise<Organization> {
    return apiClient.get<Organization>(API_ENDPOINTS.ORGANIZATIONS.GET(id))
  },

  async create(data: Omit<Organization, "id" | "createdAt" | "updatedAt">): Promise<Organization> {
    return apiClient.post<Organization>(API_ENDPOINTS.ORGANIZATIONS.CREATE, data)
  },

  async update(id: string, data: Partial<Organization>): Promise<Organization> {
    return apiClient.patch<Organization>(API_ENDPOINTS.ORGANIZATIONS.UPDATE(id), data)
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.ORGANIZATIONS.DELETE(id))
  },
}
