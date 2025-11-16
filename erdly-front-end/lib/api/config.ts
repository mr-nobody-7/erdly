// API Configuration
export const API_CONFIG = {
  // Toggle between 'mock' and 'backend'
  MODE: (process.env.NEXT_PUBLIC_API_MODE || "mock") as "mock" | "backend",

  // Backend API base URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",

  // API timeout in milliseconds
  TIMEOUT: 30000,

  // Enable request/response logging
  DEBUG: process.env.NODE_ENV === "development",
}

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },

  // Organizations
  ORGANIZATIONS: {
    LIST: "/organizations",
    GET: (id: string) => `/organizations/${id}`,
    CREATE: "/organizations",
    UPDATE: (id: string) => `/organizations/${id}`,
    DELETE: (id: string) => `/organizations/${id}`,
  },

  // Projects
  PROJECTS: {
    LIST: "/projects",
    GET: (id: string) => `/projects/${id}`,
    CREATE: "/projects",
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
    BY_ORG: (orgId: string) => `/organizations/${orgId}/projects`,
  },

  // Diagrams
  DIAGRAMS: {
    LIST: "/diagrams",
    GET: (id: string) => `/diagrams/${id}`,
    CREATE: "/diagrams",
    UPDATE: (id: string) => `/diagrams/${id}`,
    DELETE: (id: string) => `/diagrams/${id}`,
    BY_PROJECT: (projectId: string) => `/projects/${projectId}/diagrams`,
    PUBLIC: (publicId: string) => `/public/diagrams/${publicId}`,
    TOGGLE_PUBLIC: (id: string) => `/diagrams/${id}/public`,
  },

  // Versions
  VERSIONS: {
    LIST: (diagramId: string) => `/diagrams/${diagramId}/versions`,
    GET: (diagramId: string, versionId: string) => `/diagrams/${diagramId}/versions/${versionId}`,
    CREATE: (diagramId: string) => `/diagrams/${diagramId}/versions`,
    DELETE: (diagramId: string, versionId: string) => `/diagrams/${diagramId}/versions/${versionId}`,
    RESTORE: (diagramId: string, versionId: string) => `/diagrams/${diagramId}/versions/${versionId}/restore`,
  },

  // Team
  TEAM: {
    LIST: "/team/members",
    INVITE: "/team/invite",
    REMOVE: (userId: string) => `/team/members/${userId}`,
    UPDATE_ROLE: (userId: string) => `/team/members/${userId}/role`,
    COLLABORATORS: (diagramId: string) => `/diagrams/${diagramId}/collaborators`,
  },

  // Billing
  BILLING: {
    PLANS: "/billing/plans",
    SUBSCRIPTION: "/billing/subscription",
    UPDATE: "/billing/subscription",
    CANCEL: "/billing/subscription/cancel",
  },

  // Code Generation
  CODE_GEN: {
    SQL: "/code-gen/sql",
    PRISMA: "/code-gen/prisma",
    SEQUELIZE: "/code-gen/sequelize",
  },

  // AI Features
  AI: {
    GENERATE_SCHEMA: "/ai/generate-schema",
    VALIDATE_SCHEMA: "/ai/validate-schema",
    SUGGEST_RELATIONSHIPS: "/ai/suggest-relationships",
    CHAT: "/ai/chat",
  },
}
