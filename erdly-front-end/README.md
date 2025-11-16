# ERDly - ER Diagram Builder SaaS Platform

A modern, full-featured ER Diagram builder with multi-tenancy, real-time collaboration, and AI-powered features.

## 🚀 Features

### Core Features
- **Multi-Tenancy**: Organizations → Projects → Diagrams hierarchy
- **Interactive Diagram Editor**: Drag-and-drop tables, relationships, and fields
- **Code Generation**: Export to SQL, Prisma, Sequelize
- **Team Collaboration**: Role-based access control (Owner, Editor, Viewer)
- **Version History**: Track and restore diagram versions
- **Public Sharing**: Share diagrams with public links
- **Theme Support**: Light and dark modes with persistence

### Diagram Editor
- React Flow-based canvas with pan, zoom, and fit view
- Drag-and-drop table nodes with editable fields
- Relationship connections with labels (1-1, 1-n, n-n)
- Keyboard shortcuts (Delete, Ctrl+S, Ctrl+Z/Y)
- Auto-save every 10 seconds
- Export to JSON and PNG
- Schema validation
- Auto-layout optimization

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **UI**: React 19, Tailwind CSS v4, shadcn/ui
- **State**: Zustand with localStorage persistence
- **Diagrams**: React Flow (@xyflow/react)
- **Types**: TypeScript throughout
- **Theme**: next-themes

## 📦 Installation

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
\`\`\`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

\`\`\`env
# API Configuration
NEXT_PUBLIC_API_MODE=mock          # "mock" or "backend"
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Optional: Backend API Key
NEXT_PUBLIC_API_KEY=your-api-key
\`\`\`

### Switching to Backend API

1. Set `NEXT_PUBLIC_API_MODE=backend` in `.env.local`
2. Set your backend URL in `NEXT_PUBLIC_API_URL`
3. Implement Express endpoints per `API_SPECIFICATION.md`
4. All API calls will automatically route to your backend

## 📁 Project Structure

\`\`\`
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/                # Dashboard pages
│   │   ├── organizations/        # Organization management
│   │   ├── projects/             # Project management
│   │   ├── editor/[id]/          # Diagram editor
│   │   ├── team/                 # Team management
│   │   ├── billing/              # Billing & subscriptions
│   │   └── settings/             # User settings
│   └── view/[id]/                # Public diagram viewer
├── components/                   # React components
│   ├── diagram/                  # Diagram-specific components
│   ├── shared/                   # Shared components (navbar, sidebar)
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utilities and helpers
│   ├── api/                      # API abstraction layer
│   │   ├── services/             # API service modules
│   │   ├── client.ts             # API client
│   │   └── config.ts             # API configuration
│   ├── mock-api.ts               # Mock API with localStorage
│   ├── store.ts                  # Zustand state management
│   ├── types.ts                  # TypeScript type definitions
│   ├── schemaUtils.ts            # Schema validation utilities
│   └── aiHelper.ts               # AI helper functions
└── public/                       # Static assets
\`\`\`

## 🎨 Key Components

### Diagram Editor
- **TableNode**: Draggable table component with fields
- **DiagramToolbar**: Toolbar with all editor controls
- **TableEditorDialog**: Modal for editing table properties
- **VersionHistoryPanel**: Version history sidebar
- **DiagramSettingsDialog**: Diagram settings modal

### State Management
- **useStore**: Zustand store with persistence
- **Editor State**: Undo/redo history management
- **User State**: Authentication and user data
- **Diagram State**: Diagrams, organizations, projects

### API Layer
- **Mock API**: Fully functional with localStorage
- **API Client**: Abstraction layer for backend integration
- **Services**: Modular API services (auth, diagrams, orgs, projects)

## 📖 API Documentation

See `API_SPECIFICATION.md` for complete API documentation including:
- All endpoints with request/response formats
- Authentication flow
- Error handling
- WebSocket events for real-time collaboration

## 🎯 Usage

### Creating a Diagram
1. Navigate to Organizations page
2. Create or select an organization
3. Create or select a project
4. Click "New Diagram"
5. Enter diagram name and description
6. Start building your ER diagram

### Editing Tables
1. Click "Add Table" in the toolbar
2. Click on a table to edit
3. Add fields with name, type, PK, FK, nullable
4. Connect tables by dragging from one to another
5. Changes auto-save every 10 seconds

### Exporting
- **JSON**: Click "Export JSON" to download diagram data
- **Image**: Click "Export Image" to download PNG
- **Code**: Use code generation utilities for SQL, Prisma, Sequelize

### Keyboard Shortcuts
- `Delete`: Remove selected nodes/edges
- `Ctrl+S`: Manual save
- `Ctrl+Z`: Undo
- `Ctrl+Y`: Redo

## 🔐 Authentication

Currently uses mock authentication with localStorage. To integrate with your backend:

1. Implement `/api/auth/login` and `/api/auth/register` endpoints
2. Return JWT token in response
3. Token is automatically stored and sent with all requests
4. Update `authService` in `lib/api/services/auth.service.ts`

## 🤝 Contributing

This is a complete, production-ready application. To extend:

1. Add new features in `app/` directory
2. Create reusable components in `components/`
3. Add API endpoints in `lib/api/services/`
4. Update types in `lib/types.ts`

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🆘 Support

For issues or questions:
1. Check `API_SPECIFICATION.md` for backend integration
2. Review `PROJECT_CHECKLIST.md` for feature completeness
3. Inspect browser console for debug logs (prefixed with `[v0]`)

---

**Built with ❤️ using Next.js, React Flow, and shadcn/ui**
