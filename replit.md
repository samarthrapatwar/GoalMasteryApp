# Personal Goal Mastery App (PGMA)

## Overview

PGMA is a full-stack web application designed to help computer engineering students and productivity enthusiasts manage their personal development journey. The application provides comprehensive tools for goal tracking, habit formation, routine planning, roadmap visualization, and journaling. Built with a focus on clean design and data-first visualization, it combines productivity tracking with motivational elements to help users stay organized and achieve their objectives.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript
- Uses Vite as the build tool and development server
- Client-side routing implemented with Wouter (lightweight router)
- State management via TanStack Query (React Query) for server state
- Component-based architecture with reusable UI elements

**UI Component System**: Radix UI + Tailwind CSS
- Adopts shadcn/ui component library (customizable, accessible components)
- Design system follows Linear + Material Design hybrid approach
- Typography: Inter for UI, JetBrains Mono for metrics/data
- Supports dark/light theme switching with system preference detection
- Responsive design with mobile-first breakpoints

**Design Patterns**:
- Composition pattern for flexible component assembly
- Custom hooks for shared logic (useAuth, useToast, useIsMobile)
- Form handling with controlled components
- Optimistic updates with React Query mutations

### Backend Architecture

**Server Framework**: Express.js with TypeScript
- RESTful API design with `/api/*` endpoints
- Session-based authentication via Replit Auth (OpenID Connect)
- Express middleware for JSON parsing, logging, and error handling
- Development mode integrates Vite middleware for HMR

**Database Layer**: Drizzle ORM + PostgreSQL
- Uses Neon serverless PostgreSQL with WebSocket support
- Type-safe database operations with Drizzle ORM
- Schema-first design with Zod validation
- Storage abstraction layer (IStorage interface) for clean separation

**Data Models**:
- Users: Authentication and profile information
- Goals: Categorized objectives with progress tracking, priorities, and deadlines
- Habits: Recurring activities with streak tracking and check-ins
- Routines: Scheduled time blocks with categories
- Roadmaps: Multi-step learning paths with progress visualization
- Journal Entries: Daily reflections with mood tracking
- Sessions: Server-side session storage

**API Architecture**:
- CRUD endpoints for each entity type
- Analytics endpoints for aggregated statistics
- Validation using Zod schemas (insertSchema/updateSchema)
- Error handling with HTTP status codes and descriptive messages

### Authentication & Authorization

**Authentication Provider**: Replit Auth (OpenID Connect)
- SSO integration with Replit platform
- Session management via connect-pg-simple (PostgreSQL session store)
- User claims stored in session with JWT access tokens
- Middleware `isAuthenticated` guards protected routes

**Session Strategy**:
- 1-week session TTL with automatic cleanup
- HTTP-only, secure cookies for session transport
- User profile synchronized from OIDC claims on login

### Build & Deployment

**Development**:
- Vite dev server with HMR and fast refresh
- TypeScript type checking (noEmit mode)
- Path aliases for clean imports (@/, @shared/)
- Source maps for debugging

**Production Build**:
- Frontend: Vite bundles React app to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js`
- ESM module format throughout
- Static asset serving from production build

**Database Migrations**:
- Drizzle Kit for schema management
- Push-based workflow (`db:push`) for development
- Migration files output to `./migrations`

## External Dependencies

### Third-Party Services

**Database**: Neon Serverless PostgreSQL
- Managed PostgreSQL with serverless scaling
- WebSocket connections for real-time compatibility
- Connection pooling via @neondatabase/serverless

**Authentication**: Replit Auth (OIDC)
- Identity provider for user authentication
- OAuth 2.0/OpenID Connect protocol
- Integrated with Replit platform ecosystem

### Key NPM Packages

**Frontend Libraries**:
- React 18+ with TypeScript
- TanStack Query: Server state management and caching
- Radix UI: Headless accessible components (dialogs, dropdowns, tooltips, etc.)
- Tailwind CSS: Utility-first styling
- date-fns: Date manipulation and formatting
- Wouter: Client-side routing
- class-variance-authority: Component variant management

**Backend Libraries**:
- Express: HTTP server framework
- Drizzle ORM: Type-safe database toolkit
- Passport + openid-client: Authentication middleware
- connect-pg-simple: PostgreSQL session store
- Zod: Schema validation
- ws: WebSocket support for Neon

**Development Tools**:
- Vite: Build tool and dev server
- esbuild: Fast JavaScript bundler
- TypeScript: Type system
- tsx: TypeScript execution for development
- Drizzle Kit: Database schema management

### Design Assets

**Typography**:
- Google Fonts: Inter (primary), JetBrains Mono (monospace), DM Sans, Fira Code, Geist Mono

**Icons**: Lucide React
- Comprehensive icon set for UI elements
- Tree-shakeable and customizable

**Design Guidelines**:
- Documented in `design_guidelines.md`
- Spacing primitives: 2, 4, 6, 8, 12, 16 (Tailwind units)
- 12-column responsive grid system
- Fixed 280px sidebar, collapsible on mobile