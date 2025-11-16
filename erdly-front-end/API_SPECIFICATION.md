# ERDly Express Backend API Specification

## Base Configuration

\`\`\`
Base URL: http://localhost:5000/api
Content-Type: application/json
\`\`\`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

---

## 1. Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

**Error Response (400 Bad Request):**
\`\`\`json
{
  "error": "Email already exists"
}
\`\`\`

---

### POST /auth/login
Login with email and password.

**Request Body:**
\`\`\`json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

**Error Response (401 Unauthorized):**
\`\`\`json
{
  "error": "Invalid credentials"
}
\`\`\`

---

### POST /auth/logout
Logout current user (invalidate token).

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "message": "Logged out successfully"
}
\`\`\`

---

### GET /auth/me
Get current authenticated user.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}
\`\`\`

---

## 2. Organization Endpoints

### GET /organizations
Get all organizations for the authenticated user.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
[
  {
    "id": "org_123",
    "name": "Acme Corp",
    "description": "Main organization",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "ownerId": "user_123",
    "memberCount": 5
  }
]
\`\`\`

---

### GET /organizations/:id
Get a specific organization by ID.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": "org_123",
  "name": "Acme Corp",
  "description": "Main organization",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "ownerId": "user_123",
  "memberCount": 5
}
\`\`\`

**Error Response (404 Not Found):**
\`\`\`json
{
  "error": "Organization not found"
}
\`\`\`

---

### POST /organizations
Create a new organization.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "New Organization",
  "description": "Organization description"
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "id": "org_456",
  "name": "New Organization",
  "description": "Organization description",
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z",
  "ownerId": "user_123",
  "memberCount": 1
}
\`\`\`

---

### PUT /organizations/:id
Update an organization.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "Updated Organization Name",
  "description": "Updated description"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": "org_123",
  "name": "Updated Organization Name",
  "description": "Updated description",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T12:00:00Z",
  "ownerId": "user_123",
  "memberCount": 5
}
\`\`\`

---

### DELETE /organizations/:id
Delete an organization.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "message": "Organization deleted successfully"
}
\`\`\`

**Error Response (403 Forbidden):**
\`\`\`json
{
  "error": "Only organization owner can delete"
}
\`\`\`

---

## 3. Project Endpoints

### GET /organizations/:orgId/projects
Get all projects in an organization.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
[
  {
    "id": "proj_123",
    "name": "E-commerce Platform",
    "description": "Main e-commerce database",
    "organizationId": "org_123",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "diagramCount": 3
  }
]
\`\`\`

---

### GET /projects/:id
Get a specific project by ID.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": "proj_123",
  "name": "E-commerce Platform",
  "description": "Main e-commerce database",
  "organizationId": "org_123",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "diagramCount": 3
}
\`\`\`

---

### POST /organizations/:orgId/projects
Create a new project in an organization.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "New Project",
  "description": "Project description"
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "id": "proj_456",
  "name": "New Project",
  "description": "Project description",
  "organizationId": "org_123",
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z",
  "diagramCount": 0
}
\`\`\`

---

### PUT /projects/:id
Update a project.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "Updated Project Name",
  "description": "Updated description"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": "proj_123",
  "name": "Updated Project Name",
  "description": "Updated description",
  "organizationId": "org_123",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T12:00:00Z",
  "diagramCount": 3
}
\`\`\`

---

### DELETE /projects/:id
Delete a project.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "message": "Project deleted successfully"
}
\`\`\`

---

## 4. Diagram Endpoints

### GET /projects/:projectId/diagrams
Get all diagrams in a project.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
[
  {
    "id": "diagram_123",
    "name": "User Management Schema",
    "description": "User and authentication tables",
    "projectId": "proj_123",
    "isPublic": false,
    "nodes": [],
    "edges": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
\`\`\`

---

### GET /diagrams
Get all diagrams for the authenticated user (across all projects).

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Query Parameters:**
- `projectId` (optional): Filter by project ID
- `isPublic` (optional): Filter by public/private status

**Response (200 OK):**
\`\`\`json
[
  {
    "id": "diagram_123",
    "name": "User Management Schema",
    "description": "User and authentication tables",
    "projectId": "proj_123",
    "isPublic": false,
    "nodes": [
      {
        "id": "table_1",
        "type": "table",
        "position": { "x": 100, "y": 100 },
        "data": {
          "label": "users",
          "fields": [
            {
              "id": "field_1",
              "name": "id",
              "type": "INTEGER",
              "isPrimaryKey": true,
              "isForeignKey": false,
              "isNullable": false
            },
            {
              "id": "field_2",
              "name": "email",
              "type": "VARCHAR(255)",
              "isPrimaryKey": false,
              "isForeignKey": false,
              "isNullable": false
            }
          ]
        }
      }
    ],
    "edges": [
      {
        "id": "edge_1",
        "source": "table_1",
        "target": "table_2",
        "sourceHandle": "field_1",
        "targetHandle": "field_3",
        "label": "1-n",
        "type": "smoothstep"
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
\`\`\`

---

### GET /diagrams/:id
Get a specific diagram by ID.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": "diagram_123",
  "name": "User Management Schema",
  "description": "User and authentication tables",
  "projectId": "proj_123",
  "isPublic": false,
  "nodes": [
    {
      "id": "table_1",
      "type": "table",
      "position": { "x": 100, "y": 100 },
      "data": {
        "label": "users",
        "fields": [
          {
            "id": "field_1",
            "name": "id",
            "type": "INTEGER",
            "isPrimaryKey": true,
            "isForeignKey": false,
            "isNullable": false
          }
        ]
      }
    }
  ],
  "edges": [],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
\`\`\`

---

### GET /diagrams/:id/public
Get a public diagram (no authentication required).

**Response (200 OK):**
\`\`\`json
{
  "id": "diagram_123",
  "name": "User Management Schema",
  "description": "User and authentication tables",
  "isPublic": true,
  "nodes": [...],
  "edges": [...],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
\`\`\`

**Error Response (404 Not Found):**
\`\`\`json
{
  "error": "Diagram not found or not public"
}
\`\`\`

---

### POST /projects/:projectId/diagrams
Create a new diagram in a project.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "New Diagram",
  "description": "Diagram description",
  "isPublic": false
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "id": "diagram_456",
  "name": "New Diagram",
  "description": "Diagram description",
  "projectId": "proj_123",
  "isPublic": false,
  "nodes": [],
  "edges": [],
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}
\`\`\`

---

### PUT /diagrams/:id
Update a diagram (including nodes and edges).

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "Updated Diagram Name",
  "description": "Updated description",
  "isPublic": true,
  "nodes": [
    {
      "id": "table_1",
      "type": "table",
      "position": { "x": 150, "y": 150 },
      "data": {
        "label": "users",
        "fields": [...]
      }
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "source": "table_1",
      "target": "table_2",
      "label": "1-n"
    }
  ]
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": "diagram_123",
  "name": "Updated Diagram Name",
  "description": "Updated description",
  "projectId": "proj_123",
  "isPublic": true,
  "nodes": [...],
  "edges": [...],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T12:00:00Z"
}
\`\`\`

---

### DELETE /diagrams/:id
Delete a diagram.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "message": "Diagram deleted successfully"
}
\`\`\`

---

### POST /diagrams/:id/duplicate
Duplicate a diagram.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "id": "diagram_789",
  "name": "User Management Schema (Copy)",
  "description": "User and authentication tables",
  "projectId": "proj_123",
  "isPublic": false,
  "nodes": [...],
  "edges": [...],
  "createdAt": "2024-01-15T12:00:00Z",
  "updatedAt": "2024-01-15T12:00:00Z"
}
\`\`\`

---

## 5. Diagram Version Endpoints

### GET /diagrams/:diagramId/versions
Get all versions of a diagram.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
[
  {
    "id": "version_123",
    "diagramId": "diagram_123",
    "versionNumber": 1,
    "name": "Initial version",
    "nodes": [...],
    "edges": [...],
    "createdAt": "2024-01-15T10:30:00Z",
    "createdBy": "user_123"
  },
  {
    "id": "version_124",
    "diagramId": "diagram_123",
    "versionNumber": 2,
    "name": "Added user roles",
    "nodes": [...],
    "edges": [...],
    "createdAt": "2024-01-15T11:00:00Z",
    "createdBy": "user_123"
  }
]
\`\`\`

---

### POST /diagrams/:diagramId/versions
Create a new version of a diagram.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "Version name",
  "nodes": [...],
  "edges": [...]
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "id": "version_125",
  "diagramId": "diagram_123",
  "versionNumber": 3,
  "name": "Version name",
  "nodes": [...],
  "edges": [...],
  "createdAt": "2024-01-15T12:00:00Z",
  "createdBy": "user_123"
}
\`\`\`

---

### POST /diagrams/:diagramId/versions/:versionId/restore
Restore a specific version of a diagram.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": "diagram_123",
  "name": "User Management Schema",
  "nodes": [...],
  "edges": [...],
  "updatedAt": "2024-01-15T12:30:00Z"
}
\`\`\`

---

## 6. Code Generation Endpoints

### POST /diagrams/:id/generate/sql
Generate SQL code from a diagram.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "dialect": "postgresql"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "code": "CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  email VARCHAR(255) NOT NULL UNIQUE,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE posts (\n  id SERIAL PRIMARY KEY,\n  user_id INTEGER REFERENCES users(id),\n  title VARCHAR(255) NOT NULL,\n  content TEXT\n);"
}
\`\`\`

---

### POST /diagrams/:id/generate/prisma
Generate Prisma schema from a diagram.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "code": "model User {\n  id        Int      @id @default(autoincrement())\n  email     String   @unique\n  posts     Post[]\n  createdAt DateTime @default(now())\n}\n\nmodel Post {\n  id      Int    @id @default(autoincrement())\n  userId  Int\n  user    User   @relation(fields: [userId], references: [id])\n  title   String\n  content String?\n}"
}
\`\`\`

---

### POST /diagrams/:id/generate/sequelize
Generate Sequelize models from a diagram.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "code": "const User = sequelize.define('User', {\n  id: {\n    type: DataTypes.INTEGER,\n    primaryKey: true,\n    autoIncrement: true\n  },\n  email: {\n    type: DataTypes.STRING,\n    allowNull: false,\n    unique: true\n  }\n});\n\nconst Post = sequelize.define('Post', {\n  id: {\n    type: DataTypes.INTEGER,\n    primaryKey: true,\n    autoIncrement: true\n  },\n  userId: {\n    type: DataTypes.INTEGER,\n    references: {\n      model: User,\n      key: 'id'\n    }\n  },\n  title: DataTypes.STRING,\n  content: DataTypes.TEXT\n});\n\nUser.hasMany(Post, { foreignKey: 'userId' });\nPost.belongsTo(User, { foreignKey: 'userId' });"
}
\`\`\`

---

## 7. Team & Collaboration Endpoints

### GET /organizations/:orgId/members
Get all members of an organization.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
[
  {
    "id": "member_123",
    "userId": "user_123",
    "organizationId": "org_123",
    "role": "owner",
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com"
    },
    "joinedAt": "2024-01-15T10:30:00Z"
  }
]
\`\`\`

---

### POST /organizations/:orgId/members
Invite a user to an organization.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "email": "newuser@example.com",
  "role": "editor"
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "id": "member_456",
  "userId": "user_456",
  "organizationId": "org_123",
  "role": "editor",
  "user": {
    "id": "user_456",
    "name": "Jane Smith",
    "email": "newuser@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=newuser@example.com"
  },
  "joinedAt": "2024-01-15T12:00:00Z"
}
\`\`\`

---

### PUT /organizations/:orgId/members/:memberId
Update a member's role.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "role": "viewer"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": "member_456",
  "userId": "user_456",
  "organizationId": "org_123",
  "role": "viewer",
  "joinedAt": "2024-01-15T12:00:00Z"
}
\`\`\`

---

### DELETE /organizations/:orgId/members/:memberId
Remove a member from an organization.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "message": "Member removed successfully"
}
\`\`\`

---

### GET /diagrams/:diagramId/collaborators
Get all collaborators on a specific diagram.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
[
  {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com",
    "role": "owner"
  },
  {
    "id": "user_456",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=jane@example.com",
    "role": "editor"
  }
]
\`\`\`

---

## 8. Subscription & Billing Endpoints

### GET /billing/plans
Get all available subscription plans.

**Response (200 OK):**
\`\`\`json
[
  {
    "id": "plan_free",
    "name": "Free",
    "price": 0,
    "interval": "month",
    "features": [
      "Up to 3 diagrams",
      "Basic export (JSON, PNG)",
      "Community support"
    ]
  },
  {
    "id": "plan_pro",
    "name": "Pro",
    "price": 29,
    "interval": "month",
    "features": [
      "Unlimited diagrams",
      "Advanced export (SQL, Prisma)",
      "Version history",
      "Priority support",
      "Team collaboration"
    ]
  },
  {
    "id": "plan_enterprise",
    "name": "Enterprise",
    "price": 99,
    "interval": "month",
    "features": [
      "Everything in Pro",
      "Unlimited team members",
      "SSO authentication",
      "Advanced security",
      "Dedicated support",
      "Custom integrations"
    ]
  }
]
\`\`\`

---

### GET /billing/subscription
Get current user's subscription.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": "sub_123",
  "userId": "user_123",
  "planId": "plan_pro",
  "status": "active",
  "currentPeriodStart": "2024-01-15T00:00:00Z",
  "currentPeriodEnd": "2024-02-15T00:00:00Z",
  "cancelAtPeriodEnd": false
}
\`\`\`

---

### POST /billing/subscription
Create or update a subscription.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "planId": "plan_pro"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": "sub_123",
  "userId": "user_123",
  "planId": "plan_pro",
  "status": "active",
  "currentPeriodStart": "2024-01-15T00:00:00Z",
  "currentPeriodEnd": "2024-02-15T00:00:00Z",
  "cancelAtPeriodEnd": false
}
\`\`\`

---

### DELETE /billing/subscription
Cancel current subscription.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "message": "Subscription cancelled successfully",
  "cancelAtPeriodEnd": true,
  "currentPeriodEnd": "2024-02-15T00:00:00Z"
}
\`\`\`

---

## 9. AI Features Endpoints (Optional)

### POST /ai/generate-schema
Generate ER diagram from natural language description.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "prompt": "Create a schema for a blog platform with users, posts, comments, and tags"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "nodes": [
    {
      "id": "table_1",
      "type": "table",
      "position": { "x": 100, "y": 100 },
      "data": {
        "label": "users",
        "fields": [...]
      }
    }
  ],
  "edges": [...]
}
\`\`\`

---

### POST /ai/validate-schema
Validate a diagram schema and get suggestions.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "nodes": [...],
  "edges": [...]
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "isValid": true,
  "issues": [
    {
      "type": "warning",
      "message": "Table 'users' has no primary key",
      "nodeId": "table_1"
    }
  ],
  "suggestions": [
    {
      "type": "optimization",
      "message": "Consider adding an index on 'email' field",
      "nodeId": "table_1",
      "fieldId": "field_2"
    }
  ]
}
\`\`\`

---

### POST /ai/chat
AI assistant for schema questions.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "message": "How should I structure a many-to-many relationship?",
  "context": {
    "diagramId": "diagram_123"
  }
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "response": "For a many-to-many relationship, you should create a junction table...",
  "suggestions": [
    {
      "action": "create_table",
      "tableName": "user_roles"
    }
  ]
}
\`\`\`

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
\`\`\`json
{
  "error": "Invalid request data",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}
\`\`\`

### 401 Unauthorized
\`\`\`json
{
  "error": "Authentication required"
}
\`\`\`

### 403 Forbidden
\`\`\`json
{
  "error": "You don't have permission to perform this action"
}
\`\`\`

### 404 Not Found
\`\`\`json
{
  "error": "Resource not found"
}
\`\`\`

### 500 Internal Server Error
\`\`\`json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
\`\`\`

---

## Rate Limiting

All API endpoints are rate-limited:
- **Free tier**: 100 requests per hour
- **Pro tier**: 1000 requests per hour
- **Enterprise tier**: Unlimited

Rate limit headers are included in all responses:
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642252800
\`\`\`

---

## Pagination

List endpoints support pagination using query parameters:

\`\`\`
GET /diagrams?page=1&limit=20
\`\`\`

**Response includes pagination metadata:**
\`\`\`json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
\`\`\`

---

## WebSocket Events (Real-time Collaboration)

Connect to: `ws://localhost:5000`

### Authentication
Send authentication message after connection:
\`\`\`json
{
  "type": "auth",
  "token": "Bearer <token>"
}
\`\`\`

### Join Diagram Room
\`\`\`json
{
  "type": "join",
  "diagramId": "diagram_123"
}
\`\`\`

### Diagram Update Event
\`\`\`json
{
  "type": "diagram_update",
  "diagramId": "diagram_123",
  "userId": "user_456",
  "changes": {
    "nodes": [...],
    "edges": [...]
  }
}
\`\`\`

### User Presence Event
\`\`\`json
{
  "type": "presence",
  "diagramId": "diagram_123",
  "users": [
    {
      "id": "user_123",
      "name": "John Doe",
      "cursor": { "x": 150, "y": 200 }
    }
  ]
}
\`\`\`

---

## Notes for Implementation

1. **Authentication**: Use JWT tokens with 24-hour expiration
2. **Database**: Recommended to use PostgreSQL for relational data
3. **File Storage**: Use cloud storage (AWS S3, Cloudflare R2) for diagram exports
4. **Caching**: Implement Redis caching for frequently accessed diagrams
5. **Validation**: Use Zod or Joi for request validation
6. **Security**: Implement CORS, helmet, rate limiting
7. **Logging**: Use Winston or Pino for structured logging
8. **Testing**: Write integration tests for all endpoints

---

## Environment Variables

\`\`\`env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://user:password@localhost:5432/erdly
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
