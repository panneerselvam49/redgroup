# EstateHub — Real Estate Listing Platform

A full-stack real estate listing platform built with Node.js/Express (backend) and Next.js (frontend), using Sequelize ORM for PostgreSQL.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Folder Structure](#folder-structure)
5. [Setup Instructions](#setup-instructions)
6. [PostgreSQL Setup](#postgresql-setup)
7. [Environment Variables](#environment-variables)
8. [Backend Startup](#backend-startup)
9. [Frontend Startup](#frontend-startup)
10. [API Documentation](#api-documentation)
11. [Authentication Approach](#authentication-approach)
12. [Database Schema](#database-schema)
13. [Indexing Strategy](#indexing-strategy)
14. [Search and Filter Strategy](#search-and-filter-strategy)
15. [Pagination Strategy](#pagination-strategy)
16. [Similar Property Algorithm](#similar-property-algorithm)
17. [Rate Limiting](#rate-limiting)
18. [Security Considerations](#security-considerations)
19. [SEO Approach](#seo-approach)
20. [Scalability — 50,000+ Properties](#scalability--50000-properties)
21. [Production Improvements](#production-improvements)

---

## Project Overview

EstateHub is a production-ready real estate listing platform where users can:
- Browse, search, and filter property listings
- Register and log in with JWT-based authentication
- Create, edit, and delete their own property listings
- Send inquiries to property owners
- View similar properties on a property detail page

---

## Architecture

```
Browser (Next.js)
      │
      │  HTTP (REST API)
      ▼
Express.js Backend (Node.js)
      │
      │  Sequelize ORM
      ▼
PostgreSQL Database
```

The frontend is a Next.js App Router application. The backend is an Express REST API.
They communicate over HTTP. There is no shared server-side rendering between them —
the Next.js frontend calls the backend API directly.

**Decision**: Keeping frontend and backend as separate applications makes the architecture
simple, testable, and easy to deploy independently. A developer with 1–2 years of
experience can understand and modify either part without touching the other.

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | Next.js 15, App Router, TypeScript, Tailwind CSS |
| Backend     | Node.js, Express.js, TypeScript   |
| Database    | PostgreSQL                        |
| ORM         | Sequelize                         |
| Auth        | JWT (jsonwebtoken) + bcryptjs     |
| Validation  | Zod                               |
| API Docs    | Swagger (swagger-jsdoc + swagger-ui-express) |
| Security    | Helmet, CORS, express-rate-limit  |

---

## Folder Structure

```
real-estate-platform/
│
├── backend/
│   └── src/
│       ├── config/
│       │   └── db.ts              # Sequelize connection
│       ├── models/
│       │   ├── User.ts            # User model
│       │   ├── Property.ts        # Property model
│       │   ├── Inquiry.ts         # Inquiry model
│       │   └── index.ts           # Associations
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   ├── property.controller.ts
│       │   └── inquiry.controller.ts
│       ├── routes/
│       │   ├── auth.routes.ts
│       │   ├── property.routes.ts
│       │   └── inquiry.routes.ts
│       ├── middleware/
│       │   ├── auth.middleware.ts
│       │   ├── error.middleware.ts
│       │   └── rateLimit.middleware.ts
│       ├── validators/
│       │   ├── auth.validator.ts
│       │   ├── property.validator.ts
│       │   └── inquiry.validator.ts
│       ├── utils/
│       │   ├── jwt.ts
│       │   └── apiError.ts
│       ├── swagger/
│       │   └── swagger.ts
│       ├── app.ts                 # Express app setup
│       └── server.ts              # Entry point
│
└── frontend/
    ├── app/
    │   ├── layout.tsx             # Root layout + Navbar
    │   ├── page.tsx               # Home page
    │   ├── login/page.tsx
    │   ├── register/page.tsx
    │   ├── properties/
    │   │   ├── page.tsx           # Listing page
    │   │   └── [id]/
    │   │       ├── page.tsx       # Detail page (SSR + SEO)
    │   │       ├── PropertyDetailClient.tsx
    │   │       └── edit/page.tsx  # Edit page
    │   └── create-property/page.tsx
    ├── components/
    │   ├── Navbar.tsx
    │   ├── PropertyCard.tsx
    │   ├── PropertyFilters.tsx
    │   ├── PropertyForm.tsx
    │   ├── Pagination.tsx
    │   └── Loading.tsx
    ├── lib/
    │   └── api.ts                 # Centralized API client
    └── types/
        └── property.ts            # Shared TypeScript types
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm

### Clone and install

```bash
# Install backend dependencies
cd real-estate-platform/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## PostgreSQL Setup

1. Open `psql` or pgAdmin.
2. Create the database:

```sql
CREATE DATABASE real_estate_db;
```

3. The tables will be created automatically when the backend starts via `sequelize.sync()`.

**Why `sequelize.sync()` instead of migrations?**

For this assignment, `sync({ force: false })` is used because it:
- Creates tables if they don't exist
- Doesn't drop existing tables or data
- Requires zero migration files to manage

For production, you'd switch to Sequelize migrations (`sequelize-cli`) which give you:
- Version-controlled schema changes
- Rollback support
- Safe incremental updates

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000

DB_NAME=real_estate_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=1d

FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Backend Startup

```bash
cd real-estate-platform/backend
npm run dev
```

The server starts at: `http://localhost:5000`
On startup it:
1. Authenticates the PostgreSQL connection
2. Syncs Sequelize models (creates tables)
3. Starts accepting HTTP requests

---

## Frontend Startup

```bash
cd real-estate-platform/frontend
npm run dev
```

The app runs at: `http://localhost:3000`

---

## API Documentation

Swagger UI is available at:

```
http://localhost:5000/api-docs
```

You can test authenticated endpoints by:
1. Calling `/api/auth/login`
2. Copying the JWT token from the response
3. Clicking **Authorize** in Swagger UI and pasting: `Bearer <token>`

### API Endpoints

| Method | Path                    | Auth | Description                |
|--------|-------------------------|------|----------------------------|
| POST   | /api/auth/register      | No   | Register new user          |
| POST   | /api/auth/login         | No   | Login, returns JWT         |
| GET    | /api/auth/me            | Yes  | Get current user           |
| GET    | /api/properties         | No   | List properties (filtered) |
| GET    | /api/properties/:id     | No   | Property details + similar |
| POST   | /api/properties         | Yes  | Create property            |
| PUT    | /api/properties/:id     | Yes  | Update own property        |
| DELETE | /api/properties/:id     | Yes  | Delete own property        |
| POST   | /api/inquiries          | Yes  | Send inquiry               |

---

## Authentication Approach

- **JWT (JSON Web Tokens)** are used for stateless authentication.
- On login/register, the server signs a JWT with `{ userId }` as the payload.
- The token is returned to the client and stored in `localStorage`.
- On authenticated requests, the client sends: `Authorization: Bearer <token>`
- The `auth.middleware.ts` verifies the token and attaches `req.user.userId`.
- Controllers always use `req.user.userId` — **never** trusting any userId from the request body.

**Token storage trade-off**: `localStorage` was chosen for simplicity in this assignment.
The known risk: XSS attacks can read localStorage. For production, `httpOnly` cookies
would be safer (immune to JavaScript access), but require additional CSRF protection.

**Why not refresh tokens?** Access-only tokens (1-day expiry) are sufficient for this
assignment. Refresh tokens would add complexity (token rotation, revocation) that isn't
needed here.

---

## Database Schema

### `users`

| Column    | Type         | Notes                  |
|-----------|--------------|------------------------|
| id        | INTEGER (PK) | Auto-increment         |
| name      | VARCHAR(100) |                        |
| email     | VARCHAR(255) | Unique, indexed        |
| password  | VARCHAR(255) | bcrypt hashed          |
| createdAt | TIMESTAMP    |                        |
| updatedAt | TIMESTAMP    |                        |

### `properties`

| Column       | Type              | Notes                          |
|--------------|-------------------|--------------------------------|
| id           | INTEGER (PK)      | Auto-increment                 |
| userId       | INTEGER (FK)      | References users.id            |
| title        | VARCHAR(255)      |                                |
| description  | TEXT              |                                |
| price        | BIGINT            | Supports large values (Cr)     |
| city         | VARCHAR(100)      | Indexed                        |
| location     | VARCHAR(255)      |                                |
| propertyType | ENUM              | apartment/villa/house/plot     |
| bedrooms     | INTEGER           | Indexed                        |
| bathrooms    | INTEGER           |                                |
| area         | FLOAT             | sq.ft                          |
| images       | JSONB             | Array of image URLs            |
| createdAt    | TIMESTAMP         | Indexed                        |
| updatedAt    | TIMESTAMP         |                                |

### `inquiries`

| Column     | Type         | Notes                          |
|------------|--------------|--------------------------------|
| id         | INTEGER (PK) | Auto-increment                 |
| propertyId | INTEGER (FK) | References properties.id       |
| userId     | INTEGER (FK) | The user who sent the inquiry  |
| ownerId    | INTEGER (FK) | The property owner             |
| message    | TEXT         |                                |
| createdAt  | TIMESTAMP    |                                |

**Unique constraint**: `(propertyId, userId)` — prevents duplicate inquiries.

---

## Indexing Strategy

Indexes were carefully chosen to support the most common query patterns without
creating too many (indexes slow down writes).

### `properties` table indexes:

| Index                              | Reason                                               |
|------------------------------------|------------------------------------------------------|
| `city`                             | Most common single-field filter                      |
| `propertyType`                     | Type-only filter                                     |
| `bedrooms`                         | Bedroom-only filter                                  |
| `price`                            | Range queries + sorting                              |
| `createdAt`                        | Newest/oldest sort                                   |
| `userId`                           | Fetching a user's own listings                       |
| `(city, propertyType, bedrooms)`   | Most common combined search pattern                  |
| `(city, price)`                    | Budget range search within a city                    |

### `users` table indexes:

| Index   | Reason                               |
|---------|--------------------------------------|
| `email` | Fast lookup during login             |

### `inquiries` table indexes:

| Index                   | Reason                                        |
|-------------------------|-----------------------------------------------|
| `(propertyId, userId)`  | Unique constraint + duplicate check           |
| `ownerId`               | Fetch all inquiries received by an owner      |
| `propertyId`            | Fetch all inquiries on a property             |

---

## Search and Filter Strategy

All filtering, sorting, and pagination is done **in PostgreSQL**, not in Node.js.

Example query parameters:
```
GET /api/properties?city=Chennai&minPrice=500000&maxPrice=10000000&propertyType=apartment&bedrooms=2&sort=price_asc&page=1&limit=10
```

How it works:
1. Query parameters are validated by Zod (type coercion for numbers)
2. A `WHERE` clause is built dynamically — only the provided filters are applied
3. Sequelize generates a single parameterized SQL query
4. PostgreSQL uses the appropriate index to return only matching rows
5. `LIMIT` and `OFFSET` are applied in SQL — only the requested page is transferred

City search uses `ILIKE '%term%'` (case-insensitive partial match).

---

## Pagination Strategy

**Current implementation**: Offset-based pagination

```sql
SELECT ... FROM properties WHERE ... LIMIT 10 OFFSET 20;
```

This is the simplest approach and works well for the first ~1000 pages.

**When to upgrade to cursor/keyset pagination**:
For very deep pagination (e.g., page 5000 with 10 items/page = OFFSET 50000),
PostgreSQL still has to scan 50,000 rows before returning the 10 you want.

Cursor pagination would use a `WHERE id > last_seen_id` pattern instead of OFFSET,
which remains O(1) regardless of depth. The code is structured so this can be
added later without major refactoring.

---

## Similar Property Algorithm

No machine learning — simple SQL with domain logic:

```
Similar = same city + same property type + bedrooms within ±1 + price within ±20%
```

Implementation in `property.controller.ts`:

```typescript
const priceVariance = property.price * 0.20;

Property.findAll({
  where: {
    id: { [Op.ne]: property.id },
    city: property.city,
    propertyType: property.propertyType,
    bedrooms: { [Op.between]: [property.bedrooms - 1, property.bedrooms + 1] },
    price: { [Op.between]: [price - priceVariance, price + priceVariance] },
  },
  limit: 6,
});
```

This query uses the composite index `(city, propertyType, bedrooms)` for efficiency.
The entire query runs in PostgreSQL — no loading of thousands of records into Node.js.

---

## Rate Limiting

| Endpoint               | Limit                     |
|------------------------|---------------------------|
| POST /api/auth/login   | 5 requests / 15 minutes   |
| POST /api/auth/register| 5 requests / 15 minutes   |
| POST /api/inquiries    | 10 requests / 15 minutes  |
| All routes (safety)    | 200 requests / 15 minutes |

**Implementation**: `express-rate-limit` with default in-memory store.

**Production note**: In a multi-server deployment, each server's in-memory store is
independent, so the effective limit would be `max × server_count`. To enforce global
limits across servers, replace the default store with a Redis-backed store using the
`rate-limit-redis` package.

---

## Security Considerations

| Concern                  | Implementation                                       |
|--------------------------|------------------------------------------------------|
| Password storage         | bcryptjs with cost factor 12                         |
| JWT secret               | Environment variable — never hardcoded               |
| User enumeration         | Generic "Invalid email or password" login message    |
| Ownership authorization  | Always checked on backend using `req.user.userId`    |
| Client trust             | `ownerId` on inquiry taken from DB — never from body |
| Password in responses    | Excluded at model level (`attributes: { exclude }`)  |
| Input validation         | Zod schemas on all POST/PUT bodies                   |
| Security headers         | Helmet middleware                                    |
| CORS                     | Whitelisted frontend origin only                     |
| Rate limiting            | Login, register, inquiry endpoints                   |
| Stack traces             | Never exposed to client in production                |

---

## SEO Approach

Property detail pages (`/properties/[id]`) are **server-rendered** using Next.js App Router.

The `page.tsx` is a server component that:
1. Fetches the property from the backend
2. Generates dynamic `<title>` and `<meta description>` using `generateMetadata()`
3. Includes OpenGraph tags for social sharing

Example generated metadata:
```
<title>Modern 2BHK Apartment in Anna Nagar | EstateHub</title>
<meta name="description" content="apartment for sale in Anna Nagar, Chennai. 2 BHK, 1200 sq.ft at ₹50.00 L..." />
```

**ISR (Incremental Static Regeneration)**: For a production deployment with many
detail pages, you'd add `next: { revalidate: 3600 }` to the fetch call. This would
cache each detail page for 1 hour and rebuild it in the background on demand,
dramatically reducing backend load while keeping pages fresh.

---

## Scalability — 50,000+ Properties

This system is designed to handle 50,000+ property records efficiently:

### What's already implemented:

1. **Database-level filtering**: No records are loaded into Node.js and filtered in memory.
   All WHERE clauses, sorting, and pagination happen in PostgreSQL.

2. **Composite indexes**: The `(city, propertyType, bedrooms)` index covers the most
   common combined search without PostgreSQL needing to merge multiple indexes.

3. **Selective column fetching**: List endpoints only return columns needed for cards
   (not description, not all images) using Sequelize `attributes`. This reduces
   network payload significantly.

4. **No N+1 queries**: Owner information is eager-loaded with `include` in the same
   SQL query. No separate query per property.

5. **Connection pooling**: Sequelize pool (`max: 10, min: 2`) handles concurrent
   requests without opening a new DB connection per request.

6. **Rate limiting**: Prevents one actor from flooding the API.

7. **BIGINT for price**: Supports property values up to ~9 quadrillion.

8. **JSONB for images**: PostgreSQL JSONB is indexable and efficient for array storage.

### What would scale further in production:

| Need                         | Solution                                      |
|------------------------------|-----------------------------------------------|
| Deep pagination              | Cursor/keyset pagination                      |
| High read traffic            | Redis caching for popular listings            |
| Rate limiting across servers | Redis-backed rate limiter                     |
| Image storage                | AWS S3 / Cloudflare R2 + CDN                  |
| Multiple backend servers     | Horizontal scaling behind a load balancer     |
| Large aggregate queries      | Read replicas for reporting/search            |
| Full-text search             | PostgreSQL `tsvector` or Elasticsearch        |
| Real-time updates            | WebSockets or SSE for new listing alerts      |

---

## Production Improvements

1. **Migrations over sync()**: Use `sequelize-cli` migrations for schema versioning
2. **Refresh tokens**: Add short-lived access tokens + long-lived refresh tokens
3. **httpOnly cookies**: More secure than localStorage for token storage
4. **Image upload**: Integrate S3/Cloudflare R2 instead of URL-only images
5. **Email notifications**: Send email when an inquiry is received
6. **Redis caching**: Cache frequently viewed properties (property detail pages)
7. **Full-text search**: PostgreSQL `tsvector` or a search service for description search
8. **CI/CD pipeline**: Automated testing and deployment
9. **Environment-specific configs**: Separate configs for dev/staging/production
10. **Monitoring**: Structured logging + APM (e.g., Datadog, New Relic)
