# Guardian Route Dashboard - Comprehensive Deployment Guide

This guide provides detailed instructions for deploying both the frontend and backend components of the Guardian Route Dashboard.

## 1. Prerequisites

Ensure you have the following installed on your deployment environment:

*   **Node.js:** Version 18 or higher.
*   **npm or pnpm:** Package manager (the project uses `npm` in the backend and `pnpm` in the frontend).
*   **PostgreSQL:** Version 15 or higher, with the **PostGIS extension** enabled for geospatial features.
*   **Git:** For cloning the repository.

## 2. Backend Deployment (Node.js/NestJS)

The backend is a NestJS application. It can be deployed to any environment that supports Node.js, such as Railway, AWS EC2, or a private server.

### 2.1. Configuration

1.  Navigate to the backend directory:
    ```bash
    cd Guardian-Route/backend
    ```
2.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
3.  **Edit the `.env` file** and configure the following variables:

    | Variable | Description | Example Value |
    | :--- | :--- | :--- |
    | `DATABASE_URL` | Connection string for your PostgreSQL database. | `postgresql://user:pass@host:port/db_name?schema=public` |
    | `JWT_SECRET` | A long, random string for signing JWT access tokens. | `a-very-secret-key-for-jwt` |
    | `JWT_REFRESH_SECRET` | A long, random string for signing JWT refresh tokens. | `another-secret-key-for-refresh` |
    | `PORT` | The port the server will listen on (default is 3001). | `3001` |

### 2.2. Database Setup

1.  **Install PostGIS:** Ensure the PostGIS extension is installed on your database.
    ```sql
    -- Connect to your database and run:
    CREATE EXTENSION IF NOT EXISTS postgis;
    ```
2.  **Run Migrations and Seed Data:**
    ```bash
    # Install dependencies
    npm install
    # Run database migrations
    npx prisma migrate deploy
    # Seed initial data (users, villages, etc.)
    npx prisma db seed
    ```

### 2.3. Build and Run

1.  **Build the application:**
    ```bash
    npm run build
    ```
    The compiled application will be in the `dist` directory.
2.  **Start the application in production:**
    ```bash
    # Use a process manager like PM2 for production
    npm install -g pm2
    pm2 start dist/main.js --name "guardian-route-api"
    ```
    The API will be running on the configured `PORT` (default: `http://localhost:3001`).

## 3. Frontend Deployment (React/Vite)

The frontend is a React application built with Vite. It is a static application and can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

### 3.1. Configuration

1.  Navigate to the frontend directory:
    ```bash
    cd Guardian-Route/frontend
    ```
2.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
3.  **Edit the `.env` file** and configure the following variable:

    | Variable | Description | Example Value |
    | :--- | :--- | :--- |
    | `VITE_API_URL` | The public URL of your deployed backend API. | `https://api.yourdomain.com/api` |

### 3.2. Dependency Fix (Crucial)

**NOTE:** The project was fixed by downgrading the Chakra UI library to a stable v2 version to resolve numerous TypeScript and component compatibility errors. This step is crucial for a successful build.

1.  Navigate to the frontend directory:
    ```bash
    cd Guardian-Route/frontend
    ```
2.  Install dependencies and fix the Chakra UI version:
    ```bash
    # Use pnpm as specified in the project's lockfile
    pnpm install
    # Downgrade Chakra UI to v2.8.0
    pnpm remove @chakra-ui/react
    pnpm install @chakra-ui/react@^2.8.0 @emotion/react@^11 @emotion/styled@^11 framer-motion@^10
    ```

### 3.3. Build and Deploy

1.  **Build the application:**
    ```bash
    pnpm run build
    ```
    The static files will be generated in the `dist` directory.
2.  **Deploy the `dist` folder** to your static hosting service (e.g., Vercel):
    ```bash
    # Example for Vercel
    cd dist
    vercel --prod
    ```

## 4. Verification

After deployment, verify the following:

1.  **Backend API:** Access the API documentation at `http://<your-backend-url>:<port>/api/docs`.
2.  **Frontend:** Access the main dashboard URL and ensure you can log in with the test accounts:
    *   `supervisor@obtwiang.go.th` / `password123`
    *   `field@obtwiang.go.th` / `password123`
    *   `executive@obtwiang.go.th` / `password123`
    *   `admin@obtwiang.go.th` / `password123`

---
*This guide was generated after resolving all critical build errors in the project.*
